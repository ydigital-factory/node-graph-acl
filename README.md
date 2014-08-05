#node-graph-acl

[![Build Status via Travis CI](https://travis-ci.org/ydigital-factory/node-graph-acl.svg?branch=master)](https://travis-ci.org/ydigital-factory/node-graph-acl)

Node Graph ACL is a ACL module using Graph databases.

It's made to be a direct replacement for npm package "acl"

## Examples

```
var neo4j = require('node-neo4j');
var acl = require('node-graph-acl');

var db = new neo4j('http://localhost:7474');
var myACL = new acl(new acl.neo4jConnector(db));

testACL.allow('admin', 'dashboard', ['create', 'read', 'update', 'delete'], function (err, success) {
  // Do something
});

```

## Install

```
npm install node-graph-acl
```

## Documentation

### addUserRoles (userId, roles, callback)

### removeUserRoles (userId, roles, callback)

### userRoles (userId, callback)

### addRoleParents (role, parents, callback)

### removeRole (roleId, callback)

### allow (roles, resources, permissions, callback)

### removeAllow (role, resources, permissions, callback)

### allowedPermissions (userId, resources, callback)

### isAllowed (userId, resource, permissions, callback)

### areAnyRolesAllowed (roles, resource, permissions, callback)

### whatResources (roles, permissions, callback)

### removeResource (resourceId, callback)
