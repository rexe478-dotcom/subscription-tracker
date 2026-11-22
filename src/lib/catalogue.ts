import { Provider } from '@/types';

export const verifiedProviders: Provider[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'GitHub',
    slug: 'github',
    aliases: ['gh', 'copilot', 'github pro', 'github team'],
    category: 'Software',
    website_url: 'https://github.com',
    logo_asset_url: null,
    cancellation_url: 'https://github.com/settings/billing',
    metadata_source: 'Official GitHub Docs',
    last_verified_at: '2026-11-22T00:00:00Z',
    is_active: true,
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Spotify',
    slug: 'spotify',
    aliases: ['spotify music', 'spotify premium', 'spotify duo', 'spotify family'],
    category: 'Entertainment',
    website_url: 'https://spotify.com',
    logo_asset_url: null,
    cancellation_url: 'https://www.spotify.com/account/subscription/',
    metadata_source: 'Official Spotify Support',
    last_verified_at: '2026-11-22T00:00:00Z',
    is_active: true,
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Netflix',
    slug: 'netflix',
    aliases: ['netflix streaming', 'netflix 4k'],
    category: 'Entertainment',
    website_url: 'https://netflix.com',
    logo_asset_url: null,
    cancellation_url: 'https://www.netflix.com/youraccount',
    metadata_source: 'Official Netflix Help Center',
    last_verified_at: '2026-11-22T00:00:00Z',
    is_active: true,
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Figma',
    slug: 'figma',
    aliases: ['figma professional', 'figjam', 'figma org'],
    category: 'Software',
    website_url: 'https://figma.com',
    logo_asset_url: null,
    cancellation_url: 'https://help.figma.com/hc/en-us/articles/360039829734',
    metadata_source: 'Official Figma Support',
    last_verified_at: '2026-11-22T00:00:00Z',
    is_active: true,
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    name: 'Notion',
    slug: 'notion',
    aliases: ['notion plus', 'notion ai', 'notion workspace'],
    category: 'Productivity',
    website_url: 'https://notion.so',
    logo_asset_url: null,
    cancellation_url: 'https://www.notion.so/help/upgrade-or-downgrade-your-plan',
    metadata_source: 'Official Notion Help',
    last_verified_at: '2026-11-22T00:00:00Z',
    is_active: true,
  },
  {
    id: '00000000-0000-0000-0000-000000000006',
    name: 'Apple One / iCloud',
    slug: 'apple-services',
    aliases: ['icloud', 'icloud+', 'apple music', 'apple tv+', 'apple one', 'apple arcade'],
    category: 'Utilities',
    website_url: 'https://apple.com',
    logo_asset_url: null,
    cancellation_url: 'https://support.apple.com/HT202039',
    metadata_source: 'Official Apple Support',
    last_verified_at: '2026-11-22T00:00:00Z',
    is_active: true,
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    name: 'Google One',
    slug: 'google-one',
    aliases: ['google drive', 'google storage', 'google one storage', 'gemini advanced'],
    category: 'Utilities',
    website_url: 'https://one.google.com',
    logo_asset_url: null,
    cancellation_url: 'https://one.google.com/settings',
    metadata_source: 'Official Google Support',
    last_verified_at: '2026-11-22T00:00:00Z',
    is_active: true,
  },
  {
    id: '00000000-0000-0000-0000-000000000008',
    name: 'Amazon Prime',
    slug: 'amazon-prime',
    aliases: ['prime video', 'prime membership', 'amazon prime video'],
    category: 'Entertainment',
    website_url: 'https://amazon.com',
    logo_asset_url: null,
    cancellation_url: 'https://www.amazon.com/mc/manage',
    metadata_source: 'Official Amazon Customer Service',
    last_verified_at: '2026-11-22T00:00:00Z',
    is_active: true,
  },
];

/**
 * Searches the provider catalogue by query matching name or aliases
 */
export function searchCatalogue(query: string, providers: Provider[] = verifiedProviders): Provider[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return providers;

  return providers.filter((p) => {
    if (p.name.toLowerCase().includes(trimmed)) return true;
    if (p.category?.toLowerCase().includes(trimmed)) return true;
    if (p.aliases && p.aliases.some((alias) => alias.toLowerCase().includes(trimmed))) {
      return true;
    }
    return false;
  });
}
