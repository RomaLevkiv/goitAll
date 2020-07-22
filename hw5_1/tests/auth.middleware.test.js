const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../tests/auth.middleware.test.js")
});
const jwt = require("jsonwebtoken");

require = require("esm")(module);
const should = require("should");
const sinon = require("sinon");
const { authController } = require("../auth/auth.controller");
const { contactModel } = require("../model/contact.model");
const { UnauthorizedError } = require("../helpers/error.constructor");

describe("Authorization middleware Test Suite", () => {
    let sandbox;
    let nextStub;
    let findContactByTokenStub;
  
    before(() => {
      sandbox = sinon.createSandbox();
      nextStub = sandbox.stub();
      findContactByTokenStub = sandbox.stub(contactModel, "findContactByToken");
    });
  
    after(() => {
      sandbox.restore();
    });
  
    context("when user have not provided auth token", () => {
      const req = { headers: {} };
      const res = {};
  
      before(async () => {
        await authController.authorize(req, res, nextStub);
      });
  
      after(() => {
        sandbox.reset();
      });
  
      it("should not call findUserByToken", () => {
        sinon.assert.notCalled(findContactByTokenStub);
      });
  
      it("should call next once", () => {
        sinon.assert.calledOnce(nextStub);
  
        sinon.assert.calledWithMatch(
          nextStub,
          sinon.match.instanceOf(UnauthorizedError)
        );
      });
    });
})  