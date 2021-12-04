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
	/*cookie: {
		secure: true,
		maxAge: 86400000, //One Day
	}*/
}

const saltRounds = 10;

function generateRandomSecret(length) {
	var secret = "";
	for (var i = 0; i < length; i++) {
		secret += String.fromCharCode(Math.floor(Math.random() * 63) + 32);
	}
	return secret;
}

const o = {
	loginPage: "/login/login/",
	welcomePage: "/login/welcome/",
	createPage: "/login/createLogin/"
}

const m = {
	promptUsername: "Please enter your username.",
	noUserFound: "No account found with that username.",
	usernameTaken: "Sorry, but someone else already got that username :(",
	usernameTooLong: "Username too long- Max Username Length is 40 Characters (really long usernames would just get cut off anyway)",

	promptPassword: "Please enter your password.",
	incorrectPassword: "Invalid Password. Either that, or we messed up big time.",
	passwordTooShort: "Your password has to have more than 6 characters. Otherwise, it's not very secure.",
	passwordTooLong: "Sorry, but we don't support passwords longer than 256 characters. This is to prevent trollers from breaking the login system with insanely long passwords.",

	promptConfirmPassword: "Please confirm your password.",
	differentPasswords: "The passwords you entered don't match!",

	serverError: "Sorry, there was some kind of server-side issue. Please contact Will, or try again later."
}

var messages = {};
for (let key in m) {
	messages[key] = `<p class="err">${m[key]}</p>`;
}

console.log(messages)

module.exports = () => {
	const loginPage = new Template(__dirname + "/login.htmlt", true);
	const welcomePage = new Template(__dirname + "/welcome.htmlt", true);
	const createLoginPage = new Template(__dirname + "/createLogin.htmlt", true);
	var s = session(sessionConfig);

	return login;

	function login(req, res, next) {
		console.log("Handled by Login Handler")
		console.log(req.url)
		if (path.normalize(req.url + '/') == o.loginPage) {
			//Establish session
			s(req, res, login.bind(this))

			function login () {
				if (req.method == "POST") {
					//Run all middleware and attempt to log in.
					urlencoded({ extended: true })(req, res, () => {
						json()(req, res, () => {
							var username = req.body.username;
							var password = req.body.password;
							var usernameErr = "";
							var passwordErr = "";
							if (!username) {
								usernameErr = messages.promptUsername;
							}
							if (!password) {
								passwordErr = messages.promptPassword
							}

							if (username && password) {

								getUser(username, (user) => {
									if (user) {
										if (bcrypt.compareSync(password, user.hash)) {
											console.log(req.session.loggedin);
											console.log(req.session.username)
											req.session.loggedin = true;
											req.session.username = username;

											console.log(req.session.loggedin);
											console.log(req.session.username)

											console.log("LOGIN SUCCESS!")
											res.redirect(o.welcomePage);
											return;
										} else {
											passwordErr = messages.incorrectPassword;
										}

									} else {
										usernameErr = messages.noUserFound;
									}
									console.log(`Login Failed, ${passwordErr} ${usernameErr}`)
									res.send(loginPage.fill({ usernameErr: usernameErr, passwordErr: passwordErr, username: username }))
								})
							} else {
								res.send(loginPage.fill({ usernameErr: usernameErr, passwordErr: passwordErr, username: username }))
							}
						})
					})

				} else if (req.method == "GET") {
					if (req.session.loggedin) {
						//If already logged in, redirect to welcome page
						res.redirect(o.welcomePage)
					} else {
						//Serve login page (With no errors)
						res.send(loginPage.fill({ usernameErr: "", passwordErr: "", username: "" })) //Send Blank login page (no errors)
					}
				}
			}
		} else if (path.normalize(req.url + "/") == o.welcomePage && req.method == "GET") {
			s(req, res, wp);
			function wp () {
				if (req.session.loggedin) {
					res.send(welcomePage.fill({ username: req.session.username }));
				} else {
					res.redirect(o.loginPage)
				}
			}
		} else if (path.normalize(req.url + "/") == o.createPage) {
			if (req.method == "GET") {
				res.send(createLoginPage.fill({ usernameErr: "", passwordErr: "", confirmPasswordErr: "", username: "" }))
			} else if (req.method == "POST") {
				urlencoded({ extended: true })(req, res, () => {
					json()(req, res, () => {
						var username = req.body.username
						var password = req.body.password
						var confirmPassword = req.body.confirm_password
						var usernameErr = "";
						var passwordErr = "";
						var confirmPasswordErr = ""

						if (!username) {
							usernameErr = messages.promptUsername;
						} else if (username.length > 40) {
							usernameErr = messages.usernameTooLong;
						}

						if (!password) {
							passwordErr = messages.promptPassword;
						} else if (password.length < 6) {
							passwordErr = messages.passwordTooShort;
						} else if (password.length > 256) {
							passwordErr = messages.passwordTooLong;
						}

						if (!confirmPassword) {
							confirmPasswordErr = messages.promptConfirmPassword;
						} else if (password !== confirmPassword) {
							confirmPasswordErr = messages.differentPasswords;
						}

						if (usernameErr.length == 0 && passwordErr.length == 0 && confirmPasswordErr.length == 0) {
							//No errors so far, keep going.
							getUser(username, (user) => {
								if (user) {
									usernameErr = messages.usernameTaken;
								} else {
									//At this point, everything is valid
									addUser(username, bcrypt.hashSync(password, saltRounds), err => {
										if (err) {
											console.error(err);
											res.send(createLoginPage.fill({
												usernameErr: "",
												passwordErr: "",
												confirmPasswordErr: messages.serverError,
												username: username
											}))
										} else {
											req.session.loggedin = true;
											req.session.username = username;

											res.redirect(o.welcomePage);
										}
									});
								}
							})
						} else {
							res.send(createLoginPage.fill({
								usernameErr: usernameErr,
								passwordErr: passwordErr,
								confirmPasswordErr: confirmPasswordErr,
								username: username
							}))
						}
					})
				})
			}
		} else {
			next();
		}
	}
}

//Performant user lookup
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

function addUser(name, hash, onresult) {
	fs.appendFile(path.resolve(__dirname + "/users.txt"), `{"un":"${name}","hash":"${hash}"}\n`, onresult);
}