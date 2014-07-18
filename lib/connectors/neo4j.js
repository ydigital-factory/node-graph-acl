/**
 * Neo4j Connector.
 */

var async = require('async');

/**
 * Creates an instance of Neo4jConnector.
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
	Creates a node with given properties and labels.

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
	Creates a relationship between two nodes.
	Properties can be added to the relationship.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.addRelationship(1, 2, 'TYPE', {p1:'v1', p2:'v2'}, callback);
		connector.addRelationship(1, 2, 'TYPE', callback);

	@param {number|string} from - From Node ID.
	@param {number|string} to - To Node ID.
	@param {string} type - Relationship Type.
	@param {Object} properties - Node ID.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.addRelationship = function (from, to, type, properties, callback) {
	this.db.insertRelationship(from, to, type, properties, callback);
};

Neo4jConnector.prototype.updateRelationship = function (relationshipId, properties, callback) {
	this.db.updateRelationship(relationshipId, properties, callback);
};

Neo4jConnector.prototype.removeRelationship = function (relationshipId, callback) {
	this.db.deleteRelationship(relationshipId, callback);
};

/**
	Retrieves a relationship.

	Examples:
		connector = new Neo4jConnector('http://localhost:7474');
		connector.getRelationship(1, callback);

	@param {number|string} relationshipId - Relationship ID.
	@param {function} callback - Callback called when finished.
*/
Neo4jConnector.prototype.getRelationship = function (relationshipId, callback) {
	this.db.readRelationship(relationshipId, callback);
};

Neo4jConnector.prototype.getRelationshipProperties = function (relationshipId, callback) {
	this.db.readRelationship(relationshipId, function(err, relationship) {
		delete relationship['_id'];
		delete relationship['_type'];
		delete relationship['_start'];
		delete relationship['_end'];
		callback(null, relationship);
	});
};

// option(not mandatory): in or out
Neo4jConnector.prototype.getNodeRelationships = function (nodeId, option, callback) {
	if (typeof callback === 'undefined') {
		callback = option;
		option = undefined;
	}
	this.db.readRelationshipsOfNode(nodeId, option, callback);
};

Neo4jConnector.prototype.getNodeRelationshipsProperties = function () {

};

Neo4jConnector.prototype.addProperty = function () {

};

Neo4jConnector.prototype.updateProperty = function () {

};

Neo4jConnector.prototype.removeProperty = function () {

};

// pre-tested
Neo4jConnector.prototype.getLabels = function (nodeId, callback) {
	this.db.readLabels(nodeId, callback);
};

Neo4jConnector.prototype.addLabel = function (nodeId, labels, callback) {
	this.db.addLabelsToNode(nodeId, labels, callback);
};

Neo4jConnector.prototype.removeLabel = function (nodeId, label, callback) {
	this.db.deleteLabelFromNode(nodeId, label, callback);
};

Neo4jConnector.prototype.startTransaction = function () {
	this.db.beginTransaction();
};

Neo4jConnector.prototype.rollbackTransaction = function () {
	this.db.rollbackTransaction();
};

Neo4jConnector.prototype.commitTransaction = function () {
	this.db.commitTransaction();
};

module.exports = Neo4jConnector;
