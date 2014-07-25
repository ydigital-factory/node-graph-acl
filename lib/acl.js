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

  @param {String|Number} User id.
  @param {String|Array} Role(s) to add to the user id.
  @param {Function} Callback called when finished.
  @return {Boolean}
*/
ACL.prototype.addUserRoles = function(userId, roles, callback){
  var _this = this;

  if (typeof userId === 'undefined') {
    callback(new Error('User ID is empty'));
    return;
  }
  if (typeof roles === 'undefined') {
    callback(new Error('Roles are empty'));
    return;
  }

  // When only one role in format string, transform it to array
  if (!(roles instanceof Array)) {
    roles = [roles];
  }

  // @todo: verify if user exists
  _this.connector.createNode({uid: userId}, ['User'], function (err, user) {
    async.map(
      roles, // Array
      function(item, callback){
        // @todo: verify if role exists
        _this.connector.createNode({rid: item}, ['Role'], function(err, role) {
          // @todo: verify if relationship exists
          _this.connector.addRelationship(user._id, role._id, 'BELONGS_TO', undefined, callback);
        });
      },
      function(err, results){
        callback(err, results);
      }
    );
  });
};

ACL.prototype.createUser = function (userId, callback) {
  this.connector.existsNodeWithLabelsAndProperties(['User'], {uid: userId}, function(err, exists) {
    if (exists) {
      this.connector.getNodesWithLabelsAndProperties(['User'], {uid: userId}, function(err, userRetrieved) {
        callback(null, userRetrieved[0]);
      });
    } else {
      this.connector.createNode({uid: userId}, ['User'], function (err, userCreated) {
        callback(null, userCreated);
      });
    }
  });
};

ACL.prototype.createRole = function (roleId, callback) {
  this.connector.existsNodeWithLabelsAndProperties(['Role'], {rid: roleId}, function(err, exists) {
    if (exists) {
      this.connector.getNodesWithLabelsAndProperties(['Role'], {rid: roleId}, function(err, roleRetrieved) {
        callback(null, roleRetrieved[0]);
      });
    } else {
      this.connector.createNode({rid: roleId}, ['Role'], function (err, roleCreated) {
        callback(null, roleCreated);
      });
    }
  });
};


/**
  removeUserRoles( userId, roles, function(err) )

  Remove roles from a given user.

  @param {String|Number} User id.
  @param {String|Array} Role(s) to remove to the user id.
  @param {Function} Callback called when finished.
  @return {Promise} Promise resolved when finished
*/
ACL.prototype.removeUserRoles = function(userId, roles, callback){
  return true;
};

/**
  userRoles( userId, function(err, roles) )

  Return all the roles from a given user.

  @param {String|Number} User id.
  @param {Function} Callback called when finished.
  @return {Promise} Promise resolved with an array of user roles
*/
ACL.prototype.userRoles = function(userId, callback){
  return true;
};

/**
  addRoleParents( role, parents, function(err) )

  Adds a parent or parent list to role.

  @param {String|Number} User id.
  @param {String|Array} Role(s) to remove to the user id.
  @param {Function} Callback called when finished.
  @return {Promise} Promise resolved when finished
*/
ACL.prototype.addRoleParents = function(role, parents, callback){
  return true;
};

/**
  removeRole( role, function(err) )

  Removes a role from the system.

  @param {String} Role to be removed
  @param {Function} Callback called when finished.
*/
ACL.prototype.removeRole = function(role, callback){
  return true;
};

/**
  removeResource( resource, function(err) )

  Removes a resource from the system

  @param {String} Resource to be removed
  @param {Function} Callback called when finished.
  @return {Promise} Promise resolved when finished
*/
ACL.prototype.removeResource = function(resource, callback){
  return true;
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
  @return {Promise} Promise resolved when finished
*/
ACL.prototype.allow = function(roles, resources, permissions, callback){
  return true;
};

ACL.prototype.removeAllow = function(role, resources, permissions, callback){
  return true;
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
  return true;
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
  return true;
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
  return true;
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
  return true;
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
  return true;
};

/*ACL.prototype.permittedResources = function(roles, permissions, callback){
  return true;
};*/

module.exports = ACL;
