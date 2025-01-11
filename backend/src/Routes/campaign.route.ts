import { Router } from "express";
import { uploadCampaign, editCampaign, deleteCampaign } from '../Controllers/campaign.controller'
import { singleUpload } from '../middleware/multer.middleware';

const router = Router()


router.post('/upload-campaign', singleUpload, uploadCampaign);
router.put('/edit/:id', editCampaign);
router.delete('/delete/:id', deleteCampaign);




export default router