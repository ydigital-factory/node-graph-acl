var neo4j = require('node-neo4j');
var acl = require("../lib/acl.js");

describe("addUserRoles", function () {
  it("should add roles to a user", function () {
    var db = new neo4j('http://localhost:7474');
    var acl1 = new acl(new acl.neo4jConnector(db));

    var addUserRole = acl1.addUserRoles('user', 'group');

    expect(addUserRole).toBe(true);
  });
});
