import { Router } from "express";
import { uploadCampaign, editCampaign, deleteCampaign } from '../Controllers/campaign.controller'

const router = Router()

router.route("/upload-campaign").get(uploadCampaign)
router.route("/edit-campaign/:id").get(editCampaign)
router.route("/delete-campaign/:id").get(deleteCampaign)





export default router