const common = require("./common");
const GroupModel = require("./../models/group");


create = (req, res) =>
{
    let user_list = req.body.user_list;

    if(10 < user_list.length < 3)
        res.status(400).json({rescode: 1, message: "Invalid group size"});
    else
    {
        let group = GroupModel.Group();
        group.name = req.body.name;
        group.user_list = req.body.user_list;

        group
            .save()
            .then(
                () =>
                {
                    res.json({rescode: 0, message: "Group created successfully"});
                })
            .catch(
                (err) =>
                {
                    if(err.code === 11000)
                        res.status(400).json({rescode: 1, message: "Group already exists"});
                    else
                        res.status(500).json(common.errorResponse(err));
                });
    }
};

fetch = (req, res) =>
{
    GroupModel
        .Group
        .findOne({name: req.query.name})
        .then(
            (result) =>
            {
                if(result)
                {
                    res.json({rescode: 0, message: "Group fetched successfully",
                                 name: result.name, user_list: result.user_list,
                                 status: result.status});
                }
                else
                {
                    res.status(404).json({rescode: 1, message: "Group not found"});
                }
            })
        .catch(
            (err) =>
            {
                res.status(500).json(common.errorResponse(err));
            });
};

addUsers = (req, res) =>
{
    GroupModel
        .Group
        .findOne({name: req.body.name})
        .then(
            async (group) =>
            {
                if(11 < group.user_list.length + req.body.user_list < 3)
                    res.status(400).json({rescode: 1, message: "Invalid group size"});
                else
                {
                    group.user_list = group.user_list.concat(req.body.user_list);
                    await group.save();
                    await res.json({rescode: 0, message: "Added users successfully"});
                }
            })
        .catch(
            (err) =>
            {
                res.status(500).json(common.errorResponse(err));
            });
};

module.exports =
    {
        create: create,
        fetch: fetch
    };