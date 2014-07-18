var neo4j = require('node-neo4j');
var acl = require("../index.js");

var db = new neo4j('http://localhost:7474');
var testACL = new acl(new acl.neo4jConnector(db));

var properties1 = {
  p1: 'prop 1',
  p2: 'prop 2'
};
var labels1 = [
  'Label1',
  'Label2'
];
var groups1 = [
  'group1',
  'group2'
];

var properties2 = {
  p3: 'prop 3',
  p4: 'prop 4'
};
var labels2 = [
  'Label3',
  'Label4'
];
var groups2 = [
  'group3',
  'group4'
];
/*
describe("Call addUserRoles with userID and a single role", function () {
  var node;

  beforeEach(function(done) {
    testACL.addUserRoles('user1', ['group'], function(err, node1) {
      node = node1;
      done();
    });
  });

  it("should create a user and a role", function (done) {
    expect(node).toBeDefined();
    done();
  });
});

describe("Call addUserRoles with userID and a single role", function () {
  var node;

  beforeEach(function(done) {
    testACL.addUserRoles('user1', ['group'], function(err, node1) {
      node = node1;
      done();
    });
  });

  it("should create a user and a role", function (done) {
    expect(node).toBeDefined();
    done();
  });
});*/



// After all tests, delete nodes created for testing
