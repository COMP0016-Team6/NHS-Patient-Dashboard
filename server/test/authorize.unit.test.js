const authorize = require("../middleware/authorize");
const httpMocks = require("node-mocks-http");
const jwtGen = require("../utils/jwtGenerator");

// some function
function next() {
    return "what?";
};

let req = {};
let res = {};

// creates reqeuest and res objects before tests
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
})

test("id: 1, correct token => matched id", () => {
    const testUserId = 1;
    const testUserToken = jwtGen(testUserId);
    req._setHeadersVariable("jwt_token", testUserToken);

    authorize(req, res, next);
    expect(req.user.id).toBe(testUserId);
});

test("id: 12, correct token => matched id", () => {
    const testUserId = 12;
    const testUserToken = jwtGen(testUserId);
    req._setHeadersVariable("jwt_token", testUserToken);

    authorize(req, res, next);
    expect(req.user.id).toBe(testUserId);
});

test("id: 123, correct token => matched id", () => {
    const testUserId = 123;
    const testUserToken = jwtGen(testUserId);
    req._setHeadersVariable("jwt_token", testUserToken);

    authorize(req, res, next);
    expect(req.user.id).toBe(testUserId);
});

test("id: 1 wrong token => Token is not valid", () => {
    const expMsg = "{\"auth\":false,\"msg\":\"Token is not valid\"}";
    const testUserId = 1;
    const testUserToken = jwtGen(testUserId) + "test123";
    req._setHeadersVariable("jwt_token", testUserToken);

    authorize(req, res, next);
    expect(res.status(res._getStatusCode())._getData()).toEqual(expMsg);
});

test("id: 12 wrong token => Token is not valid", () => {
    const expMsg = "{\"auth\":false,\"msg\":\"Token is not valid\"}";
    const testUserId = 12;
    const testUserToken = jwtGen(testUserId) + "test123";
    req._setHeadersVariable("jwt_token", testUserToken);

    authorize(req, res, next);
    expect(res.status(res._getStatusCode())._getData()).toEqual(expMsg);
});

test("id: 123 wrong token => Token is not valid", () => {
    const expMsg = "{\"auth\":false,\"msg\":\"Token is not valid\"}";
    const testUserId = 123;
    const testUserToken = jwtGen(testUserId) + "test123";
    req._setHeadersVariable("jwt_token", testUserToken);

    authorize(req, res, next);
    expect(res.status(res._getStatusCode())._getData()).toEqual(expMsg);
});

test("no token => authorization denied", () => {
    const expMsg = { msg: "authorization denied" };

    const msg = JSON.parse(authorize(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});