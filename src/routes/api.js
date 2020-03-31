const jwt = require('jsonwebtoken');


const userController = require("../controllers/user");
const messageController = require("../controllers/messages");


module.exports = function(router, secret)
{
    const authenticateJWT = (req, res, next) =>
    {
        const authHeader = req.headers.authorization;

        if(authHeader)
        {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, secret, (err, user) =>
            {
                if(err)
                    return res.sendStatus(403);

                req.user = user;
                next();
            });
        }
        else
        {
            res.sendStatus(401);
        }
    };

    router.post(
        '/user/register',
        (req, res) =>
        {
            userController.create(req, res);
        });

    router.post(
        '/user/login',
        (req, res) =>
        {
            userController.login(req, res);
        });

    router.get(
        '/user/fetch',
        authenticateJWT,
        (req, res) =>
        {
            userController.fetch(req, res);
        });

    router.get(
        '/messages/direct/fetch',
        authenticateJWT,
        (req, res) =>
        {
            messageController.fetchDirectMessages(req, res);
        });

    router.get(
        '/messages/group/fetch',
        authenticateJWT,
        (req, res) =>
        {
            messageController.fetchGroupMessages(req, res);
        });
};
