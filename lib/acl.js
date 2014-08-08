"use strict";
/**
 * Graph ACL.
 */

var async = require('async');

/**
 * Creates an instance of ACL.
 *
 * Examples:
 *   var neo4j = require('node-neo4j');
 *   var graphACL = require('node-graph-acl');
 *   var db = new neo4j('http://localhost:7474');
 *   var connector = new graphACL.neo4jConnector(db);
 *   var acl = new graphACL(connector);
 *
 * @constructor
 * @this {ACL}
 * @param {Connector|Neo4jConnector} connector - A connector to a graph database of your choice
 */
var ACL = function(connector) {
  this.connector = connector;
};

/**
 * Add roles to a given user.
 *
 * Examples:
 *   acl.addUserRoles('user1', 'role1', callback);
 *   acl.addUserRoles('user1', ['role1', 'role2'], callback);
 *
 * @param {String|Number} userId -  User id.
 * @param {String|Array} roles - Role(s) to add to the user.
 * @param {Function} callback - Callback called when finished.
 */
ACL.prototype.addUserRoles = function(userId, roles, callback) {
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
 * Remove roles from a given user.
 *
 * Examples:
 *   acl.removeUserRoles('user1', 'role1', callback);
 *   acl.removeUserRoles('user1', ['role1', 'role2'], callback);
 *
 * @param {String|Number} userId - User id.
 * @param {String|Array} roles - Role(s) to remove from the user.
 * @param {Function} callback - Callback called when finished.
 */
ACL.prototype.removeUserRoles = function(userId, roles, callback) {
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
 * Return all the roles the user belongs to.
 *
 * Examples:
 *   acl.userRoles('user1', callback);
 *
 * @param {String|Number} userId - User id.
 * @param {Function} callback - Callback called when finished.
 */
ACL.prototype.userRoles = function(userId, callback) {
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
 * Add one or more parent roles to a role.
 *
 * Examples:
 *   acl.addRoleParents('role1', 'role2', callback);
 *   acl.addRoleParents('role1', ['role2', 'role3'], callback);
 *
 * @param {String|Number} role - Role id.
 * @param {String|Array} parents - Parent role(s) to add to the role.
 * @param {Function} callback - Callback called when finished.
 */
ACL.prototype.addRoleParents = function(role, parents, callback) {
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
 * Remove a role from the system.
 *
 * Examples:
 *   acl.removeRole('role1', callback);
 *
 * @param {String|Number} roleId - Role to be removed
 * @param {Function} callback - Callback called when finished.
 */
ACL.prototype.removeRole = function(roleId, callback) {
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
 * Add permissions to roles over resources.
 * @todo: alternative syntax with permissions array.
 *
 * Examples:
 *   acl.allow('role1', 'resource1', 'permission1', callback);
 *   acl.allow(['role1', 'role2'], ['resource1', 'resource1'], ['permission1', 'permission2'], callback);
 *
 *   @todo:
 *   var permissionsArray = [
 *     {
 *       roles:'role1',
 *       allows:[
 *         {resources:'resource1', permissions:'permission1'},
 *         {resources:['resource2', 'resource3'], permissions:['permission1','permission2']}
 *       ]
 *     },
 *     {
 *       roles:['role1', 'role2'],
 *       allows:[
 *         {resources:'resource4', permissions:['permission1', 'permission2']},
 *         {resources:['resource5', 'resource6'], permissions:'permission1'}
 *       ]
 *     },
 *   ];
 *   acl.allow(permissionsArray, callback);
 *
 * @param {String|Array} roles - Role(s) to add permission(s) of resource(s) to.
 * @param {String|Array} resources - Resource(s) to give permission(s) to.
 * @param {String|Array} permissions - Permission(s) of the resource(s).
 * @param {Function} callback - Callback called when finished.
 */
ACL.prototype.allow = function(roles, resources, permissions, callback) {
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

  // @todo: Allow complex alternative syntax

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
 * Remove permissions from roles over resources.
 *
 * Examples:
 *   acl.removeAllow('role1', 'resource1', 'permission1', callback);
 *   acl.removeAllow('role1', ['resource1', 'resource2'], ['permission1', 'permission2'], callback);
 *
 * @param {String} role - Role to remove permission(s) of resource(s) from.
 * @param {String|Array} resources - Resource(s) to remove permission(s) from.
 * @param {String|Array} permissions - Permission(s) of the resource(s).
 * @param {Function} callback - Callback called when finished.
 */
ACL.prototype.removeAllow = function(role, resources, permissions, callback) {
  var _this = this;

  if (!(resources instanceof Array)) {
    resources = [resources];
  }
  if (!(permissions instanceof Array)) {
    permissions = [permissions];
  }

  _this.connector.getNodesWithLabelsAndProperties(['Role'], {rid: role}, function(err, nodes) {
    _this.connector.getNodeRelationships(nodes[0]._id, {types: ['HAS_ACCESS_TO']}, function(err, relationships) {
      async.map(
        relationships, // Array
        function(relationship, cb){
          _this.connector.getNode(relationship._end, function(err, resourceNode) {
            if (resources.indexOf(resourceNode.rsid) > -1) {
              var relationshipId = relationship._id;
              var newPermissions = relationship;

              // @todo: use _getParameters
              delete(newPermissions._id);
              delete(newPermissions._start);
              delete(newPermissions._end);
              delete(newPermissions._type);

              permissions.forEach(function (permission) {
                delete(newPermissions[permission]);
              });

              _this.connector.updateRelationship(relationshipId, newPermissions, function (err, updatedRelationship) {
                cb(null, updatedRelationship);
              });
            } else {
              cb(null, relationship);
            }
          });
        },
        function(err, results){
          callback(err, results);
        }
      );
    });
  });

};

/**
 * Get all the permissions the user has to over this resources.
 *
 * It returns an array of objects where every object maps a
 * resource name to a list of permissions for that resource.
 *
 * @todo: ATENTION! At the moment this does not support Parent Roles!
 * @todo: Ideal scenario: Take advantage of graph queries to get all resources
 *
 * Examples:
 *   acl.allowedPermissions('user1', 'resource1', callback);
 *   acl.allowedPermissions('user1', ['resource1', 'resource2'], callback);
 *
 * @param {String|Number} userId - User.
 * @param {String|Array} resources - Resource(s) to ask permissions about.
 * @param {Function} callback - Callback called when finished.
 */
ACL.prototype.allowedPermissions = function(userId, resources, callback) {
  var _this = this;
  var userNode;
  var permissions = [];

  if (!(resources instanceof Array)) {
    resources = [resources];
  }

  // Get User Node
  this.connector.getNodesWithLabelsAndProperties(['User'], {uid: userId}, function(err, userNodes) {
    userNode = userNodes[0];

    // Get Roles to which the User belongs to
    _this.connector.getNodeRelationships(userNode._id, {types: ['BELONGS_TO']}, function(err, relationships) {
      async.map(
        relationships, // Array
        function(relationship, cb){
          _this.connector.getNode(relationship._end, function(err, roleNode) {
            cb(null, roleNode);
          });
        },
        function(err, roles){
          // Get all Resource Nodes the User is connected to
          async.map(
            roles, // Array
            function(role, cb){
              _this.connector.getNodeRelationships(role._id, {types: ['HAS_ACCESS_TO']}, function(err, relationships) {
                cb(null, relationships);
              });
            },
            function(err, relationships){
              // Check if Resource is in the resources array, and if it is,
              // check which permissions the Role has on that resource
              async.map(
                relationships[0], // Array
                function(relationship, cb){
                  _this.connector.getNode(relationship._end, function(err, resourceNode) {
                    if (resources.indexOf(resourceNode.rsid) > -1) {
                      var obj = {};

                      _this.connector._getParameters(relationship, function(err, cleanedRelationship) {
                        var resourcePermissions = [];

                        for (var key in cleanedRelationship){
                          if (cleanedRelationship[key] === true) {
                            resourcePermissions.push(key);
                          }
                        }

                        obj[resourceNode.rsid] = resourcePermissions;
                        permissions.push(obj);
                      });
                    }
                    cb(null, true);
                  });
                },
                function(err, resources){
                  callback(err, permissions);
                }
              );
            }
          );
        }
      );
    });
  });
};

/**
 * Check if a user is allowed to access resource(s) with given
 * permission(s) (note: it must fulfil all the permissions).
 *
 * Examples:
 *   acl.isAllowed('user1', 'resource1', 'permission1', callback);
 *   acl.isAllowed('user1', ['resource1', 'resource2'], ['permission1', 'permission2'], callback);
 *
 * @param {String|Number} userId - User id.
 * @param {String|Array} resources - Resource(s) to ask permissions for.
 * @param {String|Array} permissions - Permission(s).
 * @param {Function} callback - Callback called when finished.
 */
ACL.prototype.isAllowed = function(userId, resources, permissions, callback){
  if (!(resources instanceof Array)) {
    resources = [resources];
  }
  if (!(permissions instanceof Array)) {
    permissions = [permissions];
  }

  this.allowedPermissions(userId, resources, function (err, fullPermissions) {
    var allowed = true;
    var fullPermissionsNormalized = [];

    fullPermissions.forEach(function(fullPermission) {
      for (var key in fullPermission) {
        fullPermissionsNormalized[key] = fullPermission[key];
      }
    });

    for (var key in resources) {
      if (fullPermissionsNormalized[resources[key]]) {
        for (var key2 in permissions) {
          if (fullPermissionsNormalized[resources[key]].indexOf(permissions[key2]) === -1) {
            allowed = false;
          }
        }
      } else {
        allowed = false;
      }
    }

    callback(null, allowed);
  });
};

/**
 * Check if the role(s) have permission(s) on the resource(s).
 *
 * Examples:
 *   acl.areAnyRolesAllowed('role1', 'resource1', 'permission1', callback);
 *   acl.areAnyRolesAllowed('role1', 'resource1', ['permission1', 'permission2'], callback);
 *   acl.areAnyRolesAllowed(['role1', role2], 'resource1', 'permission1', callback);
 *   acl.areAnyRolesAllowed(['role1', role2], 'resource1', ['permission1', 'permission2'], callback);
 *
 * @param {String|Array} roles - Role(s) ids to check the permissions for.
 * @param {String} resource - Resource to ask permissions for.
 * @param {String|Array} permissions - Permission(s) over the resource.
 * @param {Function} callback - Callback called when finished.
 */
ACL.prototype.areAnyRolesAllowed = function(roles, resource, permissions, callback){

  callback();
};

/**
 * Get resources the role(s) has permission(s) over.
 *
 * Examples:
 *   acl.whatResources('role1', 'permission1', callback);
 *   acl.whatResources('role1', ['permission1', 'permission2'], callback);
 *   acl.whatResources(['role1', role2], 'permission1', callback);
 *   acl.whatResources(['role1', role2], ['permission1', 'permission2'], callback);
 *
 * @param {String|Array} roles - Roles ids.
 * @param {String|Array} permissions - Permissions ids.
 * @param {Function} callback - Callback called when finished.
 */
ACL.prototype.whatResources = function(roles, permissions, callback){

  callback();
};

/**
 * Remove a resource from the system.
 *
 * Examples:
 *   acl.removeResource('resource1', callback);
 *
 * @param {String} resourceId - Resource to be removed.
 * @param {Function} callback - Callback called when finished.
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
 * Create User. If user already exists, does nothing.
 *
 * Examples:
 *   acl._createUser('user1', callback);
 *
 * @param {String|Number} userId - User id.
 * @param {Function} callback - Callback called when finished.
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
 * Create Role. If role already exists, does nothing.
 *
 * Examples:
 *   acl._createRole('role1', callback);
 *
 * @param {String|Number} roleId - Role id.
 * @param {Function} callback - Callback called when finished.
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
 * Create Resource. If role already exists, does nothing.
 *
 * Examples:
 *   acl._createResource('resource1', callback);
 *
 * @param {String|Number} resourceId - Resource id.
 * @param {Function} callback - Callback called when finished.
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
 * Create Relationship. If relationship already exists, does nothing.
 *
 * Examples:
 *   acl._createRelationship(1, 2, 'TYPE', callback);
 *   acl._createRelationship(1, 2, 'TYPE', {p1:'v1', p2:'v2'}, callback);
 *
 * @param {String|Number} nodeId1 - First Node ID.
 * @param {String|Number} nodeId2 - Second Node ID.
 * @param {String} type - Relationship type.
 * @param {Object} properties - Relationship properties.
 * @param {Function} callback - Callback called when finished.
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
        var complete = true;
        for (var property in properties) {
          if (relationshipRetrieved[property] === undefined) {
            complete = false;
          }
        }

        if (complete) {
          callback(null, relationshipRetrieved);
        } else {
          // @todo: should update relationship
          var newProperties = relationshipRetrieved;
          var relationshipRetrievedId = relationshipRetrieved._id;

          // @todo: use _getParameters
          delete(newProperties._id);
          delete(newProperties._start);
          delete(newProperties._end);
          delete(newProperties._type);

          for (property in properties) {
            if (newProperties[property] === undefined) {
              newProperties[property] = true;
            }
          }

          _this.connector.updateRelationship(relationshipRetrievedId, newProperties, function (err, updatedRelationship) {
            callback(null, updatedRelationship);
          });
        }
      });
    } else {
      _this.connector.addRelationship(nodeId1, nodeId2, type, properties, function (err, relationshipCreated) {
        callback(null, relationshipCreated);
      });
    }
  });
};

module.exports = ACL;
