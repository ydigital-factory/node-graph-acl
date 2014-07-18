var neo4j = require('node-neo4j');
var acl = require("../../index.js");

var db = new neo4j('http://localhost:7474');
var testACL = new acl(new acl.neo4jConnector(db));

var properties1 = {
  p1: 'test prop 1',
  p2: 'test prop 2'
};
var labels1 = [
  'TestLabel1',
  'TestLabel2'
];

var properties2 = {
  p3: 'test prop 3',
  p4: 'test prop 4'
};
var labels2 = [
  'TestLabel3',
  'TestLabel4'
];

// Neo4jConnector.prototype.createNode
describe("Call createNode with properties and labels", function () {
  var node;

  beforeEach(function(done) {
    testACL.connector.createNode(properties1, labels1, function(err, createdNode) {
      node = createdNode;
      done();
    });
  });

  it("should create a user with properties and labels", function (done) {
    expect(node).toBeDefined();
    expect(node.p1).toEqual(properties1.p1);
    expect(node.p2).toEqual(properties1.p2);
    // @todo Check if labels were inserted
    done();
  });
});

// Neo4jConnector.prototype.updateNode
describe("Call updateNode with nodeId, properties and labels", function () {
  var createdNode;
  var updatedNode;
  var updateSuccess;

  beforeEach(function(done) {
    testACL.connector.createNode(properties1, labels1, function(err, node) {
      createdNode = node;
      testACL.connector.updateNode(node._id, properties2, labels2, function(err, success) {
        updateSuccess = success;

        testACL.connector.getNode(node._id, function(err, node) {
          updatedNode = node;
          done();
        });
      });
    });
  });

  it("should update properties and labels of a node", function (done) {
    expect(updateSuccess).toBeDefined();
    expect(updateSuccess.updateProperties).toEqual(true);
    expect(updateSuccess.updateLabels).toEqual(true);
    expect(createdNode).not.toEqual(updatedNode);
    // @todo Check if properties and labels were correctly replaced

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

// Neo4jConnector.prototype.getNode
describe("Call getNode with nodeId", function () {
  var createdNode;
  var retrievedNode;

  beforeEach(function(done) {
    testACL.connector.createNode(properties1, labels1, function(err, node) {
      createdNode = node;
      testACL.connector.getNode(node._id, function(err, noNode) {
        retrievedNode = noNode;
        done();
      });
    });
  });

  it("should retrieve given node", function (done) {
    expect(createdNode).toEqual(retrievedNode);
    done();
  });
});

// Neo4jConnector.prototype.getNodeProperties
describe("Call getNodeProperties with nodeId", function () {
  var createdNode;
  var retrievedProperties;

  beforeEach(function(done) {
    testACL.connector.createNode(properties1, labels1, function(err, node) {
      createdNode = node;
      testACL.connector.getNodeProperties(node._id, function(err, properties) {
        retrievedProperties = properties;
        done();
      });
    });
  });

  it("should retrieve given node properties", function (done) {
    expect(properties1).toEqual(retrievedProperties);
    done();
  });
});


// Neo4jConnector.prototype.getRelationship
// Neo4jConnector.prototype.addRelationship
describe("Call Add Relationship with two new nodes", function () {
  var createdNode1;
  var createdNode2;
  var addedRelationship;
  var retrievedRelationship;

  beforeEach(function(done) {
    testACL.connector.createNode(properties1, labels1, function(err, node) {
      createdNode1 = node;
      testACL.connector.createNode(properties1, labels1, function(err, node) {
        createdNode2 = node;
        var type = 'TEST';
        testACL.connector.addRelationship(createdNode1._id, createdNode2._id, type,
                          properties1, function(err, relationship) {
          addedRelationship = relationship;

          testACL.connector.getRelationship(addedRelationship._id, function(err, relationship) {
            retrievedRelationship = relationship;

            done();
          });
        });
      });
    });
  });

  it("should create that relationship", function (done) {
    expect(addedRelationship).toEqual(retrievedRelationship);
    done();
  });
});



// Neo4jConnector.prototype.updateRelationship




// Neo4jConnector.prototype.removeRelationship




// Neo4jConnector.prototype.getRelationship




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
