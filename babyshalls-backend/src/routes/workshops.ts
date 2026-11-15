import { Router, Request, Response } from 'express';
import { mockWorkshops } from '../data/mockData.js';

export const workshopsRouter = Router();

// GET /api/workshops - list upcoming workshops
workshopsRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: mockWorkshops.length,
    data: mockWorkshops
  });
});

// GET /api/workshops/:id - single workshop detail
workshopsRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const workshop = mockWorkshops.find((w) => w.id === id);

  if (!workshop) {
    res.status(404).json({
      success: false,
      message: `Workshop with id ${id} not found`
    });
    return;
  }

  res.json({
    success: true,
    data: workshop
  });
});

