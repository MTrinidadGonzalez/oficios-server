import chatsModel from '../models/chatsModel.js'
export default class CahtsManager{

  createChat = async (ownerIds) => {
    try {
      const sortedOwnerIds = ownerIds.sort();
  
      const chat = await chatsModel.create({
        owners: sortedOwnerIds,
      });
  
      console.log('chatmanager createChat: Se creó el chat', chat);
      return chat;
    } catch (error) {
      console.log(error);
    }
  };


    getChatByOwners = (email1, email2) => {
        return chatsModel.findOne({
            $and: [
                { 'owners.email': email1 },
                { 'owners.email': email2 }
            ]
        });
    }

     getChatByOwnersId = (ownerId1, ownerId2) => {
      try {
        const sortedOwnerIds = [ownerId1, ownerId2].sort();
        return chatsModel.findOne({
          $and: [
            { 'owners': sortedOwnerIds[0] },
            { 'owners': sortedOwnerIds[1] }
          ]
        }).populate('owners');
      } catch (error) {
        console.log(error);
      }
    };

    getUserChats = (ownerId) => {
      return chatsModel
        .find({ 'owners': ownerId })
        .populate('owners')
        .exec();
    }

      getChatById=(chatId)=>{
        return chatsModel.findById(chatId).populate('owners').exec();
      }

      findChatByIdandSendMessage=async(chatId,ownerMssg,content)=>{
      try{
        const chat=await chatsModel.findById(chatId)
        const newMessage = {
         owner:ownerMssg,
         content: content,
         fecha: new Date()
       };
       chat.messages.push(newMessage);
       await chat.save();

      }
      catch(error){
        console.log(error)
      }
      }
      

     
     deleteChatMessage=async(chatId,messageID)=>{
      const chatDb = await chatsModel.findById(chatId);
      const messages= chatDb.messages
      const messageIndex= messages.findIndex(message => message._id.equals(messageID))
      
      chatDb.messages.splice(messageIndex, 1)
      await chatDb.save()
     
     }      
   
}