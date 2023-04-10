const mongoose = require('mongoose')

const otpModel = new mongoose.Schema({
    otp:{type:Number, required:true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},
    {
        timestamps: true,
    }
)

const Otp = mongoose.model("Otp", otpModel)
module.exports = Otp