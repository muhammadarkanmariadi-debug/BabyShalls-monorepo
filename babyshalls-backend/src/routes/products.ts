import { Router, Request, Response } from 'express';
import { mockProducts } from '../data/mockData.js';
import { AgeGroup, ProductCategory } from '../types.js';

export const productsRouter = Router();

// GET /api/products - list all products with optional filters
productsRouter.get('/', (req: Request, res: Response) => {
  const { category, ageGroup, search } = req.query;

  let results = [...mockProducts];

  if (category && typeof category === 'string' && category !== 'All Products') {
    results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (ageGroup && typeof ageGroup === 'string' && ageGroup !== 'All Ages') {
    results = results.filter((p) => p.ageGroup.toLowerCase() === ageGroup.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// GET /api/products/:id - single product detail
productsRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    res.status(404).json({
      success: false,
      message: `Product with id ${id} not found`
    });
    return;
  }

  res.json({
    success: true,
    data: product
  });
});

// POST /api/products - create new product (Admin)
productsRouter.post('/', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.title || !body.category) {
    res.status(400).json({
      success: false,
      message: 'Title and category are required'
    });
    return;
  }

  const newProduct = {
    id: body.id || `prod-${Date.now()}`,
    title: body.title,
    author: body.author || 'Babyshalls Selection',
    category: body.category,
    ageGroup: body.ageGroup || 'All Ages',
    price: Number(body.price) || 100000,
    coverImage: body.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    description: body.description || '',
    inStock: body.inStock !== false,
    featured: Boolean(body.featured),
    badge: body.badge || '',
    pages: body.pages || '',
    publisher: body.publisher || 'Babyshalls Press',
    staffNote: body.staffNote || '',
    language: body.language || 'Bahasa Indonesia',
    moralTheme: body.moralTheme || '',
    format: body.format || 'Hardcover Picture Book',
    isbn: body.isbn || '',
    dimensions: body.dimensions || '',
    weight: body.weight || ''
  };

  mockProducts.unshift(newProduct);

  res.status(201).json({
    success: true,
    message: 'Product successfully added to catalog',
    data: newProduct
  });
});

// PUT /api/products/:id - update existing product (Admin)
productsRouter.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = mockProducts.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({
      success: false,
      message: `Product with id ${id} not found`
    });
    return;
  }

  mockProducts[index] = {
    ...mockProducts[index],
    ...req.body,
    id // keep original ID
  };

  res.json({
    success: true,
    message: 'Product successfully updated',
    data: mockProducts[index]
  });
});

// DELETE /api/products/:id - delete product (Admin)
productsRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = mockProducts.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({
      success: false,
      message: `Product with id ${id} not found`
    });
    return;
  }

  const removed = mockProducts.splice(index, 1)[0];

  res.json({
    success: true,
    message: 'Product successfully removed from catalog',
    data: removed
  });
});

