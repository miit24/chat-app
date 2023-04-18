const { string } = require('@hapi/joi')
const mongoose = require('mongoose')

const barcodeModel = new mongoose.Schema({
    uuid: { type: String, require: true },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true,
})

const Barcode = mongoose.model("Barcode", barcodeModel)
module.exports = Barcode