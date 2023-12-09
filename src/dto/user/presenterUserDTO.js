export default class UserPresenterDTO {
    static getFrom = (user) =>{
        return {
            name: user.first_name,
            lastName:user.last_name,
            email:user.email,
            role:user.role,
          
        
        }
    }
}