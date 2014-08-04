"use strict";
/**
 * Graph ACL.
 */

var async = require('async');

/**
 * Creates an instance of ACL.
 *
 * @constructor
 * @this {ACL}
 * @param {Connector|Neo4jConnector} connector - A connector to a graph database of your choice
 */
var ACL = function(connector) {
  this.connector = connector;
};

/**
  addUserRoles( userId, roles, function(err) )

  Adds roles to a given user id.

  @param {String|Number} userId -  User id.
  @param {String|Array} roles - Role(s) to add to the user id.
  @param {Function} cb - Callback called when finished.
*/
ACL.prototype.addUserRoles = function(userId, roles, callback){
  var _this = this;

  if (typeof userId === 'undefined') {
    callback(new Error('User ID is empty'));
    return;
  }
  if (typeof roles === 'undefined') {
    callback(new Error('Roles list is empty'));
    return;
  }

  // When only one role in string format, transform it to array
  if (!(roles instanceof Array)) {
    roles = [roles];
  }

  this._createUser(userId, function (err, user) {
    async.map(
      roles, // Array
      function(item, cb){
        _this._createRole(item, function(err, role) {
          _this._createRelationship(user._id, role._id, 'BELONGS_TO', cb);
        });
      },
      function(err, results){
        if (results.length === 1) {
          callback(err, results[0]);
        } else {
          callback(err, results);
        }
      }
    );
  });
};

/**
  removeUserRoles( userId, roles, function(err) )

  Remove roles from a given user.

  @param {String|Number} User id.
  @param {String|Array} Role(s) to remove to the user id.
  @param {Function} Callback called when finished.
*/
ACL.prototype.removeUserRoles = function(userId, roles, callback){
  var _this = this;
  var userNode;

  // When only one role in string format, transform it to array
  if (!(roles instanceof Array)) {
    roles = [roles];
  }

  this.connector.getNodesWithLabelsAndProperties(['User'], {uid: userId}, function(err, userNodes) {
    userNode = userNodes[0];

    _this.connector.getNodeRelationships(userNode._id, {types: ['BELONGS_TO']}, function(err, relationships) {
      async.map(
        relationships, // Array
        function(relationship, cb){
          _this.connector.getNode(relationship._end, function(err, roleNode) {
            if (roles.indexOf(roleNode.rid) !== -1) {
              _this.connector.removeRelationship(relationship._id, cb);
            } else {
              cb(null, true);
            }
          });
        },
        function(err, results){
          if (results.length === 1) {
            callback(err, results[0]);
          } else {
            callback(err, results);
          }
        }
      );
    });
  });
};

/**
  userRoles( userId, function(err, roles) )

  Return all the roles from a given user.

  @param {String|Number} User id.
  @param {Function} Callback called when finished.
*/
ACL.prototype.userRoles = function(userId, callback){
  var _this = this;
  var roles = [];

  _this.connector.getNodesWithLabelsAndProperties(['User'], {uid: userId}, function(err, nodes) {
    _this.connector.getNodeRelationships(nodes[0]._id, {types: ['BELONGS_TO']}, function(err, relationships) {
      async.map(
        relationships, // Array
        function(relationship, cb){
          _this.connector.getNode(relationship._end, function(err, roleNode) {
            if (typeof roleNode.rid !== 'undefined') {
              roles.push(roleNode);
            }
            cb(null, true);
          });
        },
        function(err, results){
          callback(err, roles);
        }
      );
    });
  });
};

/**
  addRoleParents( role, parents, function(err) )

  Adds a parent or parent list to role.

  @param {String|Number} User id.
  @param {String|Array} Role(s) to remove to the user id.
  @param {Function} Callback called when finished.
*/
ACL.prototype.addRoleParents = function(role, parents, callback){
  var _this = this;
  // @todo: Create a relationship of type 'BELONGS_TO' between role and each parent
  // When only one parent role in string format, transform it to array
  if (!(parents instanceof Array)) {
    parents = [parents];
  }

  this._createRole(role, function (err, role) {
    async.map(
      parents, // Array
      function(item, cb){
        _this._createRole(item, function(err, parent) {
          _this._createRelationship(role._id, parent._id, 'BELONGS_TO', cb);
        });
      },
      function(err, results){
        if (results.length === 1) {
          callback(err, results[0]);
        } else {
          callback(err, results);
        }
      }
    );
  });
};

/**
  removeRole( role, function(err) )

  Removes a role from the system.

  @param {String|Number} roleId - Role to be removed
  @param {Function} callback - Callback called when finished.
*/
ACL.prototype.removeRole = function(roleId, callback){
  var _this = this;
  var role;

  this.connector.getNodesWithLabelsAndProperties(['Role'], {rid: roleId}, function(err, node) {
    role = node[0];

    _this.connector.getNodeRelationships(role._id, {}, function(err, relationships) {
      async.map(
        relationships, // Array
        function(relationship, cb){
          _this.connector.removeRelationship(relationship._id, cb);
        },
        function(err, results){
          _this.connector.deleteNode(role._id, function (err, success) {
            callback(err, success);
          });
        }
      );
    });
  });

  // @todo: node-neo4j: Maybe create a new function for erasing node and all its relationships?
};

/**
  allow( roles, resources, permissions, function(err) )

  Adds the given permissions to the given roles over the given resources.

  @param {String|Array} role(s) to add permissions to.
  @param {String|Array} resource(s) to add permisisons to.
  @param {String|Array} permission(s) to add to the roles over the resources.
  @param {Function} Callback called when finished.

  allow( permissionsArray, function(err) )

  @param {Array} Array with objects expressing what permissions to give.

  [{roles:{String|Array}, allows:[{resources:{String|Array}, permissions:{String|Array}]]

  @param {Function} Callback called when finished.
*/
ACL.prototype.allow = function(roles, resources, permissions, callback){
  var _this = this;
  var createdRoles = [];
  var createdResources = [];
  var createdRelationships = [];
  var permissionsFormatted = {};

  if (!(roles instanceof Array)) {
    roles = [roles];
  }
  if (!(resources instanceof Array)) {
    resources = [resources];
  }
  if (!(permissions instanceof Array)) {
    permissions = [permissions];
  }

  permissions.forEach(function (permission) {
    permissionsFormatted[permission] = true;
  });

  async.map(
    roles, // Array
    function(role, cb){
      _this._createRole(role, function (err, createdRole) {
        cb(null, createdRole);
      });
    },
    function(err, results){
      createdRoles = results;

      async.map(
        resources, // Array
        function(resource, cb){
          _this._createResource(resource, function (err, createdResource) {
            cb(null, createdResource);
          });
        },
        function(err, results){
          createdResources = results;

          var start = 0;
          var end = createdRoles.length * createdResources.length;

          createdRoles.forEach(function (role) {
            createdResources.forEach(function (resource) {
              _this._createRelationship(role._id, resource._id, 'HAS_ACCESS_TO', permissionsFormatted, function (err, relationship) {
                createdRelationships.push(relationship);
                start += 1;

                if (start === end) {
                  callback(null, createdRelationships);
                }
              });
            });
          });
        }
      );
    }
  );
};


/**
  removeAllow(role, resources, permissions, callback)
*/
ACL.prototype.removeAllow = function(role, resources, permissions, callback){

  callback();
};

/**
  removePermissions( role, resources, permissions)

  Remove permissions from the given roles owned by the given role.

  Note: we loose atomicity when removing empty role_resources.

  @param {String}
  @param {String|Array}
  @param {String|Array}
*/
ACL.prototype.removePermissions = function(role, resources, permissions, callback){

  callback();
};

/**
  allowedPermissions( userId, resources, function(err, obj) )

  Returns all the allowable permissions a given user have to
  access the given resources.

  It returns an array of objects where every object maps a
  resource name to a list of permissions for that resource.

  @param {String|Number} User id.
  @param {String|Array} resource(s) to ask permissions for.
  @param {Function} Callback called when finished.
*/
ACL.prototype.allowedPermissions = function(userId, resources, callback){

  callback();
};

/**
  isAllowed( userId, resource, permissions, function(err, allowed) )

  Checks if the given user is allowed to access the resource for the given
  permissions (note: it must fulfill all the permissions).

  @param {String|Number} User id.
  @param {String|Array} resource(s) to ask permissions for.
  @param {String|Array} asked permissions.
  @param {Function} Callback called wish the result.
*/
ACL.prototype.isAllowed = function(userId, resource, permissions, callback){

  callback();
};

/**
  areAnyRolesAllowed( roles, resource, permissions, function(err, allowed) )

  Returns true if any of the given roles have the right permissions.

  @param {String|Array} Role(s) to check the permissions for.
  @param {String} resource(s) to ask permissions for.
  @param {String|Array} asked permissions.
  @param {Function} Callback called with the result.
*/
ACL.prototype.areAnyRolesAllowed = function(roles, resource, permissions, callback){

  callback();
};

/**
  whatResources(role, function(err, {resourceName: [permissions]})

  Returns what resources a given role or roles have permissions over.

  whatResources(role, permissions, function(err, resources) )

  Returns what resources a role has the given permissions over.

  @param {String|Array} Roles
  @param {String|Array} Permissions
  @param {Function} Callback called wish the result.
*/
ACL.prototype.whatResources = function(roles, permissions, callback){

  callback();
};

/**
  removeResource( resource, function(err) )

  Removes a resource from the system

  @param {String} resourceId - Resource to be removed
  @param {Function} callback - Callback called when finished.
*/
ACL.prototype.removeResource = function(resourceId, callback){
  var _this = this;
  var resource;

  this.connector.getNodesWithLabelsAndProperties(['Resource'], {rsid: resourceId}, function(err, node) {
    resource = node[0];

    _this.connector.getNodeRelationships(resource._id, {}, function(err, relationships) {
      async.map(
        relationships, // Array
        function(relationship, cb){
          _this.connector.removeRelationship(relationship._id, cb);
        },
        function(err, results){
          _this.connector.deleteNode(resource._id, function (err, success) {
            callback(err, success);
          });
        }
      );
    });
  });
};

/*ACL.prototype.permittedResources = function(roles, permissions, callback){

  callback();
};*/

/////////////////////////
// "Private" functions //
/////////////////////////

/**
  Create User. If user already exists, does nothing.

  Examples:
    connector = new Neo4jConnector('http://localhost:7474');
    connector._createUser('user1', callback);

  @param {String|Number} userId - User id.
  @param {Function} callback - Callback called when finished.
*/
ACL.prototype._createUser = function (userId, callback) {
  var _this = this;

  this.connector.existsNodeWithLabelsAndProperties(['User'], {uid: userId}, function(err, exists) {
    if (exists) {
      _this.connector.getNodesWithLabelsAndProperties(['User'], {uid: userId}, function(err, userRetrieved) {
        callback(null, userRetrieved[0]);
      });
    } else {
      _this.connector.createNode(['User'], {uid: userId}, function (err, userCreated) {
        callback(null, userCreated);
      });
    }
  });
};

/**
  Create Role. If role already exists, does nothing.

  Examples:
    connector = new Neo4jConnector('http://localhost:7474');
    connector._createRole('role1', callback);

  @param {String|Number} roleId - Role id.
  @param {Function} callback - Callback called when finished.
*/
ACL.prototype._createRole = function (roleId, callback) {
  var _this = this;

  this.connector.existsNodeWithLabelsAndProperties(['Role'], {rid: roleId}, function(err, exists) {
    if (exists) {
      _this.connector.getNodesWithLabelsAndProperties(['Role'], {rid: roleId}, function(err, roleRetrieved) {
        callback(null, roleRetrieved[0]);
      });
    } else {
      _this.connector.createNode(['Role'], {rid: roleId}, function (err, roleCreated) {
        callback(null, roleCreated);
      });
    }
  });
};

/**
  Create Resource. If role already exists, does nothing.

  Examples:
    connector = new Neo4jConnector('http://localhost:7474');
    connector._createResource('resource1', callback);

  @param {String|Number} resourceId - Resource id.
  @param {Function} callback - Callback called when finished.
*/
ACL.prototype._createResource = function (resourceId, callback) {
  var _this = this;

  this.connector.existsNodeWithLabelsAndProperties(['Resource'], {rsid: resourceId}, function(err, exists) {
    if (exists) {
      _this.connector.getNodesWithLabelsAndProperties(['Resource'], {rsid: resourceId}, function(err, resourceRetrieved) {
        callback(null, resourceRetrieved[0]);
      });
    } else {
      _this.connector.createNode(['Resource'], {rsid: resourceId}, function (err, resourceCreated) {
        callback(null, resourceCreated);
      });
    }
  });
};

/**
  Create Relationship. If relationship already exists, does nothing.

  Examples:
    connector = new Neo4jConnector('http://localhost:7474');
    connector._createRelationship(1, 2, 'TYPE', callback);

  @param {String|Number} nodeId1 - First Node ID.
  @param {String|Number} nodeId2 - Second Node ID.
  @param {String} type - Relationship type.
  @param {Function} callback - Callback called when finished.
*/
ACL.prototype._createRelationship = function (nodeId1, nodeId2, type, properties, callback) {
  var _this = this;

  if (typeof callback === 'undefined') {
    if (typeof properties === 'function') {
      callback = properties;
      properties = {};
    }
  }

  this.connector.existsRelationshipsBetweenNodes(nodeId1, nodeId2, type, function(err, exists) {
    if (exists) {
      _this.connector.getRelationshipsBetweenNodes(nodeId1, nodeId2, type, function(err, relationshipRetrieved) {
        callback(null, relationshipRetrieved);
      });
    } else {
      _this.connector.addRelationship(nodeId1, nodeId2, type, properties, function (err, relationshipCreated) {
        callback(null, relationshipCreated);
      });
    }
  });
};

module.exports = ACL;
