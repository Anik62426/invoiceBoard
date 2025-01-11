import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import csvParser from "csv-parser";

const prisma = new PrismaClient();

const validatePAN = (panCard: string): Boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(panCard);
};

const uploadCampaign = (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
  }

  const filePath = req.file?.path;

  interface Campaign {
    name: string;
    panCard: string;
    budget: number;
  }

  const campaigns: Campaign[] = [];
  const errors: { row: any; error: string }[] = [];

  if (filePath) {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        const { name, panCard, budget } = row;

        if (!name || !panCard || !validatePAN(panCard) || !budget) {
          errors.push({ row, error: "Invalid data in row" });
          return;
        }

        campaigns.push({
          name,
          panCard,
          budget: parseFloat(budget),
        });
      })
      .on("end", async () => {
        if (errors.length > 0) {
          return res.status(400).json({ errors });
        }

        try {
          await prisma.campaign.createMany({
            data: campaigns,
            skipDuplicates: true,
          });
          res
            .status(201)
            .json({ message: "Campaigns uploaded successfully", campaigns });
        } catch (err) {
          const error = err as Error;
          res
            .status(500)
            .json({
              error: "Error saving campaign data",
              details: error.message,
            });
        }
      });
  } else {
    res.status(400).send("File path is undefined.");
  }
};

const editCampaign = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, panCard, budget } = req.body;
  console.log(name,panCard,budget);
  try {
    
    if (panCard && !validatePAN(panCard)) {
      res.status(400).json({ error: "Invalid PAN Card format" });
      return;
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(panCard && { panCard }),
        ...(budget && { budget: parseFloat(budget) }),
      },
    });

    res.status(200).json({
      message: "Campaign updated successfully",
      updatedCampaign,
    });
  } catch (err: any) {
    res.status(500).json({
      error: "Error updating campaign",
      details: err.message,
    });
  }
};

const deleteCampaign = async(req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedCampaign = await prisma.campaign.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Campaign deleted successfully', deletedCampaign });
  } catch (err: any) {
    res.status(500).json({ error: 'Error deleting campaign', details: (err as Error).message });
  }
};

export { uploadCampaign, editCampaign, deleteCampaign };
