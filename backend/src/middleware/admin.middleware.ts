import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const isAdmin = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const  userId  = req.params.id; 
  console.log(userId)
  
  try {
    const user = await prisma.user.findUnique({
      where: {id: Number(userId) },
    });

    if (!user || !user.admin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    next(); 
  } catch (error: any) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
};
