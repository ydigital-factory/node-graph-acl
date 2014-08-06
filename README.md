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

It's not on npm yet, but when it is, you'll just have to:

```
npm install node-graph-acl
```

## Documentation

### addUserRoles (userId, roles, callback)

done

### removeUserRoles (userId, roles, callback)

done

### userRoles (userId, callback)

done

### addRoleParents (role, parents, callback)

done

### removeRole (roleId, callback)

done

### allow (roles, resources, permissions, callback)

done

### removeAllow (role, resources, permissions, callback)

done

### allowedPermissions (userId, resources, callback)

in progress

### isAllowed (userId, resource, permissions, callback)

in progress

### areAnyRolesAllowed (roles, resource, permissions, callback)

in progress

### whatResources (roles, permissions, callback)

in progress

### removeResource (resourceId, callback)

done
