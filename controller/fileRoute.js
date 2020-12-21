const File = require("../model/file");
const sendmail = require("../util/sendEmail");
const temp = require("../util/emailtemp");
const path = require("path");

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
      .catch((err) => {
        res.status(505).json({ error: "internal server error" });
      });
  },
  download: async (req, res) => {
    try {
      let file = await File.findOne({ uuid: req.params.id });
      if (!!file) {
        return res.download(path.join(__dirname, `../upload/${file.filename}`));
      }
      return res
        .status(404)
        .json({
          msg: "Cannot find such file may be id is wrong or file is expired",
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
      if (!file) {
        return res.status(400).json({ error: "uuid is incorrect" });
      }
      file.sender = emailFrom;
      file.receiver = emailTo;
      await file.save();
      // send email
      let msg = await sendmail({
        from: emailFrom,
        to: emailTo,
        subject: "File Share",
        text: `${emailFrom} shared a file with you`,
        html: temp({
          emailFrom,
          downloadLink: `${process.env.APP_BASE_URL}/files/${uuid}`,
          size: parseInt(file.size / 1000) + " kb",
          expires: "24hr",
        }),
      });
      return res.json(msg);
    } catch (error) {
      console.log(error)
      return res.json({ error: "ERROR in sending mail" });
    }
  },
};
