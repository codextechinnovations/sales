import { useState, useEffect, useRef, useCallback } from 'react';

interface AddressData {
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (data: AddressData) => void;
  placeholder?: string;
  inputStyle?: React.CSSProperties;
}

export function AddressAutocomplete({ value, onChange, onSelect, placeholder, inputStyle }: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://photon.komoot.io/api?q=${encodeURIComponent(query)}&limit=5&bbox=73.98,11.59,78.58,18.45`);
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (err) {
      console.error('Address autocomplete error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 400);
    return () => clearTimeout(timerRef.current);
  }, [value, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (feature: any) => {
    const props = feature.properties;
    const data: AddressData = {
      address: [props.street, props.housenumber, props.district].filter(Boolean).join(', '),
      city: props.city || props.town || props.village || props.county || '',
      state: props.state || '',
      pincode: props.postcode || '',
      latitude: feature.geometry.coordinates[1].toString(),
      longitude: feature.geometry.coordinates[0].toString(),
    };
    onSelect(data);
    setIsOpen(false);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background:#eef2ff;padding:0 2px;border-radius:2px;">$1</mark>');
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setIsOpen(true); }}
        placeholder={placeholder || 'Search address...'}
        style={inputStyle}
      />
      {(loading || suggestions.length > 0) && isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'white', border: '1px solid #e0e0e0', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 50, marginTop: '4px',
          maxHeight: '240px', overflowY: 'auto',
        }}>
          {loading && (
            <div style={{ padding: '10px', color: '#888', textAlign: 'center' }}>Searching...</div>
          )}
          {suggestions.map((feature, i) => {
            const p = feature.properties;
            const name = [p.name, p.street, p.city, p.state].filter(Boolean).join(', ');
            return (
              <div
                key={i}
                onClick={() => handleSelect(feature)}
                style={{
                  padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f9ff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                dangerouslySetInnerHTML={{ __html: highlightMatch(name, value) }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}