import { Router } from "express";
import { isAdmin } from "../middleware/admin.middleware";
import { reviewCampaign } from "../Controllers/admin.controller";

const router = Router()

router.post('/campaign/:id',isAdmin, reviewCampaign );

export default router