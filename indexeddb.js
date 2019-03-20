//the database reference
let db;

//initializes the database
function initDatabase() {

	//create a unified variable for the browser variant
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

		//if a variant wasn't found, let the user know
	if (!window.indexedDB) {
			window.alert("Your browser doesn't support a stable version of IndexedDB.")
	}

   //attempt to open the database
	let request = window.indexedDB.open("guest", 1);
	request.onerror = function(event) {
		console.log(event);
	};

   //map db to the opening of a database
	request.onsuccess = function(event) { 
		db = request.result;
		console.log("success: " + db);
      readAll();
	};

   //if no database, create one and fill it with data
	request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore("guest", {keyPath: "email"});
      
   }
}

//adds a record as entered in the form
function add() {

	//get a reference to the fields in html
	let FirstName = document.querySelector("#FirstName").value;
	let LastName = document.querySelector("#LastName").value;
	let email = document.querySelector("#email").value;
	let Notes = document.querySelector("#Notes").value;

   

	//alert(id + name + email + age);
   
   //create a transaction and attempt to add data
	var request = db.transaction(["guest"], "readwrite")
	.objectStore("guest")
	.add({ FirstName:FirstName, LastName: LastName, email: email, Notes: Notes });

   //when successfully added to the database
	request.onsuccess = function(event) {
		alert(`${email}, you're all set! `);
      readAll();

      document.querySelector("#FirstName").value ="";
      document.querySelector("#LastName").value ="";
      document.querySelector("#email").value ="";
      document.querySelector("#Notes").value ="";
	};

   //when not successfully added to the database
	request.onerror = function(event) {
	alert(`\r\n${email} is already here! `);
	}
}

//not used in code example
//reads one record by id
function read() {
   //get a transaction
   var transaction = db.transaction(["employee"]);
   
   //create the object store
   var objectStore = transaction.objectStore("employee");

   //get the data by id
   var request = objectStore.get("00-03");
   
   request.onerror = function(event) {
      alert("Unable to retrieve daa from database!");
   };
   
   request.onsuccess = function(event) {
      // Do something with the request.result!
      if(request.result) {
         alert("Name: " + request.result.name + ", Age: " + request.result.age + ", Email: " + request.result.email);
      }
      
      else {
         alert("Kenny couldn't be found in your database!");
      }
   };
}

//reads all the data in the database
function readAll() {
   var objectStore = db.transaction("guest").objectStore("guest");
   
   document.querySelector("#display").innerHTML=" ";
   //creates a cursor which iterates through each record
   objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      
      if (cursor) {
         addEntry(cursor.value.FirstName, cursor.value.LastName, cursor.value.email, cursor.value.Notes);
         cursor.continue();
      }
   };
}

 function addEntry(firstname, lastname, email, notes) {
     // Your existing code unmodified...
    var iDiv = document.createElement('div');
    iDiv.className = 'Guest'; //This is setting the class of the created div called Guest
    iDiv.innerHTML = firstname + " " + lastname + " " + email + "<BR>" + notes + "<HR>";
    document.querySelector("#display").appendChild(iDiv);
 }

initDatabase();