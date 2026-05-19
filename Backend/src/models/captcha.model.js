import mongoose from "mongoose";

const catchaSchema = new mongoose.Schema({

    question: {
        type: String,
        required : true
    },

    answer : {
        type: Number,
        required : true
    },

    expiresAt : {
        type : Date,
        required : true,
        expires: 300 // expires after 30 seconds
    }
}
, {
    timestamps : true
})

const Captcha = mongoose.model("Captcha", catchaSchema)

export default Captcha;