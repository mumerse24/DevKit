import { Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const saveActivity = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  const { toolName, inputData, outputData } = req.body;

  if (!toolName || !inputData) {
    return res.status(400).json({ error: 'toolName and inputData are required.' });
  }

  try {
    const log = await prisma.history.create({
      data: {
        userId: req.user.id,
        toolName,
        inputData,
        outputData: outputData || null,
      },
    });

    res.status(201).json(log);
  } catch (err: any) {
    console.error('Save activity error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getHistory = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  const search = req.query.search as string || '';

  try {
    const logs = await prisma.history.findMany({
      where: {
        userId: req.user.id,
        OR: [
          { toolName: { contains: search, mode: 'insensitive' } },
          { inputData: { contains: search, mode: 'insensitive' } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(logs);
  } catch (err: any) {
    console.error('Get history error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteHistoryItem = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  const { id } = req.params;
  const historyId = parseInt(id);

  if (isNaN(historyId)) {
    return res.status(400).json({ error: 'Invalid history ID.' });
  }

  try {
    // Confirm ownership
    const item = await prisma.history.findUnique({
      where: { id: historyId },
    });

    if (!item) {
      return res.status(404).json({ error: 'History item not found.' });
    }

    if (item.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this item.' });
    }

    await prisma.history.delete({
      where: { id: historyId },
    });

    res.json({ message: 'History item deleted successfully.' });
  } catch (err: any) {
    console.error('Delete item error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const clearHistory = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    await prisma.history.deleteMany({
      where: { userId: req.user.id },
    });
    res.json({ message: 'All history cleared successfully.' });
  } catch (err: any) {
    console.error('Clear history error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
