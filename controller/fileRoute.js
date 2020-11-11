const File = require("../model/file");
const sendmail = require("../util/sendEmail");
const temp = require("../util/emailtemp");
const upload = require("../util/uploadConfig");

module.exports = {
  UploadFile: (req, res) => {
    // validate
    if (!req.file) {
      return res.status(401).json({ error: "File require" });
    }
    // store file
    File.upload(req.file.filename, req.file.path, req.file.size)
      .then((data) =>
        res.json({ data, file: `${process.env.APP_BASE_URL}/files/${data.id}` })
      )
      .catch((err) => res.json({ err }));
    // database

    // response
  },
  dowload: async (req, res) => {
    try {
      let file = await File.findOne({ uuid: req.params.id });
      return res.json({
        file,
        uri: `${process.env.APP_BASE_URL}/files/dowload/${file.uuid}`,
      });

      // res.dowload() insert the path of folder
    } catch (error) {
      return res.status(505).json({ error: "No file found" });
    }
  },
  sendEmail: async (req, res) => {
    try {
      const { uuid, emailTo, emailFrom } = req.body;
      // validation
      let file = await File.findOne({ uuid });
      if (file.sender) {
        return res.status(400).json({ error: "Email already send" });
      }
      file.sender = emailFrom;
      file.receiver = emailTo;
      await file.save();
      // send email
    let msg= await sendmail({
        from: emailFrom,
        to: emailTo,
        subject: "File Share",
        text: `${emailFrom} shared a file with you`,
        html: temp({
          emailFrom,
          downloadLink: `${process.env.APP_BASE_URL}/files/${uuid}`,
          size: parseInt(file.size/1000) + " kb",
          expires:'24hr'
        }),
      });
      return res.json(msg)
    } catch (error) {
        
        return res.json({error:"ERROR in sending mail"})
    }
  },
};
