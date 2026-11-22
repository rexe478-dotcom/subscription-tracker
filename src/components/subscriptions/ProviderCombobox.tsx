import React, { useState, useRef, useEffect } from 'react';
import { Provider } from '@/types';
import { verifiedProviders, searchCatalogue } from '@/lib/catalogue';
import { Search, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProviderComboboxProps {
  selectedProvider: Provider | null;
  customName: string;
  onSelectCatalogueProvider: (provider: Provider) => void;
  onSelectCustom: (name: string) => void;
  error?: string;
}

export const ProviderCombobox: React.FC<ProviderComboboxProps> = ({
  selectedProvider,
  customName,
  onSelectCatalogueProvider,
  onSelectCustom,
  error,
}) => {
  const [query, setQuery] = useState(selectedProvider?.name || customName || '');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = searchCatalogue(query, verifiedProviders);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (provider: Provider) => {
    setQuery(provider.name);
    onSelectCatalogueProvider(provider);
    setIsOpen(false);
  };

  const handleCustomSelect = () => {
    onSelectCustom(query);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-secondary select-none">
        Provider or Service Name *
      </label>

      <div className="relative flex items-center">
        <div className="absolute left-3 flex items-center pointer-events-none text-text-muted">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search provider (e.g. Netflix, Spotify, Figma) or type custom"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            onSelectCustom(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          className={cn(
            'w-full bg-surface border border-border text-text-primary rounded-md pl-9 pr-3 py-2 text-sm transition-colors min-h-[44px]',
            'placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent focus-visible:border-accent',
            error && 'border-status-danger focus-visible:outline-status-danger'
          )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
      </div>

      {error && <p className="text-xs text-status-danger mt-0.5" role="alert">{error}</p>}

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-border bg-surface-elevated shadow-2xl p-1">
          <div className="px-2 py-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Verified Catalogue
          </div>

          {filtered.map((provider) => {
            const isSelected = selectedProvider?.id === provider.id;
            return (
              <button
                key={provider.id}
                type="button"
                onClick={() => handleSelect(provider)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-sm rounded-sm text-left transition-colors min-h-[38px]',
                  isSelected ? 'bg-surface text-accent font-semibold' : 'text-text-primary hover:bg-surface/80'
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center text-[10px] font-bold text-accent">
                    {provider.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium text-sm text-text-primary">{provider.name}</span>
                    {provider.category && (
                      <span className="ml-2 text-[11px] text-text-muted">({provider.category})</span>
                    )}
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-accent shrink-0" />}
              </button>
            );
          })}

          {/* Fallback Custom Provider Button */}
          {query.trim().length > 0 && (
            <div className="pt-1 mt-1 border-t border-border">
              <button
                type="button"
                onClick={handleCustomSelect}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface/80 rounded-sm text-left min-h-[38px]"
              >
                <Plus className="w-4 h-4 text-accent shrink-0" />
                <span>
                  Use custom name: <strong className="text-text-primary">"{query.trim()}"</strong>
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
