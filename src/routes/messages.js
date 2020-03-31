const socketioJwt = require("socketio-jwt");


const UserModel = require("./../models/user");
const MessageModel = require("../models/message");
const GroupModel = require("../models/group");
const Mailer = require("./email");


let userSockets = {};
let groupUsers = {};


module.exports = function(io, secret)
{
    async function sendToUser(email, message, type)
    {
        let msg_status = 1;

        if(!userSockets.hasOwnProperty(email))
        {
            let user = await UserModel.User.findOne({email: email});

            if(user !== null && user.hasOwnProperty("socket_id") && user.socket_id !== null)
                userSockets[email] = [user.socket_id];
        }

        if(userSockets.hasOwnProperty(email))
        {
            userSockets[email].forEach(
                (socket_id) =>
                {
                    io.to(socket_id).emit(type, message);
                    msg_status = 0;
                });
        }

        return msg_status;
    }

    io.sockets
      .on('connection', socketioJwt.authorize({secret: secret, timeout: 15000}))
      .on('authenticated', (socket) =>
    {
        let email = socket.decoded_token.email;
        let socket_id = socket.id;

        if(userSockets.hasOwnProperty(email))
        {
            if(!userSockets[email].hasOwnProperty(socket_id))
                userSockets[email].push(socket_id);
        }
        else
        {
            userSockets[email] = [socket_id];
        }

        UserModel.User.findOne({email: email})
            .then(
                async (result) =>
                {
                    result.socketId = socket.id;
                    await result.save();
                })
            .catch(
                (err) =>
                {
                    console.log("Error in updating user details. Error: " + err.message);
                });

        //TODO: Process pending messages.

        socket.on(
            'direct message',
            async (msg) =>
            {
                let { from, to, message } = JSON.parse(msg);
                let msg_status = await sendToUser(to, msg, 'direct message');

                if(msg_status === 1)
                {
                    Mailer.sendMail(to, "Unread message", message);
                    //TODO: Throttle mails
                }

                //Send to the sender as well, in case of multiple instances.
                await sendToUser(from, msg, 'direct message');

                let directMessage = MessageModel.DirectMessage();
                directMessage.from = from;
                directMessage.to = to;
                directMessage.message = message;
                directMessage.status = msg_status;
                await directMessage.save();

                let user = await UserModel.User.findOne({email: from});

                if(!user.friend_list.hasOwnProperty(to))
                {
                    user.friend_list.push(to);
                    await user.save();
                }
            });

        socket.on(
            'group message',
            async (msg) =>
            {
                let { from, group_name, message } = JSON.parse(msg);
                let undelivered_list = [];
                let msg_status = 0;

                if(!groupUsers.hasOwnProperty(group_name))
                {
                    let group = await GroupModel.Group.findOne({name: group_name});

                    if(group !== null)
                        groupUsers[group_name] = group.user_list;
                }

                if(groupUsers.hasOwnProperty(group_name))
                {
                    for(let idx = 0; idx < groupUsers[group_name].length; idx++)
                    {
                        let to = groupUsers[group_name][idx];
                        let temp_msg_status = await sendToUser(to, msg, 'group message');

                        if(temp_msg_status === 1)
                        {
                            msg_status = temp_msg_status;
                            undelivered_list.push(to);

                            Mailer.sendMail(to, "Unread message", message);
                            //TODO: Throttle mails
                        }
                    }
                }

                let groupMessage = MessageModel.GroupMessage();
                groupMessage.from = from;
                groupMessage.group_name = group_name;
                groupMessage.message = message;
                groupMessage.status = msg_status;
                groupMessage.undelivered_users = undelivered_list;
                await groupMessage.save();
            });

        socket.on(
            "disconnect",
            () =>
            {
                delete userSockets[email];
            });
    });
};
