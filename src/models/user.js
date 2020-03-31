const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const User = new Schema(
    {
        email: {type: String, unique: true, required: true},
        passhash: {type: String, required: true},
        friend_list: {type: Array, default: []},
        group_list: {type: Array, default: []},
        status: {type: Number, default: 1},
        socked_id: {type: String}
    },
    { timestamps: true }
);

module.exports = { User: mongoose.model("User", User) };