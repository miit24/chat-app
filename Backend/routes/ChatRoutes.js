const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../util.js')
const Chat = require('../Models/ChatModel')
const User = require('../Models/UserModel.js')

const ChatRouter = express.Router()

ChatRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
    const { userId } = req.body
    if (!userId) {
        throw new Error("User ID is not provided")
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: req.user._id },
            { users: userId }
        ]
    })
    .populate('users', '-password')
    .populate('latestMessage')

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name pic email'
    })

    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        }

        try {
            const createdChat = await Chat.create(chatData)
            const fullChat = await Chat.findOne({ _id: createdChat._id })
                .populate('users', '-password')
            res.status(200).send(fullChat)

        } catch (error) {
            res.status(400)
        }
    }

}))

ChatRouter.get('/', isAuth, expressAsyncHandler(async (req, res) => {
    try {
        const isChat = await Chat.find({
            users: req.user._id
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .populate({
                path: "latestMessage",
                populate: {
                    path: "latestMessage.sender",
                    select: "name pic email"
                }
            })
            .sort({ updatedAt: -1 })
        // isChat = await User.populate(isChat, {
        //     path: 'latestMessage.sender',
        //     select: 'name pic email'
        // })
        console.log(isChat)
        res.status(200).json(isChat)

    } catch (error) {

    }
}))

ChatRouter.post('/group', isAuth, expressAsyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name)
        throw new Error("Field are empty")
    let users = JSON.parse(req.body.users)
    if (users.length < 2)
        throw new Error("More than two user are required")
        
    users.push(req.user)

    const newChat = await Chat.create({
        chatName: req.body.name,
        users,
        isGroupChat: true,
        groupAdmin: req.user
    })
    const fullChat = await Chat.findOne({ _id: newChat._id }).populate("users", "-password").populate("groupAdmin", "-password")
    res.send(fullChat)
}))

ChatRouter.put('/rename', isAuth, expressAsyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body
    const newData = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        }, {
        new: true
    }).populate("users", "-password").populate("groupAdmin", "-password")

    if (newData)
        res.json(newData)
    else
        throw new Error("No such group exist")
}))

ChatRouter.put('/groupremove', isAuth, expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body
    // const checker = await Chat.findById(chatId)

    // if(!checker.isGroupAdmin)
    //     throw new Error("Select Group Chat")

    const newData = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId }
        }, {
        new: true
    }).populate("users", "-password").populate("groupAdmin", "-password")

    if (newData)
        res.json(newData)
    else
        throw new Error("No such group exist")
}))

ChatRouter.put('/groupadd', isAuth, expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body
    // const checker = await Chat.findById(chatId)

    // if(!checker.isGroupAdmin)
    //     throw new Error("Select Group Chat")

    const newData = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId }
        }, {
        new: true
    }).populate("users", "-password").populate("groupAdmin", "-password")

    if (newData)
        res.json(newData)
    else
        throw new Error("No such group exist")
}))

module.exports = ChatRouter