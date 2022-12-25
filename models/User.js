const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, },
    isAdmin: { type: Boolean, default: false },
    img: { type: String, },
    address: { type: String, required: true, },
}, { timestamps: true });



module.exports =mongoose.model("user", UserSchema);