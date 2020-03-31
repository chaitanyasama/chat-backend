let mailer = null;
let from = null;


const initializeMailer = (_mailer, _from) =>
{
    mailer = _mailer;
    from = _from;
};


const sendMail = (to, subject, message) =>
{
    let mail = {from: from, to: to, subject: subject, text: message};

    mailer.sendMail(mail, (error, info) =>
    {
        if(error)
        {
            console.log(error);
        }
        else
        {
            console.log("Message from " + from + " to " + to + "has been sent.");
        }
    });
};


module.exports =
{
    initializeMailer: initializeMailer,
    sendMail: sendMail
};