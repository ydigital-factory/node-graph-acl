/**
 * Neo4j Connector.
 */

var async = require('async');

/**
 * Create an instance of Neo4jConnector.
 *
 * @constructor
 * @this {Neo4jConnector}
 * @param {string} db	- The database connection string. Format: http://username:password@domain:port
 */
function Neo4jConnector(db){
	if (typeof db === 'undefined') {
		this.db = 'http://localhost:7474';
	} else {
		this.db = db;
	}
}

/**
	Create a node with given properties and labels.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.createNode(callback);
		connector.createNode({p1:'v1', p2:'v2'}, callback);
		connector.createNode({p1:'v1', p2:'v2'}, ['l1','l2'], callback);

	@param {Object} properties - Node properties.
	@param {array} labels - Node labels.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.createNode = function (properties, labels, callback) {
	// To make properties and labels optional
	if (typeof callback === 'undefined') {
		if (typeof labels === 'function') {
			callback = labels;
			labels = [];
		} else if (typeof properties === 'function') {
			callback = properties;
			labels = [];
			properties = {};
		}
	} else {
		if (typeof properties === 'undefined') {
			properties = {};
		}

		if (typeof labels === 'undefined') {
			labels = [];
		}
	}

	this.db.insertNode(properties, labels, callback);
};

/**
	Get an existing node.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.getNode(1, callback);

	@param {number|string} nodeId - Node ID.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.getNode = function (nodeId, callback) {
	this.db.readNode(nodeId, callback);
};

/**
	Update an existing node with given properties and labels.
	All old properties and labels will be erased.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.updateNode(1, callback);
		connector.updateNode(1, {p1:'v1', p2:'v2'}, callback);
		connector.updateNode(1, {p1:'v1', p2:'v2'}, ['l1','l2'], callback);

	@param {number|string} nodeId - Node ID.
	@param {Object} properties - Node properties.
	@param {array} labels - Node labels.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.updateNode = function (nodeId, properties, labels, callback) {
	var db = this.db;

	async.parallel({
		updateProperties: function(cb) {
			db.updateNode(nodeId, properties, cb);
		},
		updateLabels: function(cb) {
			db.replaceLabelsFromNode(nodeId, labels, cb);
		}
  },
	function (err, results) {
		callback(err, results);
	});
};

/**
	Delete an existing node.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.deleteNode(1, callback);

	@param {number|string} nodeId - Node ID.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.deleteNode = function (nodeId, callback) {
	this.db.deleteNode(nodeId, callback);
};

/**
	Get an existing node's properties.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.getNodeProperties(1, callback);

	@param {number|string} nodeId - Node ID.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.getNodeProperties = function (nodeId, callback) {
	this.db.readNode(nodeId, function(err, node) {
		delete node['_id'];
		callback(null, node);
	});
};

/**
	Create a relationship between two nodes.
	Properties can be added to the relationship.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.addRelationship(1, 2, 'TYPE', {p1:'v1', p2:'v2'}, callback);
		connector.addRelationship(1, 2, 'TYPE', callback);

	@param {number|string} from - From Node ID.
	@param {number|string} to - To Node ID.
	@param {string} type - Relationship Type.
	@param {Object} properties - Relationship properties.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.addRelationship = function (from, to, type, properties, callback) {
	this.db.insertRelationship(from, to, type, properties, callback);
};

/**
	Get a relationship.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.getRelationship(1, callback);

	@param {number|string} relationshipId - Relationship ID.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.getRelationship = function (relationshipId, callback) {
	this.db.readRelationship(relationshipId, callback);
};

/**
	Update properties of a relationship between two nodes.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.updateRelationship(1, {p1:'v1', p2:'v2'}, callback);

	@param {number|string} relationshipId - Relationship ID.
	@param {Object} properties - Relationship properties.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.updateRelationship = function (relationshipId, properties, callback) {
	this.db.updateRelationship(relationshipId, properties, callback);
};

/**
	Remove relationship with given ID.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.removeRelationship(1, callback);

	@param {number|string} relationshipId - Relationship ID.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.removeRelationship = function (relationshipId, callback) {
	this.db.deleteRelationship(relationshipId, callback);
};


/**
	Get a relationship properties.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.getRelationshipProperties(1, callback);

	@param {number|string} relationshipId - Relationship ID.
	@param {function} callback - Callback called when finished.
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
	Get a node relationships.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		options = {
    		types: ['TEST', ...] // optional
    		direction: 'in' // optional, alternative 'out', defaults to 'all'
    }
		connector.getNodeRelationships(1, options, callback);
		connector.getNodeRelationships(1, {}, callback);

	@param {number|string} nodeId - Node ID.
	@param {string} options - Type of relationship: 'in', 'out' or 'all' (Default). Optional.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.getNodeRelationships = function (nodeId, options, callback) {
	this.db.readRelationshipsOfNode(nodeId, options, callback);
};

/**
	Add properties to a node.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.addNodeProperties(1, {p1:'v1', p2:'v2'}, callback);

	@param {string|number} nodeId - Node ID.
	@param {Object} properties - Node properties to add.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.addNodeProperties = function (nodeId, properties, callback) {
	var _this = this;

	_this.getNodeProperties(nodeId, function(err, existingProperties) {
		for (var key in properties) {
			existingProperties[key] = properties[key];
		}

		_this.getNodeLabels(nodeId, function(err, existingLabels) {
			_this.updateNode(nodeId, existingProperties, existingLabels, callback);
		});
	});
};

/**
	Update properties of a node.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.updateNodeProperties(1, {p1:'v1', p2:'v2'}, callback);

	@param {string|number} nodeId - Node ID.
	@param {Object} properties - Node properties to replace with.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.updateNodeProperties = function (nodeId, properties, callback) {
	var _this = this;

	_this.getNodeLabels(nodeId, function(err, existingLabels) {
		_this.updateNode(nodeId, properties, existingLabels, callback);
	});
};

/**
	Removes properties from a node.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.removeNodeProperties(1, ['p1', 'p2'], callback);

	@param {string|number} nodeId - Node ID.
	@param {Object} properties - Node properties to remove.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.removeNodeProperties = function (nodeId, properties, callback) {
	var _this = this;

	_this.getNodeProperties(nodeId, function(err, existingProperties) {
		for (var key in properties) {
			delete existingProperties[key];
		}
		_this.getNodeLabels(nodeId, function(err, existingLabels) {
			_this.updateNode(nodeId, existingProperties, existingLabels, callback);
		});
	});
};

/**
	Add properties to a relationship.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.addRelationshipProperties(1, {p1:'v1', p2:'v2'}, callback);

	@param {string|number} relationshipId - Relationship ID.
	@param {Object} properties - Relationship properties to add.
	@param {function} callback - Callback called when finished.
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
	Update properties of a relationship.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.updateRelationshipProperties(1, {p1:'v1', p2:'v2'}, callback);

	@param {number|string} relationshipId - Relationship ID.
	@param {Object} properties - Relationship properties.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.updateRelationshipProperties = function (relationshipId, properties, callback) {
	this.updateRelationship(relationshipId, properties, callback);
};

/**
	Remove properties from a relationship.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.removeRelationshipProperties(1, ['p1', 'p2'], callback);

	@param {string|number} relationshipId - Relationship ID.
	@param {Object} properties - Relationship properties to remove.
	@param {function} callback - Callback called when finished.
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
	Get a node labels.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.getNodeLabels(1, callback);

	@param {number|string} nodeId - Node ID.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.getNodeLabels = function (nodeId, callback) {
	this.db.readLabels(nodeId, callback);
};

/**
	Add labels to a node.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.addNodeLabels(1, ['l1', 'l2'], callback);

	@param {number|string} nodeId - Node ID.
	@param {array} labels - Labels to add.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.addNodeLabels = function (nodeId, labels, callback) {
	this.db.addLabelsToNode(nodeId, labels, callback);
};

/**
	Remove a label from a node.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.removeNodeLabel(1, ['l1', 'l2'], callback);

	@param {number|string} nodeId - Node ID.
	@param {string} label - Label to remove.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.removeNodeLabel = function (nodeId, label, callback) {
	// @todo with assync, make it possible to remove several labels
	this.db.deleteLabelFromNode(nodeId, label, callback);
};


/*	Get all nodes with a label
	Given a label (non-empty string)
	returns an array of nodes with that label
	Examples:
	readNodesWithLabel('User', callback);
		returns an array with nodes with the label 'User'
	deleteLabelFromNode('DoesNotExist', callback);
		returns an empty array	 */
/**
	Get Nodes with label.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.getNodesWithLabel('Test', callback);

	@param {string} label - Label to search.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.getNodesWithLabel = function (label, callback) {
	this.db.readNodesWithLabel(label, callback);
}


/*	Get all nodes with labels and properties
	Given one label (non-empty string) or multiple labels (array of strings) and one or more properties in json
	returns an array of nodes with these labels and properties
	Examples:
	readNodesWithLabelsAndProperties('User',{ firstname: 'Sam', male: true }, callback);
		returns an array with nodes with the label 'User' and properties firstname='Sam' and male=true
	readNodesWithLabelsAndProperties(['User','Admin'], { 'name': 'DoesNotExist'}, callback);
		returns an empty array	 		*/

Neo4jConnector.prototype.getNodesWithLabelAndProperties = function (labels, properties, callback) {
	this.db.readNodesWithLabelsAndProperties(labels, properties, callback);
}










module.exports = Neo4jConnector;
