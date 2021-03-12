const validInfo = require("../middleware/validInfo");
const httpMocks = require("node-mocks-http");

// acceptable inputs
const okInputs = Object.freeze({
    email: "emailTest123@test123.com",
    name: "nameTest123",
    password: "passwordTest123",
    role: "Patient",
    dob: "some date",
    gender: "Male",
    diagnosticConclusion: "diagnoseTest123",
    weight: "123"
});
const okPlan = Object.freeze({
    description: "discriptionTest123",
    target_feed_volume: "123",
    target_feed_energy: "123",
    modified_time: "some time"
});
const okLoginBody = Object.freeze({
    email: "emailTest123@test123.com",
    password: "passwordTest12"
});
const okChangeTreatBody = Object.freeze({
    description: "discriptionTest123",
    target_feed_volume: "123",
    target_feed_energy: "123"
});
const okChangeWeightBody = Object.freeze({
    newWeight: "123"
});

// blank inputs
const blankInputs = Object.freeze({
    email: "",
    name: "",
    password: "",
    role: "Patient", // default
    dob: "",
    gender: "Male", // default
    diagnosticConclusion: "",
    weight: ""
});
const blankPlan = Object.freeze({
    description: "",
    target_feed_volume: "",
    target_feed_energy: "",
    modified_time: ""
});
const blankLoginBody = Object.freeze({
    email: "",
    password: ""
});
const blankChangeTreatBody = Object.freeze({
    description: "",
    target_feed_volume: "",
    target_feed_energy: ""
});
const blankChangeWeightBody = Object.freeze({
    newWeight: ""
});

// paths
const regPath = "/register";
const loginPath = "/login";
const changeTreatPath = "/changeTreatmentPlan";
const changeWeightPath = "/changeWeight";

// some function
function next() {
    return "what?";
};

let res = {};

// refreash res on start
beforeEach(() => {
    res = httpMocks.createResponse();
})

// /register

// Partial inputs
test("Register: blank input => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const req = { path: regPath, body: { inputs: Object.assign({}, blankInputs), plan: Object.assign({}, blankPlan)} };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: email => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeRegBody = { inputs: Object.assign({}, blankInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.inputs.email = okInputs.email;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: name => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeRegBody = { inputs: Object.assign({}, blankInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.inputs.name = okInputs.name;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: password => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeRegBody = { inputs: Object.assign({}, blankInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.inputs.password = okInputs.password;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: email, name => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeRegBody = { inputs: Object.assign({}, blankInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.inputs.email = okInputs.email;
    changeRegBody.inputs.name = okInputs.name;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: email, password => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeRegBody = { inputs: Object.assign({}, blankInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.inputs.email = okInputs.email;
    changeRegBody.inputs.password = okInputs.password;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: name, password => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeRegBody = { inputs: Object.assign({}, blankInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.inputs.name = okInputs.name;
    changeRegBody.inputs.password = okInputs.password;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

// role = clinician, success
test("Register: email, name, password - clinician => undefined", () => {
    const changeRegBody = { inputs: Object.assign({}, blankInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.inputs.email = okInputs.email;
    changeRegBody.inputs.name = okInputs.name;
    changeRegBody.inputs.password = okInputs.password;
    changeRegBody.inputs.role = "clinician"
    const req = { path: regPath, body: changeRegBody };

    expect(validInfo(req, res, next)).toBeUndefined();
});

// default role = patient
test("Register: email, name, password - patient => All fields must be filled!", () => {
    const expMsg = "All fields must be filled!";

    const changeRegBody = { inputs: Object.assign({}, blankInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.inputs.email = okInputs.email;
    changeRegBody.inputs.name = okInputs.name;
    changeRegBody.inputs.password = okInputs.password;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: email, name, password, dob => All fields must be filled!", () => {
    const expMsg = "All fields must be filled!";

    const changeRegBody = { inputs: Object.assign({}, blankInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.inputs.email = okInputs.email;
    changeRegBody.inputs.name = okInputs.name;
    changeRegBody.inputs.password = okInputs.password;
    changeRegBody.inputs.dob = okInputs.dob;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: email, name, password, diagnose => All fields must be filled!", () => {
    const expMsg = "All fields must be filled!";

    const changeRegBody = { inputs: Object.assign({}, blankInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.inputs.email = okInputs.email;
    changeRegBody.inputs.name = okInputs.name;
    changeRegBody.inputs.password = okInputs.password;
    changeRegBody.inputs.diagnosticConclusion = okInputs.diagnosticConclusion;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: email, name, password, weight => All fields must be filled!", () => {
    const expMsg = "All fields must be filled!";

    const changeRegBody = { inputs: Object.assign({}, blankInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.inputs.email = okInputs.email;
    changeRegBody.inputs.name = okInputs.name;
    changeRegBody.inputs.password = okInputs.password;
    changeRegBody.inputs.weight = okInputs.weight;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: email, name, password, dob, diagnose => All fields must be filled!", () => {
    const expMsg = "All fields must be filled!";

    const changeRegBody = { inputs: Object.assign({}, blankInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.inputs.email = okInputs.email;
    changeRegBody.inputs.name = okInputs.name;
    changeRegBody.inputs.password = okInputs.password;
    changeRegBody.inputs.dob = okInputs.dob;
    changeRegBody.inputs.diagnosticConclusion = okInputs.diagnosticConclusion;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: email, name, password, dob, weight => All fields must be filled!", () => {
    const expMsg = "All fields must be filled!";

    const changeRegBody = { inputs: Object.assign({}, blankInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.inputs.email = okInputs.email;
    changeRegBody.inputs.name = okInputs.name;
    changeRegBody.inputs.password = okInputs.password;
    changeRegBody.inputs.dob = okInputs.dob;
    changeRegBody.inputs.weight = okInputs.weight;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: email, name, password, diagnose, weight => All fields must be filled!", () => {
    const expMsg = "All fields must be filled!";

    const changeRegBody = { inputs: Object.assign({}, blankInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.inputs.email = okInputs.email;
    changeRegBody.inputs.name = okInputs.name;
    changeRegBody.inputs.password = okInputs.password;
    changeRegBody.inputs.diagnosticConclusion = okInputs.diagnosticConclusion;
    changeRegBody.inputs.weight = okInputs.weight;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: email, name, password, dob, diagnose, weight => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeRegBody = { inputs: Object.assign({}, okInputs), plan: Object.assign({}, blankPlan)};
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: email, name, password, dob, diagnose, weight, discript => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeRegBody = { inputs: Object.assign({}, okInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.plan.description = okPlan.description;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: email, name, password, dob, diagnose, weight, volume => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeRegBody = { inputs: Object.assign({}, okInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.plan.target_feed_volume = okPlan.target_feed_volume;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: email, name, password, dob, diagnose, weight, energy => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeRegBody = { inputs: Object.assign({}, okInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.plan.target_feed_energy = okPlan.target_feed_energy;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: email, name, password, dob, diagnose, weight, discript, volume => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeRegBody = { inputs: Object.assign({}, okInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.plan.description = okPlan.description;
    changeRegBody.plan.target_feed_volume = okPlan.target_feed_volume;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: email, name, password, dob, diagnose, weight, discript, energy => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeRegBody = { inputs: Object.assign({}, okInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.plan.description = okPlan.description;
    changeRegBody.plan.target_feed_energy = okPlan.target_feed_energy;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: email, name, password, dob, diagnose, weight, energy, volume => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeRegBody = { inputs: Object.assign({}, okInputs), plan: Object.assign({}, blankPlan)};
    changeRegBody.plan.target_feed_energy = okPlan.target_feed_energy;
    changeRegBody.plan.target_feed_volume = okPlan.target_feed_volume;
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

// success
test("Register: email, name, password, dob, diagnose, weight, discript, energy, volume => undefined", () => {
    const changeRegBody = { inputs: Object.assign({}, okInputs), plan: Object.assign({}, okPlan)};
    const req = { path: regPath, body: changeRegBody };

    expect(validInfo(req, res, next)).toBeUndefined();
});

// Incorrect inputs
test("Register: email(incorrect), all others => Invalid Email", () => {
    const expMsg = "Invalid Email";

    const changeRegBody = { inputs: Object.assign({}, okInputs), plan: Object.assign({}, okPlan)};
    changeRegBody.inputs.email = "test123wrong";
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: weight(not number), all others => Weight Must be a Number!", () => {
    const expMsg = "Weight Must be a Number!";

    const changeRegBody = { inputs: Object.assign({}, okInputs), plan: Object.assign({}, okPlan)};
    changeRegBody.inputs.weight = "test123wrong";
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: weight(negative), all others => Weight Must be Positive!", () => {
    const expMsg = "Weight Must be Positive!";

    const changeRegBody = { inputs: Object.assign({}, okInputs), plan: Object.assign({}, okPlan)};
    changeRegBody.inputs.weight = "-123";
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: volume(not number), all others => Target Value Must be a Number!", () => {
    const expMsg = "Target Value Must be a Number!";

    const changeRegBody = { inputs: Object.assign({}, okInputs), plan: Object.assign({}, okPlan)};
    changeRegBody.plan.target_feed_volume = "test123wrong";
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: energy(not number), all others => Target Value Must be a Number!", () => {
    const expMsg = "Target Value Must be a Number!";

    const changeRegBody = { inputs: Object.assign({}, okInputs), plan: Object.assign({}, okPlan)};
    changeRegBody.plan.target_feed_energy = "test123wrong";
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: volume(negative), all others => Target Feed Must be Positive!", () => {
    const expMsg = "Target Feed Must be Positive!";

    const changeRegBody = { inputs: Object.assign({}, okInputs), plan: Object.assign({}, okPlan)};
    changeRegBody.plan.target_feed_volume = "-123";
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Register: energy(negative), all others => Target Feed Must be Positive!", () => {
    const expMsg = "Target Feed Must be Positive!";

    const changeRegBody = { inputs: Object.assign({}, okInputs), plan: Object.assign({}, okPlan)};
    changeRegBody.plan.target_feed_energy = "-123";
    const req = { path: regPath, body: changeRegBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

// /login

test("Login: email: Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeLoginBody = Object.assign({}, blankLoginBody);
    changeLoginBody.email = okLoginBody.email;
    const req = { path: loginPath, body: changeLoginBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Login: password => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeLoginBody = Object.assign({}, blankLoginBody);
    changeLoginBody.password = okLoginBody.password;
    const req = { path: loginPath, body: changeLoginBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("Login: email(incorrect), password => Invalid Email", () => {
    const expMsg = "Invalid Email";

    const changeLoginBody = Object.assign({}, blankLoginBody);
    changeLoginBody.email = "test123wrong";
    changeLoginBody.password = okLoginBody.password;
    const req = { path: loginPath, body: changeLoginBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

// success
test("Login: email, password => undefined", () => {
    const changeLoginBody = Object.assign({}, blankLoginBody);
    changeLoginBody.email = okLoginBody.email;
    changeLoginBody.password = okLoginBody.password;
    const req = { path: loginPath, body: changeLoginBody };

    expect(validInfo(req, res, next)).toBeUndefined();
});

// /changeTreatmentPlan

test("ChangeTreatmentPlan: blank body => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const req = { path: changeTreatPath, body: Object.assign({}, blankChangeTreatBody) };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("ChangeTreatmentPlan: discript => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeTreatBody = Object.assign({}, blankChangeTreatBody);
    changeTreatBody.description = okChangeTreatBody.description;
    const req = { path: changeTreatPath, body: changeTreatBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("ChangeTreatmentPlan: volume => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeTreatBody = Object.assign({}, blankChangeTreatBody);
    changeTreatBody.target_feed_volume = okChangeTreatBody.target_feed_volume;
    const req = { path: changeTreatPath, body: changeTreatBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("ChangeTreatmentPlan: energy => Missing Credentials", () => {
    const expMsg = "Missing Credentials";

    const changeTreatBody = Object.assign({}, blankChangeTreatBody);
    changeTreatBody.target_feed_energy = okChangeTreatBody.target_feed_energy;
    const req = { path: changeTreatPath, body: changeTreatBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

// success
test("ChangeTreatmentPlan: discript, volume, energy => undefined", () => {
    const req = { path: changeTreatPath, body: Object.assign({}, okChangeTreatBody) };

    expect(validInfo(req, res, next)).toBeUndefined();
});

test("ChangeTreatmentPlan: discript, volume(not number), energy => Target Value Must be a Number!", () => {
    const expMsg = "Target Value Must be a Number!";

    const changeTreatBody = Object.assign({}, okChangeTreatBody);
    changeTreatBody.target_feed_volume = "test123wrong";
    const req = { path: changeTreatPath, body: changeTreatBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("ChangeTreatmentPlan: discript, volume, energy(not number) => Target Value Must be a Number!", () => {
    const expMsg = "Target Value Must be a Number!";

    const changeTreatBody = Object.assign({}, okChangeTreatBody);
    changeTreatBody.target_feed_energy = "test123wrong";
    const req = { path: changeTreatPath, body: changeTreatBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("ChangeTreatmentPlan: discript, volume(negative), energy => Target Feed Must be Positive!", () => {
    const expMsg = "Target Feed Must be Positive!";

    const changeTreatBody = Object.assign({}, okChangeTreatBody);
    changeTreatBody.target_feed_energy = "-123";
    const req = { path: changeTreatPath, body: changeTreatBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("ChangeTreatmentPlan: discript, volume, energy(negative) => Target Feed Must be Positive!", () => {
    const expMsg = "Target Feed Must be Positive!";

    const changeTreatBody = Object.assign({}, okChangeTreatBody);
    changeTreatBody.target_feed_energy = "-123";
    const req = { path: changeTreatPath, body: changeTreatBody };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

// /changeWeight

test("ChangeWeight: blank body => New Weight Cannot be Empty!", () => {
    const expMsg = "New Weight Cannot be Empty!";

    const req = { path: changeWeightPath, body: Object.assign({}, blankChangeWeightBody) };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("ChangeWeight: body(not number) => Weight Must be a Number!", () => {
    const expMsg = "Weight Must be a Number!";

    const changeWeightBody = Object.assign({}, blankChangeWeightBody);
    changeWeightBody.newWeight = "test123wrong";
    const req = { path: changeWeightPath, body: Object.assign({}, changeWeightBody) };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

test("ChangeWeight: body(negative) => Weight Must be Positive!", () => {
    const expMsg = "Weight Must be Positive!";

    const changeWeightBody = Object.assign({}, blankChangeWeightBody);
    changeWeightBody.newWeight = "-123";
    const req = { path: changeWeightPath, body: Object.assign({}, changeWeightBody) };

    const msg = JSON.parse(validInfo(req, res, next)._getData());
    expect(msg).toEqual(expMsg);
});

// success
test("ChangeWeight: body => undefined", () => {
    const changeWeightBody = Object.assign({}, blankChangeWeightBody);
    changeWeightBody.newWeight = "-123";
    const req = { path: changeWeightPath, body: Object.assign({}, okChangeWeightBody) };

    expect(validInfo(req, res, next)).toBeUndefined();
});
