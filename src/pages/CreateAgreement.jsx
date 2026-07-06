import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDraftWithAI } from '../hooks/useAgreements';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Sparkle, Warning as WarningIcon, ArrowRight, CheckCircle, MagnifyingGlass, User, ShieldCheck, X } from '@phosphor-icons/react';
import { useUIStore } from '../stores/uiStore';
import { searchUsers } from '../api/auth';

const schema = z.object({
  seller_id: z.coerce.number().min(1, 'Please select a seller'),
  amount: z.coerce.number().positive('Amount must be positive'),
  currency: z.string().min(1, 'Required'),
  deadline: z.string().min(1, 'Select a deadline'),
  raw_conditions: z.string().min(20, 'At least 20 characters'),
});

/* ── Seller Search Combobox ───────────────────────── */
function SellerPicker({ onChange, error }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchUsers = async (q = '') => {
    setLoading(true);
    try {
      const data = await searchUsers(q);
      setResults(data);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    const q = e.target.value;
    setQuery(q);
    setSelected(null);
    onChange(null); // clear selection when typing
    setActiveIndex(-1);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchUsers(q), 300);
  };

  const handleFocus = () => {
    if (!selected) {
      if (results.length > 0) {
        setOpen(true);
      } else {
        fetchUsers(query);
      }
    }
  };

  const handleSelect = (user) => {
    setSelected(user);
    setQuery(user.display_name);
    setResults([]);
    setOpen(false);
    setActiveIndex(-1);
    onChange(user.id);
  };

  const handleClear = () => {
    setSelected(null);
    setQuery('');
    setResults([]);
    setActiveIndex(-1);
    onChange(null);
  };

  const handleKeyDown = (e) => {
    if (!open || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label
        htmlFor="seller-search-input"
        style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
          color: 'var(--text-primary)', display: 'block',
        }}
      >
        Seller
      </label>

      {/* Input row */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
          color: loading ? 'var(--brand-primary)' : 'var(--text-tertiary)',
          pointerEvents: 'none',
        }}>
          <MagnifyingGlass style={{ width: 15, height: 15 }} weight="bold" />
        </div>
        <input
          id="seller-search-input"
          type="text"
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="Search by name or email…"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="seller-picker-results"
          aria-activedescendant={activeIndex >= 0 ? `seller-option-${activeIndex}` : undefined}
          style={{
            width: '100%',
            paddingLeft: 34,
            paddingRight: selected ? 34 : 12,
            paddingTop: 10,
            paddingBottom: 10,
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            borderRadius: 10,
            border: error
              ? '1.5px solid #e05252'
              : selected
                ? '1.5px solid #9fe870'
                : '1.5px solid var(--border-default)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s ease',
          }}
          onFocusCapture={(e) => {
            e.target.style.borderColor = selected ? '#9fe870' : 'var(--brand-primary)';
            e.target.style.boxShadow = '0 0 0 3px rgba(159, 232, 112, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
            if (!selected) e.target.style.borderColor = error ? '#e05252' : 'var(--border-default)';
          }}
        />
        {selected && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-tertiary)', width: 44, height: 44, borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Clear seller"
          >
            <X style={{ width: 14, height: 14 }} weight="bold" />
          </button>
        )}
      </div>

      {/* Selected user chip */}
      {selected && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px',
          backgroundColor: '#f5fbf0',
          border: '1.5px solid #9fe870',
          borderRadius: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            backgroundColor: '#e2f6d5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <User style={{ width: 15, height: 15, color: '#1a5c2a' }} weight="fill" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: '#1a5c2a', margin: 0 }}>
              {selected.display_name}
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
              {selected.email}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <ShieldCheck style={{ width: 13, height: 13, color: '#1a5c2a' }} weight="fill" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, color: '#1a5c2a' }}>
              {Math.round(selected.trust_score ?? 0)}
            </span>
          </div>
        </div>
      )}

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div
          id="seller-picker-results"
          role="listbox"
          aria-label="Seller search results"
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid var(--border-default)',
            borderRadius: 12,
            boxShadow: 'var(--shadow-md)',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          {results.map((u, i) => {
            const isActive = activeIndex === i;
            return (
              <button
                key={u.id}
                id={`seller-option-${i}`}
                type="button"
                role="option"
                aria-selected={isActive}
                onMouseDown={() => handleSelect(u)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '10px 14px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: '1px solid var(--border-default)',
                  transition: 'background-color 0.1s ease',
                  backgroundColor: isActive ? 'var(--bg-surface-alt)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-alt)';
                  setActiveIndex(i);
                }}
                onMouseLeave={(e) => {
                  if (activeIndex !== i) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  backgroundColor: 'var(--bg-surface-alt)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <User style={{ width: 14, height: 14, color: 'var(--text-secondary)' }} weight="fill" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {u.display_name}
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'var(--text-secondary)', margin: 0 }}>
                    {u.email}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                  <ShieldCheck style={{ width: 12, height: 12, color: 'var(--text-tertiary)' }} weight="fill" />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>
                    {Math.round(u.trust_score ?? 0)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {open && results.length === 0 && query.length > 0 && !loading && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid var(--border-default)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-md)',
          zIndex: 100,
          padding: '14px 16px',
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            No users found for "{query}"
          </p>
        </div>
      )}

      {error && (
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#e05252', margin: 0 }}>{error}</p>
      )}
    </div>
  );
}


/* ── Main Page ───────────────────────────────────── */
export default function CreateAgreement() {
  const navigate = useNavigate();
  const draftWithAI = useDraftWithAI();
  const addToast = useUIStore((s) => s.addToast);
  const [draftedData, setDraftedData] = useState(null);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: { currency: 'NGN', seller_id: '' },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await draftWithAI.mutateAsync(data);
      setDraftedData(result);
      addToast('Milestones parsed and structured.', 'success');
    } catch { }
  };

  const headingStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 26, fontWeight: 900, letterSpacing: '-0.025em',
    color: 'var(--text-primary)', margin: '0 0 4px',
  };
  const subStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 14, color: 'var(--text-secondary)', margin: 0,
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, fontFamily: "'Inter', system-ui, sans-serif" }}>

      <div>
        <h1 style={headingStyle}>Create Escrow Agreement</h1>
        <p style={subStyle}>
          Describe deliverables in plain language. AI will structure them into milestones.
        </p>
      </div>

      {!draftedData ? (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <CardHeader>
              <CardTitle>Agreement Details</CardTitle>
            </CardHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Seller picker , full width */}
              <Controller
                name="seller_id"
                control={control}
                render={({ field }) => (
                  <SellerPicker
                    onChange={(id) => field.onChange(id ?? '')}
                    error={errors.seller_id?.message}
                  />
                )}
              />
              {/* Amount + Currency row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Input label="Amount (NGN)" type="number" step="0.01" placeholder="0.00" error={errors.amount?.message} {...register('amount')} />
                <Input label="Currency" type="text" disabled error={errors.currency?.message} {...register('currency')} />
              </div>
              {/* Deadline */}
              <Input label="Deadline" type="datetime-local" error={errors.deadline?.message} {...register('deadline')} />
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>Conditions</CardTitle></CardHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Textarea
                rows={6}
                placeholder="Describe what needs to be delivered and verified…"
                error={errors.raw_conditions?.message}
                {...register('raw_conditions')}
              />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <WarningIcon style={{ width: 15, height: 15, color: 'var(--color-accent-yellow-text)', flexShrink: 0, marginTop: 2 }} weight="fill" />
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                  Be specific. The AI uses this to evaluate proof of delivery.
                </p>
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button variant="secondary" type="button" onClick={() => navigate('/dashboard')}>Cancel</Button>
            <Button type="submit" loading={draftWithAI.isPending}>
              <Sparkle style={{ width: 16, height: 16 }} weight="bold" /> Draft with AI
            </Button>
          </div>
        </form>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card style={{ border: '1.5px solid #9fe870', backgroundColor: '#f5fbf0' }}>
            <CardHeader>
              <CardTitle style={{ color: '#1a5c2a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle style={{ width: 18, height: 18 }} weight="fill" /> AI Structured Draft
              </CardTitle>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Review milestones before locking funds.
              </p>
            </CardHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid var(--border-default)',
                borderRadius: 10, padding: 16,
              }}>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: 'var(--text-secondary)', margin: '0 0 8px',
                }}>
                  Original input
                </p>
                <p style={{
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  fontSize: 13, color: 'var(--text-primary)',
                  fontStyle: 'italic', lineHeight: '20px', margin: 0,
                }}>
                  &ldquo;{draftedData.raw_conditions}&rdquo;
                </p>
              </div>
              <div>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: 'var(--text-secondary)', margin: '0 0 12px',
                }}>
                  Generated Milestones
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {draftedData.conditions?.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        backgroundColor: 'var(--bg-surface)',
                        border: '1.5px solid var(--border-default)',
                        borderRadius: 10, padding: '12px 14px',
                      }}
                    >
                      <div style={{
                        width: 24, height: 24, borderRadius: 7,
                        backgroundColor: '#e2f6d5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: 11, fontWeight: 700, color: '#1a5c2a',
                        flexShrink: 0,
                      }}>
                        {i + 1}
                      </div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: '20px', color: 'var(--text-primary)', margin: 0 }}>
                        {item.description || item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button variant="secondary" onClick={() => setDraftedData(null)}>Edit</Button>
            <Button onClick={() => navigate(`/agreements/${draftedData.id}`)}>
              Confirm <ArrowRight style={{ width: 16, height: 16 }} weight="bold" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
