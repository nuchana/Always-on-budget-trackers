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

