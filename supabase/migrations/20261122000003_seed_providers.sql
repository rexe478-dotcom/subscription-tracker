-- ==============================================================================
-- Migration: 20261122000003_seed_providers.sql
-- Description: Verified initial seed catalogue for common digital providers.
-- Provenance: Verified official domain endpoints as of 2026-11-22.
-- ==============================================================================

INSERT INTO public.providers (
    id,
    name,
    slug,
    aliases,
    category,
    website_url,
    cancellation_url,
    metadata_source,
    last_verified_at,
    is_active
) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'GitHub',
    'github',
    ARRAY['gh', 'copilot', 'github pro'],
    'Software',
    'https://github.com',
    'https://github.com/settings/billing',
    'Official GitHub Docs',
    '2026-11-22T00:00:00Z',
    TRUE
),
(
    '00000000-0000-0000-0000-000000000002',
    'Spotify',
    'spotify',
    ARRAY['spotify music', 'spotify premium'],
    'Entertainment',
    'https://spotify.com',
    'https://www.spotify.com/account/subscription/',
    'Official Spotify Support',
    '2026-11-22T00:00:00Z',
    TRUE
),
(
    '00000000-0000-0000-0000-000000000003',
    'Netflix',
    'netflix',
    ARRAY['netflix streaming'],
    'Entertainment',
    'https://netflix.com',
    'https://www.netflix.com/youraccount',
    'Official Netflix Help Center',
    '2026-11-22T00:00:00Z',
    TRUE
),
(
    '00000000-0000-0000-0000-000000000004',
    'Figma',
    'figma',
    ARRAY['figma professional', 'figjam'],
    'Software',
    'https://figma.com',
    'https://help.figma.com/hc/en-us/articles/360039829734',
    'Official Figma Support',
    '2026-11-22T00:00:00Z',
    TRUE
),
(
    '00000000-0000-0000-0000-000000000005',
    'Notion',
    'notion',
    ARRAY['notion plus', 'notion ai'],
    'Productivity',
    'https://notion.so',
    'https://www.notion.so/help/upgrade-or-downgrade-your-plan',
    'Official Notion Help',
    '2026-11-22T00:00:00Z',
    TRUE
),
(
    '00000000-0000-0000-0000-000000000006',
    'Apple One / iCloud',
    'apple-services',
    ARRAY['icloud', 'apple music', 'apple tv+', 'apple one'],
    'Utilities',
    'https://apple.com',
    'https://support.apple.com/HT202039',
    'Official Apple Support',
    '2026-11-22T00:00:00Z',
    TRUE
),
(
    '00000000-0000-0000-0000-000000000007',
    'Google One',
    'google-one',
    ARRAY['google drive storage', 'google one storage'],
    'Utilities',
    'https://one.google.com',
    'https://one.google.com/settings',
    'Official Google Support',
    '2026-11-22T00:00:00Z',
    TRUE
),
(
    '00000000-0000-0000-0000-000000000008',
    'Amazon Prime',
    'amazon-prime',
    ARRAY['prime video', 'prime membership'],
    'Entertainment',
    'https://amazon.com',
    'https://www.amazon.com/mc/manage',
    'Official Amazon Customer Service',
    '2026-11-22T00:00:00Z',
    TRUE
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    aliases = EXCLUDED.aliases,
    category = EXCLUDED.category,
    website_url = EXCLUDED.website_url,
    cancellation_url = EXCLUDED.cancellation_url,
    metadata_source = EXCLUDED.metadata_source,
    last_verified_at = EXCLUDED.last_verified_at;
