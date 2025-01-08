import { Request, Response } from "express";

const uploadCampaign = (req:Request,res:Response) =>{

    res.send("uploadCampaign")

}

const editCampaign = (req:Request,res:Response) =>{
      const id = req.params
    res.send("editCampaign" + id)

}

const deleteCampaign = (req:Request,res:Response) =>{
    const id = req.params
    res.send("deleteCampaign"+ id)

}



export {uploadCampaign,editCampaign,deleteCampaign}