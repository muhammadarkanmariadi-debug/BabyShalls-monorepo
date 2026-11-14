# Graph Report - BabyShalls  (2026-11-14)

## Corpus Check
- 82 files · ~52,846 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 6, .example 2, .prisma 1)

## Summary
- 515 nodes · 830 edges · 36 communities (33 shown, 3 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Frontend Pages & Checkout
- Frontend Dependencies & ESLint
- Sitemap & Navigation Flows
- Architecture & API Specs
- Static Pages & FAQ
- Backend Dev Dependencies
- Root Layout & Typography
- Header & Navigation UI
- Frontend TypeScript Config
- Monorepo Root Scripts
- Backend Environment Variables
- Backend Runtime Dependencies
- Express Server & Shipping
- Backend TypeScript Config
- Account & Orders Page
- Postgres Docker Service
- Docker App Build Services
- Docker Service Dependencies
- Homepage Mockup Sections
- Warm Style Guide
- Brand Logo & Favicon
- Checkout & Shipping User Flow
- Redis Cache Client
- Docker Volumes Config
- Docker Resource Limits
- Redis Docker Service
- Hero Child Reading Visual
- Backend Prisma Scripts
- Next.js Default SVGs
- Docker Healthchecks
- Midtrans Payment Client
- Prisma ORM Client
- Watercolor Mascot Logo
- Catalog & Review Models
- User & Admin Module
- Next.js Agent Rules

## God Nodes (most connected - your core abstractions)
1. `react` - 33 edges
2. `lucide-react` - 25 edges
3. `next` - 23 edges
4. `isReducedMotion()` - 17 edges
5. `formatIDR()` - 17 edges
6. `compilerOptions` - 16 edges
7. `useCart()` - 15 edges
8. `environment` - 13 edges
9. `compilerOptions` - 11 edges
10. `formatWeight()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Strict Anti-Bias Guardrails` --semantically_similar_to--> `BabyShalls Engineering Guardrails (Rules 01-08)`  [INFERRED] [semantically similar]
  AGENTS.md → docs/RULES.md
- `BabyShalls AI Agent Context & Workspace Guide` --references--> `API Specification & Contracts`  [EXTRACTED]
  AGENTS.md → docs/API_SPECIFICATION.md
- `BabyShalls AI Agent Context & Workspace Guide` --references--> `Architecture Blueprint v1.0.0`  [EXTRACTED]
  AGENTS.md → docs/ARCHITECTURE.md
- `BabyShalls AI Agent Context & Workspace Guide` --references--> `Database Schema & Data Dictionary`  [EXTRACTED]
  AGENTS.md → docs/DATABASE_SCHEMA.md
- `BabyShalls AI Agent Context & Workspace Guide` --references--> `Product Requirements Document (PRD) v1.0.0`  [EXTRACTED]
  AGENTS.md → docs/PRD.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **End-to-End Checkout, Shipping & Payment Flow** — docs_architecture_frontend_tier, docs_api_specification_shipping_calculate, docs_api_specification_create_snap_token, docs_api_specification_midtrans_webhook, docs_database_schema_order_models [EXTRACTED 1.00]
- **Redis Cache-Aside & Graceful Degradation Architecture** — docs_architecture_backend_tier, docs_architecture_redis_caching, docs_trd_cache_aside_pattern, docs_rules_guardrails [INFERRED 0.95]
- **Single-Store Malang Boutique Governance** — agents_anti_bias_guardrails, docs_rules_guardrails, docs_prd_single_door_hub, docs_prd_m2_kiriminaja_shipping [EXTRACTED 1.00]
- **BabyShalls Design System Tokens** — frontend_public_babyshalls_warm_style_guide_and_homepage_mockup_2_color_palette, frontend_public_babyshalls_warm_style_guide_and_homepage_mockup_2_typography, frontend_public_babyshalls_warm_style_guide_and_homepage_mockup_2_button_system, frontend_public_babyshalls_warm_style_guide_and_homepage_mockup_2_icon_set, frontend_public_babyshalls_warm_style_guide_and_homepage_mockup_2_ui_elements [EXTRACTED 1.00]
- **BabyShalls Desktop Homepage Layout** — frontend_public_babyshalls_warm_style_guide_and_homepage_mockup_2_header_navigation, frontend_public_babyshalls_warm_style_guide_and_homepage_mockup_2_hero_section, frontend_public_babyshalls_warm_style_guide_and_homepage_mockup_2_shop_by_age, frontend_public_babyshalls_warm_style_guide_and_homepage_mockup_2_new_arrivals, frontend_public_babyshalls_warm_style_guide_and_homepage_mockup_2_gift_hampers_banner, frontend_public_babyshalls_warm_style_guide_and_homepage_mockup_2_workshops_events, frontend_public_babyshalls_warm_style_guide_and_homepage_mockup_2_reviews_strip, frontend_public_babyshalls_warm_style_guide_and_homepage_mockup_2_footer_and_whatsapp [EXTRACTED 1.00]
- **Baby Shall's Watercolor Logo Composition** — frontend_public_babyshallslogo_1_png, frontend_public_babyshallslogo_1_brand_wordmark, frontend_public_babyshallslogo_1_reading_girl_mascot, frontend_public_babyshallslogo_1_book_stacks, frontend_public_babyshallslogo_1_floral_star_accents [EXTRACTED]
- **BabyShalls Hero Banner Composition** — frontend_public_hero_child_reading_jpg, frontend_public_hero_child_reading_toddler_reader, frontend_public_hero_child_reading_wooden_toys, frontend_public_hero_child_reading_plush_bunny, frontend_public_hero_child_reading_nursery_environment, frontend_public_hero_child_reading_illustrated_overlays, frontend_public_hero_child_reading_early_literacy_theme [INFERRED]
- **Baby Shall's Visual Brand Identity** — frontend_public_logo_brand_logo, frontend_public_logo_baby_shalls_wordmark, frontend_public_logo_reading_girl_illustration, frontend_src_app_icon_app_icon [EXTRACTED 1.00]
- **Frontend Public Static SVG Asset Bundle** — frontend_public_file_svg, frontend_public_globe_svg, frontend_public_next_svg, frontend_public_vercel_svg, frontend_public_window_svg, concept_nextjs_public_svg_assets [EXTRACTED]
- **End-to-End Customer Storefront Checkout Flow** — frontend_public_user_flow_babyshalls_jelajah_filter, frontend_public_user_flow_babyshalls_keranjang_cart, frontend_public_user_flow_babyshalls_pilih_alamat, frontend_public_user_flow_babyshalls_hitung_ongkir_kiriminaja, frontend_public_user_flow_babyshalls_pilih_kurir, frontend_public_user_flow_babyshalls_bayar_midtrans, frontend_public_user_flow_babyshalls_status_lunas, frontend_public_user_flow_babyshalls_pelacakan_resi [EXTRACTED 1.00]
- **Workshop Event Registration & QR Check-In Flow** — frontend_public_user_flow_babyshalls_pilih_jadwal_event, frontend_public_user_flow_babyshalls_isi_form_peserta, frontend_public_user_flow_babyshalls_etiket_qr_terbit, frontend_public_user_flow_babyshalls_tunjukkan_layar_hp, frontend_public_user_flow_babyshalls_login_admin_hp, frontend_public_user_flow_babyshalls_buka_menu_scan_qr, frontend_public_user_flow_babyshalls_scan_layar_hp_peserta, frontend_public_user_flow_babyshalls_status_checkin_sukses [EXTRACTED 1.00]
- **BabyShalls Admin Operations & Semi-CMS Control Hub** — frontend_public_sitemap_babyshalls_area_admin, frontend_public_user_flow_babyshalls_alur_pemrosesan_pesanan, frontend_public_user_flow_babyshalls_manajemen_konten_semicms, frontend_public_user_flow_babyshalls_laporan_csv_promosi [INFERRED 0.85]

## Communities (36 total, 3 thin omitted)

### Community 0 - "Frontend Pages & Checkout"
Cohesion: 0.09
Nodes (42): AdminDashboardPage(), CatalogContent(), CatalogPage(), AVAILABLE_VOUCHERS, CheckoutPage(), CouponData, CourierOption, SAMPLE_COURIERS (+34 more)

### Community 1 - "Frontend Dependencies & ESLint"
Cohesion: 0.06
Nodes (43): eslintConfig, dependencies, clsx@^2.1.1, gsap@^3.15.1, lenis@^1.3.27, lucide-react@^1.70.0, next@16.4.5, react@19.3.0 (+35 more)

### Community 2 - "Sitemap & Navigation Flows"
Cohesion: 0.05
Nodes (42): Area Admin (Khusus Admin), Area Akun, Area Event, Area Layanan, Area Toko, Beranda, Checkout & Pembayaran, Daftar Event (+34 more)

### Community 3 - "Architecture & API Specs"
Cohesion: 0.07
Nodes (29): BabyShalls AI Agent Context & Workspace Guide, PUT /admin/cms, POST /admin/orders/:id/pickup, POST /book-requests, POST /orders/create-snap-token, API Specification & Contracts, POST /events/register, POST /orders/midtrans-webhook (+21 more)

### Community 4 - "Static Pages & FAQ"
Cohesion: 0.15
Nodes (20): nextConfig, CategoryFilter, FAQ_DATA, FAQItem, HomePage(), EventsSection(), HampersSection(), HeroSection() (+12 more)

### Community 5 - "Backend Dev Dependencies"
Cohesion: 0.11
Nodes (25): devDependencies, prisma@^6.2.1, tsx@^4.19.2, @types/bcryptjs@^2.4.6, @types/cors@^2.8.17, @types/express@^5.0.0, @types/ioredis@^4.28.10, @types/jsonwebtoken@^9.0.8 (+17 more)

### Community 6 - "Root Layout & Typography"
Cohesion: 0.15
Nodes (13): metadata, nunito, playfair, RootLayout(), Footer(), WhatsAppButton(), Toast(), CartProvider() (+5 more)

### Community 7 - "Header & Navigation UI"
Cohesion: 0.21
Nodes (13): AnnouncementBar(), Header(), HeaderProps, MobileDrawer(), MobileDrawerProps, Navbar(), SiteHeaderWrapper(), AGE_GROUPS_DROPDOWN (+5 more)

### Community 8 - "Frontend TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "Monorepo Root Scripts"
Cohesion: 0.12
Nodes (16): description, devDependencies, concurrently@^9.1.2, name, private, scripts, build, build:backend (+8 more)

### Community 10 - "Backend Environment Variables"
Cohesion: 0.14
Nodes (15): environment, CORS_ORIGIN, DATABASE_URL, JWT_SECRET, KIRIMINAJA_API_KEY, KIRIMINAJA_BASE_URL, MIDTRANS_CLIENT_KEY, MIDTRANS_IS_PRODUCTION (+7 more)

### Community 11 - "Backend Runtime Dependencies"
Cohesion: 0.14
Nodes (14): dependencies, axios@^1.7.9, bcryptjs@^3.0.2, cors@^2.8.5, dotenv@^16.4.7, express@^4.21.2, jsonwebtoken@^9.0.2, zod@^3.24.1 (+6 more)

### Community 12 - "Express Server & Shipping"
Cohesion: 0.23
Nodes (10): app, CalculateShippingPayload, calculateShippingRates(), requestCourierPickup(), ShippingRateOption, AuthenticatedUser, authenticateJWT(), AuthRequest (+2 more)

### Community 13 - "Backend TypeScript Config"
Cohesion: 0.15
Nodes (12): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, outDir, rootDir (+4 more)

### Community 14 - "Account & Orders Page"
Cohesion: 0.18
Nodes (10): AccountPage(), ACTIVE_VOUCHERS, AddressItem, EventTicket, INITIAL_ADDRESSES, INITIAL_ORDERS, INITIAL_TICKETS, OrderItem (+2 more)

### Community 15 - "Postgres Docker Service"
Cohesion: 0.20
Nodes (10): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, container_name, environment, image, ports, restart (+2 more)

### Community 16 - "Docker App Build Services"
Cohesion: 0.25
Nodes (9): build, context, dockerfile, build, container_name, depends_on, ports, restart (+1 more)

### Community 17 - "Docker Service Dependencies"
Cohesion: 0.22
Nodes (9): container_name, depends_on, ports, restart, postgres, redis, condition, condition (+1 more)

### Community 18 - "Homepage Mockup Sections"
Cohesion: 0.25
Nodes (9): Footer & Floating WhatsApp CTA, Gift Hampers Banner, Top Bar, Header & Navigation, Hero Banner Section, 11-Section HTML Mockup Specification, New Arrivals Product Grid, Customer Reviews Strip, Shop by Age Section (+1 more)

### Community 19 - "Warm Style Guide"
Cohesion: 0.29
Nodes (7): BabyShalls Brand Identity, Button & Action Controls, Warm Earthy Color Palette, Line/Flat Icon Set, BabyShalls Warm Style Guide and Homepage Mockup, Typography System (Playfair Display & Nunito), Decorative & Badge UI Elements

### Community 20 - "Brand Logo & Favicon"
Cohesion: 0.32
Nodes (8): Baby Shall's Script Wordmark, Colorful Stacked Books Motif, Baby Shall's Brand Logo (logo.png), Watercolor Floral and Gold Star Accents, Watercolor Reading Girl Illustration, Baby Shall's App Icon (icon.png), Baby Shall's Watercolor Brand Mark, Next.js App Router Favicon Asset

### Community 21 - "Checkout & Shipping User Flow"
Cohesion: 0.25
Nodes (8): Bayar Midtrans (QRIS, BCA, Mandiri, Kartu), Hitung Ongkir via API KiriminAja, Jelajah & Filter (Usia 1-3 / 3+), Keranjang (Slide Cart Drawer & Free Gift Wrapping), Pelacakan Resi Real-Time di Akun Saya, Pilih Multi-Alamat / Input Alamat Baru, Pilih Kurir (JNE, J&T, SiCepat, Anteraja), Status Lunas via Webhook Real-Time

### Community 22 - "Redis Cache Client"
Cohesion: 0.29
Nodes (5): ioredis@^6.0.0, getCache(), redis, setCache(), ioredis

### Community 23 - "Docker Volumes Config"
Cohesion: 0.29
Nodes (6): driver, driver, services, volumes, postgres_data, redis_data

### Community 24 - "Docker Resource Limits"
Cohesion: 0.29
Nodes (7): deploy, resources, deploy, memory, deploy, deploy, limits

### Community 25 - "Redis Docker Service"
Cohesion: 0.29
Nodes (7): command, container_name, image, ports, restart, volumes, redis

### Community 26 - "Hero Child Reading Visual"
Cohesion: 0.38
Nodes (6): Early Childhood Literacy & Play, Whimsical Brand Doodle Overlays, Sunlit Playroom & Bookshelves, Plush Bunny Toy, Toddler Reading Picture Book, Montessori-Style Wooden Toys

### Community 27 - "Backend Prisma Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, prisma:generate, prisma:push, start

### Community 28 - "Next.js Default SVGs"
Cohesion: 0.33
Nodes (6): Next.js Default Public SVG Assets, file.svg (16x16 Document Icon), globe.svg (16x16 Globe Icon), next.svg (394x80 Next.js Wordmark), vercel.svg (1155x1000 Vercel Triangle), window.svg (16x16 Browser Window Icon)

### Community 29 - "Docker Healthchecks"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 30 - "Midtrans Payment Client"
Cohesion: 0.40
Nodes (4): midtrans-client@^1.4.3, coreApi, snap, midtrans-client

### Community 31 - "Prisma ORM Client"
Cohesion: 0.40
Nodes (4): @prisma/client@^6.2.1, globalForPrisma, prisma, @prisma/client

### Community 32 - "Watercolor Mascot Logo"
Cohesion: 0.50
Nodes (4): Colorful Book Stacks, Baby Shall's Brand Wordmark, Floral and Gold Star Accents, Watercolor Reading Girl Mascot

## Knowledge Gaps
- **58 isolated node(s):** `Next.js Agent Rules`, `Next.js Frontend Getting Started Guide`, `Module M3: User & Admin Accounts`, `Architecture Blueprint v1.0.0`, `Technical Requirements Document (TRD) v1.0.0` (+53 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 202 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Static Pages & FAQ` to `Frontend Pages & Checkout`, `Frontend Dependencies & ESLint`, `Root Layout & Typography`, `Header & Navigation UI`, `Account & Orders Page`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `Next.js Agent Rules`, `Next.js Frontend Getting Started Guide`, `Module M3: User & Admin Accounts` to the rest of the system?**
  _58 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Pages & Checkout` be split into smaller, more focused modules?**
  _Cohesion score 0.08708357685563997 - nodes in this community are weakly interconnected._
- **Why does `next` connect `Static Pages & FAQ` to `Frontend Pages & Checkout`, `Frontend Dependencies & ESLint`, `Root Layout & Typography`, `Header & Navigation UI`, `Account & Orders Page`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `Frontend Dependencies & ESLint` be split into smaller, more focused modules?**
  _Cohesion score 0.0595959595959596 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Frontend Pages & Checkout` to `Frontend Dependencies & ESLint`, `Static Pages & FAQ`, `Root Layout & Typography`, `Header & Navigation UI`, `Account & Orders Page`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `Sitemap & Navigation Flows` be split into smaller, more focused modules?**
  _Cohesion score 0.05226480836236934 - nodes in this community are weakly interconnected._