# CraftedTales Platform Architecture Proposal

This document outlines the recommended architecture for the CraftedTales platform based on Cloudflare’s ecosystem, using your selected stack: **React + TanStack + Vite**, **Hono backend**, and a **simple relational database**. This proposal is focused on **Option A** — a fully Cloudflare-native implementation with no external search engine.

---

# 1. Goals

The architecture prioritizes:

* Minimal infrastructure management
* Global performance and scalability
* Cost-efficiency
* Developer-friendly stack (TypeScript everywhere)
* Maintainability and clear separation of concerns

---

# 2. Cloudflare-First Architecture Summary

## **Frontend**

* Framework: **React + TanStack Router + Vite**
* Hosted on **Cloudflare Pages**
* Vite build output deployed globally and cached
* Optional: SSR using Pages Functions or Worker proxy

## **Backend**

* Framework: **Hono** (ideal for Cloudflare Workers)
* Runs entirely on **Cloudflare Workers**
* Single API Worker providing all endpoints:

  * Mods
  * Users
  * Versions
  * Categories
  * Auth
  * Reporting
  * Admin
  * Search

## **Authentication**

* **Cloudflare Access + OAuth** (Google/GitHub/Microsoft)
* Worker validates tokens using WebCrypto / JWT
* User profiles stored in D1
* Sessions stored in Durable Objects or Workers KV

## **Database**

* Primary store: **Cloudflare D1** (SQLite-backed, serverless SQL)
* Stores all relational data:

  * Users
  * Mods
  * Versions
  * Dependencies
  * Categories
  * Reports
  * Cart items
  * Admin logs
* Ideal for small/medium datasets
* Simple SQL migrations

## **Object Storage**

* **Cloudflare R2**
* Stores:

  * Mod files (.zip / .rar / .7z)
  * Screenshots
  * Thumbnails
  * Changelogs
* Direct upload from client → R2 via signed URLs
* Metadata stored in D1

## **Search (Cloudflare-native implementation)**

Since D1 is not ideal for full-text search:

* Implement a **custom inverted index** using **Durable Objects**
* Index:

  * Mod title
  * Description
  * Tags
  * Categories
* DO Responsibilities:

  * Maintain search terms mapping → mod IDs
  * Support prefix + keyword search
  * Provide fast filtering
* D1 is used to fetch full metadata after search returns result IDs

## **Caching**

* **Workers KV** used for:

  * Popular mods cache
  * Landing page cache
  * Category lists
  * Settings/config
* Reduces load on D1

## **Background Jobs**

* **Cloudflare Queues + Cron Triggers**
  Used for:
* Rebuilding search index
* Cleaning old mods / orphaned files
* Sending verification emails
* Processing daily reports

## **Docker Use**

* No Docker needed in production
* Optional for local dev (e.g. Meilisearch, mocking R2)

---

# 3. System Diagram (Textual)

```
                       +-----------------------+
                       |     Cloudflare CDN    |
                       +-----------+-----------+
                                   |
                   Frontend (Cloudflare Pages)
                                   |
                                   v
                        +----------+---------+
                        | Cloudflare Worker  |
                        |   Hono Backend     |
                        +----------+---------+
                                   |
            ------------------------------------------------
            |                    |                        |
            v                    v                        v
     Cloudflare D1        Durable Object Search     Cloudflare R2
      (SQL DB)               (Inverted Index)       (Mod Storage)
```

---

# 4. Why This Architecture Works

## **Strengths**

* Entire stack runs on Cloudflare
* Global, low-latency delivery
* Zero server maintenance
* Simple TypeScript-first development
* Object storage perfectly handled by R2
* Search solved natively without external service
* Easy horizontal scaling via Workers
* Authentication securely handled with OAuth

## **Limitations to be aware of**

* D1 is not ideal for heavy analytic queries or huge datasets
* Custom search indexing requires careful design
* Worker environment has CPU/time limitations
* No traditional Docker runtime support

---

# 5. Expected Load & Performance

For a platform like CraftedTales:

* **Mods count**: up to ~200k
* **Storage**: 1–5 TB (handled seamlessly by R2)
* **Search requests**: fast thanks to Durable Objects
* **User load**: Cloudflare Workers scale automatically

This architecture will perform extremely well for your intended use case.

---

# 6. Summary of Technology Choices

| Component | Selected Technology             | Reason                                    |
| --------- | ------------------------------- | ----------------------------------------- |
| Frontend  | React + TanStack + Vite + Pages | Best DX + global static hosting           |
| Backend   | Hono on Workers                 | Fast, TS-friendly, minimal overhead       |
| Database  | Cloudflare D1                   | Simple SQL, adequate size, low ops        |
| Storage   | Cloudflare R2                   | No egress fees, ideal for large files     |
| Search    | Durable Objects (custom index)  | Cloudflare-native, no external dependency |
| Auth      | Cloudflare Access + OAuth       | Secure and easy integration               |
| Caching   | Workers KV                      | Ideal for read-heavy static data          |
| Jobs      | Cron Triggers + Queues          | Built-in background workers               |

---

# 7. Next Steps

If approved by your team, the next deliverables can be:

* Detailed folder structure
* API endpoint specification
* D1 schema and migrations
* R2 upload flow architecture
* Search index design
* Deployment scripts
* CI/CD pipeline outline

Let me know which of these you want next.
