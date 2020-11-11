const multer=require("multer")
const path=require('path')


let storage= multer.diskStorage({
    destination:(req,file,cb) => cb(null,'upload/'),

    filename:(req,file,cb)=>{
        const name= `${Date.now()}${path.extname(file.originalname)}`
        cb(null,name)
    }
})

let upload= multer({
    storage,
    limits:{fileSize:1000000 * 100}
})


module.exports=upload