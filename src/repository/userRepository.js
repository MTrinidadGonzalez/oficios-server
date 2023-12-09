
export default class UserRepository{

        constructor(dao){
            this.dao= dao
        }
        getUsers(){
            return this.dao.getUsers()
        }

        getUserById=(uid)=>{
            return this.dao.getUserById(uid)
        }

        getUser(params,user){
            return this.dao.getUser(params,user)
        }

        uptateUserRole=(userId, newRole)=>{
            return this.dao.uptateUserRole(userId,newRole)
        }

        updateUserLastConection=(userId, newConection)=>{
            return this.dao.updateUserLastConection(userId,newConection)
        }
        updateUserExpiration=(userId, newExpiration)=>{
            return this.dao.updateUserExpiration(userId,newExpiration)
        }

        createUser(user){
            return this.dao.createUser(user)
        }

        updateUser(uid,user){
            return this.dao.updateUser(uid,user)
        }

        updateUserBy(params, user, newData){
            return this.dao.updateUserBy(params, user, newData)
        }

        deleteUser(uid){
            return this.dao.deleteUser(uid)
        }

        changeMssgStatus = (receptorId, emitterId,newStatus) =>{
            return this.dao.changeMssgStatus(receptorId, emitterId,newStatus)
        }

        
     addComment = async (receiverCommentId, senderCommentId, senderComentName, comment) => {
     return this.dao.addComment(receiverCommentId, senderCommentId, senderComentName, comment)
      };

      addRecommendation = async (recommendedUserId, recommender) => {
       return this.dao.addRecommendation(recommendedUserId, recommender)
      };

      removeRecommendation = async (recommendedUserId, recommenderId) => {
      return this.dao.removeRecommendation(recommendedUserId, recommenderId)
    };

    changeUserLocation = async (userId, latitude, longitude) => {
       return this.dao.changeUserLocation(userId, latitude, longitude)
      };
}