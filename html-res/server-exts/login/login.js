const bodyParser = require("body-parser");
const session = require("express-session");
const fs = require("fs");

function generateRandomSecret(length) {
    var secret = "";
    for (var i = 0; i < length; i++) {
        secret += String.fromCharCode(Math.floor(Math.random() * 63) + 32);
    }
    return secret;
}

module.exports = loginPageUrl => {
    var page = fs.readfileSync(loginPageUrl);

    return login;

    function login(req, res, next) {
    //Run session middleware
    session({
        secret: "changeth1s2be_moresecurel&ter",
        resave: false,
        saveUninitialize: false,
        cookie: {
            secure: true,
            maxAge: 86400000, //One Day
        }
    })(req, res, () => {
        //Run bodyParser urlencoded middleware
        bodyParser.urlencoded({
            extended: true
        })(req, res, () => {

            //Run bodyParser json middleware
            bodyParser.json()(req, res, () => {

                //FINALLY run my code
                var username = request.body.username;
                var password = request.body.password;
                if (username) {
                    if (password) {
                        if (results.length > 0) {
                            req.session.loggedin = true;
                            req.session.username = username;

                            res.redirect('/home');
                        } else {
                            res.send('Incorrect Username and/or Password!');
                        }
                    } else {
                        res.send("Please enter your password")
                    }
                } else {
                    res.send('Please enter your username!');
                }
                next();
            })
        })
    })
}
}