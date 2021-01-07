// See the JQuery documentation at ... 
// http://api.jquery.com/
// http://learn.jquery.com/
// See my JQuery and Ajax notes 
//states and views of the game
function State(state) {
	switch (state) {
		case "login":
			textFieldAction("loginForm");
			$("#ui_login").show();
			$("#ui_register").hide();
			$("#ui_counter").hide();
			$("#ui-navigation").hide();
			$("#ui_setting").hide();
			$("#ui_game").hide();
			$('#ui_game-mode').hide();
			retrieveHighScores();
			// sessionStorage.setItem("state", "login");
			break;
		case "setting":
			var result = authentication();
			if (result == 1) {
				$(".buttons").on('click', toggle_nav);
				$("#ui_login").hide();
				$("#ui_register").hide();
				$("#ui_counter").hide();
				$("#ui-navigation").show();
				$("#ui_setting").show();
				$("#ui_game").hide();
				$('#ui_game-mode').hide();
				sessionStorage.setItem("state", "setting");
			} else {
				State("login");
			}
			break;
		case "register":
			textFieldAction("other");
			$("#ui_login").hide();
			$("#ui-navigation").hide();
			$("#ui_register").show();
			$("#ui_counter").hide();
			$("#ui_setting").hide();
			$("#ui_game").hide();
			$('#ui_game-mode').hide();
			sessionStorage.setItem("state", "register");
			break;
		case "game":
			var result = authentication();
			if (result == 1) {
				sessionStorage.setItem("points", 0);
				$("#ui_login").hide();
				$("#ui_counter").hide();
				$("#ui_register").hide();
				$("#ui-navigation").hide();
				$("#ui_setting").hide();
				$("#ui_game").show();
				$('#ui_game-mode').hide();
				setupGame();
				startGame();
				sessionStorage.setItem("state", "game");
			} else {
				State("login");
			}
			break;
		case "profile":
			var result = authentication();
			if (result == 1) {
				$(".buttons").on('click', toggle_nav);
				$("#ui_login").hide();
				$("#ui_counter").show();
				$("#ui_register").hide();
				$("#ui-navigation").show();
				$("#ui_setting").hide();
				$("#ui_game").hide();
				$('#ui_game-mode').hide();
				sessionStorage.setItem("state", "profile");
			} else {
				State("login");
			}
			break;
		case "game-mode":
			var result = authentication();
			if (result == 1) {
				$("#ui_login").hide();
				$("#ui_counter").hide();
				$("#ui_register").hide();
				$("#ui-navigation").hide();
				$("#ui_setting").hide();
				$("#ui_game").hide();
				$('#ui_game-mode').show();
				sessionStorage.setItem("state", "game-mode");
			} else {
				State("login");
			}
			break;
		default:
			$("#ui_login").show();
			$("#ui_register").hide();
			$("#ui_counter").hide();
			break;
	}

}
//expand the navigation bar
function toggle_nav() {
	//use toggleClass to make the navigation appear
	$(this).toggleClass("on");
	$(".menu").toggleClass("active");
};

//Function to register the user
function register() {
	//Starting with error checking
	var userName = document.getElementById('userName').value;
	var userPassword = document.getElementById('userPassword').value;
	var Email = document.getElementById('userEmail').value;
	var gender = $("input:radio[name='radiobtn']:checked").val();
	var month = $('#month option:selected').text();
	var day = $('#day option:selected').text();
	var year = $('#year option:selected').text();

	if (userName == "") {
		// send an alert if user name is empty
		alert("You forgot to type your username");
	}
	else if (userPassword == "" || $("#userPassword2").val() == "") {
		// send an alert if user password is empty
		alert("You forgot to type your password");
	} else if (Email == "") {
		alert("You forgot to type your email");
	} else if (EmailFormat(Email) == false) {
		alert("please enter a valid email address");
		document.getElementById("userEmail").value = "";
	} else if (month == "Month" || day == "Day" || year == "Year") {
		alert("You forgot to select your date of birth.");
	} else if ($("#userPassword").val().length < 6) {
		textFieldAction("password");
		document.getElementById("regerr").innerHTML = "password must be atleast 6 charaters long.";
	} else if ($("#userPassword").val() != $("#userPassword2").val()) {
		textFieldAction("password");
		document.getElementById("regerr").innerHTML = "Passwords do not match!";
	} else {
		document.getElementById("regerr").innerHTML = "";
		$.ajax({
			method: "POST",
			url: "/api/register/",
			data: {
				//obtain the values from the textfields and set the data
				user: $("#userName").val(),
				pass: $("#userPassword").val(),
				email: $("#userEmail").val(),
				gender: gender,
				Month: month,
				Day: day,
				Year: year

			}, error: function (error) {
				//the only error that will occur is from the database which is: 
				textFieldAction("username");
				document.getElementById("regerr").innerHTML = "The username you selected is taken.";
				console.log(error.status);
				console.log(JSON.stringify(error.responseJSON));
			}
		}).done(function (data) {
			console.log(JSON.stringify(data));
			alert("You have Registered! Now sign in.");
			State("login");
			textFieldAction("other");

		});

	}

}
//Birthday information
function Register_birth() {
	//input months 
	for (var i = 0; i < months.length; i++) {
		// create an option and add text
		var option = document.createElement('option');
		var monthText = document.createTextNode(months[i].name);
		option.appendChild(monthText);
		// add option and assign a value of each option
		var addHere = document.getElementById('month');
		addHere.appendChild(option);
		option.value = months[i].id;
		option.className = 'userMonth';
	}
	//input days
	selectFunc(days, "day", "userDay");
	//input year
	selectFunc(years, "year", "userYear");
}

//email verification
function EmailFormat(email) {
	//Reference: Stackoverflow -- use regex to determie the format of the email
	var regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return regEx.test(email);
}
//login-->used to login the user
function login() {
	// Normally would check the server to see if the credentials checkout
	$.ajax({
		method: "POST",
		url: "/api/login/",
		data: {
			//obtain the values from the textfields and set the data
			username: $("#username").val(),
			password: $("#password").val()
		}, error: function (error) {
			var userName = document.getElementById('username').value;
			var userPassword = document.getElementById('password').value;
			if (userName == "") {
				// send an alert if user name is empty
				alert("You forgot to type your username");
			}
			else if (userPassword == "") {
				// send an alert if user password is empty
				alert("You forgot to type your password");
			} else {
				document.getElementById("errormsg").innerHTML = "Incorrect Password or Username";
				document.getElementById("username").value = "";
				document.getElementById("password").value = "";

				$("#ui_login").show();
				$("#ui_counter").hide();
				$("#ui_register").hide();
			}
			console.log(error.status);
			console.log(JSON.stringify(error.responseJSON));
		}
	}).done(function (data) {
		var username = document.getElementById('username').value;
		var password = document.getElementById('password').value;
		//using the data obtained in the ajax call use the  username and password for authicating
		console.log(JSON.stringify(data));
		if (data == "Success") {
			sessionStorage.setItem("username", username);
			sessionStorage.setItem("password", password);
			var result = authentication();
			if (result == 1) {
				$(".buttons").on('click', toggle_nav);
				retrieveAll();
				State("profile");
			}
		} else {
			document.getElementById("errormsg").innerHTML = "An error has occured";
		}
	});
}

//On everypage, this function authenticates the user by checking its creditantials
function authentication() {
	//obatin the username from the one stored in session 
	var logged_username = sessionStorage.getItem("username");
	var logged_password = sessionStorage.getItem("password");
	var authCheck = 0;
	$.ajax({
		method: "POST",
		url: "/api/authentication/",
		data: {
			username: logged_username,
			password: logged_password
		},
		//async must be send according to arnold--so that this call is completed before anyother call is amde
		async: false,
	}).done(function (data) {
		if (data == "Success") {
			authCheck = 1;
		} else {
			authCheck = 0;
		}
	});
	return authCheck;
}

//Change password function, using auth to chnage the users password and update it in the database
function Update() {
	//obtain current and new passwords
	var current = document.getElementById("oldpass").value;
	var new1 = document.getElementById("newpass").value;
	var new2 = document.getElementById("newpass2").value;
	var auth = authentication();
	//authenticate the user to check that it is the user
	if (auth == 1) {
		if (current != "" && new1 != "" && new2 != "") {
			if (current != sessionStorage.getItem("password")) {
				document.getElementById("setError").innerHTML = "";
				document.getElementById("oldpass").value = "";
				document.getElementById("newpass").value = ""
				document.getElementById("newpass2").value = "";
				document.getElementById("setError").innerHTML = "You current password is incorrectly inputed.";
				State("setting");
			} else if (new1 != new2) {
				document.getElementById("setError").innerHTML = "";
				document.getElementById("oldpass").value = "";
				document.getElementById("newpass").value = ""
				document.getElementById("newpass2").value = "";
				document.getElementById("setError").innerHTML = "The new passwords do not match.";
				State("setting");
			} else if (new1.length < 6) {
				document.getElementById("setError").innerHTML = "";
				document.getElementById("oldpass").value = "";
				document.getElementById("newpass").value = ""
				document.getElementById("newpass2").value = "";
				document.getElementById("setError").innerHTML = "The new passwords must be atleast 6 characters in length.";
				State("setting");
			} else if (new1 == current) {
				document.getElementById("setError").innerHTML = "";
				document.getElementById("oldpass").value = "";
				document.getElementById("newpass").value = ""
				document.getElementById("newpass2").value = "";
				document.getElementById("setError").innerHTML = "The new password cannot be the same as the old";

			} else {
				$.ajax({
					method: "POST",
					url: '/api/Update/',
					data: {
						username: sessionStorage.getItem("username"),
						password_new: new1
					}
				}).done(function (data) {
					if (data == "Success") {
						alert("your password has been Updated! Now log back in with your new password.")
						document.getElementById("setError").innerHTML = "";
						document.getElementById("setError").innerHTML = "password has been updated!";
						document.getElementById("oldpass").value = "";
						document.getElementById("newpass").value = ""
						document.getElementById("newpass2").value = "";
						sessionStorage.setItem("password", new1);
						sessionStorage.clear();
						textFieldAction("login");
						State("login");
					}
				});
			}

		}
	} else {
		State("login");
	}
}


// Request all counters from the server
function retrieveAll() {
	// For a completely restful api, we would need to send some king of authentication
	// token for each request. A simple trivial one is sending the user and password
	// an alternative is to send something hashed with the user and password
	var username = sessionStorage.getItem("username");
	var auth = authentication();
	if (auth == 1) {
		$.ajax({
			method: "GET",
			url: "/api/profileInfo/" + username + "/"
		}).done(function (data) {
			console.log(JSON.stringify(data));
			sessionStorage.setItem("email", data.email);
			sessionStorage.setItem("bio", data.bio);
			sessionStorage.setItem("gender", data.gender);
			sessionStorage.setItem("score", data.score);
			var dob = data.year + "-" + data.month + "-" + data.day;
			sessionStorage.setItem("dob", dob);

			var age = getUserAge(data.month, data.day, data.year);
			sessionStorage.setItem("age", age);

			document.getElementById("bioG").innerHTML = sessionStorage.getItem("bio");
			document.getElementById("updateEmail").innerHTML = sessionStorage.getItem("email");
			document.getElementById("updateGender").innerHTML = sessionStorage.getItem("gender");
			document.getElementById("updateBirth").innerHTML = sessionStorage.getItem("dob");
			document.getElementById("updateName").innerHTML = username
			document.getElementById("updateAge").innerHTML = sessionStorage.getItem("age") + " years old";
		});
	}

}

//het the  users age --> takes in the users date of birth
function getUserAge(month, day, year) {
	var today = new Date();
	var nowmonth = today.getMonth();
	var nowday = today.getDate();
	var nowyear = today.getFullYear();
	//find the difference in age of the player comapared to the date today
	var age = nowyear - year;
	var ageMonth = nowmonth - month;
	var actualAge = nowday - day;
	//calculate the age
	if (ageMonth < 0 || (ageMonth == 0 && actualAge < 0)) {
		age = age - 1;
	}
	return age;
}

// add a counter new profile bio
function create() {
	var username = sessionStorage.getItem("username");
	console.log("inside of create");
	$.ajax({
		method: "PUT",
		url: "/api/ProfileBio/" + username + "/" + $("#bio").val()
	}).done(function (data) {
		console.log("inside of create par 2");
		console.log("Got back:" + JSON.stringify(data));
		if ("error" in data) { console.log(data["error"]); }
		else {
			retrieveAll();
			document.getElementById("setError").innerHTML = "A bio was added to your profile!";

		}
	});
}



/*========================================================
          Changes Made
==========================================================*/

// increment a counter for the score of the player afte they finish playing
function update() {
	var auth = authentication();
	if (auth == 1) {
		$.ajax({
			method: "POST",
			url: "/api/updateScore/",
			data: {
				username: sessionStorage.getItem("username"),
				score: sessionStorage.getItem("points")
			}
		}).done(function (data, text_status, jqXHR) {
			console.log(JSON.stringify(data));
			console.log(text_status);
			console.log(jqXHR.status);
			retrieveHighScores();
		}).fail(function (err) {
			console.log(err.status);
			console.log(JSON.stringify(err.responseJSON));
		});
	}
}
//gets the highscore of top 10 players in the game
function retrieveHighScores() {
	$.ajax({
		method: "GET",
		url: "/api/getScore/"
	}).done(function (data) {
		console.log(JSON.stringify(data));
		var HighScores_usr = "";
		var HighScores_scr = "";
		for (i = 0; i < data["TopScores"].length; i++) {
			HighScores_usr += "<br/>" + data["TopScores"][i].username + " ";
			HighScores_scr += "<br/>" + data["TopScores"][i].score
		}
		document.getElementById("score_usr").innerHTML = HighScores_usr;
		document.getElementById("score_scr").innerHTML = HighScores_scr;

	});
}
//delete the entire user from the database
function delete_user() {
	var username = sessionStorage.getItem("username");
	var password_sess = sessionStorage.getItem("password");
	var text_pass = document.getElementById("del").value;
	if (text_pass != password_sess) {
		document.getElementById("setError").innerHTML = "";
		document.getElementById("del").value = "";
		document.getElementById("setError").innerHTML = "Delete Account: The password you entered does not match your current password";
	} else {
		var auth = authentication();
		if (auth == 1) {
			$.ajax({
				type: "DELETE",
				url: "/api/del/" + username + "/",
				success: function (response) {
					alert("Deleting Your Account.");
					sessionStorage.clear();
					textFieldAction("login");
					State("login");
				}
			})
		}
	}
}

/*========================================================
         End of changes made
==========================================================*/


// This is executed when the document is ready (the DOM for this document is loaded)
$(function () {
	// Setup all events here and display the appropriate UI
	$("#loginSubmit").on('click', function () { login(); $(".buttons").on('click', toggle_nav); });
	$("#create").click(function () { Register_birth(); State("register");});
	$("#login_register").click(function () { State("login");});
	$("#registerSubmit").on('click', function () { register(); });
	$("#signout").click(function () {sessionStorage.clear(); textFieldAction("login"); State("login");});
	$("#settings").click(function () { $(".buttons").on('click', toggle_nav); State("setting");});
	$("#settingSubmit").on('click', function () { Update(); });
	$("#settingDel").on('click', function () { delete_user(); });
	$("#Profile1").click(function () { $(".buttons").on('click', toggle_nav); retrieveAll(); State("profile");});
	$("#play").click(function () {State("game-mode");});
	$("#start").click(function () {State("game");});

	$("#goBack").click(function () {$(".buttons").on('click', toggle_nav); retrieveAll(); State("profile"); });

	$("#exitGame").click(function () {
		update();
		retrieveAll();
		$(".buttons").on('click', toggle_nav);
		State("profile");
	});

	$("#settingBio").on('click', function () { create(); });
	$("#updateCounterSubmit").on('click', function () { update(); });
	//check for which state
	if (sessionStorage.getItem("state") == "login") {
		State("login");
		$("#loginSubmit").on('click', function () { login(); $(".buttons").on('click', toggle_nav); });
	} else if (sessionStorage.getItem("state") == "register") {
		State("register");
	} else if (sessionStorage.getItem("state") == "profile") {
		$(".buttons").on('click', toggle_nav);
		retrieveAll();
		State("profile");
	} else if (sessionStorage.getItem("state") == "setting") {
		State("setting");
	} else if (sessionStorage.getItem("state") == "game") {
		$(".buttons2").on('click', toggle_nav);
		State("game");
	} else if (sessionStorage.getItem("state") == "game-mode") {
		State("game-mode");
	} else {
		$(".buttons").on('click', toggle_nav());
		retrieveHighScores();
		State("login");
	}
});

// -------------------------------------------------------------------- REGISTRATION INFORMATION --------------------------------------------- //

//For the registration page: create The months for the option
var months = [
	{ id: 1, name: "January" },
	{ id: 2, name: "February" },
	{ id: 3, name: "March" },
	{ id: 4, name: "April" },
	{ id: 5, name: "May" },
	{ id: 6, name: "June" },
	{ id: 7, name: "July" },
	{ id: 8, name: "August" },
	{ id: 9, name: "September" },
	{ id: 10, name: "October" },
	{ id: 11, name: "November" },
	{ id: 12, name: "December" }
];

// create years
var years = [];
var date = new Date();
// to create an account on this website you have to be at least 13
for (var i = (date.getFullYear() - 10); i > (date.getFullYear() - 100); i--) {
	years.push(i)
}

var days = [];
for (var i = 1; i <= 31; i++) {
	days.push(i);
}
//select function for each entry
function selectFunc(numberArray, idName, className) {
	for (var i = 0; i < numberArray.length; i++) {
		var option = document.createElement('option');
		var number = document.createTextNode(numberArray[i]);
		option.appendChild(number);
		var addHere = document.getElementById(idName);
		addHere.appendChild(option);
		option.value = numberArray[i];
		option.className = className;
	}
}
//set the textfield according to its appropriate error
function textFieldAction(type) {
	if (type == "password") {
		document.getElementById("regerr").innerHTML = "";
		document.getElementById("userPassword").value = "";
		document.getElementById("userPassword2").value = "";
	} else if (type == "username") {
		document.getElementById("userName").value = "";
		document.getElementById("userPassword").value = "";
		document.getElementById("userPassword2").value = "";
	} else if (type == "loginForm") {
		var username = $("#userName").val();
		var password = $("#userPassword").val();

		document.getElementById("errormsg").innerHTML = "";
		document.getElementById("username").value = username;
		document.getElementById("password").value = password;
	} else {
		document.getElementById("regerr").innerHTML = "";
		document.getElementById("userName").value = "";
		document.getElementById("userPassword").value = "";
		document.getElementById("userPassword2").value = "";
		document.getElementById("userEmail").value = "";
		$("#month").val($("#month option:first").val());
		$("#day").val($("#day option:first").val());
		$("#year").val($("#year option:first").val());
	}

}

