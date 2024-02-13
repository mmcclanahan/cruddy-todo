const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
//var Promise = require('bluebird');


var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////


//fill in parameters for getNextUniqueID
//use uniqueID to create file
//fs.writeFile function params: filepath, data, callback
//filepath: exports.dataDir, data: .txt
//path.join(exports.dataDir, id)           filename === id  inside === data
//testmessage
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, value) => {
    //if there is an error, we pass it into the callback to make value 0
    if (err) {
      callback(err);
    }
    var filePath = path.join(exports.dataDir, `${value}.txt`);
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
//the data directory holds files each filename is the value === ##### and inside the file is a string text
//read our data folder, build list of files: storing files in array
//create list = [];
//DO NOT READ File contents
//
//promisifing readall
//
// within our map iteration, fs.readFile for each file
// Use Promise.all to have an array with promises from each file
//[readDir, readFile] when completes -> [id, inside text]

//when using Promise.promisfy() paramater must be just the function / not including its expected parameters
//var readit = Promise.promisify(fs.readFile); // now can use readit with expected arguments
exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    //if statement to callback err
    if (err) {
      callback(err);
    }
    var PromiseForEachFileList = files.map((currentFileName) => {
      // get filepath for each file
      var filePath = path.join(exports.dataDir, currentFileName);
      // make readfile a promise to then assert values of keys in file
      var realId = currentFileName.slice(0, currentFileName.length - 4);
      //fs.promise returns Promise objects rather than using cbs
      //fs.promises.readfile
      return fs.promises.readFile(filePath, 'utf8')
        .then(text => (
          {'id': realId, 'text': text}
        ));
    });
    Promise.all(PromiseForEachFileList)
      .then((values) => callback(null, values))
      .catch((errors) => callback(errors));

    //callback(null, fileList);
  });

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

};
//read a todo item from the data directory based on the id
//read the contents of the todo item file
//give the contents to the client

//get filepath via path.join (see above)
//fs.readfile method (filepath, (err, text) )

exports.readOne = (id, callback) => {
  const filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, 'utf8', (err, text) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {'id': id, 'text': text});
    }
  });
  /*
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
  */
};

//set up path
//fs.readfile (only to callback(errors) if file dne)
//if error, catch err with callback
//else, fs.writefile, somehow take in user input


exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(filePath, text, 'utf8', (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, {'id': id, 'text': text});
        }
      });
    }
  });

  /*
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
  */
};
// make filePath
//fs.rm(path, callback for error)
exports.delete = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.rm(filePath, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });

  /*
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
  */
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
