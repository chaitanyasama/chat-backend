const common = require("./common");
const MessageModel = require("../models/message");


const fetchDirectMessages = (req, res) =>
{
    let email_list = [req.query.from, req.query.to];

    MessageModel
        .DirectMessage
        .find({from: {$in: email_list}, to: {$in: email_list}})
        .then(
            (result) =>
            {
                let message_list = [];

                if(result)
                {
                    result.forEach(
                        (row) =>
                        {
                            message_list.push({from: row.from, to: row.to, message: row.message,
                                                  timestamp: row.createdAt});
                        });
                }

                res.json({rescode: 0, message: "Messages fetched successfully",
                             message_list: message_list})
            })
        .catch(
            (err) =>
            {
                res.status(500).json(common.errorResponse(err));
            });
};


const fetchGroupMessages = (req, res) =>
{
    MessageModel
        .GroupMessage
        .find({name: req.query.name})
        .then(
            (result) =>
            {
                let message_list = [];

                if(result)
                {
                    result.forEach(
                        (row) =>
                        {
                            message_list.push({group_name: row.group_name, from: row.from,
                                                  message: row.message, timestamp: row.createdAt});
                        });
                }

                res.json({rescode: 0, message: "Messages fetched successfully",
                             message_list: message_list})
            })
        .catch(
            (err) =>
            {
                res.status(500).json(common.errorResponse(err));
            });
};


module.exports =
    {
        fetchDirectMessages: fetchDirectMessages,
        fetchGroupMessages: fetchGroupMessages
    };
