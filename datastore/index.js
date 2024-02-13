const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////


//fill in parameters for getNextUniqueID
//use uniqueID to create file
//fs.writeFile function params: filepath, data, callback
//filepath: exports.dataDir, data: .txt
//path.join(exports.dataDir, id)           filename === id  inside === data
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, value) => {
    //if there is an error, we pass it into the callback to make value 0
    if (err) {
      callback(err);
    }
    var filePath = path.join(exports.dataDir, `${value}.txt` );
    fs.writeFile(filePath, text, (err) => {
      //if
      if (err) {
        throw ('file not found');
      } else {
        //somehow store our value and text data
        callback(null, {id: value, text: text});
      }
    });

  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
  });
};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
