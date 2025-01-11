import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const reviewCampaign = async (req: Request, res: Response): Promise<void> => {

  const { id,status } = req.body;
 
  if (!id) {
    res.status(400).json({ error: 'Campaign ID is required.' });
    return;
  }

  try {
 
    const existingCampaign = await prisma.campaign.findUnique({ where: { id } });
    if (!existingCampaign) {
      res.status(404).json({ error: 'Campaign not found.' });
      return;
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data:{ status }
    });

    res.status(200).json({
      message: `Campaign status updated to "${status}" successfully.`,
      updatedCampaign,
    });

  } catch (error: any) {
    res.status(500).json({ error: 'Error updating campaign', details: error.message });
  }
};
