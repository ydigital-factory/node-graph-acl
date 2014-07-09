/**
Neo4j Connector.
*/

var async = require('async');

function Neo4jConnector(db){
	this.db = db;
}

Neo4jConnector.prototype.createNode = function (properties, labels, callback) {
	if (typeof properties === 'undefined') {
		properties = {};
	}

	if (typeof labels === 'undefined') {
		labels = [];
	}

	if (typeof callback === 'undefined') {
		callback = function(err, node){
			if (err) {
				throw err;
			}
		};
	}

	var node = this.db.insertNode(properties, labels, callback);
};

Neo4jConnector.prototype.updateNode = function () {

};

Neo4jConnector.prototype.deleteNode = function () {

};

Neo4jConnector.prototype.getNode = function () {

};

Neo4jConnector.prototype.getNodes = function () {

};

Neo4jConnector.prototype.getNodeRelationships = function () {

};

Neo4jConnector.prototype.getNodeProperties = function () {

};

Neo4jConnector.prototype.getNodeRelationshipsProperties = function () {

};

Neo4jConnector.prototype.addRelationship = function () {

};

Neo4jConnector.prototype.updateRelationship = function () {

};

Neo4jConnector.prototype.removeRelationship = function () {

};

Neo4jConnector.prototype.getRelationshipProperties = function () {

};

Neo4jConnector.prototype.addProperty = function () {

};

Neo4jConnector.prototype.updateProperty = function () {

};

Neo4jConnector.prototype.removeProperty = function () {

};

Neo4jConnector.prototype.addLabel = function () {

};

Neo4jConnector.prototype.removeLabel = function () {

};

module.exports = Neo4jConnector;
