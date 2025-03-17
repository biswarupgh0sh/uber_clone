const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usersSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long']
        },
        lastname:{
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long']
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength:[5, 'Your email must be at least 5 characters long']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socketId: {
        type: String
    }
});


usersSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h"});
    return token;
};

usersSchema.methods.comparePassword = async function(password) {
    return await bcryptjs.compare(password, this.password)
};

usersSchema.statics.hashPassword = async function (password) {
    return await bcryptjs.hash(password, 10);
};


const userModel = mongoose.model("user", usersSchema);

module.exports = userModel;