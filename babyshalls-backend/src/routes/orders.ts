import { Router, Request, Response } from 'express';
import { OrderRequest, OrderResponse } from '../types.js';

export const ordersRouter = Router();

// In-memory order log for prototype demo
const orderStore: OrderResponse[] = [];

// POST /api/orders - create/log a new order
ordersRouter.post('/', (req: Request, res: Response) => {
  try {
    const body: OrderRequest = req.body;

    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
      return;
    }

    const subtotal = body.items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

    let giftWrappingCost = 0;
    if (body.giftOptions) {
      if (body.giftOptions.birthdayCard) giftWrappingCost += 15000;
      if (body.giftOptions.customRibbon) giftWrappingCost += 10000;
      if (body.giftOptions.signatureBox) giftWrappingCost += 35000;
    }

    const total = subtotal + giftWrappingCost;

    const newOrder: OrderResponse = {
      ...body,
      id: `BS-${Date.now().toString().slice(-6)}`,
      subtotal,
      giftWrappingCost,
      total,
      status: 'pending_whatsapp',
      createdAt: new Date().toISOString()
    };

    orderStore.unshift(newOrder);

    console.log(`[Babyshalls API] Order received: ${newOrder.id} - Total: Rp ${total.toLocaleString('id-ID')}`);

    res.status(201).json({
      success: true,
      message: 'Order logged successfully',
      data: newOrder
    });
  } catch (error) {
    console.error('Error logging order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process order'
    });
  }
});

// GET /api/orders - list logged orders
ordersRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: orderStore.length,
    data: orderStore
  });
});

