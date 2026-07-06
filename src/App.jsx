import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { AIAssistantChat } from './components/AIAssistantChat';
import { List } from '@phosphor-icons/react';

import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Agreements from './pages/Agreements';
import AgreementDetail from './pages/AgreementDetail';
import CreateAgreement from './pages/CreateAgreement';
import SubmitProof from './pages/SubmitProof';
import DisputeCenter from './pages/DisputeCenter';
import TransactionHistory from './pages/TransactionHistory';
import FundEscrow from './pages/FundEscrow';
import NotFound from './pages/NotFound';

function ProtectedLayout() {
  const { accessToken } = useAuthStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!accessToken) return <Navigate to="/login" replace />;

  return (
    <div style={{ '--sidebar-width': isCollapsed ? '80px' : '256px', minHeight: '100vh', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)', display: 'flex', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <a
        href="#main-content"
        style={{ borderBottom: 'none' }}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-[10px] focus:text-sm focus:font-semibold"
        onFocus={(e) => { e.target.style.background = '#9fe870'; e.target.style.color = '#0e0f0c'; }}
      >
        Skip to content
      </a>

      <Sidebar 
        mobileOpen={mobileNavOpen} 
        onClose={() => setMobileNavOpen(false)} 
        isCollapsed={isCollapsed} 
        toggleCollapse={() => setIsCollapsed(!isCollapsed)} 
      />

      <div style={{ flex: 1, paddingLeft: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="content-area">
        {/* Mobile header — hidden on desktop via .mobile-topbar CSS */}
        <header
          className="mobile-topbar"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1.5px solid var(--border-default)',
            padding: '14px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'sticky', top: 0, zIndex: 30,
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, backgroundColor: '#9fe870',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: '#0e0f0c', lineHeight: 1 }}>E</span>
            </div>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Es-crow</span>
          </div>
          <button
            onClick={() => setMobileNavOpen(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)', padding: 8, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Open navigation"
          >
            <List style={{ width: 20, height: 20 }} weight="bold" />
          </button>
        </header>

        <main id="main-content" style={{ flex: 1, padding: '28px 28px', maxWidth: 1200, width: '100%', margin: '0 auto' }} className="app-main">
          <Outlet />
        </main>
      </div>

      <AIAssistantChat />
    </div>
  );
}

function PublicLayout() {
  const { accessToken } = useAuthStore();
  if (accessToken) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

function LandingLayout() {
  const { accessToken } = useAuthStore();
  if (accessToken) return <Navigate to="/dashboard" replace />;
  return <Landing />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public marketing routes */}
        <Route path="/" element={<LandingLayout />} />
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        {/* Protected app routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agreements" element={<Agreements />} />
          <Route path="/agreements/:id" element={<AgreementDetail />} />
          <Route path="/agreements/:id/proof" element={<SubmitProof />} />
          <Route path="/create" element={<CreateAgreement />} />
          <Route path="/disputes" element={<DisputeCenter />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/fund" element={<FundEscrow />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
