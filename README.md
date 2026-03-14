# Mainapp Slice 1 Scaffold

This scaffold implements the first authenticated Mainapp slice for the fused platform workflow:

- `/portal/dashboard` protected-entry shell
- AI concierge support launcher
- support-session creation API
- consent handling API
- message ingest API
- starter policy engine
- internal escalation handoff payload generation
- ticket and booking hook placeholders
- Vercel-to-Mainapp bridge consume API

## What is intentionally included
- Next.js App Router structure
- typed contracts with Zod
- in-memory fake persistence for quick proof-of-flow
- simple UI shell proving the support runtime

## What is intentionally deferred
- real auth provider integration
- real KYC and approval data source
- database persistence
- real Atlassian API submission
- production-grade RBAC and audit middleware
- media/video avatar layer

## Recommended next step
1. Replace fake store with real persistence.
2. Connect bridge consume route to your approved-user session issuer.
3. Wrap `/portal/*` in real auth middleware.
4. Replace policy heuristics with your actual policy engine.
5. Wire Atlassian handoff to Jira/Confluence or workflow engine.
