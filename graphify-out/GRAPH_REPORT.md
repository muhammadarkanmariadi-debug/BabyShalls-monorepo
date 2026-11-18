# Graph Report - BabyShalls  (2026-11-18)

## Corpus Check
- 340 files · ~260,319 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 3, .example 2, .ico 1)

## Summary
- 3696 nodes · 5064 edges · 120 communities (66 shown, 54 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 105
- Community 106
- Community 107
- Community 108
- Community 109
- Community 110
- Community 111
- Community 112
- Community 113
- Community 114
- Community 115
- Community 116
- Community 117
- Community 118

## God Nodes (most connected - your core abstractions)
1. `react` - 87 edges
2. `lucide-react` - 65 edges
3. `next` - 61 edges
4. `extractApiError()` - 39 edges
5. `formatIDR()` - 34 edges
6. `PrismaClient` - 33 edges
7. `@prisma/client` - 30 edges
8. `react-hot-toast` - 25 edges
9. `apiClient` - 23 edges
10. `TombolKembali()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `checkRateLimit()` --calls--> `isRedisReady()`  [EXTRACTED]
  apps/app/api/[[...route]]/route.ts → apps/server/lib/redis.ts
- `CustomerOrdersHistoryPage()` --calls--> `formatIDR()`  [EXTRACTED]
  apps/app/account/orders/page.tsx → apps/src/data/mockProducts.ts
- `AccountPage()` --calls--> `TombolKembali()`  [EXTRACTED]
  apps/app/account/page.tsx → apps/src/components/common/TombolKembali.tsx
- `AccountPage()` --calls--> `WireProductCard()`  [EXTRACTED]
  apps/app/account/page.tsx → apps/src/components/common/WireProductCard.tsx
- `AdminEventAttendeesPage()` --calls--> `CsvExportButton()`  [EXTRACTED]
  apps/app/admin/events/[id]/attendees/page.tsx → apps/src/components/admin/ui/CsvExportButton.tsx

## Import Cycles
- None detected.

## Communities (120 total, 54 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.01
Nodes (160): AddressScalarFieldEnum, AnyNull, Args, At, AtLeast, AtLoose, AtStrict, BatchPayload (+152 more)

### Community 1 - "Community 1"
Cohesion: 0.01
Nodes (159): AggregateProduct, DecimalFieldUpdateOperationsInput, EnumAgeGroupFieldUpdateOperationsInput, EnumProductConditionFieldUpdateOperationsInput, GetProductAggregateType, GetProductGroupByPayload, NullableDecimalFieldUpdateOperationsInput, Product$cartItemsArgs (+151 more)

### Community 2 - "Community 2"
Cohesion: 0.01
Nodes (153): AggregateUser, BoolFieldUpdateOperationsInput, DateTimeFieldUpdateOperationsInput, EnumRoleFieldUpdateOperationsInput, GetUserAggregateType, GetUserGroupByPayload, NullableStringFieldUpdateOperationsInput, StringFieldUpdateOperationsInput (+145 more)

### Community 3 - "Community 3"
Cohesion: 0.02
Nodes (108): AggregateReview, GetReviewAggregateType, GetReviewGroupByPayload, Review$orderItemArgs, Review$userArgs, ReviewAggregateArgs, ReviewAvgAggregateInputType, ReviewAvgAggregateOutputType (+100 more)

### Community 4 - "Community 4"
Cohesion: 0.02
Nodes (105): AggregateOrderItem, GetOrderItemAggregateType, GetOrderItemGroupByPayload, OrderItem$reviewArgs, OrderItemAggregateArgs, OrderItemAvgAggregateInputType, OrderItemAvgAggregateOutputType, OrderItemAvgOrderByAggregateInput (+97 more)

### Community 5 - "Community 5"
Cohesion: 0.02
Nodes (95): AggregateCartItem, CartItemAggregateArgs, CartItemAvgAggregateInputType, CartItemAvgAggregateOutputType, CartItemAvgOrderByAggregateInput, CartItemCountAggregateInputType, CartItemCountAggregateOutputType, CartItemCountArgs (+87 more)

### Community 6 - "Community 6"
Cohesion: 0.02
Nodes (95): AggregateEventRegistration, EventRegistration$userArgs, EventRegistrationAggregateArgs, EventRegistrationAvgAggregateInputType, EventRegistrationAvgAggregateOutputType, EventRegistrationAvgOrderByAggregateInput, EventRegistrationCountAggregateInputType, EventRegistrationCountAggregateOutputType (+87 more)

### Community 7 - "Community 7"
Cohesion: 0.02
Nodes (95): AggregateOrder, EnumOrderStatusFieldUpdateOperationsInput, GetOrderAggregateType, GetOrderGroupByPayload, Order$itemsArgs, OrderAggregateArgs, OrderAvgAggregateInputType, OrderAvgAggregateOutputType (+87 more)

### Community 8 - "Community 8"
Cohesion: 0.02
Nodes (95): AggregateSubCategory, GetSubCategoryAggregateType, GetSubCategoryGroupByPayload, SubCategory$productsArgs, SubCategoryAggregateArgs, SubCategoryAvgAggregateInputType, SubCategoryAvgAggregateOutputType, SubCategoryAvgOrderByAggregateInput (+87 more)

### Community 9 - "Community 9"
Cohesion: 0.02
Nodes (89): AggregateWishlist, GetWishlistAggregateType, GetWishlistGroupByPayload, WishlistAggregateArgs, WishlistCountAggregateInputType, WishlistCountAggregateOutputType, WishlistCountArgs, WishlistCountOrderByAggregateInput (+81 more)

### Community 10 - "Community 10"
Cohesion: 0.02
Nodes (88): AggregateCategory, Category$productsArgs, Category$subCategoriesArgs, CategoryAggregateArgs, CategoryAvgAggregateInputType, CategoryAvgAggregateOutputType, CategoryAvgOrderByAggregateInput, CategoryCountAggregateInputType (+80 more)

### Community 11 - "Community 11"
Cohesion: 0.02
Nodes (81): AggregateOtpCode, GetOtpCodeAggregateType, GetOtpCodeGroupByPayload, IntFieldUpdateOperationsInput, NullableDateTimeFieldUpdateOperationsInput, OtpCodeAggregateArgs, OtpCodeAvgAggregateInputType, OtpCodeAvgAggregateOutputType (+73 more)

### Community 12 - "Community 12"
Cohesion: 0.02
Nodes (80): AddressAggregateArgs, AddressAvgAggregateInputType, AddressAvgAggregateOutputType, AddressAvgOrderByAggregateInput, AddressCountAggregateInputType, AddressCountAggregateOutputType, AddressCountArgs, AddressCountOrderByAggregateInput (+72 more)

### Community 13 - "Community 13"
Cohesion: 0.03
Nodes (79): BoolFilter, BoolWithAggregatesFilter, DateTimeFilter, DateTimeNullableFilter, DateTimeNullableWithAggregatesFilter, DateTimeWithAggregatesFilter, DecimalFilter, DecimalNullableFilter (+71 more)

### Community 14 - "Community 14"
Cohesion: 0.03
Nodes (79): AggregateProductImage, GetProductImageAggregateType, GetProductImageGroupByPayload, ProductImageAggregateArgs, ProductImageAvgAggregateInputType, ProductImageAvgAggregateOutputType, ProductImageAvgOrderByAggregateInput, ProductImageCountAggregateInputType (+71 more)

### Community 15 - "Community 15"
Cohesion: 0.03
Nodes (76): AggregateEvent, Event$registrationsArgs, EventAggregateArgs, EventAvgAggregateInputType, EventAvgAggregateOutputType, EventAvgOrderByAggregateInput, EventCountAggregateInputType, EventCountAggregateOutputType (+68 more)

### Community 16 - "Community 16"
Cohesion: 0.03
Nodes (74): AggregateBookRequest, BookRequest$userArgs, BookRequestAggregateArgs, BookRequestCountAggregateInputType, BookRequestCountAggregateOutputType, BookRequestCountArgs, BookRequestCountOrderByAggregateInput, BookRequestCreateArgs (+66 more)

### Community 17 - "Community 17"
Cohesion: 0.03
Nodes (60): AggregateShippingRateCache, EnumLogisticsProviderFieldUpdateOperationsInput, GetShippingRateCacheAggregateType, GetShippingRateCacheGroupByPayload, ShippingRateCacheAggregateArgs, ShippingRateCacheAvgAggregateInputType, ShippingRateCacheAvgAggregateOutputType, ShippingRateCacheAvgOrderByAggregateInput (+52 more)

### Community 18 - "Community 18"
Cohesion: 0.03
Nodes (59): AggregateCoupon, CouponAggregateArgs, CouponAvgAggregateInputType, CouponAvgAggregateOutputType, CouponAvgOrderByAggregateInput, CouponCountAggregateInputType, CouponCountAggregateOutputType, CouponCountArgs (+51 more)

### Community 19 - "Community 19"
Cohesion: 0.03
Nodes (59): AggregateLogisticsApiUsageLog, GetLogisticsApiUsageLogAggregateType, GetLogisticsApiUsageLogGroupByPayload, LogisticsApiUsageLogAggregateArgs, LogisticsApiUsageLogAvgAggregateInputType, LogisticsApiUsageLogAvgAggregateOutputType, LogisticsApiUsageLogAvgOrderByAggregateInput, LogisticsApiUsageLogCountAggregateInputType (+51 more)

### Community 20 - "Community 20"
Cohesion: 0.03
Nodes (58): AggregateBroadcastLog, BroadcastLogAggregateArgs, BroadcastLogAvgAggregateInputType, BroadcastLogAvgAggregateOutputType, BroadcastLogAvgOrderByAggregateInput, BroadcastLogCountAggregateInputType, BroadcastLogCountAggregateOutputType, BroadcastLogCountArgs (+50 more)

### Community 21 - "Community 21"
Cohesion: 0.03
Nodes (58): AggregateShortLink, GetShortLinkAggregateType, GetShortLinkGroupByPayload, ShortLinkAggregateArgs, ShortLinkAvgAggregateInputType, ShortLinkAvgAggregateOutputType, ShortLinkAvgOrderByAggregateInput, ShortLinkCountAggregateInputType (+50 more)

### Community 22 - "Community 22"
Cohesion: 0.04
Nodes (54): AggregateWaybillTrackingCache, EnumWaybillDeliveryStatusFieldUpdateOperationsInput, GetWaybillTrackingCacheAggregateType, GetWaybillTrackingCacheGroupByPayload, WaybillTrackingCacheAggregateArgs, WaybillTrackingCacheCountAggregateInputType, WaybillTrackingCacheCountAggregateOutputType, WaybillTrackingCacheCountArgs (+46 more)

### Community 23 - "Community 23"
Cohesion: 0.04
Nodes (52): AggregateShippingRegion, GetShippingRegionAggregateType, GetShippingRegionGroupByPayload, ShippingRegionAggregateArgs, ShippingRegionCountAggregateInputType, ShippingRegionCountAggregateOutputType, ShippingRegionCountArgs, ShippingRegionCountOrderByAggregateInput (+44 more)

### Community 24 - "Community 24"
Cohesion: 0.04
Nodes (52): AggregateSiteContent, GetSiteContentAggregateType, GetSiteContentGroupByPayload, SiteContentAggregateArgs, SiteContentCountAggregateInputType, SiteContentCountAggregateOutputType, SiteContentCountArgs, SiteContentCountOrderByAggregateInput (+44 more)

### Community 25 - "Community 25"
Cohesion: 0.10
Nodes (35): AdminEventAttendeesPage(), KpiBox(), EditAdminEventPage(), NewAdminEventPage(), MobileQrScanPage(), ScanHistoryItem, ScanState, EVENT_CATEGORIES (+27 more)

### Community 26 - "Community 26"
Cohesion: 0.08
Nodes (33): AdminBroadcastSection(), BroadcastLogItem, AdminCmsSection(), BG_SWATCHES, BgColorPicker(), CmsPageId, HOME_SECTIONS, HomeSectionId (+25 more)

### Community 27 - "Community 27"
Cohesion: 0.05
Nodes (5): config, decodeBase64AsWasm(), LogOptions, PrismaClient, PrismaClientConstructor

### Community 28 - "Community 28"
Cohesion: 0.08
Nodes (24): AdminLoginPage(), extractApiError(), LoginPage(), AccountAddress, AccountOrder, AccountOrderItem, AccountProfile, AccountTicket (+16 more)

### Community 29 - "Community 29"
Cohesion: 0.05
Nodes (36): AddressScalarFieldEnum, AnyNull, BookRequestScalarFieldEnum, BroadcastLogScalarFieldEnum, CartItemScalarFieldEnum, CategoryScalarFieldEnum, CouponScalarFieldEnum, DbNull (+28 more)

### Community 30 - "Community 30"
Cohesion: 0.09
Nodes (31): EditAdminProductPage(), NewAdminProductPage(), AGE_GROUPS, PRELOVED_GRADES, ProductEditorView(), ProductEditorViewProps, STOREFRONT_CATEGORIES, AGE_GROUPS (+23 more)

### Community 31 - "Community 31"
Cohesion: 0.10
Nodes (26): HampersPage(), metadata, metadata, ShopPage(), MegaMenuProps, WireProductCard(), NewArrivalsSection(), NewArrivalsSectionProps (+18 more)

### Community 32 - "Community 32"
Cohesion: 0.10
Nodes (25): WireEventCard(), WireEventCardProps, WireProductCardProps, UpcomingEventsSection(), CartContext, CartContextType, GIFT_PRICES, initialGiftWrapping (+17 more)

### Community 33 - "Community 33"
Cohesion: 0.12
Nodes (23): AboutPage(), FaqPage(), metadata, HomePage(), metadata, FloatingWhatsApp(), StripInfoProps, CampaignBanner() (+15 more)

### Community 34 - "Community 34"
Cohesion: 0.12
Nodes (27): AdminBookRequestsSection(), STATUS_BADGE_REQUEST, STATUS_OPTIONS, AdminCatalogSection(), CATEGORY_OPTIONS, getCategoryBadge(), getStockBadge(), AdminUserRow (+19 more)

### Community 35 - "Community 35"
Cohesion: 0.08
Nodes (12): OrderSuccessContent(), OrderSuccessPage(), SavedOrderSnapshot, nextConfig, MegaMenu(), Footer(), OPENING_HOURS, Header() (+4 more)

### Community 36 - "Community 36"
Cohesion: 0.07
Nodes (30): dependencies, axios@^1.21.1, hono@^4.13.19, html5-qrcode@^2.3.8, ioredis@^6.0.0, jose@^6.2.17, lucide-react@^1.70.0, next@16.4.5 (+22 more)

### Community 37 - "Community 37"
Cohesion: 0.12
Nodes (22): AccountPage(), TabKey, CheckoutPage(), OrderDrawer(), Toast(), useCart(), formatIDR(), mockProducts (+14 more)

### Community 38 - "Community 38"
Cohesion: 0.07
Nodes (24): Address, BookRequest, BroadcastLog, CartItem, Category, Coupon, $Enums, Event (+16 more)

### Community 39 - "Community 39"
Cohesion: 0.08
Nodes (24): Address, BookRequest, BroadcastLog, CartItem, Category, Coupon, $Enums, Event (+16 more)

### Community 40 - "Community 40"
Cohesion: 0.11
Nodes (14): AdminDashboardPage(), AdminSessionUser, AdminTab, KPI_THEMES, KpiCard(), KpiCardProps, TAB_TITLES, getDefaultDateRange() (+6 more)

### Community 41 - "Community 41"
Cohesion: 0.09
Nodes (18): app, checkRateLimit(), DELETE, GET, memoryRateMap, OPTIONS, PATCH, POST (+10 more)

### Community 42 - "Community 42"
Cohesion: 0.09
Nodes (23): devDependencies, dotenv@^18.0.10, prisma@^7.10.1, @tailwindcss/postcss@^4.3.5, @tailwindcss/turbopack@^4, @types/node@^20, @types/nodemailer@^8.0.2, @types/pg@^8.23.1 (+15 more)

### Community 43 - "Community 43"
Cohesion: 0.21
Nodes (16): PrismaClient, createPrismaClient(), globalForPrisma, prisma, AuthVariables, requireAdmin(), requireAuth(), addressSchema (+8 more)

### Community 44 - "Community 44"
Cohesion: 0.14
Nodes (17): AdminVouchersSection(), formatDiscountLabel(), AdminLoginPayload, AdminLoginResult, AdminOtpChallenge, CreateCouponPayload, UpdateCouponPayload, useAdminCoupons() (+9 more)

### Community 45 - "Community 45"
Cohesion: 0.17
Nodes (17): generateMagicLinkToken(), generateSixDigitCode(), getOtpSecret(), hashOtp(), issueLoginOtp(), verifyLoginOtp(), verifyMagicLinkToken(), delCache() (+9 more)

### Community 46 - "Community 46"
Cohesion: 0.13
Nodes (19): AdminOrdersSection(), COURIER_OPTIONS, ORDER_STATUS_OPTIONS, STATUS_BADGE, AdminDrawer(), AdminDrawerProps, WIDTH_CLASS, useAdminOrders() (+11 more)

### Community 47 - "Community 47"
Cohesion: 0.09
Nodes (21): clsx@^2.1.1, framer-motion@^14.10.1, @neondatabase/serverless@^1.2.1, nodemailer@^10.6.0, @prisma/adapter-pg@^7.10.1, tailwind-merge@^3.7.0, @upstash/ratelimit@^2.2.1, @upstash/redis@^1.41.0 (+13 more)

### Community 48 - "Community 48"
Cohesion: 0.17
Nodes (15): defaultIdempotencyStore, getSecretKey(), JwtUserPayload, signJwt(), verifyJwt(), createMidtransSnapTransaction(), getMidtransConfig(), getMidtransTransactionStatus() (+7 more)

### Community 49 - "Community 49"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 50 - "Community 50"
Cohesion: 0.20
Nodes (12): CustomerOrdersHistoryPage(), EventDetailPage(), ChildData, EventRegistrationPage(), RequestABookContent(), RequestABookPage(), TombolKembali(), TombolKembaliProps (+4 more)

### Community 51 - "Community 51"
Cohesion: 0.16
Nodes (16): main(), AgeGroup, DiscountType, LogisticsProvider, OrderStatus, ProductCondition, Role, WaybillDeliveryStatus (+8 more)

### Community 52 - "Community 52"
Cohesion: 0.22
Nodes (11): CartPage(), metadata, ProductDetailPage(), BannerHampers(), ProductDetailView(), ProductGallery(), ProductGalleryProps, ProductReviewsSection() (+3 more)

### Community 76 - "Community 76"
Cohesion: 0.14
Nodes (14): AdminImportExportSection(), ParsedCsvRow, splitCsvLine(), VALID_AGE_GROUPS, CATEGORIES, CsvImportPreviewModal(), CsvImportProductRow, getRowError() (+6 more)

### Community 77 - "Community 77"
Cohesion: 0.24
Nodes (12): escapeHtml(), formatIDR(), sendEmail(), sendOrderReceiptEmail(), sendOtpEmail(), sendPasswordResetEmail(), SMTP_PORT, wrapEmailLayout() (+4 more)

### Community 79 - "Community 79"
Cohesion: 0.18
Nodes (8): AcquireResult, createIdempotencyStore(), acquireInMemory(), pruneExpired(), IdempotencyRecord, IdempotencyStatus, IdempotencyStore, redis

### Community 80 - "Community 80"
Cohesion: 0.17
Nodes (11): description, name, private, scripts, build, dev, prisma:generate, prisma:push (+3 more)

### Community 81 - "Community 81"
Cohesion: 0.24
Nodes (8): metadata, poppins, quicksand, RootLayout(), @react-oauth/google@^0.13.5, CartProvider(), QueryProvider(), @react-oauth/google

### Community 82 - "Community 82"
Cohesion: 0.18
Nodes (11): scripts, build, cf:build, cf:deploy, cf:preview, dev, lint, prisma:generate (+3 more)

### Community 84 - "Community 84"
Cohesion: 0.40
Nodes (8): AdminShortlinksSection(), AdminShortlink, CreateShortlinkPayload, useAdminShortlinks(), useCreateShortlink(), useDeleteShortlink(), useUpdateShortlink(), qrcode.react

### Community 85 - "Community 85"
Cohesion: 0.39
Nodes (8): gsap@^3.15.1, animateCountUp(), animateHeadlineReveal(), animateParallax(), animateStaggerCards(), isMobileDevice(), isReducedMotion(), gsap

### Community 88 - "Community 88"
Cohesion: 0.29
Nodes (6): AdminNavItem, AdminShellProps, BADGE_THEMES, GROUP_DOTS, NavItemTheme, THEME_STYLES

### Community 89 - "Community 89"
Cohesion: 0.29
Nodes (6): AGE_GROUPS_DROPDOWN, BOOKS_CATEGORIES_DROPDOWN, CategoryItem, HAMPERS_CATEGORIES_DROPDOWN, NavDropdownGroup, TOYS_CATEGORIES_DROPDOWN

### Community 90 - "Community 90"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.5, eslint, eslint-config-next

### Community 102 - "Community 102"
Cohesion: 0.50
Nodes (3): tailwindcss@^4, config, tailwindcss

### Community 112 - "Community 112"
Cohesion: 0.67
Nodes (3): PrismaClientBaseOptions, PrismaClientOptionsWithAccelerateUrl, PrismaClientOptionsWithAdapter

## Knowledge Gaps
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `Community 36` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 11`, `Community 12`, `Community 13`, `Community 14`, `Community 15`, `Community 16`, `Community 17`, `Community 18`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 23`, `Community 24`, `Community 27`, `Community 29`, `Community 38`, `Community 47`?**
  _High betweenness centrality (0.413) - this node is a cross-community bridge._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.012422360248447204 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Community 33` to `Community 25`, `Community 26`, `Community 28`, `Community 30`, `Community 31`, `Community 32`, `Community 34`, `Community 35`, `Community 36`, `Community 37`, `Community 40`, `Community 44`, `Community 46`, `Community 47`, `Community 50`, `Community 52`, `Community 76`, `Community 81`, `Community 84`, `Community 88`, `Community 111`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0125 - nodes in this community are weakly interconnected._
- **Why does `@tanstack/react-query` connect `Community 76` to `Community 32`, `Community 34`, `Community 36`, `Community 37`, `Community 44`, `Community 46`, `Community 47`, `Community 81`, `Community 84`, `Community 25`, `Community 26`, `Community 28`, `Community 30`, `Community 31`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.012987012987012988 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.01834862385321101 - nodes in this community are weakly interconnected._