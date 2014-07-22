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


var properties2 = {
  p3: 'prop 3',
  p4: 'prop 4'
};
var labels2 = [
  'Label3',
  'Label4'
];



// Test properties
var properties1 = {
  p1: 'test prop 1',
  p2: 'test prop 2'
};
var properties2 = {
  p3: 'test prop 3',
  p4: 'test prop 4'
};

// Test labels
var labels1 = [
  'TestLabel1',
  'TestLabel2'
];
var labels2 = [
  'TestLabel3',
  'TestLabel4'
];

// Test roles
var roles1 = [
  'group1',
  'group2'
];
var roles2 = [
  'group3',
  'group4'
];


// Test users and roles
var user1;
var user2;
var user3;
var role1;
var role2;
var role3;

// ACL.prototype.addUserRoles = function(userId, roles, callback)
describe("Call addUserRoles with userID and a single role", function () {
  var addSuccess;
  beforeEach(function(done) {
    testACL.addUserRoles('user1', 'group1', function(err, success) {
      addSuccess = success;
      done();
    });
  });

  it("should create a user, a role, and a relationship between them", function (done) {
    expect(addSuccess).toBeDefined();
    done();
  });
});

describe("Call addUserRoles with userID and a 3 roles", function () {
  var addSuccess;
  beforeEach(function(done) {
    testACL.addUserRoles('user1', ['group1', 'group2', 'group3'], function(err, success) {
      addSuccess = success;
      done();
    });
  });

  it("should create a user, 3 roles, and relatinships between user and roles", function (done) {
    expect(addSuccess).toBeDefined();
    done();
  });
});





// ACL.prototype.removeUserRoles = function(userId, roles, callback)




// ACL.prototype.userRoles = function(userId, callback)




// ACL.prototype.addRoleParents = function(role, parents, callback)




// ACL.prototype.removeRole = function(role, callback)




// ACL.prototype.removeResource = function(resource, callback)




// ACL.prototype.allow = function(roles, resources, permissions, callback)




// ACL.prototype.removeAllow = function(role, resources, permissions, callback)




// ACL.prototype.removePermissions = function(role, resources, permissions, callback)




// ACL.prototype.allowedPermissions = function(userId, resources, callback)




// ACL.prototype.isAllowed = function(userId, resource, permissions, callback)




// ACL.prototype.areAnyRolesAllowed = function(roles, resource, permissions, callback)




// ACL.prototype.whatResources = function(roles, permissions, callback)












// After all tests, delete nodes created for testing
