

errorResponse = (err) =>
{
    let response = {rescode: 1};

    if(err.hasOwnProperty("message") && err.message !== null)
        response["message"] = err.message;

    return response;
};


module.exports =
    {
        errorResponse: errorResponse
    };