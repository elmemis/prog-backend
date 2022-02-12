const multer = require('multer')
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../public/img"))
  },
  filename: (req, file, callback) => {
    callback(null, file.fieldname + "-" + Date.now())
  }
})

const upload = multer({ storage })

module.exports = upload