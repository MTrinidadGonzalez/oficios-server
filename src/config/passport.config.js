import passport from "passport";
import local from 'passport-local'
import { Strategy, ExtractJwt } from 'passport-jwt';
import { cookieExtractor, createHash, validatePassword } from '../utils.js';
import GithubStrategy from 'passport-github2';
import {userServices} from '../repository/services.js'
import config from  '../config.js'
import  RegisterUserDTO from '../dto/user/registerUserDTO.js'

const LocalStrategy= local.Strategy
const admin1= config.admin.emailemail1
const admin2= config.admin.emailemail2
const adminPassword= config.admin.adminPassword

const passportStrategies=()=>{
  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email'},
      async (req, email, password, done) => {
        try {
          const { first_name, last_name,alias , zona,oficio,role,description} = req.body;
      
          if(!first_name && !last_name && !email && !password){
            return done(null, false, { message:'Datos incompletos' });
          }

          const exists = await userServices.getUser("email", email);
          
          if (exists){  
            return done(null, false, { message:'El usuario ya existe' });           
          }
        else{
          const hashedPassword = await createHash(password);
          
          const user = {
            first_name,
            last_name,
            alias,
            email,
            password: hashedPassword,
            role,
            oficio,
            zona,
            description
        
          };
         
          const newUser= RegisterUserDTO.getFrom(user)
          const result = await userServices.createUser(newUser);
          done(null, result);
        }
        
        } catch (error) {
          done(error);
        }
      }
    )
  );
    
  passport.use(
        'login',
        new LocalStrategy(
          { usernameField: 'email' },
          async (email, password, done) => {
            if ((email === admin2) && password === adminPassword) {
              const userAdmin =await userServices.getUser("email", email)
              const user = {
                id: userAdmin._id,
                name: `Admin`,
                role: 'ADMIN',
                email: 'admin2@correo',
                alias: "admin"
                
              };
              return done(null, user);
            }
            else{
              
              let user
              user = await userServices.getUser("email", email);
                
            if (!user){
              return done(null, false, { message: 'Correo no encontrado' });
            }
      
            const isValidPassword = await validatePassword(password, user.password);
            if (!isValidPassword){       
              return done(null, false, { message: 'Contraseña inválida' });
            }
            
            user = {
              id: user._id,
              name: `${user.first_name} ${user.last_name}`,
              email: user.email,
              role: user.role,
              cart: user.cart 
            };
            return done(null, user);
            }
          }
        )
      );
    
      passport.use(
        'github',
        new GithubStrategy(
          {
            clientID: 'Iv1.e63146038bc90095',
            clientSecret: '72bfccf11d3469bccf973d4362b04fa6380b294f',
            callbackURL: 'http://localhost:8080/api/session/githubcallback',
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
           
              const { name, email } = profile._json;
              const user = await userServices.getUser("email", email);
       
              if(!user) {
               
                const newUser =  {
                  first_name: name,
                  email,
                  password:''
                }
                const result = await userServices.createUser(newUser);
                done(null,newUser);
              }
              
              done(null,user);
            } catch (error) {
              done(error);
            }
          }
        )
      );

      passport.use('jwt', new Strategy({
        jwtFromRequest:ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey:'jwtSecret'
      }, async(payload,done)=>{
     

        return done(null,payload);
      }))
    
    };
export default passportStrategies

