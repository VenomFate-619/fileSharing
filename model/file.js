const { url } = require("inspector");
const mongoose = require("mongoose");
const {v4:uuid4}=require('uuid')

const fileSchema = new mongoose.Schema({
  path: {
    type: String,
    trim: true,
    required: true,
  },
  filename: { type: String, trim: true, required: true },
  size: { type: Number, trim: true, required: true },
  uuid: { type: String, trim: true, required: true },
  sender: { type: String, trim: true },
  receiver: { type: String, trim: true},
},{timestamps:true });


fileSchema.statics.upload= function (filename,path,size)
{
    return new Promise((resolve,reject)=>
    {
        this.create({
          filename,
          uuid:uuid4(),
          path,
          size
      })
        .then((data)=>resolve({"msg":"File save",id:data.uuid}))
        .catch((err)=>reject("File not saved"))
          
    })
}


module.exports = mongoose.model("files", fileSchema);
