import { Router } from "express";
import { passportCall } from "../utils.js";
import config from '../config.js'


export default class RouterPadre{
    constructor(){
        this.router= Router()
        this.init()
    }

    getRouter(){
      return  this.router
    }
    init(){}


    get(path,policies, ...callbacks){
        this.router.get(path,passportCall('jwt',{strategyType:'jwt'}),this.handlePolicies(policies),this.applyCallbacks(callbacks))
    }
    post(path,policies, ...callbacks){
        this.router.post(path,passportCall('jwt',{strategyType:'jwt'}),this.handlePolicies(policies),this.applyCallbacks(callbacks))
    }

    put(path, policies,...callbacks){
        this.router.put(path, passportCall('jwt',{strategyType:'jwt'}),this.handlePolicies(policies),this.applyCallbacks(callbacks))
    }

    delete(path, policies,...callbacks){
        this.router.delete(path, passportCall('jwt',{strategyType:'jwt'}),this.handlePolicies(policies),this.applyCallbacks(callbacks))
    }

    generateCustomResponse =(req,res,next)=>{
        res.sendSuccess= (message)=>{
            res.send({status:'success', message})
        }
        res.sendSuccessAndPayload=(payload)=>{
            res.send({status:'success', payload})
        }
        res.sendError= (error)=>{
            res.status(500).send({status:'error', error})
        }
        /*si la quiero usear en los end points deberia agregarla como meddleware en las rutas de aqui
           get(path, ...callbacks){
        this.router.get(path,this.generateCustomResponse,this.applyCallbacks(callbacks))
    }*/
        next()
    }

    handlePolicies(policies){
        return(req,res,next)=>{
            if(policies[0]=== 'PUBLIC') return next()
            const user= req.user

            if(user){
              req.logger.debug('Llega el token y req.user a handlePolicies')
            }
            else{             
              req.logger.error('El req.user, y el token no no llegan a handlePolicies')             
            } 
            if(policies[0]=== 'NO_AUTH'&&user) return res.status(401).send({status:'error', error: 'no autenticado'})
            
            if(policies[0]=== 'NO_AUTH'&&!user) return next()

            //  if(!user)res.redirect('http://localhost:5173/login')

            if(!policies.includes(user.role.toUpperCase())) return res.status(403).send({status:'error', error:'forbiden'})

            next()
        }
    }

    applyCallbacks(callbacks){
        return callbacks.map(callback=> async(...params)=>{
            try{
                await callback.apply(this,params)
            }
            catch(error){
    
               console.log( error)
            }
        })
    }

}