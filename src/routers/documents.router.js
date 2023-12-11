import RouterPadre from '../routers/router.js'
import path from 'path'
import __dirname from '../utils.js'
import fs from 'fs'

export default class DocumentsRouter extends RouterPadre{
    init(){

        this.get('/:filename',["PUBLIC"],async (req,res)=>{
           try{
            //urlCompleta: http://localhost:8081/api/documents/1694297444243-59799a2e8ccd217019f2cc9d87f42af7.jpg?folder=products
           
             const {filename}= req.params
             console.log('documents.router,filename ',filename)
             const { folder } = req.query || 'profile'
             console.log('documents.router,folder',folder)
             const pathIMG= path.resolve(`${__dirname}/public/files/${folder}/${filename}`)
             console.log('documents.router,pathIMG ',pathIMG)
             const exist=  fs.existsSync(pathIMG)
             if(exist){
                 res.sendFile(pathIMG)
             }
             else{
                 res.send({status:'error', error: 'Documento no encontrado en el servidor'})
             }
           }
           catch(error){
            console.log(error)
           }
        })


    }//cierre del init
}