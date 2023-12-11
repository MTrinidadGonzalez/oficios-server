import createUploader from '../repository/multerServices/uploader.js'

export const imgProfileUploader = createUploader('profile').single('imgProfile')

export const productsUploader = createUploader('products').single('img');


export const documentsUploader = createUploader('documents').fields([
    { name: 'identificacion', maxCount: 1 },
    { name: 'comprobanteDomicilio', maxCount: 1 },
    { name: 'comprobanteEstadoCuenta', maxCount: 1 }
  ]);


