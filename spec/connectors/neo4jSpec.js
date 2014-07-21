var neo4j = require('node-neo4j');
var acl = require("../../index.js");

var db = new neo4j('http://localhost:7474');
var testACL = new acl(new acl.neo4jConnector(db));


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
var labels2 = [
  'TestLabel3',
  'TestLabel4'
];
var labels1 = [
  'TestLabel1',
  'TestLabel2'
];

// Test nodes and relationships
var testNode1;
var testNode2;
var testNode3;
var testNode4;
var testRelationship1;
var testRelationship2;

// Neo4jConnector.prototype.createNode
describe("Call createNode with properties and labels", function () {
  beforeEach(function(done) {
    testACL.connector.createNode(properties1, labels1, function(err, createdNode) {
      testNode1 = createdNode;
      done();
    });
  });

  it("should create a user with properties and labels", function (done) {
    expect(testNode1).toBeDefined();
    expect(testNode1.p1).toEqual(properties1.p1);
    expect(testNode1.p2).toEqual(properties1.p2);
    // @todo Check if labels were inserted
    done();
  });
});

describe("Call createNode with no properties and no labels", function () {
  beforeEach(function(done) {
    testACL.connector.createNode({}, [], function(err, createdNode) {
      testNode2 = createdNode;
      done();
    });
  });

  it("should create a user without properties or labels", function (done) {
    expect(testNode2).toBeDefined();
    expect(testNode2.p1).toEqual(undefined);
    expect(testNode2.p2).toEqual(undefined);
    // @todo Check if labels were inserted
    done();
  });
});

describe("Call createNode with properties", function () {
  beforeEach(function(done) {
    testACL.connector.createNode(properties1, [], function(err, createdNode) {
      testNode3 = createdNode;
      done();
    });
  });

  it("should create a user with properties but without labels", function (done) {
    expect(testNode3).toBeDefined();
    expect(testNode3.p1).toEqual(properties1.p1);
    expect(testNode3.p2).toEqual(properties1.p2);
    // @todo Check if labels were inserted
    done();
  });
});


describe("Call createNode with labels", function () {
  beforeEach(function(done) {
    testACL.connector.createNode({}, labels1, function(err, createdNode) {
      testNode4 = createdNode;
      done();
    });
  });

  it("should create a user with labels but without properties", function (done) {
    expect(testNode4).toBeDefined();
    expect(testNode4.p1).toEqual(undefined);
    expect(testNode4.p2).toEqual(undefined);
    // @todo Check if labels were inserted
    done();
  });
});

// Neo4jConnector.prototype.getNode
describe("Call getNode with nodeId", function () {
  var retrievedNode;

  beforeEach(function(done) {
    testACL.connector.getNode(testNode4._id, function(err, node) {
      retrievedNode = node;
      done();
    });
  });

  it("should retrieve given node", function (done) {
    expect(testNode4).toEqual(retrievedNode);
    done();
  });
});

// Neo4jConnector.prototype.updateNode
describe("Call updateNode with nodeId, properties and labels", function () {
  var updatedNode;
  var updateSuccess;

  beforeEach(function(done) {
      testACL.connector.updateNode(testNode2._id, properties2, labels2, function(err, success) {
        updateSuccess = success;

        testACL.connector.getNode(testNode2._id, function(err, node) {
          updatedNode = node;
          done();
        });
      });
  });

  it("should update properties and labels of a node", function (done) {
    expect(updateSuccess).toBeDefined();
    expect(updateSuccess.updateProperties).toEqual(true);
    expect(updateSuccess.updateLabels).toEqual(true);
    expect(testNode2).not.toEqual(updatedNode);
    // @todo Check if properties and labels were correctly replaced

    // update test node info
    testACL.connector.getNode(testNode2._id, function(err, node) {
      testNode2 = node;
    });
    done();
  });
});

// Neo4jConnector.prototype.deleteNode
describe("Call deleteNode with nodeId", function () {
  var createdNode;
  var deletedNode;
  var success;

  beforeEach(function(done) {
    testACL.connector.createNode(properties1, labels1, function(err, node) {
      createdNode = node;
      testACL.connector.deleteNode(node._id, function(err, deleteSuccess) {
        success = deleteSuccess;

        testACL.connector.getNode(node._id, function(err, noNode) {
          deletedNode = noNode;
          done();
        });
      });
    });
  });

  it("should delete chosen node", function (done) {
    expect(success).toBeDefined();
    expect(success).toEqual(true);
    expect(createdNode).not.toEqual(deletedNode);
    expect(deletedNode).toEqual(false);
    done();
  });
});

// Neo4jConnector.prototype.getNodeProperties
describe("Call getNodeProperties with nodeId", function () {
  var retrievedProperties;

  beforeEach(function(done) {
    testACL.connector.getNodeProperties(testNode2._id, function(err, properties) {
      retrievedProperties = properties;
      done();
    });
  });

  it("should retrieve given node properties", function (done) {
    expect(properties2).toEqual(retrievedProperties);
    done();
  });
});

// Neo4jConnector.prototype.addRelationship
describe("Call addRelationship with two new nodes", function () {
  var addedRelationship;
  var retrievedRelationship;

  beforeEach(function(done) {
    var type = 'TEST';
    testACL.connector.addRelationship(testNode1._id, testNode2._id, type,
                      properties1, function(err, relationship) {
      testRelationship1 = relationship;

      testACL.connector.getRelationship(testRelationship1._id, function(err, relationship) {
        retrievedRelationship = relationship;

        done();
      });
    });
  });

  it("should create that relationship", function (done) {
    expect(testRelationship1).toEqual(retrievedRelationship);
    done();
  });
});

// Neo4jConnector.prototype.getRelationship
describe("Call getRelationship", function () {
  var retrievedRelationship;

  beforeEach(function(done) {
    testACL.connector.getRelationship(testRelationship1._id, function(err, relationship) {
      retrievedRelationship = relationship;

      done();
    });
  });

  it("should return that relationship", function (done) {
    expect(testRelationship1).toEqual(retrievedRelationship);
    done();
  });
});

// Neo4jConnector.prototype.updateRelationship
describe("Call updateRelationship with properties", function () {
  var updatedRelationship;
  var retrievedRelationship;

  beforeEach(function(done) {
    testACL.connector.updateRelationship(testRelationship1._id, properties2, function(err, relationshipFlag) {
      updatedRelationship = relationshipFlag; // true or false

      testACL.connector.getRelationship(testRelationship1._id, function(err, relationship) {
        retrievedRelationship = relationship;

        done();
      });
    });
  });

  it("should update that relationship", function (done) {
    expect(updatedRelationship).toEqual(true);
    expect(retrievedRelationship).not.toEqual(testRelationship1);
    expect(retrievedRelationship.p3).toEqual(properties2.p3);
    expect(retrievedRelationship.p4).toEqual(properties2.p4);
    expect(retrievedRelationship.p1).toEqual(undefined);
    expect(retrievedRelationship.p2).toEqual(undefined);

    // update test relationship info
    testACL.connector.getRelationship(testRelationship1._id, function(err, relationship) {
      testRelationship1 = relationship;
    });
    done();
  });
});

// Neo4jConnector.prototype.removeRelationship
describe("Call removeRelationship", function () {
  var addedRelationship;
  var removeSuccess;

  beforeEach(function(done) {
    var type = 'TEST';
    testACL.connector.addRelationship(testNode1._id, testNode2._id, type,
                      properties1, function(err, relationship) {
      addedRelationship = relationship;

      testACL.connector.removeRelationship(addedRelationship._id, function(err, success) {
        removeSuccess = success;

        done();
      });
    });
  });

  it("should remove that relationship", function (done) {
    expect(removeSuccess).toEqual(true);
    done();
  });
});



// Neo4jConnector.prototype.getRelationshipProperties





// Neo4jConnector.prototype.getNodeRelationships




// Neo4jConnector.prototype.getNodeRelationshipsProperties




// Neo4jConnector.prototype.addProperty




// Neo4jConnector.prototype.updateProperty




// Neo4jConnector.prototype.removeProperty




// Neo4jConnector.prototype.getLabels




// Neo4jConnector.prototype.addLabel




// Neo4jConnector.prototype.removeLabel




// Neo4jConnector.prototype.startTransaction




// Neo4jConnector.prototype.rollbackTransaction




// Neo4jConnector.prototype.commitTransaction






// After all tests, delete nodes created for testing
