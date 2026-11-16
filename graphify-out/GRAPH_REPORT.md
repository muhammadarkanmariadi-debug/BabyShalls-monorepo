# Graph Report - BabyShalls  (2026-11-16)

## Corpus Check
- 275 files · ~118,330 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1007 nodes · 2274 edges · 67 communities (55 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- BinderByte Shipping Provider
- Checkout & Account Pages
- Admin Auth & Coupons
- Storefront Info Pages
- Events UI & Cart Context
- Admin Catalog & Product Modal
- Idempotency & Redis Store
- Backend Express Server
- Orders, Cart & Event Registration
- Admin Workshops & QR Scanner
- Architecture & API Guardrails
- Admin CMS Canvas Editor
- Backend Error & Zod Schemas
- Admin Orders Management
- Midtrans & JWT Middleware
- Homepage Marketing Sections
- System Architecture & Caching
- Hampers, Login & Request Routes
- Frontend UI Dependencies
- Customer Account Hooks
- Frontend TypeScript Config
- Email Broadcast & Admin Dashboard
- Backend TypeScript DevDeps
- Frontend ESLint & Tailwind Deps
- Frontend Auth Hooks
- Root Workspace Scripts
- Backend Core Dependencies
- Auth Routes & Rate Limiter
- Frontend Client Libraries
- Admin Book Requests & Broadcasts
- Docker Environment Variables
- SMTP Email & Receipt Templates
- Backend TypeScript Config
- Backend Package Metadata
- Admin Vouchers & Currency Input
- App Root Layout & Providers
- Docker Postgres Service
- Admin Events API Routes
- GSAP Motion & Animation Utils
- Docker Service Build Config
- Docker Service Dependencies
- Backend NPM Scripts
- Navigation Category Data
- Docker Volumes Config
- Docker Resource Limits
- Docker Redis Service
- New Arrivals Components
- Default Public SVG Assets
- Docker Healthcheck Config
- Prisma Database Seeding
- KiriminAja Shipping Client
- Gift Hampers Motion Banner
- Frontend NPM Scripts
- Tailwind v4 Configuration
- Midtrans Snap Client
- Orders, Coupons & Reviews Spec
- TRD & Governance Rules
- StripInfo Banner Component
- ShopByAge Component
- Design Tokens & Contrast Spec
- Nodemailer Dependency
- TSX Runner Dependency
- Next.js Setup & Agent Rules
- Next Cloudinary Dependency
- PostCSS Configuration
- Backend REST API Spec

## God Nodes (most connected - your core abstractions)
1. `react` - 83 edges
2. `lucide-react` - 64 edges
3. `next` - 45 edges
4. `useCart()` - 37 edges
5. `Header()` - 36 edges
6. `Footer()` - 35 edges
7. `formatIDR()` - 35 edges
8. `TombolKembali()` - 29 edges
9. `extractApiError()` - 21 edges
10. `express` - 19 edges

## Surprising Connections (you probably didn't know these)
- `WhatsApp Inquiry & Cart Message Generator` --semantically_similar_to--> `M1: Store & Midtrans Payment Module`  [INFERRED] [semantically similar]
  README.md → docs/PRD.md
- `Strict Anti-Bias Guardrails` --semantically_similar_to--> `BabyShalls Engineering Guardrails (Rules 01-08)`  [INFERRED] [semantically similar]
  AGENTS.md → docs/RULES.md
- `BabyShalls Prototype & Catalog Showcase` --conceptually_related_to--> `BabyShalls E-Commerce Platform PRD v2.0.0`  [INFERRED]
  README.md → docs/PRD.md
- `BabyShalls AI Agent Context & Workspace Guide` --references--> `Development Rules & Anti-Bias Governance`  [EXTRACTED]
  AGENTS.md → docs/RULES.md
- `BabyShalls AI Agent Context & Workspace Guide` --references--> `Technical Requirements Document (TRD) v1.0.0`  [EXTRACTED]
  AGENTS.md → docs/TRD.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Single-Store Malang Boutique Governance** — agents_anti_bias_guardrails, docs_rules_guardrails [EXTRACTED 1.00]
- **Frontend Public Static SVG Asset Bundle** — frontend_public_file_svg, frontend_public_globe_svg, frontend_public_next_svg, frontend_public_vercel_svg, frontend_public_window_svg, concept_nextjs_public_svg_assets [EXTRACTED]
- **Redis Cache-Aside & Graceful Degradation Architecture** — docs_trd_cache_aside_pattern, docs_rules_guardrails [INFERRED 0.95]
- **End-to-End Checkout, KiriminAja Shipping & Midtrans Payment Flow** — docs_architecture_nextjs_frontend, docs_architecture_express_backend, docs_architecture_redis_cache, docs_architecture_kiriminaja_aggregator, docs_architecture_midtrans_snap, docs_architecture_postgresql_db [EXTRACTED 1.00]
- **Full-Stack Idempotency-Key Protection Pipeline** — docs_superpowers_plans_2026_11_14_idempotency_key_frontend_checkout_key, docs_superpowers_plans_2026_11_14_idempotency_key_idempotency_middleware, docs_superpowers_plans_2026_11_14_idempotency_key_idempotency_store, docs_superpowers_plans_2026_11_14_idempotency_key_redis_graceful_fallback [EXTRACTED 1.00]
- **Verified Purchase Review Data Chain** — docs_database_schema_user, docs_database_schema_order, docs_database_schema_product, docs_database_schema_review [EXTRACTED 1.00]

## Communities (67 total, 12 thin omitted)

### Community 0 - "BinderByte Shipping Provider"
Cohesion: 0.08
Nodes (38): BinderByteCostResponse, BinderByteProvider, BinderByteTrackResponse, mapBinderByteStatus(), KomerceCostItem, KomerceDestinationItem, RajaOngkirDestination, RajaOngkirV2Provider (+30 more)

### Community 1 - "Checkout & Account Pages"
Cohesion: 0.14
Nodes (25): AccountPage(), TabKey, AdminDashboardPage(), CheckoutPage(), ProductDetailPage(), WireProductCard(), WireProductCardProps, CuratorSpotlight() (+17 more)

### Community 2 - "Admin Auth & Coupons"
Cohesion: 0.08
Nodes (22): AdminTab, AdminLoginPayload, AdminLoginResult, AdminOtpChallenge, CreateCouponPayload, UpdateCouponPayload, CreateBookRequestPayload, CreateBookRequestResult (+14 more)

### Community 3 - "Storefront Info Pages"
Cohesion: 0.13
Nodes (23): AboutPage(), FaqPage(), Home(), PrelovedPage(), FloatingWhatsApp(), ExploreBanner, ExploreBannerProps, HeroSlide (+15 more)

### Community 4 - "Events UI & Cart Context"
Cohesion: 0.08
Nodes (27): WireEventCard(), WireEventCardProps, UpcomingEventsSection(), CartContextType, EVENTS, PRODUCTS, REVIEWS, mapStaticFallback() (+19 more)

### Community 5 - "Admin Catalog & Product Modal"
Cohesion: 0.09
Nodes (24): AdminCatalogSection(), CATEGORY_OPTIONS, AGE_GROUPS, ProductFormModal(), ProductFormModalProps, QUICK_FEATURE_CHIPS, STOREFRONT_CATEGORIES, TabId (+16 more)

### Community 6 - "Idempotency & Redis Store"
Cohesion: 0.09
Nodes (22): ioredis@^6.0.0, AcquireResult, createIdempotencyStore(), acquireInMemory(), pruneExpired(), defaultIdempotencyStore, IdempotencyRecord, IdempotencyStatus (+14 more)

### Community 7 - "Backend Express Server"
Cohesion: 0.12
Nodes (24): app, configuredOrigins, HelmetFactory, HelmetOptions, rawHelmet, globalForPrisma, prisma, requireAdmin() (+16 more)

### Community 8 - "Orders, Cart & Event Registration"
Cohesion: 0.20
Nodes (20): CustomerOrdersHistoryPage(), CartPage(), EventDetailPage(), ChildData, EventRegistrationPage(), EventsPage(), NotFound(), OrderSuccessPage() (+12 more)

### Community 9 - "Admin Workshops & QR Scanner"
Cohesion: 0.16
Nodes (25): AdminModal(), AdminModalProps, SIZE_CLASSES, AdminWorkshopsSection(), EventQrScannerModal(), EventQrScannerModalProps, ScanHistoryEntry, WORKSHOP_CATEGORIES (+17 more)

### Community 10 - "Architecture & API Guardrails"
Cohesion: 0.07
Nodes (23): Admin Endpoints (/admin/orders/:id/pickup, /admin/coupons, /admin/cms), POST /book-requests, POST /orders/create-snap-token (Midtrans Snap), POST /events/register, POST /orders/midtrans-webhook, POST /shipping/calculate (KiriminAja Multi-Courier), BabyShalls Architecture Blueprint v1.0.0, Hostinger VPS KVM 1 Deployment (Nginx + PM2 + Ubuntu 24.04) (+15 more)

### Community 11 - "Admin CMS Canvas Editor"
Cohesion: 0.13
Nodes (19): AdminCmsSection(), CmsAboutCanvas(), CmsAboutCanvasProps, CmsHomeCanvas(), CmsHomeCanvasProps, MultiImageUploader(), MultiImageUploaderProps, normalizeImageUrl() (+11 more)

### Community 12 - "Backend Error & Zod Schemas"
Cohesion: 0.14
Nodes (22): ApiErrorCode, emailSchema, expressErrorHandler(), FormattedZodError, formatZodError(), handleRouteError(), indonesianPhoneSchema, optionalIndonesianPhoneSchema (+14 more)

### Community 13 - "Admin Orders Management"
Cohesion: 0.13
Nodes (17): AdminOrdersSection(), COURIER_OPTIONS, ORDER_STATUS_OPTIONS, STATUS_BADGE, AdminOrder, useAdminOrders(), useUpdateAdminOrderStatus(), CalculateShippingPayload (+9 more)

### Community 14 - "Midtrans & JWT Middleware"
Cohesion: 0.17
Nodes (16): childAgeSchema, optionalPostalCodeSchema, coreApi, snap, AuthenticatedUser, authenticateJWT(), AuthRequest, optionalAuthenticateJWT() (+8 more)

### Community 15 - "Homepage Marketing Sections"
Cohesion: 0.10
Nodes (6): CategoryShowcaseProps, FaqItem, ReadingGuideSectionProps, InstagramIcon(), StoreInfoModal(), lucide-react

### Community 16 - "System Architecture & Caching"
Cohesion: 0.10
Nodes (18): POST /auth/login (JWT Auth), Wishlist Endpoints (/wishlist), Express.js Backend Tier (TypeScript ES2022, Prisma 6.x), KiriminAja Logistics Aggregator (Malang Origin), Midtrans Snap Payment Gateway & Webhook, Next.js 16.4+ Frontend Tier (App Router, Turbopack, React 19), PostgreSQL 16 Database, Address Table (KiriminAja subdistrictId) (+10 more)

### Community 17 - "Hampers, Login & Request Routes"
Cohesion: 0.14
Nodes (7): HampersPage(), nextConfig, MegaMenu(), MegaMenuProps, BannerHampers(), HeaderProps, next

### Community 18 - "Frontend UI Dependencies"
Cohesion: 0.10
Nodes (20): dependencies, html5-qrcode@^2.3.8, lucide-react@^1.70.0, next@16.4.5, qrcode.react@^4.2.0, react@19.3.0, react-hot-toast@^2.6.1, recharts@^3.10.1 (+12 more)

### Community 19 - "Customer Account Hooks"
Cohesion: 0.11
Nodes (5): AccountAddress, AccountOrder, AccountOrderItem, AccountProfile, AccountTicket

### Community 20 - "Frontend TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 21 - "Email Broadcast & Admin Dashboard"
Cohesion: 0.14
Nodes (14): BroadcastPayload, runEmailBroadcast(), triggerCouponBroadcastAsync(), triggerEventBroadcastAsync(), ALLOWED_BROADCAST_TAGS, createEventSchema, createProductSchema, manualBroadcastSchema (+6 more)

### Community 22 - "Backend TypeScript DevDeps"
Cohesion: 0.12
Nodes (17): devDependencies, prisma@^6.2.1, @types/bcryptjs@^2.4.6, @types/cors@^2.8.17, @types/express@^5.0.0, @types/ioredis@^4.28.10, @types/midtrans-client@^1.4.0, @types/node@^22.10.2 (+9 more)

### Community 23 - "Frontend ESLint & Tailwind Deps"
Cohesion: 0.12
Nodes (16): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.4.5, @tailwindcss/postcss@^4.3.5, @tailwindcss/turbopack@^4, @types/node@^20, @types/react@^19 (+8 more)

### Community 24 - "Frontend Auth Hooks"
Cohesion: 0.15
Nodes (11): AuthResponse, AuthUser, LoginPayload, OtpChallengeResponse, persistAuthSession(), RegisterPayload, useGoogleAuth(), useLogin() (+3 more)

### Community 25 - "Root Workspace Scripts"
Cohesion: 0.12
Nodes (16): description, devDependencies, concurrently@^9.1.2, name, private, scripts, build, build:backend (+8 more)

### Community 26 - "Backend Core Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, axios@^1.7.9, cors@^2.8.5, dotenv@^16.4.7, express@^4.21.2, express-rate-limit@^8.7.4, google-auth-library@^11.3.4, helmet@^8.3.0 (+8 more)

### Community 27 - "Auth Routes & Rate Limiter"
Cohesion: 0.12
Nodes (15): jsonwebtoken@^9.0.2, authRateLimiter, forgotPasswordSchema, googleAuthSchema, googleClient, loginSchema, RateLimitFactory, rawRateLimit (+7 more)

### Community 28 - "Frontend Client Libraries"
Cohesion: 0.12
Nodes (15): axios@^1.21.1, clsx@^2.1.1, react-dom@19.3.0, @react-oauth/google@^0.13.5, tailwind-merge@^3.7.0, @tiptap/starter-kit@^3.34.0, axios, name (+7 more)

### Community 29 - "Admin Book Requests & Broadcasts"
Cohesion: 0.19
Nodes (12): AdminBookRequestsSection(), STATUS_OPTIONS, AdminBroadcastSection(), BroadcastLogItem, DataTableToolbar(), DataTableToolbarProps, FilterOption, RichTextEditor() (+4 more)

### Community 30 - "Docker Environment Variables"
Cohesion: 0.14
Nodes (15): environment, CORS_ORIGIN, DATABASE_URL, JWT_SECRET, KIRIMINAJA_API_KEY, KIRIMINAJA_BASE_URL, MIDTRANS_CLIENT_KEY, MIDTRANS_IS_PRODUCTION (+7 more)

### Community 31 - "SMTP Email & Receipt Templates"
Cohesion: 0.33
Nodes (12): escapeHtml(), formatIDR(), OrderReceiptEmailItem, sendBroadcastTemplateEmail(), sendEmail(), sendEmailChangeOtpEmail(), sendOrderReceiptEmail(), sendOtpEmail() (+4 more)

### Community 32 - "Backend TypeScript Config"
Cohesion: 0.15
Nodes (12): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, outDir, rootDir (+4 more)

### Community 33 - "Backend Package Metadata"
Cohesion: 0.18
Nodes (10): midtrans-client@^1.4.3, @types/jsonwebtoken@^9.0.8, name, prisma, seed, private, type, version (+2 more)

### Community 34 - "Admin Vouchers & Currency Input"
Cohesion: 0.33
Nodes (9): AdminVouchersSection(), formatDiscountLabel(), CurrencyInput(), CurrencyInputProps, formatRupiahDigits(), useAdminCoupons(), useCreateCoupon(), useDeleteCoupon() (+1 more)

### Community 35 - "App Root Layout & Providers"
Cohesion: 0.29
Nodes (7): metadata, poppins, quicksand, RootLayout(), CartProvider(), CmsProvider(), QueryProvider()

### Community 36 - "Docker Postgres Service"
Cohesion: 0.20
Nodes (10): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, container_name, environment, image, ports, restart (+2 more)

### Community 37 - "Admin Events API Routes"
Cohesion: 0.22
Nodes (5): checkInTicketSchema, eventSchema, router, updateEventSchema, updateRegistrationSchema

### Community 38 - "GSAP Motion & Animation Utils"
Cohesion: 0.39
Nodes (8): gsap@^3.15.1, animateCountUp(), animateHeadlineReveal(), animateParallax(), animateStaggerCards(), isMobileDevice(), isReducedMotion(), gsap

### Community 39 - "Docker Service Build Config"
Cohesion: 0.25
Nodes (9): build, context, dockerfile, build, container_name, depends_on, ports, restart (+1 more)

### Community 40 - "Docker Service Dependencies"
Cohesion: 0.22
Nodes (9): container_name, depends_on, ports, restart, postgres, redis, condition, condition (+1 more)

### Community 41 - "Backend NPM Scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, postinstall, prisma:generate, prisma:push, prisma:seed, start

### Community 42 - "Navigation Category Data"
Cohesion: 0.29
Nodes (6): AGE_GROUPS_DROPDOWN, BOOKS_CATEGORIES_DROPDOWN, CategoryItem, HAMPERS_CATEGORIES_DROPDOWN, NavDropdownGroup, TOYS_CATEGORIES_DROPDOWN

### Community 43 - "Docker Volumes Config"
Cohesion: 0.29
Nodes (6): driver, driver, services, volumes, postgres_data, redis_data

### Community 44 - "Docker Resource Limits"
Cohesion: 0.29
Nodes (7): deploy, resources, deploy, memory, deploy, deploy, limits

### Community 45 - "Docker Redis Service"
Cohesion: 0.29
Nodes (7): command, container_name, image, ports, restart, volumes, redis

### Community 46 - "New Arrivals Components"
Cohesion: 0.40
Nodes (4): NewArrivalsSection(), NewArrivalsSectionProps, NewArrivals, NewArrivalsProps

### Community 47 - "Default Public SVG Assets"
Cohesion: 0.33
Nodes (6): Next.js Default Public SVG Assets, file.svg (16x16 Document Icon), globe.svg (16x16 Globe Icon), next.svg (394x80 Next.js Wordmark), vercel.svg (1155x1000 Vercel Triangle), window.svg (16x16 Browser Window Icon)

### Community 48 - "Docker Healthcheck Config"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 49 - "Prisma Database Seeding"
Cohesion: 0.40
Nodes (3): bcryptjs@^3.0.2, prisma, bcryptjs

### Community 51 - "Gift Hampers Motion Banner"
Cohesion: 0.40
Nodes (3): framer-motion@^14.10.1, GiftHampersBannerProps, framer-motion

### Community 52 - "Frontend NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 53 - "Tailwind v4 Configuration"
Cohesion: 0.50
Nodes (3): tailwindcss@^4, config, tailwindcss

### Community 55 - "Orders, Coupons & Reviews Spec"
Cohesion: 0.50
Nodes (3): GET /coupons/active & POST /coupons/validate, POST /orders/:orderId/reviews (Verified Purchase), Order, OrderItem & Coupon Tables (BS-YYYYMMDD-XXX)

### Community 56 - "TRD & Governance Rules"
Cohesion: 0.67
Nodes (3): BabyShalls AI Agent Context & Workspace Guide, Development Rules & Anti-Bias Governance, Technical Requirements Document (TRD) v1.0.0

## Knowledge Gaps
- **31 isolated node(s):** `Development Rules & Anti-Bias Governance`, `Technical Requirements Document (TRD) v1.0.0`, `vercel.svg (1155x1000 Vercel Triangle)`, `window.svg (16x16 Browser Window Icon)`, `file.svg (16x16 Document Icon)` (+26 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 412 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Storefront Info Pages` to `Checkout & Account Pages`, `Admin Auth & Coupons`, `Events UI & Cart Context`, `Admin Catalog & Product Modal`, `Orders, Cart & Event Registration`, `Admin Workshops & QR Scanner`, `Admin CMS Canvas Editor`, `Admin Orders Management`, `Homepage Marketing Sections`, `Hampers, Login & Request Routes`, `Frontend UI Dependencies`, `Frontend Client Libraries`, `Admin Book Requests & Broadcasts`, `Admin Vouchers & Currency Input`, `App Root Layout & Providers`, `New Arrivals Components`, `Gift Hampers Motion Banner`, `StripInfo Banner Component`, `ShopByAge Component`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `Development Rules & Anti-Bias Governance`, `Technical Requirements Document (TRD) v1.0.0`, `vercel.svg (1155x1000 Vercel Triangle)` to the rest of the system?**
  _31 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `BinderByte Shipping Provider` be split into smaller, more focused modules?**
  _Cohesion score 0.07667900581702802 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Homepage Marketing Sections` to `Checkout & Account Pages`, `Admin Auth & Coupons`, `Storefront Info Pages`, `Admin Vouchers & Currency Input`, `Admin Catalog & Product Modal`, `Events UI & Cart Context`, `Orders, Cart & Event Registration`, `Admin Workshops & QR Scanner`, `Admin CMS Canvas Editor`, `Admin Orders Management`, `New Arrivals Components`, `Hampers, Login & Request Routes`, `Frontend UI Dependencies`, `Gift Hampers Motion Banner`, `Frontend Client Libraries`, `Admin Book Requests & Broadcasts`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `Checkout & Account Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.1378048780487805 - nodes in this community are weakly interconnected._
- **Why does `@tanstack/react-query` connect `Admin Auth & Coupons` to `App Root Layout & Providers`, `Events UI & Cart Context`, `Admin Workshops & QR Scanner`, `Admin CMS Canvas Editor`, `Admin Orders Management`, `Frontend UI Dependencies`, `Customer Account Hooks`, `Frontend Auth Hooks`, `Frontend Client Libraries`, `Admin Book Requests & Broadcasts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Should `Admin Auth & Coupons` be split into smaller, more focused modules?**
  _Cohesion score 0.07557354925775979 - nodes in this community are weakly interconnected._