import { Router, Response } from 'express';
import { AgeGroup, OrderStatus } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { authenticateJWT, requireAdmin, AuthRequest } from '../middleware/auth.middleware.js';
import { handleRouteError } from '../lib/http-error.js';

const router = Router();
router.use(authenticateJWT, requireAdmin);

const PAID_STATUSES: OrderStatus[] = [
  OrderStatus.PAID,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.COMPLETED,
];

const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  NEWBORN_PLUS: 'Newborn+ (0-12 bln)',
  AGES_1_3: 'Ages 1-3 thn',
  AGES_3_PLUS: 'Ages 3+ thn',
  AGES_6_PLUS: 'Ages 6+ thn',
  ALL_AGES: 'Semua Usia',
};

/**
 * GET /api/admin/analytics?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD (or ?range=7d|30d|12m)
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  const range = typeof req.query.range === 'string' ? req.query.range : '30d';
  const startParam = typeof req.query.startDate === 'string' ? req.query.startDate : '';
  const endParam = typeof req.query.endDate === 'string' ? req.query.endDate : '';

  const now = new Date();
  let startDate = new Date(now);
  let endDate = new Date(now);

  if (startParam && endParam) {
    const parsedStart = new Date(`${startParam}T00:00:00`);
    const parsedEnd = new Date(`${endParam}T23:59:59.999`);
    if (!Number.isNaN(parsedStart.getTime()) && !Number.isNaN(parsedEnd.getTime())) {
      if (parsedStart <= parsedEnd) {
        startDate = parsedStart;
        endDate = parsedEnd;
      } else {
        startDate = parsedEnd;
        startDate.setHours(0, 0, 0, 0);
        endDate = parsedStart;
        endDate.setHours(23, 59, 59, 999);
      }
    }
  } else {
    if (range === '7d') {
      startDate.setDate(now.getDate() - 6);
    } else if (range === '12m') {
      startDate.setMonth(now.getMonth() - 11);
      startDate.setDate(1);
    } else {
      startDate.setDate(now.getDate() - 29);
    }
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  }

  const totalDays = Math.max(
    1,
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  );
  const useMonthlyBuckets = totalDays > 90 || (!startParam && range === '12m');

  try {
    const [
      ordersInRange,
      allOrdersStatus,
      lowStockProducts,
      paidOrderItems,
      paidOrdersUsers,
      eventsWithRegs,
      wishlistGroups,
    ] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: { createdAt: true, grandTotal: true, status: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.order.groupBy({
        by: ['status'],
        where: { createdAt: { gte: startDate, lte: endDate } },
        _count: { _all: true },
      }),
      prisma.product.findMany({
        where: { stock: { lte: 5 } },
        select: { id: true, name: true, stock: true, category: true },
        orderBy: { stock: 'asc' },
        take: 6,
      }),
      prisma.orderItem.findMany({
        where: {
          order: {
            status: { in: PAID_STATUSES },
            createdAt: { gte: startDate, lte: endDate },
          },
        },
        select: {
          productId: true,
          quantity: true,
          price: true,
          product: {
            select: {
              id: true,
              name: true,
              category: true,
              ageGroup: true,
              stock: true,
              images: true,
            },
          },
        },
      }),
      prisma.order.groupBy({
        by: ['userId'],
        where: { status: { in: PAID_STATUSES } },
        _count: { _all: true },
      }),
      prisma.event.findMany({
        orderBy: { eventDate: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          quota: true,
          price: true,
          eventDate: true,
          registrations: {
            select: {
              ticketQuantity: true,
              status: true,
              paymentStatus: true,
            },
          },
        },
      }),
      prisma.wishlist.groupBy({
        by: ['productId'],
        _count: { _all: true },
        orderBy: { _count: { productId: 'desc' } },
        take: 5,
      }),
    ]);

    // 1. Time-series revenue & orders
    const bucketMap = new Map<string, { label: string; revenue: number; orders: number }>();

    if (useMonthlyBuckets) {
      const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      while (cursor <= endMonth) {
        const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
        const label = cursor.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
        bucketMap.set(key, { label, revenue: 0, orders: 0 });
        cursor.setMonth(cursor.getMonth() + 1);
      }
      for (const ord of ordersInRange) {
        const d = ord.createdAt;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const entry = bucketMap.get(key);
        if (entry) {
          entry.orders += 1;
          if (PAID_STATUSES.includes(ord.status)) {
            entry.revenue += Number(ord.grandTotal);
          }
        }
      }
    } else {
      const days = Math.min(90, totalDays);
      for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        bucketMap.set(key, { label, revenue: 0, orders: 0 });
      }
      for (const ord of ordersInRange) {
        const key = ord.createdAt.toISOString().slice(0, 10);
        const entry = bucketMap.get(key);
        if (entry) {
          entry.orders += 1;
          if (PAID_STATUSES.includes(ord.status)) {
            entry.revenue += Number(ord.grandTotal);
          }
        }
      }
    }

    // 2. Summary KPIs (AOV & Repeat Buyer Rate)
    let paidOrdersCount = 0;
    let totalRevenueInRange = 0;
    for (const ord of ordersInRange) {
      if (PAID_STATUSES.includes(ord.status)) {
        paidOrdersCount += 1;
        totalRevenueInRange += Number(ord.grandTotal);
      }
    }
    const averageOrderValue = paidOrdersCount > 0 ? Math.round(totalRevenueInRange / paidOrdersCount) : 0;
    const totalBuyers = paidOrdersUsers.length;
    const repeatBuyers = paidOrdersUsers.filter((u) => u._count._all > 1).length;
    const repeatBuyerRate = totalBuyers > 0 ? Math.round((repeatBuyers / totalBuyers) * 100) : 0;

    // 3. Top Products, Category Sales, Age Group Sales
    const productAgg = new Map<
      string,
      { id: string; name: string; category: string; stock: number; soldQty: number; revenue: number; image: string }
    >();
    const categoryAgg = new Map<string, { category: string; soldQty: number; revenue: number }>();
    const ageAgg = new Map<AgeGroup, { ageGroup: AgeGroup; label: string; soldQty: number; revenue: number }>();

    for (const item of paidOrderItems) {
      const qty = Number(item.quantity || 0);
      const rev = Number(item.price || 0) * qty;
      const prod = item.product;

      const imgs = Array.isArray(prod.images) ? (prod.images as string[]) : [];
      const existingProd = productAgg.get(prod.id);
      if (existingProd) {
        existingProd.soldQty += qty;
        existingProd.revenue += rev;
      } else {
        productAgg.set(prod.id, {
          id: prod.id,
          name: prod.name,
          category: prod.category,
          stock: prod.stock,
          soldQty: qty,
          revenue: rev,
          image: imgs[0] || '/images/placeholder-book.jpg',
        });
      }

      const existingCat = categoryAgg.get(prod.category);
      if (existingCat) {
        existingCat.soldQty += qty;
        existingCat.revenue += rev;
      } else {
        categoryAgg.set(prod.category, { category: prod.category, soldQty: qty, revenue: rev });
      }

      const existingAge = ageAgg.get(prod.ageGroup);
      if (existingAge) {
        existingAge.soldQty += qty;
        existingAge.revenue += rev;
      } else {
        ageAgg.set(prod.ageGroup, {
          ageGroup: prod.ageGroup,
          label: AGE_GROUP_LABELS[prod.ageGroup] || prod.ageGroup,
          soldQty: qty,
          revenue: rev,
        });
      }
    }

    const topProducts = Array.from(productAgg.values())
      .sort((a, b) => b.soldQty - a.soldQty || b.revenue - a.revenue)
      .slice(0, 6);

    const categorySales = Array.from(categoryAgg.values()).sort((a, b) => b.revenue - a.revenue);
    const ageGroupSales = Array.from(ageAgg.values()).sort((a, b) => b.soldQty - a.soldQty);

    // 4. Workshop Occupancy
    const workshopOccupancy = eventsWithRegs.map((evt) => {
      let registeredCount = 0;
      let checkedInCount = 0;
      let paidRevenue = 0;
      const ticketPrice = Number(evt.price || 0);

      for (const reg of evt.registrations) {
        const qty = Number(reg.ticketQuantity || 1);
        registeredCount += qty;
        if (reg.status === 'CHECKED_IN') {
          checkedInCount += qty;
        }
        if (reg.paymentStatus === 'PAID') {
          paidRevenue += ticketPrice * qty;
        }
      }

      return {
        id: evt.id,
        title: evt.title,
        quota: evt.quota,
        registeredCount,
        checkedInCount,
        paidRevenue,
        eventDate: evt.eventDate,
      };
    });

    // 5. Top Wishlisted Products
    const wishlistProductIds = wishlistGroups.map((w) => w.productId);
    const wishlistProducts =
      wishlistProductIds.length > 0
        ? await prisma.product.findMany({
            where: { id: { in: wishlistProductIds } },
            select: { id: true, name: true, category: true, stock: true },
          })
        : [];
    const wishlistProdMap = new Map(wishlistProducts.map((p) => [p.id, p]));
    const topWishlisted = wishlistGroups
      .map((w) => {
        const p = wishlistProdMap.get(w.productId);
        if (!p) return null;
        return {
          id: p.id,
          name: p.name,
          category: p.category,
          stock: p.stock,
          wishlistCount: w._count._all,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return res.json({
      success: true,
      data: {
        range,
        series: Array.from(bucketMap.values()),
        statusBreakdown: allOrdersStatus.map((s) => ({
          status: s.status,
          count: s._count._all,
        })),
        lowStockProducts,
        summary: {
          paidOrdersCount,
          totalRevenueInRange,
          averageOrderValue,
          repeatBuyerRate,
        },
        topProducts,
        categorySales,
        ageGroupSales,
        workshopOccupancy,
        topWishlisted,
      },
    });
  } catch (err: unknown) {
    return handleRouteError(res, err, 'Gagal memuat analitik penjualan.');
  }
});

export default router;
