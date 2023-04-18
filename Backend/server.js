const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const UserRouter = require('./routes/UserRoutes.js')
const UploadRouter = require('./routes/UploadRoutes.js')
const ChatRouter = require('./routes/ChatRoutes.js')
const MessageRouter = require('./routes/MessageRoutes')

dotenv.config()
const app = express()
app.set('view engine', 'pug')
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
mongoose.connect('mongodb://localhost:27017/ChatDB', { useNewUrlParser: true })

app.use('/api/users', UserRouter)
app.use('/api/chats', ChatRouter)
app.use('/api/upload', UploadRouter)
app.use('/api/message', MessageRouter)


app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ message: err.message });
});

const port = process.env.PORT || 5001

const server = app.listen(port, () => {
    console.log(`connection started at port ${port}`)
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on("connection", (socket) => {

    socket.on("setup", (user) => {
        socket.join(user._id)
        socket.emit("connected")
    })

    socket.on("join-chat", (room) => {
        socket.join(room)
    })

    socket.on("send-message", (message) => {
        let chat = message.chat
        if (!chat.users) return console.log("no user")

        chat.users.forEach(user => {
            if (user._id === message.sender._id) {
                return
            }

            socket.to(user._id).emit("receive-message", message)

        });
    })

    socket.on("create-chat", (chat, userInfo) => {
        let users = chat.users
        if (!users) return console.log("no user")

        let filu = users.filter((e) => e._id !== userInfo._id)
        filu.forEach((user) => socket.to(user._id).emit("new-chat",chat,userInfo))
        // users.forEach(user => { 
        //     if(user._id === userInfo._id){
        //         return 
        //     }
        //     socket.to(user._id).emit("new-chat",chat,userInfo)
        // })
    })

})