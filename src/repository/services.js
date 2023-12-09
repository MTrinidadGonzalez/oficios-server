import UserManager from "../dao/managers/userManager.js";
import UserRepository from "../repository/userRepository.js";

export const userServices= new UserRepository(new UserManager)

import ChatsRepository from '../repository/chatsRepository.js'
import CahtsManager from '../dao/managers/chatsManager.js'
export const chatsService = new ChatsRepository(new CahtsManager)