const router = require("express").Router();
const { UploadFile, dowload, sendEmail } = require("../controller/fileRoute");
const upload = require("../util/uploadConfig");

router.post(
  "/files",
    (req,res,next)=>{
        upload.single("myfile")(req,res,(err)=>{
            console.log(req.body);
            
            if(err)
            {
                console.log(err)
                return res.status(501).json({error:"Error in uploading image"})
            }
            next()
        })
    }
  ,
  UploadFile
);

router.get("/files/:id", dowload);

router.post("/send", sendEmail);

module.exports = router;
