import express  from "express";  
import cookieParser from "cookie-parser";
import handlebars from 'express-handlebars'
import mongoose from "mongoose";
import cors from 'cors' 
import { Server } from 'socket.io' 
import __dirname from './utils.js'
import config from  './config.js'
import passportStrategies from './config/passport.config.js'

import UserRouter from './routers/user.router.js'
import ChatsRoute from './routers/chats.routers.js'
import  DocumentsRouter from './routers/documents.router.js'

const app= express()
const port= config.app.PORT 
//console.log('port', port)

app.use(cors(
    {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST','PUT','DELETE']
    }
))

const connection= mongoose.connect(config.mongo.URL)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(`${__dirname}/public`))


const server= app.listen(port, ()=> console.log(`listening on ${port} - ${config.mode.mode}`))
const io  = new Server(server,{
    cors:{
        origin: 'https://oficio-client.onrender.com/',
        methods: ["GET", "POST","PUT","DELETE"]
    }
})
app.use((req,res,next)=>{
    //REFERENCIAR  io
    req.io = io;
    next();
})
io.on('connection', socket =>{
  //  console.log("Nuevo cliente conectado");
   
})

//handlebars
app.engine('handlebars',handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars')

passportStrategies()

/*rutas*/
const userRouter = new UserRouter()
app.use('/api/users', userRouter.getRouter())
const chatRouter = new ChatsRoute()
app.use('/api/chats', chatRouter.getRouter())
const  documentsRouter= new  DocumentsRouter()
app.use('/api/documents', documentsRouter.getRouter())