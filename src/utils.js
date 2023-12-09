//ruteo absoluto
import {fileURLToPath} from 'url'
import {dirname} from 'path'
const __filename= fileURLToPath(import.meta.url)
const __dirname= dirname(__filename)
export default __dirname



/////////////////encripto contraseña
import bcrypt from 'bcrypt';

export const createHash = async(password) => {
    const salts = await bcrypt.genSalt(10)
    return bcrypt.hash(password,salts);
}

export const validatePassword = (password, hashedPassword) => bcrypt.compare(password,hashedPassword);


//////////////jwt
import jwt from 'jsonwebtoken'
export const generateToken= (user, expiresIn='24h')=>{
    const token= jwt.sign(user,'jwtSecret', {expiresIn})
    return token
}


// parte que cambio: if(error)return next(error);

//funcion de passportCall
import passport from 'passport'
export const passportCall = (strategy,options={}) =>{
    return async(req,res,next) =>{
        passport.authenticate(strategy,(error,user,info)=>{
            if(error)return next(error);
           
            if(!options.strategyType){
                console.log(`Route ${req.url} no se definió la strategyType`);
                return res.sendServerError();
            }
            if(!user) {
                
                switch(options.strategyType) {
                    case 'jwt':
                        req.error = info.message?info.message:info.toString;
                        
                        return next();
                    case 'locals':
                       req.error= info.message?info.message:info.toString;
                       return next();
                      //  return res.send(info.message?info.message:info.toString())
                }
            }
            req.user = user;
           // console.log('meddleware passportcall req.user', req.user)
            next();
        })(req,res,next);
    }
}

//funcion que extra el token de cookie y despues la uso en la estrategia de jwt
export const cookieExtractor = (req) =>{
    let token = null; //aca viene el token... Si lo encuentra
    if(req&&req.cookies) {
        token = req.cookies['authToken']
     
    }
    return token;
}

//funcion generate mail template
import fs from 'fs'
import Handlebars from 'handlebars'

export const generateMailTemplate= async (template, payload)=>{
    //lee el archivo y lo devuelve como string
    const content= await fs.promises.readFile(`${__dirname}/templates/${template}.handlebars`, 'utf-8')
    const preCompiled= Handlebars.compile(content)
    const compiledContent= preCompiled({...payload})
    return compiledContent
}