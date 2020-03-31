const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const DirectMessage = new Schema(
    {
        from: {type: String, required: true},
        to: {type: String, required: true},
        message: {type: String, required: true},
        status: {type: Number, required: true}
    },
    { timestamps: true }
);


const GroupMessage = new Schema(
    {
        group_name: {type: String, required: true},
        from: {type: String, required: true},
        message: {type: String, required: true},
        status: {type: Number, required: true},
        undelivered_users: {type: Array, default: []}
    },
    { timestamps: true }
);


module.exports =
    {
            DirectMessage: mongoose.model("DirectMessage", DirectMessage),
            GroupMessage: mongoose.model("GroupMessage", GroupMessage)
    };
