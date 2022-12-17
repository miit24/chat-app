const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const UserRouter = require('./routes/UserRoutes.js')
const UploadRouter = require('./routes/UploadRoutes.js')
const ChatRouter = require('./routes/ChatRoutes.js')

dotenv.config()
const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/ChatDB', { useNewUrlParser: true })


app.use('/api/users',UserRouter)
app.use('/api/chats',ChatRouter)
app.use('/api/upload',UploadRouter)


app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

const port = process.env.PORT || 5001

app.listen(port,()=>{
    console.log("port started at 5000")
})