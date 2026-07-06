import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeSlash, ArrowRight, ShieldCheck, LockSimple, Handshake } from '@phosphor-icons/react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const TRUST_POINTS = [
  { icon: ShieldCheck, text: 'Funds only move when both parties agree' },
  { icon: LockSimple, text: "Milestone-locked escrow , money can't be touched" },
  { icon: Handshake, text: 'AI-assisted dispute resolution in 48 h' },
];

export default function Login() {
  const { login } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await login(data);
    } catch {
      // toast already shown by useAuth , just stop submitting
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Left panel , brand ────────────────────── */}
      <div
        className="auth-left-panel"
        style={{
          flex: '0 0 44%',
          background: '#0e0f0c',
          padding: '48px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            backgroundColor: '#9fe870',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldCheck weight="fill" style={{ width: 20, height: 20, color: '#0e0f0c' }} />
          </div>
          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>Es-crow</span>
        </div>

        {/* Headline */}
        <div>
          <h1 style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(32px, 3vw, 44px)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            margin: '0 0 24px',
          }}>
            Money that moves only when the work is done.
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {TRUST_POINTS.map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  backgroundColor: 'rgba(159,232,112,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon weight="bold" style={{ width: 16, height: 16, color: '#9fe870' }} />
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: '22px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.28)', margin: 0 }}>
          © {new Date().getFullYear()} Es-crow. All rights reserved.
        </p>
      </div>

      {/* ── Right panel , form ───────────────────── */}
      <div className="auth-form-panel">
        <div style={{ width: '100%', maxWidth: 400 }} className="animate-in">
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: '-0.025em',
              color: '#0e0f0c',
              margin: '0 0 8px',
            }}>
              Welcome back
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#454745', margin: 0 }}>
              Sign in to your Es-crow account
            </p>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #d9ddd7',
            borderRadius: 20,
            padding: '32px',
            boxShadow: '0 4px 24px rgba(14,15,12,0.07)',
          }}>
            <form onSubmit={handleSubmit(onSubmit)} aria-label="Sign in form" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <div style={{ position: 'relative' }}>
                <Input
                  label="Password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: 12, top: '2.4rem',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#868685', padding: 4, borderRadius: 4,
                    transition: 'color 0.15s ease',
                  }}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  aria-pressed={showPw}
                >
                  {showPw
                    ? <EyeSlash style={{ width: 16, height: 16 }} weight="bold" />
                    : <Eye style={{ width: 16, height: 16 }} weight="bold" />}
                </button>
              </div>
              <Button type="submit" loading={submitting} size="lg" className="w-full mt-2">
                Sign in <ArrowRight style={{ width: 16, height: 16 }} weight="bold" />
              </Button>
            </form>

            <p style={{
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: '#454745',
              marginTop: 20,
              marginBottom: 0,
            }}>
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                style={{
                  color: '#0e0f0c',
                  fontWeight: 700,
                  borderBottom: '1.5px solid #9fe870',
                  paddingBottom: 1,
                }}
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
