import {chatsService,userServices} from '../repository/services.js'


const listenNewMessage=async(req,res)=>{
try{
  const pendingChats= []
if(req.user){
  const userDb= await userServices.getUserById(req.user.id)
  const newMessages= userDb.newMessages
 //console.log('newMessages', newMessages)
  if(newMessages.length > 0){
    newMessages.forEach((message)=>{
      if(message.status === true){
        pendingChats.push(message.emisorId)
      }
     })
  }
  if(pendingChats.length > 0){
    req.io.emit('newMessages',pendingChats)
  }
  return res.send({status:'success', payload:pendingChats})
}
else{
  return res.send({status:'success', payload:pendingChats})
}
 
}
catch(error){
  console.log(error)
}
}
const changeMessageStatus = async (req, res) => {
  try {
    const emisorMessageId = req.params.emisorMessageId;
   // console.log('emisorMessageId ',emisorMessageId )
    const emmiterDb= await userServices.getUserById(emisorMessageId)
    const receptorUserId = req.user.id;
    const emitterId = emisorMessageId
    const emitterName = `${emmiterDb.first_name} ${emmiterDb.last_name}`
    const newStatus = false;

    await userServices.changeMssgStatus({
      receptorId: receptorUserId,
      emitterId,
      emitterName,
      newStatus,
    });

    const userDb = await userServices.getUserById(req.user.id);
    const newMessages = userDb.newMessages;
    const pendingChats = [];

    newMessages.forEach((message) => {
      if (message.status === true) {
        pendingChats.push(message.emisor);
      }
    });
    req.io.emit('newMessages', pendingChats);
    res.send({ status: 'success' });
  } catch (error) {
    console.log(error);
  }
};


const getUserChats = async (req, res) => {
  try {
    const userId=req.user.id
    const chats = await chatsService.getUserChats(userId); 
   // console.log('chats',chats)
    const infoChats = [];
    chats.forEach((chat) => {
      let opositOwnerInfo = null; 
      chat.owners.forEach((owner) => {
        if (owner.email !== req.user.email) {
          opositOwnerInfo = {
            first_name: owner.first_name,
            last_name: owner.last_name,
            imgProfile: owner.imgProfile,
            id: owner._id
          };
        }
      });
      if (opositOwnerInfo) {
        const chatInfo = {
          chatId: chat.id,
          opossiteOwner: opositOwnerInfo,
        };
        infoChats.push(chatInfo); 
      }
    });
    req.io.emit('getRealTimeChat', infoChats);
   // req.io.emit('getRealTimeUserChats',infoChats)
    res.send({ status: 'success', payload:infoChats });
 
  } catch (error) {
    console.log(error);
  }
}


const getAndCreateChat = async (req, res) => {
  try {
    const { opossiteOwner } = req.params;
  // console.log('opossiteOwner',opossiteOwner)
    const userId = req.user.id;
    const userDb = await userServices.getUserById(opossiteOwner);
    
    const opositOwnerChat = {
      first_name: userDb.first_name,
      last_name: userDb.last_name,
      imgProfile: userDb.imgProfile,
      id: userDb._id,
    };
   
    const existChat = await chatsService.getChatByOwnersId(opossiteOwner, userId);
    if (existChat) {
      console.log('existia chat en el controlador');
      let chatId =  existChat._id.toString();
      const infoChats = {
        messages:  existChat.messages,
        chatId: chatId,
        opositOwnerChat: opositOwnerChat,
      };
       req.io.emit('getRealTimeChat', infoChats);
      // console.log('infoChat ya existia chat control', infoChats)
      return res.send({ status: 'success', payload: infoChats });
    } else {
      console.log('no existia el chat')
      const ownerIds = [userId, opossiteOwner];
      const chat = await chatsService.createChat(ownerIds);
      let chatId = chat._id.toString();
      const infoChats = {
        messages: chat.messages,
        chatId: chatId,
        opositOwnerChat: opositOwnerChat,
      };
      console.log('infoChat no existia chat control', infoChats)
      req.io.emit('getRealTimeChat', infoChats);
      return res.send({ status: 'success', payload: infoChats });
      
    }
    res.send({ status: 'success' });
  } catch (error) {
    console.log(error);
  }
};


const getChat = async (req, res) => {
  try {
    const actualUserId= req.user.id
    const { chatID } = req.params;
    const chat = await chatsService.getChatById(chatID);

    const opositOwnerInfo = chat.owners.find((owner) => owner.email !== req.user.email);
 
    const chatInfo = {
      actualUserId:actualUserId,
      id: chat.id,
      oppositOwner: opositOwnerInfo
        ? { email:opositOwnerInfo.email,
            first_name: opositOwnerInfo.first_name,
            last_name: opositOwnerInfo.last_name,
            imgProfile: opositOwnerInfo.imgProfile,
            id: opositOwnerInfo._id
          }
        : null,
      messages: chat.messages, 
    };

    req.io.emit('getRealTimeChat', chatInfo);
    res.send({ status: 'success',payload:chatInfo });

  } catch (error) {
    console.log(error);
  }
}
const addMessageTochat=async(req,res)=>{
 try{
  const userEmail= req.user.email
  const actualUserId=req.user.id
 const{message,chatId,opossiteOwner}=req.body

 const content=`
 ${req.user.name} dice:\n
 ${message}
`;
const msjAdd= await chatsService.findChatByIdandSendMessage(chatId,actualUserId,content)
const chat= await chatsService.getChatById(chatId)

if (!chat) {
  return res.status(404).json({ status: 'error', message: 'Chat not found' });
}

const chatInfo = {
  id: chat.id,
  opositOwner: opossiteOwner,
  messages: chat.messages, 
};
const newMessageInfo={
  receptorId:opossiteOwner,
  emitterId: actualUserId,
  emitterName:req.user.name,
  newStatus:true
}
const newMessage= await userServices.changeMssgStatus(newMessageInfo)

req.io.emit('getRealTimeChat', chatInfo);
const userDb= await userServices.getUserById(req.user.id)
  const newMessages= userDb.newMessages
//  console.log('listenNewMessage control newMsj',newMessages)
  const pendingChats= []
  newMessages.forEach((message)=>{
   if(message.status === true){
     pendingChats.push(message.emisorId)
   }
  })
 // console.log('listenNewMessage control pendingChats',pendingChats)
  req.io.emit('newMessages',pendingChats)
  res.send({ status: 'success' });
}
catch(error){
  console.log(error)
}
}


const deleteMessage=async(req,res)=>{
try{
  const actualUserId= req.user.id
  const {messageId, chatID}=req.body
  const deleteMessage= await chatsService.deleteChatMessage(chatID,messageId)
  const chat= await chatsService.getChatById(chatID)
  const opositOwnerInfo = chat.owners.find((owner) => owner.email !== req.user.email);

const chatInfo = {
  actualUserId:actualUserId,
  id: chat.id,
  opositOwner: opositOwnerInfo
    ? { email:opositOwnerInfo.email,
        first_name: opositOwnerInfo.first_name,
        last_name: opositOwnerInfo.last_name,
        imgProfile: opositOwnerInfo.imgProfile,
      }
    : null,
  messages: chat.messages, 
};

req.io.emit('getRealTimeChat', chatInfo);
  res.send({status:'success'})
}
catch(error){
  console.log(error)
}
}

export default{

    getUserChats,
    addMessageTochat,
    getChat,
    deleteMessage,
    getAndCreateChat,
    listenNewMessage,
    changeMessageStatus
}