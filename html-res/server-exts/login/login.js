const { urlencoded, json } = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt")
const fs = require("fs");
const path = require("path")
const rl = require("readline");
const { Template } = require("../../../MDWebServer/templates");

const sessionConfig = {
	secret: "changeth1s2be_moresecurel&ter",
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: true,
		maxAge: 86400000, //One Day
	}
}

const saltRounds = 10;

function generateRandomSecret(length) {
	var secret = "";
	for (var i = 0; i < length; i++) {
		secret += String.fromCharCode(Math.floor(Math.random() * 63) + 32);
	}
	return secret;
}

function getUser(name, onResult) {
	const reader = new rl.createInterface({
		input: fs.createReadStream(path.resolve(__dirname + "/users.txt")),
		crlfDelay: Infinity
	})
	var wasSuccessful = false;
	reader.on("line", line => {
		const obj = JSON.parse(line);
		if (obj.un == name) {
			onResult(obj);
			wasSuccessful = true;
			reader.close();
		}
	})
	reader.on("close", function () {
		if (wasSuccessful != true) {
			onResult(false);
		}
	})
}

const o = {
	loginPage: "/login/login/",
	welcomePage: "/login/welcome/",
	createPage: "/login/createLogin/"
}

module.exports = () => {
	const loginPage = new Template(__dirname + "/login.htmlt", true);
	const welcomePage = new Template(__dirname + "/welcome.htmlt", true);

	return login;

	function login(req, res, next) {
		console.log("Handled by Login Handler")
		console.log(req.url)
		if (path.normalize(req.url + '/') == o.loginPage) {
			//Establish session
			session(sessionConfig)(req, res, () => {
				if (req.method == "POST") {
					//Run all middleware and attempt to log in.
					urlencoded({extended: true})(req, res, () => {json()(req, res, attemptLogin)})

				} else if (req.method == "GET") {
					if (req.session.loggedin) {
						//If already logged in, redirect to welcome page
						res.redirect(o.welcomePage)
					} else {
						//Serve login page (With no errors)
						res.send(loginPage.fill({ usernameErr: "", passwordErr: "" })) //Send Blank login page (no errors)
					}
				}
			})
		} else if (path.normalize(req.url + "/") == o.welcomePage && req.method == "GET") {
			session(sessionConfig)(req, res, () => {
				if (req.session.loggedin) {
					res.send(welcomePage.fill({ username: req.session.username }));
				} else {
					res.redirect(o.loginPage)
				}
			})
		} else if (path.normalize(req.url + "/") == o.createPage) {
			if (req.method == "GET") {
				res.send(createLogin.fill({usernameErr: "", passwordErr: "", confirmPasswordError: ""}))
			} else if (req.method == "POST") {
				urlencoded({extended: true})(req, res, () => {json()(req,res,attemptCreateLogin)})
			}
		} else {
			next();
		}
	}
}


function attemptLogin() {
	const username = req.body.username;
	const password = req.body.password;
	var usernameErr = "";
	var passwordErr = "";
	if (!username) {
		usernameErr = "Please enter a username."
	}
	if (!password) {
		passwordErr = "Please enter a password."
	}

	if (username && password) {

		getUser(username, (user) => {
			if (user) {
				if (bcrypt.compareSync(password, user.hash)) {
					req.session.loggedin = true;
					req.session.username = username;

					console.log("LOGIN SUCCESS!")
					res.redirect(o.loginPage);
					//next(); Don't retru
					return;
				} else {
					passwordErr = "Invalid Password. Either that, or we messed up big time."
				}

			} else {
				usernameErr = 'No account found with that username.';
			}
			console.log(`Login Failed, ${passwordErr} ${usernameErr}`)
			res.send(loginPage.fill({ usernameErr: usernameErr, passwordErr: passwordErr }))
		})
	} else {
		res.send(loginPage.fill({ usernameErr: usernameErr, passwordErr: passwordErr }))
	}
}

function attemptCreateLogin() {
	const username = req.body.username;
	const password = req.body.password;
	const confirmPassword = req.body.confirm_password;

	var usernameErr = "";
	var passwordErr = "";
	var confirmPasswordErr = ""
	
	if (!username) {
		usernameErr = "Please enter a username."
	} else if (username.length > 40) {
		usernameErr = "Max Username Length is 40 Characters for display purposes; really long usernames would just get cut off anyway.";
	}

	if (!password) {
		passwordErr = "Please enter a password."
	} else if (password.length < 6) {
		passwordErr = "Your password has to have more than 6 characters. Otherwise, it's not very secure.<br>"
	} else if (password.length > 256) {
		passwordErr = "Sorry, but we don't support passwords longer than 512 characters. This is to prevent trollers from breaking the login system with insanely long passwords.<br>"
	}

	if (!confirmPassword) {
		confirmPasswordErr = "Please confirm your password."
	} else if (password !== confirmPassword) {
		confirmPasswordErr = "The passwords you entered don't match!"
	}

	if (usernameErr.length == 0 && passwordErr.length == 0 && confirmPasswordErr.length == 0) {
		//No errors so far, keep going.
		getUser(username,(user)=>{
			if (user) {
				usernameErr = "Sorry, but someone already got that username.\n:(";

			} else {

			}
		})
	} else {
		res.send(loginPage.fill({
			usernameErr: usernameErr,
			passwordErr: passwordErr,
			confirmPasswordErr: confirmPasswordErr
		}))
	}
}