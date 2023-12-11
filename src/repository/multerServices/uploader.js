import multer from 'multer'
import __dirname from '../../utils.js'
import path from 'path'
import fs from 'fs';
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
function createUploader(destinationFolder) {
    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            // Define la ruta del directorio
            const destinationPath = `/opt/render/project/src/src/public/files/${destinationFolder}`;

            // Verifica si el directorio existe, si no, créalo
            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath, { recursive: true });
            }

            // Llama al callback con la ruta del directorio
            callback(null, destinationPath);
        },
        filename: function (req, file, callback) {
            callback(null, `${Date.now()}-${file.originalname}`);
        }
    });

    return multer({ storage });
}


export default createUploader