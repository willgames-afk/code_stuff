const { urlencoded, json } = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt")
const fs = require("fs");
const rl = require("readline");
const {Template} = require("../../../../MDWebServer/templates");

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
		input: fs.createReadStream("users.txt"),
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
	loginPage: "/login/login",
	welcomePage: "/login/welcome"
}

module.exports = () => {
	const loginPage = new Template(__dirname + "/login.htmlt", true);
	const welcomePage = new Template(__dirname + "/welcome.htmlt", true);

	return login;

	function login(req, res, next) {
		console.log("Handled by Login Handler")
		if (req.url == o.loginPage) {

			session(sessionConfig)(req, res, () => {
				if (req.method == "POST") {
					//Run bodyParser urlencoded middleware
					urlencoded({
						extended: true
					})(req, res, () => {

						//Run bodyParser json middleware
						json()(req, res, () => {

							//FINALLY run my code
							var username = request.body.username;
							var password = request.body.password;
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

											res.redirect(o.loginPage);
											next();
											return;
										} else {
											passwordErr = "Invalid Password. Either that, or we messed up big time."
										}

									} else {
										usernameErr = 'No account found with that username.';
									}
									res.send(loginPage.fill({usernameErr: usernameErr, passwordErr: passwordErr}))
								})
							} else {
								res.send(loginPage.fill({usernameErr: usernameErr, passwordErr: passwordErr}))
							}
						})
					})
				} else if (req.method == "GET") {
					if (req.session.loggedin) {
						res.redirect(o.welcomePage)
					} else {
						res.send(loginPage.fill({ usernameErr: "", passwordErr: "" }))
					}
				}
			})
		} else if (req.url == o.welcomePage && req.method == "GET") {
			session(sessionConfig)(req, res, () => {
				if (req.session.loggedin) {
					res.send(welcomePage.fill({username: req.session.username}));
				} else {
					res.redirect(o.loginPage)
				}
			})
		}
		next();
	}
}