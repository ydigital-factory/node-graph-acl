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
	createNode(userId, roles, function(err) )

	Adds roles to a given user id.

	@param {String|Number} User id.
	@param {String|Array} Role(s) to add to the user id.
	@param {Function} Callback called when finished.
	@return {Boolean}
*/
Neo4jConnector.prototype.createNode = function (properties, labels, callback) {
	if (typeof properties === 'undefined') {
		properties = {};
	}

	if (typeof labels === 'undefined') {
		labels = [];
	}

	if (typeof callback === 'undefined') {
		callback = function(err, node) {
			console.log('Error:' + err);
			console.log('Node:' + node);
		};
	}

	this.db.insertNode(properties, labels, callback);
};

// tested
Neo4jConnector.prototype.updateNode = function (nodeId, properties, labels, cb) {
	var db = this.db;
	async.parallel({
		updateProperties: function(callback) {
			db.updateNode(nodeId, properties, callback);
		},
		updateLabels: function(callback) {
			db.replaceLabelsFromNode(nodeId, labels, callback);
		}
  },
	function (err, results) {
		cb(err, results);
	});
};

// tested
Neo4jConnector.prototype.deleteNode = function (nodeId, callback) {
	this.db.deleteNode(nodeId, callback);
};

// tested
Neo4jConnector.prototype.getNode = function (nodeId, callback) {
	this.db.readNode(nodeId, callback);
};

// tested
Neo4jConnector.prototype.getNodeProperties = function (nodeId, callback) {
	this.db.readNode(nodeId, function(err, node) {
		delete node['_id'];
		callback(null, node);
	});
};

Neo4jConnector.prototype.addRelationship = function (from, to, type, properties, callback) {
	this.db.insertRelationship(from, to, type, properties, callback);
};

Neo4jConnector.prototype.updateRelationship = function (relationship, properties, callback) {
	this.db.updateRelationship(relationship, properties, callback);
};

Neo4jConnector.prototype.removeRelationship = function (relationship, callback) {
	this.db.deleteRelationship(relationship, callback);
};

Neo4jConnector.prototype.getRelationship = function (relationship, callback) {
	this.db.readRelationship(relationship, callback);
};

Neo4jConnector.prototype.getRelationshipProperties = function () {

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
