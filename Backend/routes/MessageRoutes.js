const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../util.js')
const Chat = require('../Models/ChatModel')
const User = require('../Models/UserModel.js')
const Message = require('../Models/MessageModel')
const Joi = require('@hapi/joi')

const MessageRouter = express.Router()

MessageRouter.get('/:chatId', isAuth, expressAsyncHandler(async (req, res) => {
    const messages = await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat")
    res.status(200).json(messages)
}))

MessageRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body
    if(!content || !chatId){
        throw new Error("Invalid data passed into request")
    }

    var newMessage = {
        sender:req.user._id,
        content,
        chat: chatId
    }

    let message = await (await (await Message.create(newMessage)).populate("sender","name pic")).populate("chat")
    message = await User.populate(message,{
        path: 'chat.users',
        select: "name pic email"
    })
    await Chat.findByIdAndUpdate(chatId,{
        latestMessage: message,
    })
    res.status(200).json(message)
}))

module.exports = MessageRouter