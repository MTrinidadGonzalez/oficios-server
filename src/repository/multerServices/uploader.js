import multer from 'multer'
import __dirname from '../../utils.js'
import path from 'path'
import fs from 'fs';

function createUploader(destinationFolder) {
    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            const destinationPath = `/opt/render/project/src/src/public/files/${destinationFolder}`;
            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath, { recursive: true });
            }
            callback(null, destinationPath);
        },
        filename: function (req, file, callback) {
            callback(null, `${Date.now()}-${file.originalname}`);
        }
    });

    return multer({ storage });
}

export default createUploader


/*
function createUploader(destinationFolder) {
    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
           // const destinationPath = path.join(`${__dirname}/public/files/${destinationFolder}`)
           const destinationPath = `/opt/render/project/src/src/public/files/${destinationFolder}`;
           
           callback(null, destinationPath);
        },
        filename: function (req, file, callback) {
            callback(null, `${Date.now()}-${file.originalname}`)
        }
    });

    return multer({ storage })
}*/