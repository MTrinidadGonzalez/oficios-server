import express  from "express";  
import cookieParser from "cookie-parser";
import handlebars from 'express-handlebars'
import mongoose from "mongoose";
import cors from 'cors' 
import { Server } from 'socket.io' 
import __dirname from './utils.js'
import config from  './config.js'
import passportStrategies from './config/passport.config.js'
import path from 'path'

import UserRouter from './routers/user.router.js'
import ChatsRoute from './routers/chats.routers.js'
import  DocumentsRouter from './routers/documents.router.js'

const app= express()
const port= config.app.PORT 

app.use(cookieParser())
/*
app.use(cors(
    {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST','PUT','DELETE']
    }
))*/
app.use(cors({
    origin: true,
   //origin: 'https://oficio-client.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
//agrego esto
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', 'default-src https://oficio-client.onrender.com');
    next();
});



const connection= mongoose.connect(config.mongo.URL)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
//app.use(express.static(`${__dirname}/public`))
app.use('/static', express.static(path.join(__dirname, 'public/files')));

const server= app.listen(port, ()=> console.log(`listening on ${port} - ${config.mode.mode}`))
const io  = new Server(server,{
    cors:{
        origin: 'https://oficio-client.onrender.com',
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