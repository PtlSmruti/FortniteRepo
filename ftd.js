var port = 10071;
var express = require('express');
var app = express();

// http://www.sqlitetutorial.net/sqlite-nodejs/connect/
const sqlite3 = require('sqlite3').verbose();

// https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// http://www.sqlitetutorial.net/sqlite-nodejs/connect/
// will create the db if it does not exist
var db = new sqlite3.Database('db/database.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the database.');
});

// https://expressjs.com/en/starter/static-files.html
app.use(express.static('static-content'));
// (idempotent) logging a user in API
app.post('/api/login/', function (req, res) {
	//obtain username and password from the textfields
	console.log("Attempt to login");
	var username = req.body.username;
	var password = req.body.password;
	var result = {};
	var status = false;
	console.log("users infor: ", username, password);

	if (username != null && password != null) {
		let sql = "SELECT * FROM users WHERE username=? AND password=? LIMIT 1";
		db.get(sql, [username, password], function (err, row) {
			if (err) {
				result["error"] = err.message;
			} else if (row) {
				console.log("row exists");
				result["OK"] = "OK";
				status = true;
				res.status(200).send("Success");
			}
			//if there was no match found:
			if (status == false) {
				res.status(400).send("invalid");
			}
		});
	} else {
		res.status(400).send("invalid");
	}
});


//Registration: Add users (idempotent)
app.post('/api/register/', function (req, res) {
	
	var result = {};
	result["users"] = [];
	var username = req.body.user;
	var password = req.body.pass;
	var email = req.body.email;
	var gender = req.body.gender;
	var month = req.body.Month;
	var day = req.body.Day;
	var year = req.body.Year;
	var status = false;
	var score = 0;

	//string concatnate YYYY-MM-DD
	var dob = year + "-" + month + "-" + day;
	
	let sql = "SELECT * FROM users WHERE username=? LIMIT 1";
	db.get(sql, [username], function (err, row) {
		if (err) {
			result["error"] = err.message;
			console.log(err.message);

		} else {
			if (row) {
				result["exists"] = "username already exists";
				res.status(400).send('username exists');
				status = true;
			}
			
			//if no error has occured, proceed with registering the user
			if (status == false) {
				let query = "INSERT INTO users(username, password, email, score, gender, Month, Day, Year) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
				//db.run(sql, [username, psw, email], function (err) {
				db.run(query, [username, password, email, score, gender, month, day, year], function (err) {
					console.log("ran the query");
					var result = {};
					result["users"] = [];
					if (err) {
						result["error"] = err.message;
					} else {
						res.status(200).send('Success');
					}
				});

			}
		}
	});
});


//Validation and Authentication api--this sends a user and password to evey trasaction that
//takes place after login:
app.post('/api/authentication/', function(req, res){
	console.log("Attempt to authenticate and validate the user");
	var username = req.body.username;
	var password = req.body.password;
	var result = {};
	var status = false;
	

	if (username != null && password != null) {
		let sql = "SELECT * FROM users WHERE username=? AND password=? LIMIT 1";
		db.get(sql, [username, password], function (err, row) {
			if (err) {
				result["error"] = err.message;
			} else if (row) {
				result["OK"] = "OK";
				status = true;
				res.status(200).send("Success");
			}
			//if there was no match found the user should not have access:
			if (status == false) {
				res.status(401).send("unauthenticated user");
			}
		});
	} else {
		res.status(401).send("invalid");
	}
});



//update user password
app.post('/api/Update/', function(req, res){
	var username = req.body.username;
	var password_new = req.body.password_new;
	var result= {};
	result["result"]=[];
	let query = "UPDATE users SET password=? WHERE username=?";
	db.run(query, [password_new, username], function (err){
		
		if(err){
			res.status(404);
			result["error"]=err.message;
		}else{
			if (this.changes != 1) {
				result["error"] = "Not updated";
				res.status(404);
			} else {
				result["result"] = "updated rows: " + this.changes;
				res.status(200).send("Success");
			}
		}
	});
});
// create a new bio for the user (idempotent)
app.put('/api/ProfileBio/:username/:bio/', function(req, res){
	var username = req.params.username;
	var bio = req.params.bio;
	
	
	// let sql = 'INSERT INTO users(username, bio) VALUES (?, ?)';
	let sql = 'UPDATE users SET bio=? WHERE username=?';

	db.run(sql, [bio, username], function (err) {

		var result = {};
		if (err) {
			res.status(409);
			result["error"] = err.message;
			console.log(err.message);
		} else {
			result[bio] = "updated rows: " + this.changes;
		}
		console.log(JSON.stringify(result));
		res.json(result);
	});
});



TODO:
//retrive specifi information about the user for its profile (idempotent)
///:bio/:email/:month/:day/:year/:gender/'
app.get('/api/profileInfo/:username/', function(req, res){
	var username = req.params.username;
	
	// http://www.sqlitetutorial.net/sqlite-nodejs/query/
	let sql = 'SELECT * FROM users WHERE username=?';
	db.get(sql, [username], (err, row) => {
		var result = {};
		if (err) {
			// Should set res.status!!
			result["error"] = err.message;
		} else {
			result["email"] = row["email"];
			result["bio"] = row["bio"];
			result["score"] = row["score"];
			result["gender"] = row["gender"];
			result["month"] = row["Month"];
			result["day"] = row["Day"];
			result["year"] = row["Year"];
		}
		res.json(result);
	});
});


/*========================================================
          Changes Made
==========================================================*/

//update a score (not idempotent)
app.post('/api/updateScore/', function (req, res) {
	var username = req.body.username;
	var score = req.body.score;
	var result={};
	result["scores"]=[];
	console.log("POST:" + username + " " + score);

	// http://www.sqlitetutorial.net/sqlite-nodejs/update/
	let sql = 'UPDATE users SET score=score+? WHERE username=?;';
	db.run(sql, [score, username], function (err) {
		var result = {};
		if (err) {
			res.status(404);
			result["error"] = err.message;
		} else {
			if (this.changes != 1) {
				result["error"] = "Not updated";
				res.status(404);
			} else {
				result["scores"] = "updated rows: " + this.changes;
				res.status(200);
			}
		}
		res.json(result);
	});
});



// retrieve specific user information TOP 10 players (idempotent)
app.get('/api/getScore/', function (req, res) {
	// http://www.sqlitetutorial.net/sqlite-nodejs/query/
	let sql = 'SELECT username, score FROM users ORDER BY score DESC LIMIT 10;';
	db.all(sql, [], (err, rows) => {
		var result = {};
		result["TopScores"] = [];
		if (err) {
			result["error"] = err.message;
		} else {
			rows.forEach((row) => {
				result["TopScores"].push(row);
			});
		}
		res.json(result);
	});
});

app.delete('/api/del/:username/', function(req, res){
	var username = req.params.username;
	var sql = "DELETE FROM users WHERE username=?;";
	db.all(sql, [username], function(err){
		if (err) {
			result["error"] = err.message;
		}else{
			res.send('success');
			res.status(200);
		}
	});

});


/*========================================================
         End of changes made
==========================================================*/

// create a new counter (idempotent)
app.put('/api/counter/:counterName/', function (req, res) {
	var counterName = req.params.counterName;
	console.log("PUT:" + counterName);

	let sql = 'INSERT INTO counter(counterName, counterValue) VALUES (?,?);';
	db.run(sql, [counterName, 0], function (err) {
		var result = {};
		if (err) {
			res.status(409);
			result["error"] = err.message;
		} else {
			result[counterName] = "updated rows: " + this.changes;
		}
		console.log(JSON.stringify(result));
		res.json(result);
	});
});


// EXERCISE: delete a counter (idempotent)

app.listen(port, function () {
	console.log('Example app listening on port ' + port);
});

// db.close();

