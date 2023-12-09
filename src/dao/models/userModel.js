import mongoose from "mongoose";

const collection= 'Users'
const schema= new mongoose.Schema({
   
    imgProfile:{
        type:String,
        default:'https://i.pinimg.com/564x/3b/94/6e/3b946eb954f03a7eb2bbe6bfa02a22be.jpg'
    },
    first_name: String, 
    last_name: String,
    alias:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        require: true,
        unique:true
    },
    password:{
        type:String,
        require: true,
        unique:true
    }, 
    oficio:{
        type:String,
        enum:['cliente','albañileria','carpinteria','jardineria','montador/a de cristales y vidrios','pintor/a','mecanico/a','peluquero/a','zapatero/a','gasista',
    'chapista de vehiculos','maquillador/a','electricista','limpieza doméstica','enfermera a domicilio','cuidado de personas','maestra integradora','carpinteria',
    'clases particulares (secundaria)','clases particulares (primaria)','modista']
    },  
    role:{
        type:String,
        enum:['ADMIN', 'USER', 'PREMIUM',"TRABAJADOR"],
        default: 'USER'
    },
    zona:{
        type:String,
        default:'Patio Olmos',
        enum: ['Paseo Rivera Shopping', 'Shopping Nuevo Centro', 'Cordoba Shopping', 'Dinosaurio Mall Ruta20','Patio Olmos']
    },
    description:{
        type:String,
        default:'No hay descripción de esete usuario'
    },
    recomendaciones:[
        {
            recommender:
            {
                name:String,
                id:String
            }
        }
    ],
    comentarios:[
      {
        comment:{
            owneId:String,
            ownerName:String,
            content:String
        }
      }
    ],
    newMessages:[
        {
            emisorId:String,
            emisorName:String,
            status:{
                type:Boolean,
               
            }
        }
    ],
    last_conection:Date,
    expiration: Date,
   location:{
    latitude:Number,
    longitude:Number
   }
})
      
const userModel= mongoose.model(collection, schema)
export default userModel