var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');

var acl = require("../lib/acl.js");
var neo4jConnector = require("../lib/connectors/neo4j.js");

describe("addUserRoles", function () {
  it("should add roles to a user", function () {
    var acl1 = new acl(new neo4jConnector(db));
    var addUserRole = acl1.addUserRoles('user', 'group');
    expect(addUserRole).toBe(true);
  });
});
