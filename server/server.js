var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var cors = require('cors');
var ObjectID = mongodb.ObjectID;

var CONTACTS_COLLECTION = "contacts";
var EVENTS_COLLECTION = "events";

var app = express();
app.use(cors())
app.use(bodyParser.json());

// Link to angular build dir
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Create a database variable to reuse the connection pool
var db;

// Connect to DB
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://mongo:27017/test", {
    autoReconnect: true,
    // retry to connect for 60 times
    reconnectTries: 60,
    // wait 1 second before retrying
    reconnectInterval: 1000
    },
    function(err, client) {
        if (err) {
            console.log(err);
            process.exit(1)
        }
    
    // Save database object
    db = client.db();
    console.log("DB connection established");
    
    // Initialise the app
    var server = app.listen(process.env.PORT || 3000, function() {
        var port = server.address.port;
        console.log("App now running on port", port);
    });
});

// API routes

// Error handler function
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason)
    res.status(code || 500).json({"error": message});
}

// Contacts
app.get("/api/contacts", function(req, res) {
    db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get contacts.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/api/contacts", function(req, res) {
    var newContact = req.body;
    newContact.createDate = new Date();
    
    if (!req.body.name) {
        handleError(res, "Invalid user input", "Must provide name", 400);
    } else {
        db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc){
            if (err) {
                handleError(res, err.message, "Failed to create new contact");
            }  else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

// Contacts by ID
app.get("/api/contacts/:id", function(req, res) {
    db.collection(CONTACTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id )}, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get contact");
        } else {
            res.status(200).json(doc);
        }
    })
});

app.put("/api/contacts/:id", function(req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;
    
    db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, function(err, result) {
        if (err) {
            handleError(res, err.message, "Failed to update contact");
        } else {
            updateDoc._id = req.params.id;
            res.status(200).json(updateDoc);
        }
    })
    
});

app.delete("/api/contacts/:id", function(req, res) {
    db.collection(CONTACTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result){
        if (err) {
            handleError(res, err.message, "Failed to delete contact");
        } else {
            res.status(200).json(req.params.id);
        }
    })
});

// EVENTS
app.get("/api/events", function(req, res) {
    db.collection(EVENTS_COLLECTION).find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get events.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/api/events", function(req, res) {
    var newEvent = req.body;
    newEvent.createDate = new Date();
    
    if (!req.body.name) {
        handleError(res, "Invalid user input", "Must provide name", 400);
    } else {
        db.collection(EVENTS_COLLECTION).insertOne(newEvent, function(err, doc){
            if (err) {
                handleError(res, err.message, "Failed to create new event");
            }  else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

// Events by ID
app.get("/api/events/:id", function(req, res) {
    db.collection(EVENTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id )}, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get event");
        } else {
            res.status(200).json(doc);
        }
    })
});

app.put("/api/events/:id", function(req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;
    
    db.collection(EVENTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, function(err, result) {
        if (err) {
            handleError(res, err.message, "Failed to update event");
        } else {
            updateDoc._id = req.params.id;
            res.status(200).json(updateDoc);
        }
    })
    
});

app.delete("/api/events/:id", function(req, res) {
    db.collection(EVENTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result){
        if (err) {
            handleError(res, err.message, "Failed to delete event");
        } else {
            res.status(200).json(req.params.id);
        }
    })
});