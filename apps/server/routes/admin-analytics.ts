import { Hono } from 'hono';
import { OrderStatus } from '@/server/generated/prisma/client';
import { prisma } from '../lib/prisma';
import { requireAdmin, requireAuth, type AuthVariables } from '../middleware/auth';

const adminAnalyticsRouter = new Hono<{ Variables: AuthVariables }>();
adminAnalyticsRouter.use('*', requireAuth, requireAdmin);

adminAnalyticsRouter.get('/', async (c) => {
  try {
    const daysParam = Number(c.req.query('days') || '30');
    const days = Number.isFinite(daysParam) && daysParam > 0 ? Math.min(daysParam, 365) : 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const paidStatuses: OrderStatus[] = [
      OrderStatus.PAID,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.COMPLETED,
    ];

    const [orders, totalUsers, totalProducts, lowStockProducts] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: since }, status: { in: paidStatuses } },
        select: { createdAt: true, grandTotal: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.product.count(),
      prisma.product.findMany({
        where: { stock: { lte: 5 } },
        select: { id: true, name: true, stock: true },
        take: 10,
      }),
    ]);

    const dailyMap = new Map<string, { date: string; revenue: number; orders: number }>();
    let totalRevenue = 0;

    for (const o of orders) {
      const dateKey = o.createdAt.toISOString().slice(0, 10);
      const amount = Number(o.grandTotal);
      totalRevenue += amount;
      const entry = dailyMap.get(dateKey) || { date: dateKey, revenue: 0, orders: 0 };
      entry.revenue += amount;
      entry.orders += 1;
      dailyMap.set(dateKey, entry);
    }

    return c.json({
      success: true,
      data: {
        days,
        totalRevenue,
        totalOrders: orders.length,
        totalUsers,
        totalProducts,
        lowStockProducts,
        dailySeries: Array.from(dailyMap.values()),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memuat analitik admin.';
    return c.json({ success: false, error: message }, 500);
  }
});

export default adminAnalyticsRouter;

