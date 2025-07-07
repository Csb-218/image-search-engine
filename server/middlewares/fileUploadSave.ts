import multer from "multer";
import { extname } from "path";
import { validateFile } from "../utils/util.ts";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'data/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + extname(file.originalname) );
    }
});

const upload_save = multer({
    storage,
    limits: {fileSize: 10000000},
    fileFilter: (req, file, cb) => {
         
        const isFileTyeAllowed = validateFile(file);
        if (isFileTyeAllowed) {
            cb(null, true);
        } else {
            cb(new Error('File format not supported(only jpeg, jpg, png)'));
        }
    }
    
}).array('images', 10);

export {upload_save};