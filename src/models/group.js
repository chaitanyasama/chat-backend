const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const Group = new Schema(
    {
        name: {type: String, unique: true, required: true},
        user_list: {type: Array, required: true},
        status: {type: Number, default: 1}
    },
    { timestamps: true }
);

module.exports = { Group: mongoose.model("Group", Group) };
