var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');

BondProvider = function() {
  var that = this;
  mongodbUri = process.env.MONGOLAB_URI || 'mongodb://mongodb';
  MongoClient.connect(mongodbUri, function(err, db){
    if(err) { return console.dir(err); }
    that.db = db;
  })
};


BondProvider.prototype.getCollection= function(callback) {
  this.db.collection('bonds', function(error, bond_collection) {
    if( error ) callback(error);
    else callback(null, bond_collection);
  });
};

//find all bonds
BondProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, bond_collection) {
      if( error ) callback(error)
      else {
        bond_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//find an bond by ID
BondProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, bond_collection) {
      if( error ) callback(error)
      else {
        bond_collection.findOne({_id: bond_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};


//save new bond
BondProvider.prototype.save = function(bonds, callback) {
    this.getCollection(function(error, bond_collection) {
      if( error ) callback(error)
      else {
        if( typeof(bonds.length)=="undefined")
          bonds = [bonds];

        for( var i =0;i< bonds.length;i++ ) {
          bond = bonds[i];
          bond.created_at = new Date();
        }

        bond_collection.insert(bonds, function() {
          callback(null, bonds);
        });
      }
    });
};

// update an bond
BondProvider.prototype.update = function(bondId, bonds, callback) {
    this.getCollection(function(error, bond_collection) {
      if( error ) callback(error);
      else {
        bond_collection.update(
					{_id: bond_collection.db.bson_serializer.ObjectID.createFromHexString(bondId)},
					bonds,
					function(error, bonds) {
						if(error) callback(error);
						else callback(null, bonds)
					});
      }
    });
};

//delete bond
BondProvider.prototype.delete = function(bondId, callback) {
	this.getCollection(function(error, bond_collection) {
		if(error) callback(error);
		else {
			bond_collection.remove(
				{_id: bond_collection.db.bson_serializer.ObjectID.createFromHexString(bondId)},
				function(error, bond){
					if(error) callback(error);
					else callback(null, bond)
				});
			}
	});
};

exports.BondProvider = BondProvider;
