const mongoose = require('mongoose')


const userModel = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: { type: String, required: true, default: "https://res.cloudinary.com/mrt24/image/upload/v1668626624/vd2q9fm6rrommsgl76ve.png" }
},
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", userModel)
module.exports = User