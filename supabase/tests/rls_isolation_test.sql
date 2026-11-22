-- ==============================================================================
-- Test Suite: rls_isolation_test.sql
-- Description: Verifies strict two-user tenant isolation under Row Level Security.
-- ==============================================================================

BEGIN;

-- Setup test users in auth.users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'user_a@test.com', 'hashed_pass', NOW(), '{"provider":"email"}', '{"full_name":"User A"}', NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222222', 'user_b@test.com', 'hashed_pass', NOW(), '{"provider":"email"}', '{"full_name":"User B"}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 1. ACT AS USER A
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "11111111-1111-1111-1111-111111111111", "role": "authenticated"}';

-- Insert subscription as User A
INSERT INTO public.subscriptions (
    id,
    user_id,
    custom_provider_name,
    amount,
    currency,
    billing_interval,
    next_renewal_at,
    status
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Private Service A',
    29.99,
    'USD',
    'monthly',
    NOW() + INTERVAL '10 days',
    'active'
);

-- Assert User A can read their own row
DO $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*) INTO v_count FROM public.subscriptions WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    IF v_count <> 1 THEN
        RAISE EXCEPTION 'TEST FAILED: User A should be able to read their own subscription';
    END IF;
END $$;

-- 2. ACT AS USER B
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "22222222-2222-2222-2222-222222222222", "role": "authenticated"}';

-- Assert User B CANNOT read User A's row
DO $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*) INTO v_count FROM public.subscriptions WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    IF v_count <> 0 THEN
        RAISE EXCEPTION 'SECURITY BREACH: User B was able to view User A subscription!';
    END IF;
END $$;

-- Assert User B CANNOT update User A's row
UPDATE public.subscriptions SET amount = 0.01 WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Assert User B CANNOT delete User A's row
DELETE FROM public.subscriptions WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Assert User B CANNOT forge a subscription assigned to User A
DO $$
BEGIN
    INSERT INTO public.subscriptions (
        id,
        user_id,
        custom_provider_name,
        amount,
        currency,
        billing_interval,
        next_renewal_at,
        status
    ) VALUES (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        '11111111-1111-1111-1111-111111111111', -- Forging User A's ID
        'Forged Service',
        99.99,
        'USD',
        'monthly',
        NOW(),
        'active'
    );
    RAISE EXCEPTION 'SECURITY BREACH: User B was able to insert a row on behalf of User A!';
EXCEPTION WHEN row_security_active_enforcement_error OR check_violation OR insufficient_privilege THEN
    -- Expected RLS policy violation
    RAISE NOTICE 'SUCCESS: RLS correctly rejected insertion with forged user_id';
END $$;

-- 3. ACT AS ANONYMOUS
SET LOCAL ROLE anon;
SET LOCAL "request.jwt.claims" = '{"role": "anon"}';

-- Assert anonymous user cannot read subscriptions
DO $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*) INTO v_count FROM public.subscriptions;
    IF v_count <> 0 THEN
        RAISE EXCEPTION 'SECURITY BREACH: Anonymous user could read subscriptions!';
    END IF;
    RAISE NOTICE 'ALL RLS ISOLATION TESTS PASSED CLEANLY';
END $$;

ROLLBACK;
