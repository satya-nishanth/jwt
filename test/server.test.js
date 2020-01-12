//jshint esversion:8
const app = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");

const {
  expect
} = chai;
chai.use(chaiHttp);
let key;

describe("Server starts", () => {

  it("Logining User", done => {
    chai
      .request(app)
      .post("/login")
      .send({
        username:"Nishanth"
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        key = res.body.token;
        expect(res.body.status).to.equals("success");
        done();
      });
  });
  it("JSON Patch", done => {
    chai
      .request(app)
      .post("/patch")
      .set("Authorization","Bearer " + key  )
      .send({
        mydoc: {
         "baz": "qux",
          "foo": "bar"
         }
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals("success");
        expect(res.body.mydoc).to.be.a("object");
        done();
      });
  });
  it("Generating Thumbnail above is a buffer of the image", done => {
    chai
      .request(app)
      .post("/thumbnail")
      .set("Authorization","Bearer " + key  )
      .send({
        url:"https://i.picsum.photos/id/237/200/300.jpg"
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });


});
