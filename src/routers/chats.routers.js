import RouterPadre from './router.js'
import chatsControllers from '../controllers/chats.controllers.js'
export default class ChatsRoute extends RouterPadre{
    init(){
     this.get('/changeMessageStatus/:emisorMessageId',['PUBLIC'],chatsControllers.changeMessageStatus)
      this.get('/listenNewMessage', ['PUBLIC'],chatsControllers.listenNewMessage)
      this.get('/userChats',['PUBLIC'],chatsControllers.getUserChats)
      this.get('/getChat/:chatID', ['PUBLIC'],chatsControllers.getChat)
      this.get('/getAndCreateChat/:opossiteOwner',['PUBLIC'],chatsControllers.getAndCreateChat)

      this.post('/addMssChat',["PUBLIC","ADMIN","PREMIUM","USER"],chatsControllers.addMessageTochat)
      this.post('/deleteMessage', ['PUBLIC'],chatsControllers.deleteMessage )
   
    }//cierre del init

}