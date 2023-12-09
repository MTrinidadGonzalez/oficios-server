
export default class ChatsRepository{
    constructor(dao){
        this.dao= dao
    }


    
    createChat =  (ownerIds) => {
     return this.dao.createChat(ownerIds)
    };

    getChatById=(chatId)=>{
      return this.dao.getChatById(chatId)
    }

    getChatByOwners = (email1, email2) => {
        return this.dao.getChatByOwners(email1,email2)
    }

    getChatByOwnersId = (ownerId1, ownerId2) => {
      return this.dao.getChatByOwnersId(ownerId1, ownerId2)
    }


    getUserChats = (ownerId) => {
        return this.dao.getUserChats(ownerId);
      }


      deleteChatMessage=(chatId,messageID)=>{
       return this.dao.deleteChatMessage(chatId,messageID)
       } 

       findChatByIdandSendMessage=(chatId,ownerMssg,content)=>{
        return this.dao.findChatByIdandSendMessage(chatId,ownerMssg,content)
       }
}