import multer from "multer";

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb) {
    cb(null, file.filename + '-' + Date.now() + Path2D.extname(file.originalname));
  }
})

const upload = multer({
  storage: storage
}).single('myImage');


export default upload;