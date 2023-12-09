import userModel from "../models/userModel.js";


export default class UserManager{
    getUsers= ()=>{
        return userModel.find().lean()
    }

    getUser=(params,user)=>{
        return userModel.findOne({[params]: user}).lean()
    }

    getUserById=(uid)=>{
        return userModel.findById(uid)
    }
    
    updateUserBy = (params, user, newData) => {
        return userModel.findOneAndUpdate({ [params]: user }, newData, { new: true });
    }
  

    uptateUserRole=(userId, newRole)=>{
        return userModel.findByIdAndUpdate(userId, { role: newRole }, { new: true })
    }
    updateUserLastConection=(userId, newConection)=>{
        return userModel.findByIdAndUpdate(userId, { last_conection: newConection }, { new: true })
    }

    updateUserExpiration=(userId, newExpiration)=>{
        return userModel.findByIdAndUpdate(userId, { expiration: newExpiration }, { new: true })
    }
    createUser=(user)=>{
        return userModel.create(user)
    }

    updateUser=(uid, user)=>{
        return userModel.findByIdAndUpdate(uid, {$set: user})
    }

    deleteUser=(uid)=>{
        return userModel.findByIdAndDelete(uid)
    }

    changeMssgStatus = async ({receptorId, emitterId,emitterName,newStatus}) => {
        try {
            const user = await userModel.findById(receptorId);
            if (!user) {
                console.error('Usuario de new msj no encontrado userManager');
                return;
            }
            const existingMessage = user.newMessages.find(msg => msg.emisorId === emitterId);
            if (existingMessage) {
                existingMessage.status = newStatus;
            } else {

                user.newMessages.push({
                    emisorName:emitterName,
                    emisorId: emitterId,
                    status: newStatus
                });
            }
            await user.save();
           
        } catch (error) {
            console.error('Error al cambiar el estado del mensaje:', error);
        }
    };

    addComment = async (receiverCommentId, senderCommentId, senderComentName, comment) => {
        try {
          
            const user = await userModel.findOneAndUpdate(
                { _id: receiverCommentId },
                {
                    $push: {
                        comentarios: {
                            comment: {
                                owneId: senderCommentId,
                                ownerName: senderComentName,
                                content: comment,
                            },
                        },
                    },
                },
                { new: true }
            );
            if(!user){
                console.log('Usuario no encontrado addComentManager.');
            }
        } catch (error) {
            console.log('Error al agregar el comentario:', error.message);
        }
    };

    addRecommendation = async (recommendedUserId, recommender) => {
        try {
            const user = await userModel.findOneAndUpdate(
                { _id: recommendedUserId },
                {
                    $push: {
                        recomendaciones: {
                            recommender: {
                                name: recommender.name,
                                id: recommender.id
                            }
                        }
                    }
                },
                { new: true }
            );
    
            if (user) {
                console.log('Recomendación agregada con éxito');
            } else {
                console.log('No se encontró al usuario a recomendar');
            }
        } catch (error) {
            console.error('Error adding recommendation:', error.message);
        }
    };


    removeRecommendation = async (recommendedUserId, recommenderId) => {
        try {
            const user = await userModel.findOneAndUpdate(
                { _id: recommendedUserId },
                {
                    $pull: {
                        recomendaciones: {
                            'recommender.id': recommenderId
                        }
                    }
                },
                { new: true }
            );
        
        } catch (error) {
            console.error('Error removing recommendation:', error.message);
        }
    };

    changeUserLocation = async (userId, latitude, longitude) => {
        try {
          const user = await userModel.findById(userId);
          if (!user) {
            console.log("Usuario no encontrado");
            return
          }
          user.location.latitude = latitude;
          user.location.longitude = longitude;

          await user.save();

        } catch (error) {
          console.log("Error al actualizar la ubicación del usuario:",error);
        }
      };
      
    
}