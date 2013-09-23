/**
 * @file A module for interacting with the DB.
 */

var forecastDB = (function() {
  var fDB = {};
  var datastore = null;

  /**
   * Open a connection to the datastore.
   */
  fDB.open = function(callback) {
    // Database version.
    var version = 1;

    // Open a connection to the datastore.
    var request = indexedDB.open('forecastarray', version);

    // Handle datastore upgrades.
    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      e.target.transaction.onerror = fDB.onerror;

      // Delete the old datastore.
      if (db.objectStoreNames.contains('forecast')) {
        db.deleteObjectStore('forecast');
      }

      // Create a new datastore.
      var store = db.createObjectStore('forecast', {
        keyPath: 'timestamp'
      });
    };

    // Handle successful datastore access.
    request.onsuccess = function(e) {

      // Get a reference to the DB.
      datastore = e.target.result;

      // Execute the callback.
      callback();
    };

    // Handle errors when opening the datastore.
    request.onerror = fDB.onerror;
  };


  /**
   * Fetch all of the items in the datastore.
   * @param {function} callback. A function that will be executed once the items
   * have been retrieved. Will be passed a param with an array of items.
   */
  fDB.fetchForecastArray = function(callback) {
    var db = datastore;
    var transaction = db.transaction(['forecast'], 'readwrite');
    var objStore = transaction.objectStore('forecast');

    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objStore.openCursor(keyRange);

    var forecastarray = [];

    transaction.oncomplete = function(e) {
      // Execute the callback function.
      callback(forecastarray);
    };

    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;

      if (!!result == false) {
        return;
      }

      forecastarray.push(result.value);

      result.continue();
    };

    cursorRequest.onerror = fDB.onerror;
  };


  /**
   * Create a new item.
   * @param {object} the item.
   */
  fDB.createForecast = function(forecast, callback) {
    // Get a reference to the db.
    var db = datastore;

    // Initiate a new transaction.
    var transaction = db.transaction(['forecast'], 'readwrite');

    // Get the datastore.
    var objStore = transaction.objectStore('forecast');

    // Create a timestamp for the item.
    var timestamp = new Date().getTime();

    // Create an object for the item.
    var forecast = {
      'forecast': forecast,
      'timestamp': timestamp
    };

    // Create the datastore request.
    var request = objStore.put(forecast);

    // Handle a successful datastore put.
    request.onsuccess = function(e) {
      // Execute the callback function.
      callback(forecast);
    };

    // Handle errors.
    request.onerror = fDB.onerror;
  };


  /**
   * Delete an item.
   * @param {int} id The timestamp (id) of the item to be deleted.
   * @param {function} callback A callback function that will be
   * executed if the delete is successful.
   */
  fDB.deleteForecast = function(id, callback) {
    var db = datastore;
    var transaction = db.transaction(['forecast'], 'readwrite');
    var objStore = transaction.objectStore('forecast');

    var request = objStore.delete(id);

    request.onsuccess = function(e) {
      callback();
    }

    request.onerror = function(e) {
      //console.log(e);
    }
  };


  // Export the tDB object.
  return fDB;
}());
