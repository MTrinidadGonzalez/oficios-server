import {userServices} from '../repository/services.js'
import MailingService from '../mailService/mail.service.js'
import Dtemplates from '../constants/Dtemplates.js'
import config from '../config.js'


const urlDocs= config.multerDocsUrl.multerDocsUrl

const getAllUsers= async (req,res)=>{
    try{
        const users= await userServices.getUsers()
       // req.io.emit('getAllUsers',users)
        res.send({status:'success', payload:users})
     }
     catch(error){
         console.log(error)
    }
}
const getTradesUsers = async (req, res) => {
    try {
      const users = await userServices.getUsers();
      const tradesUsers = users.filter(user => user.role === "TRABAJADOR");
      
      req.io.emit('getAllUsers',tradesUsers)

      res.send({ status: 'success', payload: tradesUsers });
    } catch (error) {
      console.log(error);
    }
  }

const getUser= async(req,res)=>{
    try{
        const {userId}=req.params
       
        const userDb = await userServices.getUserById(userId)
       // console.log('getUser control, userDb', userDb)
        res.send({ status: 'success', payload: userDb });
  
 }
 catch(error){
    console.log(error)
}
 }


const getAuthToken = async(req,res)=>{
    if(req.user){
      return  console.log(req.user)
    }
    else{
        console.log('no hay req.user')
    }
    res.send({status:'success'})
}

 const getUserProfile= async(req,res)=>{
    try{
        if(!req.user){
            res.send({status:'error', error:'No hay token de usuario aún'})
        }
       else{
        const uid= req.user.id
        const user = await userServices.getUserById(uid)
        req.io.emit('getRealTimeUserProfile',user)
        res.send({status:'success', payload: user})
    
       }
    }
    catch(error){
        console.log(error)
    }
}

const putUser = async (req, res) => {
    try {
        const uid= req.user.id
     
        const userDb= await userServices.getUserById(uid)
        const newDataUser = {
            first_name: req.body.first_name || userDb.first_name,
            last_name: req.body.last_name || userDb.last_name,
            alias: req.body.alias || userDb.alias,
            email: req.body.email || userDb.email,
           
        }
        const result = await userServices.updateUser(uid,newDataUser)
        const user = await userServices.getUserById(uid)
        req.io.emit('getRealTimeUserProfile',user)
      /*  const users= await userServices.getUsers()
        req.io.emit('getAllUsers',users)*/

        res.send({ status: "success" })
    } catch (error) {
        console.log(error)
    }
};

const deleteUser=async(req,res)=>{
    try{
        const uid= req.user.id
        const cid= req.user.cart[0]._id

       const userProducts= await productsService.getProductsByOwnerEmail(req.user.email)
       const productsIds=[]
       const filterPIds= userProducts.map((p)=>{
        productsIds.push(p._id)
       })
      const deleteProducts= await productsService.deleteLisProductsToIds(productsIds)
       const username= `${user.first_name} ${user.last_name}`
       const userEmail= user.email
        const mailingService= new MailingService()
        const sendEmail= await mailingService.sendMail(userEmail, Dtemplates.DELETE_USER,username)

        const result= await userServices.deleteUser(uid)
       
        const users= await userServices.getUsers()
        const tradesUsers = users.filter(user => user.role === "TRABAJADOR");
        req.io.emit('getAllUsers',tradesUsers)

        res.send({status:'success'})
        }
        catch(error){
            console.log(error)
        }
}
/*
Para poner en mongo cuando tenga ngrok
exports = async function() {
 const today= new Date()
 const collection= context.services.get('ClusterTrinidad').db('ecommerce').collection('users')
 const result = await collection.find({expiration:{'$lte': today} }).toArray()
 //console.log(JSON.stringify(result))
const reponse = context.http.post({
    url: url de ngrok o la del hosteo /api/users/deleteInactiveUser,
    body: JSON.stringify(result),
    headers:{
        'Content-Type': ['application/json']
    }
})
 return response
};

 */
const deleteInactiveUser= async(req,res)=>{
    const user= req.body
    console.log(user)
    const mailingService= new MailingService()
    const sendEmail= await mailingService.sendMail(user.email, Dtemplates.CIERRE_CUENTA_INACTIVA)
    const result= await userServices.deleteUser(user._id)
    res.send({status:'success', message:'Cuenta eliminada'})
}




 const postPremiumDocuments = async (req, res) => {
    const indentificacion=  req.files['identificacion'][0].filename
    const comprobanteDomicilio= req.files['comprobanteDomicilio'][0].filename
    const comprobanteCuenta= req.files['comprobanteEstadoCuenta'][0].filename
    const documnments=[
        {
            name: 'Identificación',
            reference: `${urlDocs}/${indentificacion}?folder=documents`
        },
        {
            name: 'Comprobante de domicilio',
            reference: `${urlDocs}/${comprobanteDomicilio}?folder=documents`
        },
        {
            name: 'Comprobante de Estado de cuenta',
            reference: `${urlDocs}/${comprobanteCuenta}?folder=documents`
        }
    ]
    const response= await userServices.updateUserBy('email',req.user.email,{'documents': [...documnments]})
    res.send({ status: 'success' });
  };

 
  const postImgProfile = async (req, res) => {
    try{const uid= req.user.id
       const filename= req.file.filename
       const urlHostServer= 'https://oficios-server.onrender.com/api/documents'
       const imgProfile= `${urlHostServer}/${req.file.filename}?folder=profile`
       const response= await userServices.updateUserBy('email',req.user.email,{'imgProfile':imgProfile})
      /* const users= await userServices.getUsers()
        req.io.emit('getAllUsers',users)*/
        const user = await userServices.getUserById(uid)
        req.io.emit('getRealTimeUserProfile',user)
       res.send({ status: 'success' })
    }
    catch(error){
    console.log(error)
    }
  }

const addCommentToUser=async(req,res)=>{
    const { receiverComment,comment}=req.body
    const receiverCommentId= receiverComment._id.toString()
    const senderCommentId= req.user.id
    const senderComentName= `${req.user.name}` 
    const addComment= await userServices.addComment(receiverCommentId, senderCommentId,senderComentName,comment)
    const user= await userServices.getUserById(receiverComment._id)

     req.io.emit('changeUserInfo',user)

    res.send({status:'success'})
}

const addRecomendationToUser=async(req,res)=>{
  try{
    const {recommendedUserId}=req.body
   // console.log('req.body',recommendedUserId)
 
   const usesRecommendedDb= await userServices.getUserById(recommendedUserId)
   const recommendations= usesRecommendedDb.recomendaciones
   
   for (const recommendation of recommendations) {
    if (recommendation.recommender.id === req.user.id) {
       const removeRecommendation = await userServices.removeRecommendation(recommendedUserId, recommendation.recommender.id);
       const users= await userServices.getUsers()
       const tradesUsers = users.filter(user => user.role === "TRABAJADOR");
       req.io.emit('getAllUsers',tradesUsers)
      
       
       return res.send({status:'success', message:'Recomendación eliminada'})
    }
}
const  recommender={
    name:  `${req.user.name}`,
    id: req.user.id
   }
    const sendRecommendation= await userServices.addRecommendation(recommendedUserId, recommender)
    const users= await userServices.getUsers()
    const tradesUsers = users.filter(user => user.role === "TRABAJADOR");
    req.io.emit('getAllUsers',tradesUsers)
    res.send({status:'success', message:'Recomendación añadida'})
  }
   catch(error){
    console.log(error)
   }
}

const getUserLocation=async(req,res)=>{
try{
    const userId=req.user.id
    const {latitude,longitude}=req.body
//console.log('longitude',longitude)
//console.log('latitude', latitude)
const changeLocation= await userServices.changeUserLocation(userId,latitude,longitude)  
res.send({status:'success'})
}
catch(error){
    console.log(error)
}
}

export default{
    getAllUsers,
    putUser,
    deleteUser,
    getUser,
    postPremiumDocuments,
    postImgProfile,
    deleteInactiveUser,
    getUserProfile,
    getAuthToken,
    getTradesUsers,
    addCommentToUser,
    addRecomendationToUser,
    getUserLocation
}