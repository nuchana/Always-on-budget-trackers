const indexedDB = window.indexedDB;

let db;
// open budget database
const request = indexedDB.open("budget",1);

request.onupgradeneeded = function(event){
    let db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
    //IDBDatabase.createObjectStore(name, options). Options are optional parameters including keypath or autoIncrement
    //autoIncrement = if true, the object store has a key generator. Defaults to false. 
};

request.onsuccess = function(event){
    db = event.target.result;

    //check if app is online befoer reading from db
    if (navigator.online) {
        checkDatabase();
    }
};

request.onerror = function(event) {
    console.log ("Database error:" + event.target.errorCode);
};

function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");
  
    // access your pending object store
    const store = transaction.objectStore("pending");
  
    // add record to your store with add method.
    store.add(record);
  }
  
  function checkDatabase() {
    // open a transaction on your pending db
    const transaction = db.transaction(["pending"], "readwrite");
    // access your pending object store
    const store = transaction.objectStore("pending");
    // get all records from store and set to a variable
    const getAll = store.getAll();
  
    getAll.onsuccess = function() {
      if (getAll.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        })
        .then(response => response.json())
        .then(() => {
          // if successful, open a transaction on your pending db
          const transaction = db.transaction(["pending"], "readwrite");
  
          // access your pending object store
          const store = transaction.objectStore("pending");
  
          // clear all items in your store
          store.clear();
        });
      }
    };
  }

