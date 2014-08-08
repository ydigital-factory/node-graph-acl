"use strict";
/**
 * Neo4j Connector.
 */

var async = require('async');

/**
 * Create an instance of Neo4jConnector.
 *
 * Examples:
 *   var neo4j = require('node-neo4j');
 *   var acl = require('node-graph-acl');
 *   var db = new neo4j('http://localhost:7474');
 *   var connector = new acl.neo4jConnector(db);
 *
 * @constructor
 * @this {Neo4jConnector}
 * @param {string} db - The database connection string. Format: http://username:password@domain:port
 */
function Neo4jConnector(db){
  if (typeof db === 'undefined') {
    this.db = 'http://localhost:7474';
  } else {
    this.db = db;
  }
}

/**
 * Create a node with given labels and properties.
 *
 * Examples:
 *   connector.createNode(callback);
 *   connector.createNode(['l1','l2'], callback);
 *   connector.createNode(['l1','l2'], {p1:'v1', p2:'v2'},, callback);
 *
 * @param {Array} labels - Node labels.
 * @param {Object} properties - Node properties.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.createNode = function (labels, properties, callback) {
  // To make properties and labels optional
  if (typeof callback === 'undefined') {
    if (typeof properties === 'function') {
      callback = properties;
      properties = {};
    } else if (typeof labels === 'function') {
      callback = labels;
      properties = {};
      labels = [];
    }
  } else {
    if (typeof labels === 'undefined') {
      labels = [];
    }

    if (typeof properties === 'undefined') {
      properties = {};
    }
  }

  this.db.insertNode(properties, labels, callback);
};

/**
 * Get an existing node.
 *
 * Examples:
 *   connector.getNode(1, callback);
 *
 * @param {Number|String} nodeId - Node ID.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.getNode = function (nodeId, callback) {
  this.db.readNode(nodeId, callback);
};

/**
 * Get Nodes with given label.
 *
 * Examples:
 *   connector.getNodesWithLabel('Test', callback);
 *
 * @param {String} label - Label to search.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.getNodesWithLabel = function (label, callback) {
  this.db.readNodesWithLabel(label, callback);
};

/**
 * Get Nodes with given properties.
 *
 * Examples:
 *   connector.getNodesWithProperties({p1: 'v1', p2: 'v2'}, callback);
 *
 * @param {Object} properties - Properties to search.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.getNodesWithProperties = function (properties, callback) {
  this.db.readNodesWithProperties(properties, callback);
};

/**
 * Get Nodes with given labels and properties.
 *
 * Examples:
 *   connector.getNodesWithLabelsAndProperties('Label', {p1: 'v1', p2: 'v2'}, callback);
 *   connector.getNodesWithLabelsAndProperties(['Label1', 'Label2'], {p1: 'v1', p2: 'v2'}, callback);
 *
 *  @param {String|Array} labels - Labels to search.
 *  @param {Object} properties - Properties to search.
 *  @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.getNodesWithLabelsAndProperties = function (labels, properties, callback) {
  this.db.readNodesWithLabelsAndProperties(labels, properties, callback);
};

/**
 * Get existence of Nodes with given label.
 *
 * Examples:
 *   connector.existsNodeWithLabel('Test', callback);
 *
 * @param {String} label - Label to search.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.existsNodeWithLabel = function (label, callback) {
  this.db.readNodesWithLabel(label, function(err, roles) {
    if ((typeof roles !== 'undefined') && (roles.length > 0)) {
      callback(err, true);
    } else {
      callback(err, false);
    }
  });
};

/**
 * Get existence of Nodes with given properties.
 *
 * Examples:
 *   connector.existsNodeWithProperties({p1: 'v1', p2: 'v2'}, callback);
 *
 * @param {Object} properties - Properties to search.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.existsNodeWithProperties = function (properties, callback) {
  this.db.readNodesWithProperties(properties, function(err, roles) {
    if ((typeof roles !== 'undefined') && (roles.length > 0)) {
      callback(err, true);
    } else {
      callback(err, false);
    }
  });
};

/**
 * Get existence of Nodes with given labels and properties.
 *
 * Examples:
 *   connector.existsNodeWithLabelsAndProperties('Label', {p1: 'v1', p2: 'v2'}, callback);
 *   connector.existsNodeWithLabelsAndProperties(['Label1', 'Label2'], {p1: 'v1', p2: 'v2'}, callback);
 *
 * @param {String|Array} labels - Labels to search.
 * @param {Object} properties - Properties to search.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.existsNodeWithLabelsAndProperties = function (labels, properties, callback) {
  this.db.readNodesWithLabelsAndProperties(labels, properties, function(err, roles) {
    if ((typeof roles !== 'undefined') && (roles.length > 0)) {
      callback(err, true);
    } else {
      callback(err, false);
    }
  });
};

/**
 * Update an existing node with given labels and properties.
 *   All old properties and labels will be erased.
 *
 * Examples:
 *   connector.updateNode(1, callback);
 *   connector.updateNode(1, ['l1','l2'], callback);
 *   connector.updateNode(1, ['l1','l2'], {p1:'v1', p2:'v2'}, callback);
 *
 * @param {Number|String} nodeId - Node ID.
 * @param {Array} labels - Node labels.
 * @param {Object} properties - Node properties.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.updateNode = function (nodeId, labels, properties, callback) {
  var db = this.db;

  async.parallel({
    updateLabels: function(cb) {
      db.replaceLabelsFromNode(nodeId, labels, cb);
    },
    updateProperties: function(cb) {
      db.updateNode(nodeId, properties, cb);
    }
  },
  function (err, results) {
    callback(err, results);
  });
};

/**
 * Delete an existing node.
 *
 * Examples:
 *   connector.deleteNode(1, callback);
 *
 * @param {Number|String} nodeId - Node ID.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.deleteNode = function (nodeId, callback) {
  this.db.deleteNode(nodeId, callback);
};

/**
 * Get an existing node's properties.
 *
 * Examples:
 *   connector.getNodeProperties(1, callback);
 *
 * @param {Number|String} nodeId - Node ID.
 * @param {Function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.getNodeProperties = function (nodeId, callback) {
  this.db.readNode(nodeId, function(err, node) {
    delete node['_id'];
    callback(null, node);
  });
};

/**
 * Create a relationship between two nodes.
 * Properties can be added to the relationship.
 *
 * Examples:
 *   connector.addRelationship(1, 2, 'TYPE', {p1:'v1', p2:'v2'}, callback);
 *   connector.addRelationship(1, 2, 'TYPE', callback);
 *
 * @param {Number|String} from - From Node ID.
 * @param {Number|String} to - To Node ID.
 * @param {String} type - Relationship Type.
 * @param {Object} properties - Relationship properties.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.addRelationship = function (from, to, type, properties, callback) {
  if (typeof callback === 'undefined') {
    if (typeof properties === 'function') {
      callback = properties;
      properties = {};
    }
  }

  this.db.insertRelationship(from, to, type, properties, callback);
};

/**
 * Get a relationship.
 *
 * Examples:
 *   connector.getRelationship(1, callback);
 *
 * @param {Number|String} relationshipId - Relationship ID.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.getRelationship = function (relationshipId, callback) {
  this.db.readRelationship(relationshipId, callback);
};

/**
 * Update properties of a relationship between two nodes.
 *
 * Examples:
 *   connector.updateRelationship(1, {p1:'v1', p2:'v2'}, callback);
 *
 * @param {Number|String} relationshipId - Relationship ID.
 * @param {Object} properties - Relationship properties.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.updateRelationship = function (relationshipId, properties, callback) {
  this.db.updateRelationship(relationshipId, properties, callback);
};

/**
 * Remove relationship with given ID.
 *
 * Examples:
 *   connector.removeRelationship(1, callback);
 *
 * @param {Number|String} relationshipId - Relationship ID.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.removeRelationship = function (relationshipId, callback) {
  this.db.deleteRelationship(relationshipId, callback);
};


/**
 * Get a relationship properties.
 *
 * Examples:
 *   connector.getRelationshipProperties(1, callback);
 *
 * @param {Number|String} relationshipId - Relationship ID.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.getRelationshipProperties = function (relationshipId, callback) {
  this.db.readRelationship(relationshipId, function(err, relationship) {
    var properties = relationship;
    delete properties['_id'];
    delete properties['_type'];
    delete properties['_start'];
    delete properties['_end'];
    callback(null, properties);
  });
};

/**
 * Get a node relationships.
 *
 * Examples:
 *   var options = {
 *     types: ['TEST', ...] // optional
 *     direction: 'in' // optional, alternative 'out', defaults to 'all'
 *   }
 *   connector.getNodeRelationships(1, options, callback);
 *   connector.getNodeRelationships(1, {}, callback);
 *
 * @param {Number|String} nodeId - Node ID.
 * @param {String} options - Type of relationship: 'in', 'out' or 'all' (Default). Optional.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.getNodeRelationships = function (nodeId, options, callback) {
  this.db.readRelationshipsOfNode(nodeId, options, callback);
};

/**
 * Get Relationships between two nodes.
 *
 * Examples:
 *   connector.getRelationshipBetweenNodes(1, 2, callback);
 *   connector.getRelationshipBetweenNodes(1, 2, 'TYPE', callback);
 *
 * @param {Number|String} from - From Node.
 * @param {Number|String} to - To Node.
 * @param {String} type - Relationship Type.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.getRelationshipsBetweenNodes = function (from, to, type, callback) {
  if (typeof callback === 'undefined') {
    if (typeof type === 'function') {
      callback = type;
      type = undefined;
    }
  }

  var options = {};
  if (typeof type === 'undefined') {
    options.types = [type];
  }

  var finalRelationships = [];
  this.db.readRelationshipsOfNode(from, options, function (err, relationships) {
    async.map(
      relationships, // Array
      function(relationship, cb){
        if (relationship._start === from && relationship._end === to) {
          finalRelationships.push(relationship);
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
      function(err, results){
        if (finalRelationships.length === 1) {
          callback(err, finalRelationships[0]);
        } else {
          callback(err, finalRelationships);
        }
      }
    );
  });
};

/**
 * Get existence of Relationships between two nodes.
 *
 * Examples:
 *   connector.getRelationshipBetweenNodes(1, 2, callback);
 *   connector.getRelationshipBetweenNodes(1, 2, 'TYPE', callback);
 *
 * @param {Number|String} from - From Node.
 * @param {Number|String} to - To Node.
 * @param {String} type - Relationship Type.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.existsRelationshipsBetweenNodes = function (from, to, type, callback) {
  if (typeof callback === 'undefined') {
    if (typeof type === 'function') {
      callback = type;
      type = undefined;
    }
  }

  var options = {};
  if (typeof type === 'undefined') {
    options.types = [type];
  }

  this.db.readRelationshipsOfNode(from, options, function (err, relationships) {
    if ((typeof relationships !== 'undefined') && (relationships.length > 0)) {
      var exists = false;

      //@todo: take into account type
      relationships.forEach(function(relationship) {
        if ((from === relationship._start) && (to === relationship._end)) {
          exists = true;
        }
      });

      callback(err, exists);
    } else {
      callback(err, false);
    }
  });
};

/**
 * Add properties to a node.
 *
 * Examples:
 *   connector.addNodeProperties(1, {p1:'v1', p2:'v2'}, callback);
 *
 * @param {String|Number} nodeId - Node ID.
 * @param {Object} properties - Node properties to add.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.addNodeProperties = function (nodeId, properties, callback) {
  var _this = this;

  _this.getNodeProperties(nodeId, function(err, existingProperties) {
    for (var key in properties) {
      existingProperties[key] = properties[key];
    }

    _this.getNodeLabels(nodeId, function(err, existingLabels) {
      _this.updateNode(nodeId, existingLabels, existingProperties, callback);
    });
  });
};

/**
 * Update properties of a node.
 *
 * Examples:
 *   connector.updateNodeProperties(1, {p1:'v1', p2:'v2'}, callback);
 *
 * @param {String|Number} nodeId - Node ID.
 * @param {Object} properties - Node properties to replace with.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.updateNodeProperties = function (nodeId, properties, callback) {
  var _this = this;

  _this.getNodeLabels(nodeId, function(err, existingLabels) {
    _this.updateNode(nodeId, existingLabels, properties, callback);
  });
};

/**
 * Removes properties from a node.
 *
 * Examples:
 *   connector.removeNodeProperties(1, ['p1', 'p2'], callback);
 *
 * @param {Number|String} nodeId - Node ID.
 * @param {Object} properties - Node properties to remove.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.removeNodeProperties = function (nodeId, properties, callback) {
  var _this = this;

  _this.getNodeProperties(nodeId, function(err, existingProperties) {
    for (var key in properties) {
      delete existingProperties[key];
    }
    _this.getNodeLabels(nodeId, function(err, existingLabels) {
      _this.updateNode(nodeId, existingLabels, existingProperties, callback);
    });
  });
};

/**
 * Add properties to a relationship.
 *
 * Examples:
 *   connector.addRelationshipProperties(1, {p1:'v1', p2:'v2'}, callback);
 *
 * @param {Number|String} relationshipId - Relationship ID.
 * @param {Object} properties - Relationship properties to add.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.addRelationshipProperties = function (relationshipId, properties, callback) {
  var _this = this;

  _this.getRelationshipProperties(relationshipId, function(err, existingProperties) {
    for (var key in properties) {
      existingProperties[key] = properties[key];
    }

    _this.updateRelationship(relationshipId, existingProperties, callback);
  });
};

/**
 * Update properties of a relationship.
 *
 * Examples:
 *   connector.updateRelationshipProperties(1, {p1:'v1', p2:'v2'}, callback);
 *
 * @param {Number|String} relationshipId - Relationship ID.
 * @param {Object} properties - Relationship properties.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.updateRelationshipProperties = function (relationshipId, properties, callback) {
  this.updateRelationship(relationshipId, properties, callback);
};

/**
 * Remove properties from a relationship.
 *
 * Examples:
 *   connector.removeRelationshipProperties(1, ['p1', 'p2'], callback);
 *
 * @param {Number|String} relationshipId - Relationship ID.
 * @param {Object} properties - Relationship properties to remove.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.removeRelationshipProperties = function (relationshipId, properties, callback) {
  var _this = this;

  _this.getNodeProperties(relationshipId, function(err, existingProperties) {
    for (var key in properties) {
      delete existingProperties[key];
    }

    _this.updateRelationship(relationshipId, existingProperties, callback);
  });
};

/**
 * Get a node labels.
 *
 * Examples:
 *   connector.getNodeLabels(1, callback);
 *
 * @param {Number|String} nodeId - Node ID.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.getNodeLabels = function (nodeId, callback) {
  this.db.readLabels(nodeId, callback);
};

/**
 * Add labels to a node.
 *
 * Examples:
 *   connector.addNodeLabels(1, ['l1', 'l2'], callback);
 *
 * @param {Number|String} nodeId - Node ID.
 * @param {Array} labels - Labels to add.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.addNodeLabels = function (nodeId, labels, callback) {
  this.db.addLabelsToNode(nodeId, labels, callback);
};

/**
 * Remove a label from a node.
 *
 * Examples:
 *   connector.removeNodeLabel(1, 'l1', callback);
 *   connector.removeNodeLabel(1, ['l1', 'l2'], callback);
 *
 * @param {Number|String} nodeId - Node ID.
 * @param {String|Array} labels - Labels to remove.
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype.removeNodeLabels = function (nodeId, labels, callback) {
  var _this = this;

  // When only one label in string format, transform it to array
  if (!(labels instanceof Array)) {
    labels = [labels];
  }

  async.map(
    labels, // Array
    function(label, cb){
      _this.db.deleteLabelFromNode(nodeId, label, cb);
    },
    function(err, results){
      if (results.length === 1) {
        callback(err, results[0]);
      } else {
        callback(err, results);
      }
    }
  );
};

/**
 * Get object parameters after extracting all _* parameters
 *
 * Examples:
 *   connector._getParameters(node, callback);
 *
 * @param {Object} object - Object. Can be a node, a relationship, or any object
 * @param {Function} callback - Callback called when finished.
 */
Neo4jConnector.prototype._getParameters = function (node, callback) {
  for (var key in node) {
    if (key.indexOf('_') === 0) {
      delete node[key];
    }
  }
  callback(null, node);
};

module.exports = Neo4jConnector;
