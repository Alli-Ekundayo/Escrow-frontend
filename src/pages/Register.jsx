import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ShieldCheck, CheckCircle, Sparkle } from '@phosphor-icons/react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const schema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  email: z.string().email('Enter a valid email'),
  phone_number: z.string().regex(/^\+/, 'Must include country code e.g. +2348012345678'),
  password: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const PERKS = [
  { icon: ShieldCheck, text: 'Your funds are protected until delivery is confirmed' },
  { icon: CheckCircle, text: 'AI-structured milestones from plain language' },
  { icon: Sparkle, text: 'Automated dispute resolution , fair, fast, neutral' },
];

export default function Register() {
  const { register: authRegister } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    const { confirmPassword: _confirmPassword, ...payload } = data;
    try { await authRegister(payload); } finally { setSubmitting(false); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Left panel , brand ────────────────────── */}
      <div
        className="auth-left-panel"
        style={{
          flex: '0 0 40%',
          background: '#0e0f0c',
          padding: '48px 52px',
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

        {/* Headline + perks */}
        <div>
          <h1 style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(28px, 2.8vw, 40px)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            margin: '0 0 12px',
          }}>
            Join 2,000+ freelancers and clients.
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 15,
            color: 'rgba(255,255,255,0.5)',
            lineHeight: '24px',
            margin: '0 0 28px',
          }}>
            Create your free account and start transacting with confidence.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 7,
                  backgroundColor: 'rgba(159,232,112,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon weight="bold" style={{ width: 15, height: 15, color: '#9fe870' }} />
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: '20px', color: 'rgba(255,255,255,0.55)', margin: 0 }}>{text}</p>
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
        <div style={{ width: '100%', maxWidth: 440 }} className="animate-in">
          <div style={{ marginBottom: 28 }}>
            <h2 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: '-0.025em',
              color: '#0e0f0c',
              margin: '0 0 6px',
            }}>
              Create your account
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#454745', margin: 0 }}>
              Milestone-based escrow with buyer and seller protection.
            </p>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #d9ddd7',
            borderRadius: 20,
            padding: '32px',
            boxShadow: '0 4px 24px rgba(14,15,12,0.07)',
          }}>
            <form onSubmit={handleSubmit(onSubmit)} aria-label="Create account form" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Input label="First name" placeholder="Ada" error={errors.first_name?.message} {...register('first_name')} />
                <Input label="Last name" placeholder="Okafor" error={errors.last_name?.message} {...register('last_name')} />
              </div>
              <Input label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
              <Input label="Phone number" type="tel" placeholder="+2348012345678" error={errors.phone_number?.message} {...register('phone_number')} />
              <Input label="Password" type="password" placeholder="Min 8 characters" error={errors.password?.message} {...register('password')} />
              <Input label="Confirm password" type="password" placeholder="Repeat password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
              <Button type="submit" loading={submitting} size="lg" className="w-full mt-2">
                Create account <ArrowRight style={{ width: 16, height: 16 }} weight="bold" />
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
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: '#0e0f0c',
                  fontWeight: 700,
                  borderBottom: '1.5px solid #9fe870',
                  paddingBottom: 1,
                }}
              >
                Sign in
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
