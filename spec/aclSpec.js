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
describe("ACL.prototype.addUserRoles:", function () {
  describe("Call addUserRoles with userID and a single role", function () {
    var addSuccess;

    beforeEach(function (done) {
      testACL.addUserRoles('user1', 'group1', function(err, success) {
        addSuccess = success;
        done();
      });
    });

    it("should create a user, a role, and a relationship between them.", function (done) {
      expect(addSuccess).toBeDefined();
      // @todo More verifications needed!
      done();
    });
  });

  describe("Call addUserRoles with userID and a single role that already exist", function () {
    var addSuccess;

    beforeEach(function (done) {
      testACL.addUserRoles('user1', 'group1', function(err, success) {
        addSuccess = success;
        done();
      });
    });

    it("should not create them, but should return success.", function (done) {
      expect(addSuccess).toBeDefined();
      // @todo More verifications needed!
      done();
    });
  });

  describe("Call addUserRoles with userID and 3 roles", function () {
    var addSuccess;

    beforeEach(function(done) {
      testACL.addUserRoles('user2', ['group2', 'group3', 'group4'], function(err, success) {
        addSuccess = success;
        done();
      });
    });

    it("should create a user, 3 roles, and relationships between user and roles.", function (done) {
      expect(addSuccess).toBeDefined();
      // @todo More verifications needed!
      done();
    });
  });
});

// ACL.prototype.removeUserRoles = function(userId, roles, callback)
describe("ACL.prototype.removeUserRoles:", function () {
  describe("Call removeUserRoles with userID and a single role", function () {
    var removeSuccess;

    beforeEach(function(done) {
      testACL.addUserRoles('user1', 'group1', function(err, addSuccess) {
        testACL.removeUserRoles('user1', 'group1', function(err, success) {
          removeSuccess = success;
          done();
        });
      });
    });

    it("should remove relationship between user and role.", function (done) {
      expect(removeSuccess).toBeDefined();
      // @todo More verifications needed!
      done();
    });
  });

  describe("Call removeUserRoles with userID and a 3 roles", function () {
    var removeSuccess;

    beforeEach(function(done) {
      testACL.addUserRoles('user1', ['group1', 'group2', 'group3'], function(err, addSuccess) {
        testACL.removeUserRoles('user1', ['group1', 'group2', 'group3'], function(err, success) {
          removeSuccess = success;
          done();
        });
      });
    });

    it("should remove relationship between user and the 3 roles.", function (done) {
      expect(removeSuccess).toBeDefined();
      // @todo More verifications needed!
      done();
    });
  });

  // @todo: Add test for removing inexistent role from user
  // @todo: Add test for removing role from inexistent user

});

// ACL.prototype.userRoles = function(userId, callback)
describe("ACL.prototype.userRoles:", function () {
  describe("Call userRoles with userID", function () {
    var userRoles;

    beforeEach(function(done) {
      testACL.addUserRoles('user1', ['group1', 'group2', 'group3'], function(err, addSuccess) {
        testACL.userRoles('user1', function(err, roles) {
          userRoles = roles;
          done();
        });
      });
    });

    it("should return all roles to which the user belongs.", function (done) {
      expect(userRoles).toBeDefined();
      // @todo More verifications needed!
      done();
    });
  });

});



// ACL.prototype.addRoleParents = function(role, parents, callback)
describe("ACL.prototype.addRoleParents:", function () {
  describe("Call addRoleParents with role and a single parent", function () {
    var addSuccess;

    beforeEach(function (done) {
      testACL.addUserRoles('group10', 'group11', function(err, success) {
        addSuccess = success;
        done();
      });
    });

    it("should create the role, the parent, and a relationship between them.", function (done) {
      expect(addSuccess).toBeDefined();
      // @todo More verifications needed!
      done();
    });
  });

  describe("Call addRoleParents with role and 3 parents", function () {
    var addSuccess;

    beforeEach(function (done) {
      testACL.addUserRoles('group12', ['group13','group14','group15'], function(err, success) {
        addSuccess = success;
        done();
      });
    });

    it("should create the role, 3 parents, and a relationship between them.", function (done) {
      expect(addSuccess).toBeDefined();
      // @todo More verifications needed!
      done();
    });
  });

});



// ACL.prototype.removeRole = function(role, callback)
describe("ACL.prototype.removeRole:", function () {

});



// ACL.prototype.removeResource = function(resource, callback)
describe("ACL.prototype.removeResource:", function () {

});



// ACL.prototype.allow = function(roles, resources, permissions, callback)
describe("ACL.prototype.allow:", function () {

});



// ACL.prototype.removeAllow = function(role, resources, permissions, callback)
describe("ACL.prototype.removeAllow:", function () {

});



// ACL.prototype.removePermissions = function(role, resources, permissions, callback)
describe("ACL.prototype.removePermissions:", function () {

});



// ACL.prototype.allowedPermissions = function(userId, resources, callback)
describe("ACL.prototype.allowedPermissions:", function () {

});



// ACL.prototype.isAllowed = function(userId, resource, permissions, callback)
describe("ACL.prototype.isAllowed:", function () {

});



// ACL.prototype.areAnyRolesAllowed = function(roles, resource, permissions, callback)
describe("ACL.prototype.areAnyRolesAllowed:", function () {

});




// ACL.prototype.whatResources = function(roles, permissions, callback)
describe("ACL.prototype.whatResources:", function () {

});

// ACL.prototype._createUser = function(userId, callback)
describe("ACL.prototype._createUser:", function () {
  describe("Call _createUser with userID", function () {
    var createdUser;
    beforeEach(function(done) {
      testACL._createUser('user3', function(err, user) {
        createdUser = user;
        done();
      });
    });

    it("should create a user", function (done) {
      expect(createdUser).toBeDefined();
      expect(createdUser.uid).toBe('user3');
      done();
    });
  });
});

// ACL.prototype._createRole = function(roleId, callback)
describe("ACL.prototype._createRole:", function () {
  describe("Call _createRole with userID", function () {
    var createdRole;
    beforeEach(function(done) {
      testACL._createRole('role5', function(err, role) {
        createdRole = role;
        done();
      });
    });

    it("should create a role", function (done) {
      expect(createdRole).toBeDefined();
      expect(createdRole.rid).toBe('role5');
      done();
    });
  });
});

// ACL.prototype._createRelationship = function (nodeId1, nodeId2, type, callback)
describe("ACL.prototype._createRelationship:", function () {
  describe("Call _createRelationship with 2 nodes", function () {
    var createdRelationship;

    beforeEach(function(done) {
      testACL.connector.createNode(function (err, node1) {
        testACL.connector.createNode(function (err, node2) {
          testACL._createRelationship(node1._id, node2._id, 'BELONGS_TO', function(err, relationship) {
            createdRelationship = relationship;
            done();
          });
        });
      });
    });

    it("should create a relationship between those nodes", function (done) {
      expect(createdRelationship).toBeDefined();
      // @todo more tests
      done();
    });
  });
});









// After all tests, delete nodes created for testing
