# TrustFlow — Escrow Frontend

The React/Vite frontend for **TrustFlow**, an AI-powered escrow platform integrating Nomba payments for the Nigerian market.

---

## 🔐 Reviewer Access (Start Here)

> **Skip signup entirely.** Use the accounts below to explore the full buyer → seller escrow flow.

### 🌐 Live App

**https://escrow-frontend-618z.vercel.app**

---

### 👤 Demo Accounts

#### Buyer (funds the escrow)
| Field | Value |
|---|---|
| **Email** | `onepeice@gmail.com` |
| **Password** | `TrustFlow2026!` |

#### Seller (receives the payout)
| Field | Value |
|---|---|
| **Email** | `ada@yahoo.com` |
| **Password** | `TrustFlow2026!` |

---

### 🚦 Suggested Review Flow

1. Visit **https://escrow-frontend-618z.vercel.app**
2. Log in as **Buyer** (`onepeice@gmail.com` / `TrustFlow2026!`) → Create an escrow agreement (let AI draft the conditions).
3. Fund the escrow.
4. Log out → Log in as **Seller** (`ada@yahoo.com` / `TrustFlow2026!`) → Mark milestones complete.
5. Switch back to Buyer → Release funds.
6. Observe payout confirmation on the Seller dashboard.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Vanilla CSS
- **State**: Zustand
- **API**: Axios → `https://escrow-backend-production-7b3d.up.railway.app/api/v1`

---

## 🚀 Local Development

```bash
npm install
npm run dev
```

To point at the production API locally, set in `.env`:

```env
VITE_API_URL=https://escrow-backend-production-7b3d.up.railway.app/api
```

---

## 📂 Project Structure

```
src/
├── components/       # Reusable UI components (MilestoneTracker, FundEscrow, etc.)
├── pages/            # Route-level pages (AgreementDetail, Dashboard, etc.)
├── hooks/            # Custom React hooks (useLockFunds, usePayment, etc.)
├── store/            # Zustand state slices
└── api/              # Axios instances and endpoint wrappers
```
