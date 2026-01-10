import multer from "multer";
import path from "path";

const dir = path.resolve("public/temp");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

const storage = multer.memoryStorage();

let upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
