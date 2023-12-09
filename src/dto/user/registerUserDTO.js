//import { use } from "passport"

export default class RegisterUserDTO {
    static getFrom = (user) =>{
        return {
            first_name: user.first_name,
            last_name:user.last_name,
            alias: user.alias,
            email:user.email,
            password:user.password,
            role: user.role,
            oficio:user.oficio,
            zona: user.zona,
            description:user.description
        }
    }
}