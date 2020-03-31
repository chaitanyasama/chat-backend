const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);


const baseURL = "http://" + process.env.SERVER_HOST + ":" + process.env.SERVER_PORT;
const expect = chai.expect;


describe('User functions', function()
{
    let userDetails = {email: "test@test.com", password: "test1234"};
    let token = null;

    const setToken = (_token) => {token = _token};

    chai
        .request(baseURL)
        .post('/user/register')
        .send(userDetails)
        .end(function(error, response)
             {
                 expect(response.status).to.equal(200);
                 expect(response.body.rescode).to.equal(0);
             });

    chai
        .request(baseURL)
        .post('/user/login')
        .send(userDetails)
        .end(function(error, response, body)
             {
                 expect(response.status).to.equal(200);
                 expect(response.body.rescode).to.equal(0);
                 expect(response.body).to.haveOwnProperty("token");
                 setToken(response.body.token);
             });

    chai
        .request(baseURL)
        .get('/user/fetch')
        .query({email: userDetails.email})
        .set('Authorization', token)
        .end(function(error, response)
             {
                 let s = token;
                 expect(response.status).to.equal(200);
                 expect(response.body.rescode).to.equal(0);
                 expect(response.body.email).to.equal(userDetails.email);
             });
});
