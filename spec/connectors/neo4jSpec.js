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
var labels1 = [
  'TestLabel1',
  'TestLabel2'
];
var labels2 = [
  'TestLabel3',
  'TestLabel4'
];

// Test nodes and relationships
var testNode1;
var testNode2;
var testNode3;
var testNode4;
var testRelationship1;
var testRelationship2;

// Neo4jConnector.prototype.createNode = function (labels, properties, callback)
describe("Neo4jConnector.prototype.createNode:", function() {
  describe("Call createNode with labels and properties", function () {
    beforeEach(function(done) {
      testACL.connector.createNode(labels1, properties1, function(err, createdNode) {
        testNode1 = createdNode;
        done();
      });
    });

    it("should create a node with labels and properties.", function (done) {
      expect(testNode1).toBeDefined();
      expect(testNode1.p1).toEqual(properties1.p1);
      expect(testNode1.p2).toEqual(properties1.p2);
      // @todo Check if labels were inserted
      done();
    });
  });

  describe("Call createNode with no labels and no properties", function () {
    beforeEach(function(done) {
      testACL.connector.createNode([], {}, function(err, createdNode) {
        testNode2 = createdNode;
        done();
      });
    });

    it("should create a node without labels or properties.", function (done) {
      expect(testNode2).toBeDefined();
      expect(testNode2.p1).toEqual(undefined);
      expect(testNode2.p2).toEqual(undefined);
      // @todo Check if labels were inserted
      done();
    });
  });

  describe("Call createNode with properties", function () {
    beforeEach(function(done) {
      testACL.connector.createNode([], properties1, function(err, createdNode) {
        testNode3 = createdNode;
        done();
      });
    });

    it("should create a node with properties but without labels.", function (done) {
      expect(testNode3).toBeDefined();
      expect(testNode3.p1).toEqual(properties1.p1);
      expect(testNode3.p2).toEqual(properties1.p2);
      // @todo Check if labels were inserted
      done();
    });
  });

  describe("Call createNode with labels", function () {
    beforeEach(function(done) {
      testACL.connector.createNode(labels1, {}, function(err, createdNode) {
        testNode4 = createdNode;
        done();
      });
    });

    it("should create a node with labels but without properties.", function (done) {
      expect(testNode4).toBeDefined();
      expect(testNode4.p1).toEqual(undefined);
      expect(testNode4.p2).toEqual(undefined);
      // @todo Check if labels were inserted
      done();
    });
  });
});

// Neo4jConnector.prototype.getNode = function (nodeId, callback)
describe("Neo4jConnector.prototype.getNode:", function () {
  describe("Call getNode with nodeId", function () {
    var retrievedNode;

    beforeEach(function(done) {
      testACL.connector.getNode(testNode4._id, function(err, node) {
        retrievedNode = node;
        done();
      });
    });

    it("should retrieve given node.", function (done) {
      expect(testNode4).toEqual(retrievedNode);
      done();
    });
  });
});

// Neo4jConnector.prototype.getNodesWithLabel = function (label, callback)
describe("Neo4jConnector.prototype.getNodesWithLabel:", function () {
  describe("Call getNodesWithLabel with label 'TestLabel1'", function () {
    var retrievedNodes;

    beforeEach(function(done) {
      testACL.connector.getNodesWithLabel('TestLabel1', function(err, nodes) {
        retrievedNodes = nodes;
        done();
      });
    });

    it("should retrieve all nodes with given label.", function (done) {
      expect(retrievedNodes.length).toBeGreaterThan(0);
      //expect(testNode1._id).toEqual(retrievedNodes[0]._id);
      //expect(testNode4._id).toEqual(retrievedNodes[1]._id);
      done();
    });
  });
  describe("Call getNodesWithLabel with inexistent label", function () {
    var retrievedNodes;

    beforeEach(function(done) {
      testACL.connector.getNodesWithLabel('INEXISTENT', function(err, nodes) {
        retrievedNodes = nodes;
        done();
      });
    });

    it("should not retrieve nodes.", function (done) {
      expect(retrievedNodes.length).toBe(0);
      done();
    });
  });
});

/*
// Neo4jConnector.prototype.getNodesWithProperties = function (properties, callback)
describe("Neo4jConnector.prototype.getNodesWithProperties:", function () {
  describe("Call getNodesWithProperties with property {p1: 'test prop 1'}", function () {
    var retrievedNodes;

    beforeEach(function(done) {
      testACL.connector.getNodesWithProperties({p1: 'test prop 1'}, function(err, nodes) {
        retrievedNodes = nodes;
        done();
      });
    });

    it("should retrieve all nodes with given properties", function (done) {
      expect(retrievedNodes.length).toBeGreaterThan(0);
      //expect(testNode1._id).toEqual(retrievedNodes[0]._id);
      //expect(testNode4._id).toEqual(retrievedNodes[1]._id);
      done();
    });
  });

  describe("Call getNodesWithProperties with inexistent properties", function () {
    var retrievedNodes;

    beforeEach(function(done) {
      testACL.connector.getNodesWithProperties('INEXISTENT', {inexistent: 'inexistent'}, function(err, nodes) {
        retrievedNodes = nodes;
        done();
      });
    });

    it("should not retrieve nodes", function (done) {
      expect(retrievedNodes.length).toBe(0);
      done();
    });
  });
});
*/

// Neo4jConnector.prototype.getNodesWithLabelsAndProperties = function (labels, properties, callback)
describe("Neo4jConnector.prototype.getNodesWithLabelsAndProperties:", function () {
  describe("Call getNodesWithLabelsAndProperties with label 'TestLabel1' and property {p1: 'test prop 1'}", function () {
    var retrievedNodes;

    beforeEach(function(done) {
      testACL.connector.getNodesWithLabelsAndProperties('TestLabel1', {p1: 'test prop 1'}, function(err, nodes) {
        retrievedNodes = nodes;
        done();
      });
    });

    it("should retrieve all nodes with given label.", function (done) {
      expect(retrievedNodes.length).toBeGreaterThan(0);
      //expect(testNode1._id).toEqual(retrievedNodes[0]._id);
      //expect(testNode4._id).toEqual(retrievedNodes[1]._id);
      done();
    });
  });

  describe("Call getNodesWithLabelsAndProperties with label inexistent labels and inexistent properties", function () {
    var retrievedNodes;

    beforeEach(function(done) {
      testACL.connector.getNodesWithLabelsAndProperties('INEXISTENT', {inexistent: 'inexistent'}, function(err, nodes) {
        retrievedNodes = nodes;
        done();
      });
    });

    it("should not retrieve nodes.", function (done) {
      expect(retrievedNodes.length).toBe(0);
      done();
    });
  });
});

// Neo4jConnector.prototype.existsNodeWithLabel = function (label, callback)
describe("Neo4jConnector.prototype.existsNodeWithLabel:", function () {
  describe("Call existsNodeWithLabel with label 'TestLabel1'", function () {
    var existsNode;

    beforeEach(function(done) {
      testACL.connector.existsNodeWithLabel('TestLabel1', function(err, exists) {
        existsNode = exists;
        done();
      });
    });

    it("should return true.", function (done) {
      expect(existsNode).toBe(true);
      done();
    });
  });

  describe("Call existsNodeWithLabel with inexistent label", function () {
    var existsNode;

    beforeEach(function(done) {
      testACL.connector.existsNodeWithLabel('INEXISTENT', function(err, exists) {
        existsNode = exists;
        done();
      });
    });

    it("should return false.", function (done) {
      expect(existsNode).toBe(false);
      done();
    });
  });
});

/*
// Neo4jConnector.prototype.existsNodeWithProperties = function (properties, callback)
describe("Neo4jConnector.prototype.existsNodeWithProperties:", function () {
  describe("Call existsNodeWithProperties with property {p1: 'test prop 1'}", function () {
    var existsNode;

    beforeEach(function(done) {
      testACL.connector.existsNodeWithProperties({p1: 'test prop 1'}, function(err, exists) {
        existsNode = exists;
        done();
      });
    });

    it("should return true.", function (done) {
      expect(existsNode).toBe(true);
      done();
    });
  });

  describe("Call existsNodeWithProperties with inexistent properties", function () {
    var existsNode;

    beforeEach(function(done) {
      testACL.connector.existsNodeWithProperties('INEXISTENT', {inexistent: 'inexistent'}, function(err, exists) {
        existsNode = exists;
        done();
      });
    });

    it("should return false.", function (done) {
      expect(existsNode).toBe(false);
      done();
    });
  });
});
*/

// Neo4jConnector.prototype.existsNodeWithLabelsAndProperties = function (labels, properties, callback)
describe("Neo4jConnector.prototype.existsNodeWithLabelsAndProperties:", function () {
  describe("Call existsNodeWithLabelsAndProperties with label 'TestLabel1' and property {p1: 'test prop 1'}", function () {
    var existsNode;

    beforeEach(function(done) {
      testACL.connector.existsNodeWithLabelsAndProperties('TestLabel1', {p1: 'test prop 1'}, function(err, exists) {
        existsNode = exists;
        done();
      });
    });

    it("should return true.", function (done) {
      expect(existsNode).toBe(true);
      done();
    });
  });

  describe("Call existsNodeWithLabelsAndProperties with label inexistent labels and inexistent properties", function () {
    var existsNode;

    beforeEach(function(done) {
      testACL.connector.existsNodeWithLabelsAndProperties('INEXISTENT', {inexistent: 'inexistent'}, function(err, exists) {
        existsNode = exists;
        done();
      });
    });

    it("should return false.", function (done) {
      expect(existsNode).toBe(false);
      done();
    });
  });
});

// Neo4jConnector.prototype.updateNode = function (nodeId, labels, properties, callback)
describe("Neo4jConnector.prototype.updateNode:", function () {
  describe("Call updateNode with nodeId, labels and properties", function () {
    var updatedNode;
    var updateSuccess;

    beforeEach(function(done) {
        testACL.connector.updateNode(testNode2._id,  labels2, properties2, function(err, success) {
          updateSuccess = success;

          testACL.connector.getNode(testNode2._id, function(err, node) {
            updatedNode = node;
            done();
          });
        });
    });

    it("should update labels and properties of a node.", function (done) {
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
});

// Neo4jConnector.prototype.deleteNode = function (nodeId, callback)
describe("Neo4jConnector.prototype.deleteNode:", function () {
  describe("Call deleteNode with nodeId", function () {
    var createdNode;
    var deletedNode;
    var success;

    beforeEach(function(done) {
      testACL.connector.createNode(labels1, properties1, function(err, node) {
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

    it("should delete chosen node.", function (done) {
      expect(success).toBeDefined();
      expect(success).toEqual(true);
      expect(createdNode).not.toEqual(deletedNode);
      expect(deletedNode).toEqual(false);
      done();
    });
  });
});

// Neo4jConnector.prototype.getNodeProperties = function (nodeId, callback)
describe("Neo4jConnector.prototype.getNodeProperties:", function () {
  describe("Call getNodeProperties with nodeId", function () {
    var retrievedProperties;

    beforeEach(function(done) {
      testACL.connector.getNodeProperties(testNode2._id, function(err, properties) {
        retrievedProperties = properties;
        done();
      });
    });

    it("should retrieve given node properties.", function (done) {
      expect(properties2).toEqual(retrievedProperties);
      done();
    });
  });
});

// Neo4jConnector.prototype.addRelationship = function (from, to, type, properties, callback)
describe("Neo4jConnector.prototype.addRelationship:", function () {
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

    it("should create that relationship.", function (done) {
      expect(testRelationship1).toEqual(retrievedRelationship);
      done();
    });
  });
});

// Neo4jConnector.prototype.getRelationship = function (relationshipId, callback)
describe("Neo4jConnector.prototype.getRelationship:", function () {
  describe("Call getRelationship", function () {
    var retrievedRelationship;

    beforeEach(function(done) {
      testACL.connector.getRelationship(testRelationship1._id, function(err, relationship) {
        retrievedRelationship = relationship;

        done();
      });
    });

    it("should return that relationship.", function (done) {
      expect(testRelationship1).toEqual(retrievedRelationship);
      done();
    });
  });
});

// Neo4jConnector.prototype.updateRelationship = function (relationshipId, properties, callback)
describe("Neo4jConnector.prototype.updateRelationship:", function () {
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

    it("should update that relationship.", function (done) {
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
});

// Neo4jConnector.prototype.removeRelationship = function (relationshipId, callback)
describe("Neo4jConnector.prototype.removeRelationship:", function () {
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

    it("should remove that relationship.", function (done) {
      expect(removeSuccess).toEqual(true);
      done();
    });
  });
});

// Neo4jConnector.prototype.getRelationshipProperties = function (relationshipId, callback)
describe("Neo4jConnector.prototype.getRelationshipProperties:", function () {
  describe("Call getRelationshipProperties", function () {
    var retrievedProperties;

    beforeEach(function(done) {
      testACL.connector.getRelationshipProperties(testRelationship1._id, function(err, properties) {
        retrievedProperties = properties;

        done();
      });
    });

    it("should return that relationship properties.", function (done) {
      expect(properties2).toEqual(retrievedProperties);
      done();
    });
  });
});

// Neo4jConnector.prototype.getNodeRelationships = function (nodeId, options, callback)
describe("Neo4jConnector.prototype.getNodeRelationships:", function () {
  describe("Call getNodeRelationships", function () {
    var retrievedRelationships;

    beforeEach(function(done) {
      var options = {
        types: ['TEST'],
        direction: 'all'
      };
      testACL.connector.getNodeRelationships(testNode1._id, options, function(err, relationships) {
        retrievedRelationships = relationships;

        done();
      });
    });

    it("should return that node relationships.", function (done) {
      expect(retrievedRelationships[0].p3).toEqual(properties2.p3);
      expect(retrievedRelationships[0].p4).toEqual(properties2.p4);
      expect(retrievedRelationships[0]._type).toEqual('TEST');

      //@todo: test with more than 1 relationship. Maybe in a different test

      done();
    });
  });
});

//Neo4jConnector.prototype.getRelationshipsBetweenNodes = function (from, to, type, callback)
describe("Neo4jConnector.prototype.getRelationshipsBetweenNodes:", function () {
  describe("Call getRelationshipsBetweenNodes", function () {
    var retrievedRelationships;

    beforeEach(function(done) {
      testACL.connector.getRelationshipsBetweenNodes(testNode1._id, testNode2._id, 'TEST', function(err, relationships) {
        retrievedRelationships = relationships;

        done();
      });
    });

    it("should return relationships between the two nodes.", function (done) {
      expect(retrievedRelationships.p3).toEqual(properties2.p3);
      expect(retrievedRelationships.p4).toEqual(properties2.p4);
      expect(retrievedRelationships._type).toEqual('TEST');

      //@todo: test with more than 1 relationship. Maybe in a different test

      done();
    });
  });
});

//Neo4jConnector.prototype.existsRelationshipsBetweenNodes = function (from, to, type, callback)
describe("Neo4jConnector.prototype.existsRelationshipsBetweenNodes:", function () {
  describe("Call existsRelationshipsBetweenNodes", function () {
    var existRelationships;

    beforeEach(function(done) {
      testACL.connector.existsRelationshipsBetweenNodes(testNode1._id, testNode2._id, 'TEST', function(err, exist) {
        existRelationships = exist;

        done();
      });
    });

    it("should return true when relationship exists.", function (done) {
      expect(existRelationships).toEqual(true);
      done();
    });
  });
});

// Neo4jConnector.prototype.addNodeProperties = function (nodeId, properties, callback)
describe("Neo4jConnector.prototype.addNodeProperties:", function () {
  describe("Call addNodeProperties", function () {
    var updateSuccess;

    beforeEach(function(done) {
      testACL.connector.addNodeProperties(testNode4._id, properties2, function(err, success) {
        updateSuccess = success;

        done();
      });
    });

    it("should add properties to node.", function (done) {
      expect(updateSuccess.updateProperties).toEqual(true);
      expect(updateSuccess.updateLabels).toEqual(true);

      done();
    });
  });
});

// Neo4jConnector.prototype.updateNodeProperties = function (nodeId, properties, callback)
describe("Neo4jConnector.prototype.updateNodeProperties:", function () {
  describe("Call updateNodeProperties", function () {
    var updateSuccess;

    beforeEach(function(done) {
      testACL.connector.updateNodeProperties(testNode4._id, properties1, function(err, success) {
        updateSuccess = success;

        done();
      });
    });


    it("should update node with new properties.", function (done) {
      expect(updateSuccess.updateProperties).toEqual(true);
      expect(updateSuccess.updateLabels).toEqual(true);

      done();
    });
  });
});

// Neo4jConnector.prototype.removeNodeProperties = function (nodeId, properties, callback)
describe("Neo4jConnector.prototype.removeNodeProperties:", function () {
  describe("Call removeNodeProperties", function () {
    var updateSuccess;

    beforeEach(function(done) {
      testACL.connector.removeNodeProperties(testNode4._id, properties1, function(err, success) {
        updateSuccess = success;

        done();
      });
    });


    it("should remove properties from node.", function (done) {
      expect(updateSuccess.updateProperties).toEqual(true);
      expect(updateSuccess.updateLabels).toEqual(true);

      done();
    });
  });
});

// Neo4jConnector.prototype.addRelationshipProperties = function (relationshipId, properties, callback)
describe("Neo4jConnector.prototype.addRelationshipProperties:", function () {
  describe("Call addRelationshipProperties", function () {
    var updateSuccess;

    beforeEach(function(done) {
      testACL.connector.addRelationshipProperties(testRelationship1._id, properties2, function(err, success) {
        updateSuccess = success;

        done();
      });
    });

    it("should add properties to relationship.", function (done) {
      expect(updateSuccess).toEqual(true);

      done();
    });
  });
});

// Neo4jConnector.prototype.updateRelationshipProperties = function (relationshipId, properties, callback)
describe("Neo4jConnector.prototype.updateRelationshipProperties:", function () {
  describe("Call updateRelationshipProperties", function () {
    var updateSuccess;

    beforeEach(function(done) {
      testACL.connector.updateRelationshipProperties(testRelationship1._id, properties1, function(err, success) {
        updateSuccess = success;

        done();
      });
    });


    it("should update relationship with new properties.", function (done) {
      expect(updateSuccess).toEqual(true);

      done();
    });
  });
});

// Neo4jConnector.prototype.removeRelationshipProperties = function (relationshipId, properties, callback)
describe("Neo4jConnector.prototype.removeRelationshipProperties:", function () {
  describe("Call removeRelationshipProperties", function () {
    var updateSuccess;

    beforeEach(function(done) {
      testACL.connector.removeRelationshipProperties(testRelationship1._id, properties1, function(err, success) {
        updateSuccess = success;

        done();
      });
    });


    it("should remove properties from relationship.", function (done) {
      expect(updateSuccess).toEqual(true);

      done();
    });
  });
});

// Neo4jConnector.prototype.getNodeLabels = function (nodeId, callback)
describe("Neo4jConnector.prototype.getNodeLabels:", function () {
  describe("Call getNodeLabels", function () {
    var retrievedLabels;

    beforeEach(function(done) {
      testACL.connector.getNodeLabels(testNode1._id, function(err, labels) {
        retrievedLabels = labels;

        done();
      });
    });

    it("should return that node labels.", function (done) {
      expect(retrievedLabels).toEqual(labels1);

      done();
    });
  });
});

// Neo4jConnector.prototype.addNodeLabels = function (nodeId, labels, callback)
describe("Neo4jConnector.prototype.addNodeLabels:", function () {
  describe("Call addNodeLabels", function () {
    var addSuccess;

    beforeEach(function(done) {
      testACL.connector.addNodeLabels(testNode1._id, labels2, function(err, success) {
        addSuccess = success;

        done();
      });
    });

    it("should add labels to the given node.", function (done) {
      expect(addSuccess).toEqual(true);

      // update test node info
      testACL.connector.getNode(testNode1._id, function(err, node) {
        testNode1 = node;
      });

      done();
    });
  });
});

// Neo4jConnector.prototype.removeNodeLabels = function (nodeId, label, callback)
describe("Neo4jConnector.prototype.removeNodeLabels:", function () {
  describe("Call removeNodeLabels with a single label", function () {
    var removeSuccess;

    beforeEach(function(done) {
      testACL.connector.removeNodeLabels(testNode1._id, 'TestLabel1', function(err, success) {
        removeSuccess = success;

        done();
      });
    });

    it("should remove label from node.", function (done) {
      expect(removeSuccess).toEqual(true);

      // update test node info
      testACL.connector.getNode(testNode1._id, function(err, node) {
        testNode1 = node;
      });

      done();
    });
  });

  describe("Call removeNodeLabels with a two labels", function () {
    var removeSuccess;

    beforeEach(function(done) {
      testACL.connector.removeNodeLabels(testNode1._id, ['TestLabel1', 'TestLabel2'], function(err, success) {
        removeSuccess = success;

        done();
      });
    });

    it("should remove labels from node.", function (done) {
      expect(removeSuccess).toEqual([true, true]);

      // update test node info
      testACL.connector.getNode(testNode1._id, function(err, node) {
        testNode1 = node;
      });

      done();
    });
  });

});

// Neo4jConnector.prototype.startTransaction




// Neo4jConnector.prototype.rollbackTransaction




// Neo4jConnector.prototype.commitTransaction




describe("Neo4jConnector.prototype._getParameters:", function() {
  describe("Call _getParameters on a created node", function () {
    var retrievedParameters;

    beforeEach(function(done) {
      testACL.connector.createNode(labels1, properties1, function(err, createdNode) {
        testACL.connector._getParameters(createdNode, function (err, parameters){
          retrievedParameters = parameters;
          done();
        });
      });
    });

    it("should return only the parameters that don't start with _.", function (done) {
      expect(retrievedParameters).toBeDefined();
      expect(retrievedParameters.p1).toBeDefined();
      expect(retrievedParameters.p2).toBeDefined();
      expect(retrievedParameters._id).not.toBeDefined();
      // @todo Check if labels were inserted
      done();
    });
  });
});



// After all tests, delete nodes created for testing
// Doesn't work yet

// See afterEach!!!!

//testACL.connector.deleteNode(testNode1._id, function(err, success) {});
//testACL.connector.deleteNode(testNode2._id, function(err, success) {});
//testACL.connector.deleteNode(testNode3._id, function(err, success) {});
//testACL.connector.deleteNode(testNode4._id, function(err, success) {});

//testACL.connector.deleteRelationship(testRelationship1._id, function(err, success) {});
//testACL.connector.deleteRelationship(testRelationship2._id, function(err, success) {});
