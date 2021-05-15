var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var http = require("http")
var cors = require('cors');
const { json } = require("body-parser");
var ObjectID = mongodb.ObjectID;

// Keycloak connection configuration
const keycloakHost = 'keycloak';
const keycloakPort = '8080';
const keycloakKeyPath = '/auth/realms/master/protocol/openid-connect/userinfo';

// Database collections for storing objects
var STREAMS_COLLECTION = "streams";
var EVENTS_COLLECTION = "events";
var TASKS_COLLECTION = "tasks"

// Start the server with CORS enabled
var app = express();
app.use(cors())
app.use(bodyParser.json());

// Link to angular build directory
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
    function (err, client) {
        if (err) {
            console.log("Database connection error: " + err);
            process.exit(1)
        }

        // Save database object
        db = client.db();
        console.log("DB connection established");

        // Initialise the app
        var server = app.listen(process.env.PORT || 3000, function () {
            var port = server.address.port;
            console.log("App now running on port", port);
        });
    });


// // check each request for a valid bearer token
// app.use((req, res, next) => {

//     // assumes bearer token is passed as an authorization header
//     if (req.headers.authorization) {
//         http.get({
//             hostname: `${keycloakHost}`,
//             port: `${keycloakPort}`,
//             path: `${keycloakKeyPath}`,
//             agent: false,  // Create a new agent just for this one request
//             headers: {
//                 'Authorization': req.headers.authorization
//             }
//         }, (response) => {

//             let data = '';

//             // a data chunk has been received.
//             response.on('data', (chunk) => {
//                 data += chunk;
//             });

//             // complete response has been received.
//             response.on('end', () => {
//                 console.log('data: ' + data);

//                 if (response.statusCode !== 200) {
//                     console.log("Response code: " + response.statusCode);
//                     console.log(req.headers.authorization)
//                     res.status(401).json({
//                         error: `unauthorized`,
//                     });
//                 } else {
//                     console.log("Success!")
//                     next();
//                 }
//             });

//         }).on("error", (err) => {
//             console.log("Error processing request: " + err.message);
//         });

//     } else {
//         // there is no token, don't process request further
//         res.status(401).json({
//             error: `unauthorized`,
//         });
//     }
// });

// API routes

// Error handler function
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason + message + code)
    res.status(code || 500).json({ "error": message });
}

// Streams
app.get("/api/streams", function (req, res) {
    db.collection(STREAMS_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get streams.");
        } else {
            try {
                res.status(200).json(docs);
            } catch (e) {
                console.log("aha!" + e.message);
            }

        }
    });
});

app.post("/api/streams", function (req, res) {
    var newStream = req.body;
    newStream.createDate = new Date();

    if (!req.body.name) {
        handleError(res, "Invalid user input", "Must provide name", 400);
    } else {
        db.collection(STREAMS_COLLECTION).insertOne(newStream, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to create new stream");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

// Streams by ID
app.get("/api/streams/:id", function (req, res) {
    db.collection(STREAMS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get stream");
        } else {
            res.status(200).json(doc);
        }
    })
});

app.put("/api/streams/:id", function (req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection(STREAMS_COLLECTION).updateOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
        if (err) {
            handleError(res, err.message, "Failed to update stream");
        } else {
            updateDoc._id = req.params.id;
            res.status(200).json(updateDoc);
        }
    })

});

app.delete("/api/streams/:id", function (req, res) {
    db.collection(STREAMS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
        if (err) {
            handleError(res, err.message, "Failed to delete stream");
        } else {
            res.status(200).json(req.params.id);
        }
    })
});

//GET Tasks
app.get("/api/tasks/:level", function (req, res) {
    if(req.params.level) {
        var level = parseInt(req.params.level)
        db.collection(TASKS_COLLECTION).find({level: level}).toArray(function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to get tasks");
            } else {
                res.status(200).json(doc);
            }
        });
    }
});


app.get("/api/tasks", function (req, res) {
    db.collection(TASKS_COLLECTION).find({}).toArray(function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get tasks");
        } else {
            res.status(200).json(doc);
        }
    });
});

app.post("/api/tasks", function (req, res) {
    var newTask = req.body;

    if (!req.body.description) {
        handleError(res, "Invalid user input", "Must provide requirement description", 400);
    } else {
        db.collection(TASKS_COLLECTION).insertOne(newTask, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to create new task");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

app.put("/api/tasks/:id", function (req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection(TASKS_COLLECTION).updateOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
        if (err) {
            handleError(res, err.message, "Failed to update task");
        } else {
            updateDoc._id = req.params.id;
            res.status(200).json(updateDoc);
        }
    })
});

app.delete("/api/tasks/:id", function (req, res) {
    db.collection(TASKS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
        if (err) {
            handleError(res, err.message, "Failed to delete task");
        } else {
            res.status(200).json(req.params.id);
        }
    })
});

// UserTasks by ID
app.get("/api/usertasks/:id", function (req, res) {
    db.collection(TASKS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get event");
        } else {
            res.status(200).json(doc);
        }
    })
});

app.put("/api/usertasks/:id", function (req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection(TASKS_COLLECTION).updateOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
        if (err) {
            handleError(res, err.message, "Failed to update task");
        } else {
            updateDoc._id = req.params.id;
            res.status(200).json(updateDoc);
        }
    })
});

app.delete("/api/usertasks/:id", function (req, res) {
    db.collection(TASKS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
        if (err) {
            handleError(res, err.message, "Failed to delete task");
        } else {
            res.status(200).json(req.params.id);
        }
    })
});

