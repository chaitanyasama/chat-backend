const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const common = require("./common");
const UserModel = require("./../models/user");


const SECRET = "test";


const create = (req, res) =>
{
    let user = UserModel.User();
    user.email = req.body.email;
    user.passhash = bcrypt.hashSync(req.body.password, 10);

    user.save()
        .then(
            () =>
            {
                res.json({rescode: 0, message: "User created successfully"});
            })
        .catch(
            (err) =>
            {
                if(err.code === 11000)
                    res.status(400).json({rescode: 1, message: "User already exists"});
                else
                    res.status(500).json(common.errorResponse(err));
            });
};

const fetch = (req, res) =>
{
    UserModel
        .User
        .findOne({email: req.query.email})
        .then(
            (result) =>
            {
                if(result)
                {
                    res.json({rescode: 0, message: "User fetched successfully",
                                 email: result.email, status: result.status,
                                 friend_list: result.friend_list, group_list: result.group_list});
                }
                else
                {
                    res.status(404).json({rescode: 1, message: "User not found"});
                }
            })
        .catch(
            (err) =>
            {
                res.status(500).json(common.errorResponse(err));
            });
};

const login = (req, res) =>
{
    let email = req.body.email;
    let password = req.body.password;

    UserModel.User
        .findOne({email: email})
        .then(
            (result) =>
            {
                if(result)
                {
                    if(bcrypt.compareSync(password, result.passhash))
                    {
                        const token = jwt.sign({email: email}, SECRET, {expiresIn: "24h"});
                        res.json({rescode: 0, message: "User authenticated successfully",
                                     token: token});
                    }
                    else
                    {
                        res.status(401).json({rescode: 1, message: "Unauthenticated"});
                    }
                }
                else
                {
                    res.status(404).json({rescode: 1, message: "User not found."});
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
        fetch: fetch,
        login: login
    };
