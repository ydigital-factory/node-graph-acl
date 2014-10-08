#node-graph-acl

[![Build Status via Travis CI](https://travis-ci.org/ydigital-factory/node-graph-acl.svg?branch=master)](https://travis-ci.org/ydigital-factory/node-graph-acl)
[![Coverage Status via Coveralls](https://img.shields.io/coveralls/ydigital-factory/node-graph-acl.svg)](https://coveralls.io/r/ydigital-factory/node-graph-acl)
[![Dependency Status via Gemnasium](https://gemnasium.com/ydigital-factory/node-graph-acl.svg)](https://gemnasium.com/ydigital-factory/node-graph-acl)


Node Graph ACL is a ACL module that uses Graph databases.

It's made to be a direct replacement for [npm package acl](https://www.npmjs.org/package/acl), which is inspired by Zend_ACL.

This module is sponsored by [YDigital Factory](http://ydigitalfactory.com)

## Short Example

```
var neo4j = require('node-neo4j');
var acl = require('graph-acl');

var db = new neo4j('http://localhost:7474');
var myACL = new acl(new acl.neo4jConnector(db));

myACL.allow('admin', 'dashboard', ['create', 'read', 'update', 'delete'], function (err, success) {
  // Do something
});

```

## Install

@todo: at the moment it is not a npm project yet.
To install the project and all its dependencies, you have to execute:
```
npm install node-graph-acl
```

## Tests

Tests are done with [Jasmine 2.0](http://jasmine.github.io/2.0/introduction.html). To run them, you have to execute:
```
grunt test
```

## Documentation

JSDoc is used for the documentation of the project. To create it, you have to execute:
```
grunt doc
```

## Short Documentation

### addUserRoles (userId, roles, callback)

Add roles to a given user.

__Parameters:__
* userId (String|Number): User id.
* roles (String|Array): Role(s) to add to the user.
* callback (Function): Callback called when finished.

__Examples:__
```
myACL.addUserRoles('user1', 'role1', callback);
myACL.addUserRoles('user1', ['role1', 'role2'], callback);
```

### removeUserRoles (userId, roles, callback)

Remove roles from a given user.

__Parameters:__
* userId (String|Number): User id.
* roles (String|Array): Role(s) to remove from the user.
* callback (Function): Callback called when finished.

__Examples:__
```
myACL.removeUserRoles('user1', 'role1', callback);
myACL.removeUserRoles('user1', ['role1', 'role2'], callback);
```

### userRoles (userId, callback)

Return all the roles the user belongs to.

__Parameters:__
* userId (String|Number): User id.
* callback (Function): Callback called when finished.

__Examples:__
```
myACL.userRoles('user1', callback);
```

### addRoleParents (role, parents, callback)

Add one or more parent roles to a role.

__Parameters:__
* role (String|Number): Role id.
* parents (String|Array): Parent role(s) to add to the role.
* callback (Function): Callback called when finished.

__Examples:__
```
myACL.addRoleParents('role1', 'role2', callback);
myACL.addRoleParents('role1', ['role2', 'role3'], callback);
```

### removeRole (roleId, callback)

Remove a role from the system.

__Parameters:__
* roleId (String|Number): Role to be removed.
* callback (Function): Callback called when finished.

__Examples:__
```
myACL.removeRole('role1', callback);
```

### allow (roles, resources, permissions, callback)

Add permissions to roles over resources.
@todo: alternative syntax with permissions array.

__Parameters:__
* roles (String|Array): Role(s) to add permission(s) of resource(s) to.
* resources (String|Array): Resource(s) to give permission(s) to.
* permissions (String|Array): Permission(s) of the resource(s).
* callback (Function): Callback called when finished.

__Examples:__
```
myACL.allow('role1', 'resource1', 'permission1', callback);
myACL.allow(['role1', 'role2'], ['resource1', 'resource1'], ['permission1', 'permission2'], callback);

@todo:
var permissionsArray = [
  {
    roles:'role1',
    allows:[
      {resources:'resource1', permissions:'permission1'},
      {resources:['resource2', 'resource3'], permissions:['permission1','permission2']}
    ]
  },
  {
    roles:['role1', 'role2'],
    allows:[
      {resources:'resource4', permissions:['permission1', 'permission2']},
      {resources:['resource5', 'resource6'], permissions:'permission1'}
    ]
  },
];
myACL.allow(permissionsArray, callback);
```

### removeAllow (role, resources, permissions, callback)

Remove permissions from roles over resources.

__Parameters:__
* role (String): Role to remove permission(s) of resource(s) from.
* resources (String|Array): Resource(s) to remove permission(s) from.
* permissions (String|Array): Permission(s) of the resource(s).
* callback (Function): Callback called when finished.

__Examples:__
```
myACL.removeAllow('role1', 'resource1', 'permission1', callback);
myACL.removeAllow('role1', ['resource1', 'resource2'], ['permission1', 'permission2'], callback);
```

### allowedPermissions (userId, resources, callback)

Get all the permissions the user has to over this resources.

It returns an array of objects where every object maps a resource name to a list of permissions for that resource.

@todo: ATENTION! At the moment this does not support Parent Roles!
@todo: Ideal scenario: Take advantage of graph queries to get all resources

__Parameters:__
* userId (String|Number): User id.
* resources (String|Array): Resource(s) to ask permissions about.
* callback (Function): Callback called when finished.

__Examples:__
```
myACL.allowedPermissions('user1', 'resource1', callback);
myACL.allowedPermissions('user1', ['resource1', 'resource2'], callback);
```

### isAllowed (userId, resources, permissions, callback)

Check if a user is allowed to access resource(s) with given permission(s) (note: it must fulfil all the permissions).

__Parameters:__
* userId (String|Number): User id.
* resources (String|Array): Resource(s) to ask permissions for.
* permissions (String|Array): Permission(s).
* callback (Function): Callback called when finished.

__Examples:__
```
myACL.isAllowed('user1', 'resource1', 'permission1', callback);
myACL.isAllowed('user1', ['resource1', 'resource2'], ['permission1', 'permission2'], callback);
```

### areAnyRolesAllowed (roles, resource, permissions, callback)

Check if any of the role(s) have permission(s) on the resource(s).

__Parameters:__
* roles (String|Array): Role(s) ids to check the permissions for.
* resource (String): Resource to ask permissions for.
* permissions (String|Array): Permission(s) over the resource.
* callback (Function): Callback called when finished.

__Examples:__
```
myACL.areAnyRolesAllowed('role1', 'resource1', 'permission1', callback);
myACL.areAnyRolesAllowed('role1', 'resource1', ['permission1', 'permission2'], callback);
myACL.areAnyRolesAllowed(['role1', role2], 'resource1', 'permission1', callback);
myACL.areAnyRolesAllowed(['role1', role2], 'resource1', ['permission1', 'permission2'], callback);
```

### whatResources (roles, permissions, callback)

Get resources the role(s) have permission(s) over.

__Parameters:__
* roles (String|Array): Roles ids.
* permissions (String|Array): Permissions ids.
* callback (Function): Callback called when finished.

__Examples:__
```
myACL.whatResources('role1', 'permission1', callback);
myACL.whatResources('role1', ['permission1', 'permission2'], callback);
myACL.whatResources(['role1', role2], 'permission1', callback);
myACL.whatResources(['role1', role2], ['permission1', 'permission2'], callback);
```

### removeResource (resourceId, callback)

Remove a resource from the system.

__Parameters:__
* resourceId (String): Resource to be removed.
* callback (Function): Callback called when finished.

__Examples:__
```
myACL.removeResource('resource1', callback);
```
