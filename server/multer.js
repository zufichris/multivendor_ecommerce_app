import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    cb(null, fileName.split(".")[0] + "-" + Date.now() + ".png");
  },
});
export const uploadOptions = multer({ storage });
