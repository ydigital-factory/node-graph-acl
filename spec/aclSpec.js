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
  describe("Call removeRole with role", function () {
    var addSuccess;
    var removeSuccess;

    beforeEach(function (done) {
      testACL.addUserRoles('group12', ['group13','group14','group15'], function(err, success) {
        //console.log(success);
        addSuccess = success;
        testACL.removeRole('group13', function(err, success2) {
          //console.log(success2);
          removeSuccess = success2;
          done();
        });
      });
    });

    it("should remove role and its relationships.", function (done) {
      expect(addSuccess).toBeDefined();
      expect(removeSuccess).toBeDefined();
      // @todo More verifications needed!
      done();
    });
  });
});

// ACL.prototype.allow = function(roles, resources, permissions, callback)
describe("ACL.prototype.allow:", function () {
  describe("Call allow with 2 roles, 2 resources, and 4 permissions", function () {
    var createdRelationships;

    beforeEach(function (done) {
      testACL.allow(['role30', 'role40'], ['resource50', 'resource60'], ['create', 'edit', 'erase', 'view'], function(err, relationships) {
        createdRelationships = relationships;
        done();
      });
    });

    it("should create roles, resources, and relationships with those permissions.", function (done) {
      expect(createdRelationships).toBeDefined();
      // @todo More verifications needed!
      done();
    });
  });
});

// ACL.prototype.removeAllow = function(role, resources, permissions, callback)
describe("ACL.prototype.removeAllow:", function () {
  describe("Call removeAllow with a role, 2 resources, and 2 permissions", function () {
    var createdRelationships;

    beforeEach(function (done) {
      testACL.removeAllow('role30', ['resource50', 'resource60'], ['edit', 'erase'], function(err, relationships) {
        createdRelationships = relationships;
        done();
      });
    });

    it("should remove those permissions from the relationship between the role and the resources.", function (done) {
      expect(createdRelationships).toBeDefined();
      // @todo More verifications needed!
      done();
    });
  });
});

// ACL.prototype.allowedPermissions = function(userId, resources, callback)
describe("ACL.prototype.allowedPermissions:", function () {
  describe("Call allowedPermissions with a user and 2 resources", function () {
    var retrievedPermissions;

    beforeEach(function (done) {
      testACL.allow('admin', 'dashboard', ['create', 'read', 'update', 'delete'], function(err, createdRelationships1) {
        testACL.allow('admin', 'campaigns', ['create', 'read', 'update', 'delete'], function(err, createdRelationships2) {
          testACL.addUserRoles('test_user', 'admin', function(err, addSuccess) {
            testACL.allowedPermissions('test_user', ['dashboard', 'campaigns'], function(err, permissions) {
              retrievedPermissions = permissions;
              done();
            });
          });
        });
      });
    });

    it("should return an array of objects identifying the user permissions.", function (done) {
      expect(retrievedPermissions).toBeDefined();
      //expect(retrievedPermissions).toBe([{'campaigns': ['update', 'delete', 'read', 'create']},
      //                                   {'dashboard': ['update', 'delete', 'read', 'create']}]);
      // @todo More verifications needed!
      done();
    });
  });
});

// ACL.prototype.isAllowed = function(userId, resource, permissions, callback)
describe("ACL.prototype.isAllowed:", function () {
  describe("Call isAllowed with a user, 2 valid resources, and 2 valid permissions", function () {
    var permissionSuccess;

    beforeEach(function (done) {
      testACL.allow('admin', 'dashboard', ['create', 'read', 'update', 'delete'], function(err, createdRelationships1) {
        testACL.allow('admin', 'campaigns', ['create', 'read', 'update', 'delete'], function(err, createdRelationships2) {
          testACL.addUserRoles('test_user', 'admin', function(err, addSuccess) {
            testACL.isAllowed('test_user', ['campaigns', 'dashboard'], ['read', 'delete'], function(err, isSuccess) {
              permissionSuccess = isSuccess;
              done();
            });
          });
        });
      });
    });

    it("should return true.", function (done) {
      expect(permissionSuccess).toBeDefined();
      expect(permissionSuccess).toBe(true);
      done();
    });
  });

  describe("Call isAllowed with a user, 1 valid resource, and 1 valid permission", function () {
    var permissionSuccess;

    beforeEach(function (done) {
      testACL.allow('admin', 'dashboard', ['create', 'read', 'update', 'delete'], function(err, createdRelationships1) {
        testACL.addUserRoles('test_user', 'admin', function(err, addSuccess) {
          testACL.isAllowed('test_user', 'dashboard', 'read', function(err, isSuccess) {
            permissionSuccess = isSuccess;
            done();
          });
        });
      });
    });

    it("should return true.", function (done) {
      expect(permissionSuccess).toBeDefined();
      expect(permissionSuccess).toBe(true);
      done();
    });
  });

  describe("Call isAllowed with a user, 1 valid resource, and 1 invalid permission", function () {
    var permissionSuccess;

    beforeEach(function (done) {
      testACL.allow('admin', 'dashboard', ['create', 'read', 'update', 'delete'], function(err, createdRelationships1) {
        testACL.allow('admin', 'campaigns', ['create', 'read', 'update', 'delete'], function(err, createdRelationships2) {
          testACL.addUserRoles('test_user', 'admin', function(err, addSuccess) {
            testACL.isAllowed('test_user', 'reports', 'invalid', function(err, isSuccess) {
              permissionSuccess = isSuccess;
              done();
            });
          });
        });
      });
    });

    it("should return false.", function (done) {
      expect(permissionSuccess).toBeDefined();
      expect(permissionSuccess).toBe(false);
      done();
    });
  });

  describe("Call isAllowed with a user, 1 invalid resource, and 1 invalid permission", function () {
    var permissionSuccess;

    beforeEach(function (done) {
      testACL.allow('admin', 'dashboard', ['create', 'read', 'update', 'delete'], function(err, createdRelationships1) {
        testACL.allow('admin', 'campaigns', ['create', 'read', 'update', 'delete'], function(err, createdRelationships2) {
          testACL.addUserRoles('test_user', 'admin', function(err, addSuccess) {
            testACL.isAllowed('test_user', 'invalid', 'invalid', function(err, isSuccess) {
              permissionSuccess = isSuccess;
              done();
            });
          });
        });
      });
    });

    it("should return false.", function (done) {
      expect(permissionSuccess).toBeDefined();
      expect(permissionSuccess).toBe(false);
      done();
    });
  });
});

// ACL.prototype.areAnyRolesAllowed = function(roles, resource, permissions, callback)
describe("ACL.prototype.areAnyRolesAllowed:", function () {
  describe("Call areAnyRolesAllowed with 2 roles, 1 resource, and 2 permissions", function () {
    var permissionSuccess;

    beforeEach(function (done) {
      testACL.allow('admin', 'dashboard', ['create', 'read', 'update', 'delete'], function(err, createdRelationships1) {
        testACL.allow('test', 'campaigns', ['create', 'read', 'update', 'delete'], function(err, createdRelationships2) {
          testACL.areAnyRolesAllowed(['test', 'admin'], 'dashboard', ['read', 'create'], function(err, isSuccess) {
            permissionSuccess = isSuccess;
            done();
          });
        });
      });
    });

    it("should return true.", function (done) {
      expect(permissionSuccess).toBeDefined();
      expect(permissionSuccess).toBe(true);
      done();
    });
  });

  describe("Call areAnyRolesAllowed with 2 roles, 1 resource, and 2 invalid permissions", function () {
    var permissionSuccess;

    beforeEach(function (done) {
      testACL.allow('admin', 'dashboard', ['create', 'read', 'update', 'delete'], function(err, createdRelationships1) {
        testACL.allow('test', 'campaigns', ['create', 'read', 'update', 'delete'], function(err, createdRelationships2) {
          testACL.areAnyRolesAllowed(['test', 'admin'], 'dashboard', ['read_not', 'create_not'], function(err, isSuccess) {
            permissionSuccess = isSuccess;
            done();
          });
        });
      });
    });

    it("should return false.", function (done) {
      expect(permissionSuccess).toBeDefined();
      expect(permissionSuccess).toBe(false);
      done();
    });
  });
});

// ACL.prototype.whatResources = function(roles, permissions, callback)
describe("ACL.prototype.whatResources:", function () {
  describe("Call whatResources with 1 role", function () {
    var validResources;

    beforeEach(function (done) {
      testACL.allow('test', 'dashboard', ['create', 'read', 'update', 'delete'], function(err, createdRelationships1) {
        testACL.allow('test', 'campaigns', ['create', 'read', 'update', 'delete'], function(err, createdRelationships2) {
          testACL.whatResources('test', function(err, resources) {
            validResources = resources;
            done();
          });
        });
      });
    });

    it("should return false.", function (done) {
      expect(validResources).toBeDefined();
      expect(validResources).toBeDefined(validResources.dashboard);
      expect(validResources).toBeDefined(validResources.campaigns);
      done();
    });
  });
});

// ACL.prototype.removeResource = function(resource, callback)
describe("ACL.prototype.removeResource:", function () {
  //@todo: waiting for resource creation function before making this test

  /*describe("Call removeResource with resource", function () {
    var addSuccess;
    var removeSuccess;

    beforeEach(function (done) {
      testACL.allow('group12', ['dashboard'], ['view', 'create', 'edit', 'erase'], function(err, success) {
        //console.log(success);
        addSuccess = success;
        testACL.removeResource('dashboard', function(err, success2) {
          //console.log(success2);
          removeSuccess = success2;
          done();
        });
      });
    });

    it("should remove resource and its relationships.", function (done) {
      expect(addSuccess).toBeDefined();
      expect(removeSuccess).toBeDefined();
      // @todo More verifications needed!
      done();
    });
  });*/
});

// ACL.prototype._createUser = function(userId, callback)
describe("ACL.prototype._createUser:", function () {
  describe("Call _createUser with user ID", function () {
    var createdUser;
    beforeEach(function(done) {
      testACL._createUser('user3', function(err, user) {
        createdUser = user;
        done();
      });
    });

    it("should create a user.", function (done) {
      expect(createdUser).toBeDefined();
      expect(createdUser.uid).toBe('user3');
      done();
    });
  });
});

// ACL.prototype._createRole = function(roleId, callback)
describe("ACL.prototype._createRole:", function () {
  describe("Call _createRole with role ID", function () {
    var createdRole;
    beforeEach(function(done) {
      testACL._createRole('role5', function(err, role) {
        createdRole = role;
        done();
      });
    });

    it("should create a role.", function (done) {
      expect(createdRole).toBeDefined();
      expect(createdRole.rid).toBe('role5');
      done();
    });
  });
});

// ACL.prototype._createResource = function(resourceId, callback)
describe("ACL.prototype._createResource:", function () {
  describe("Call _createResource with resource ID", function () {
    var createdResource;
    beforeEach(function(done) {
      testACL._createResource('resource15', function(err, resource) {
        createdResource = resource;
        done();
      });
    });

    it("should create a resource.", function (done) {
      expect(createdResource).toBeDefined();
      expect(createdResource.rsid).toBe('resource15');
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

    it("should create a relationship between those nodes.", function (done) {
      expect(createdRelationship).toBeDefined();
      // @todo more tests
      done();
    });
  });
});









// After all tests, delete nodes created for testing
