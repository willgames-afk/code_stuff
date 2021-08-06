//Loading of modules
const fs = require('fs');            //Files
const express = require('express');  //Server
const showdown = require("showdown");//Markdown to HTML
const katex = require("katex");      //LATeX to HTML
const path = require("path");

//Setup
const app = express();
const port = 3000;

//error code lookup
const errorMessages = {
	"ENOENT": "Couldn't find this file :( \n(ENOENT)",
	"EACCES": "Sorry, but you don't have access to that! \n(EACCES)",
	"ECONNREFUSED": "Connection Refused. \n(ECONNREFUSED)",
	"ECONNRESET": "Connection reset by peer. :( \n(ECONNRESET)",
	"EMFILE": "Too many open files in system. (Probably due to Will writing bad code) \n(EMFILE)",
	"ENOTFOUND": "DNS lookup failed. \n(ENOTFOUND)",
	"EPERM": "Sorry,but you don't have the permissions to do that. \n(EPERM)",
	"ETIMEDOUT": "Timed Out :( \nMaybe try refresing? \n(ETIMEDOUT)",
}


//Resource Loading
const res_dir = "./resources/";
const public_dir = "./public/";
function loadRes(url) {
	return fs.readFileSync(path.join(res_dir, url))
}
function preloadPage(url) {
	return fs.readFileSync(path.join(res_dir, url + ".html")).toString();
}
function loadPub(url) {
	return fs.readFileSync(path.join(public_dir, url))
}
const basepage = preloadPage("post") //Page Template
const index = preloadPage("index")   //Site Index.html
var publicFiles = searchDir('./public');
console.dir(publicFiles, { depth: null });

function loggerMWF(req, res, next) {
	console.log(`${req.method} ${req.path}`)
	next();
}
app.use('/', loggerMWF);//Log all server requests


app.get('/', (req, res) => {
	console.log("handled by index handler")
	res.send(index);
});

//Resources
app.use('/resources/', (req, res) => {
	res.type(path.extname(req.url)) //Send correct filetype
	res.send(loadRes(req.url));
})

//  blog/
app.get("/blog/", (req, res) => {
	res.send(fillTemplate(basepage, { content: "Blog Homepage" }))
})
// blog/imgs/**
app.use("/blog/imgs", (req, res) => {
	var file;
	try {
		file = loadPub(path.join("blog/imgs", req.path)); //Get the file
	} catch (err) {
		sendErrorMessage(err, res);
		return;
	}
	res.type(path.extname(req.url));
	res.send(file);
})
// blog/** not including /imgs or /
app.use('/blog/', (req, res) => {
	console.log("Handled by Blog Handler")
	var url = path.join("./public/blog", `${req.url}.md`)
	var rawfile
	try {
		rawfile = fs.readFileSync(url); //Get the file
	} catch (err) {
		sendErrorMessage(err, res);
		return;
	}
	const fileObj = splitFile(rawfile.toString());
	if (!fileObj.timecode) {
		var timecode = addTimecode(url);
	} else {
		console.log(fileObj.timecode)
		var timecode = fileObj.timecode;
	}

	const date = new Date(parseInt(timecode,10)).toDateString();
	const converter = new showdown.Converter(); //Get a converter
	const postContent = converter.makeHtml(preconvertLatex(fileObj.file));
	const page = fillTemplate(basepage, {
		content: postContent,
		title: fileObj.title,
		subtitle: fileObj.subtitle,
		postdate: date
	})

	res.send(page);
})

//Anything in the public folder will be served from the root directory
app.use('/', (req, res) => {
	//console.log("Used bulk web handler")
	var file;

	//Attempt to load file
	try {
		if (path.extname(req.url) === "") { //Automatically serve index.html s
			file = fs.readFileSync(path.join("./public", req.url, "index.html"));
		} else {
			file = fs.readFileSync(path.join("./public", req.url));
		}

		//If error is thrown, send error page
	} catch (err) {
		sendErrorMessage(err, res);
		return;
	}

	//If no errors have been thrown, send file (with correct filetype)
	if (path.extname(req.url) === "") {
		res.type("html")
		res.send(file);
	} else {
		res.type("." + path.extname(req.url)) //Send correct filetype
		res.send(file);
	}
})

//Start the app
app.listen(port, () => {
	console.log(`Markdown Web Server listening at http://localhost:${port}`);
})


function preconvertLatex(mdstring) {
	var convertables = mdstring.matchAll(/```latex\n[^`]+\n```/g);
	for (var match of convertables) {
		var toConvert = match[0].substring(9, match[0].length - 4)
		console.log("Converting:" + toConvert);
		var converted = katex.renderToString(toConvert);
		console.log(match)
		mdstring = replace(mdstring, match.index, match.index + match[0].length, converted)
	}
	return mdstring;
}


function replace(replacestring, index1, index2, string) {
	var part1 = replacestring.substring(0, index1);
	var part2 = replacestring.substring(index2)
	console.log(`Part One: ${part1} \nString: ${string} \nPart Two: ${part2}`)
	return part1 + "<br>" + string + "<br>" + part2;
}

function searchDir(path) {
	const _dir = fs.readdirSync(path, { withFileTypes: true });
	var dir = [];
	for (var i = 0; i < _dir.length; i++) {
		if (_dir[i].name !== ".DS_Store") {
			if (_dir[i].isDirectory()) {
				dir.push({ name: _dir[i].name, type: 'dir', files: searchDir(path + '/' + _dir[i].name) });
			} else {
				dir.push({ name: _dir[i].name, type: 'file', loaded: false });
			}
		}
	}
	return dir;
}

function splitFile(poststring) { //Splits a md post into metadata and file
	var index = poststring.indexOf('\n');
	const title = poststring.substring(0, index);
	index++;
	var newIndex = poststring.indexOf('\n', index);
	const subtitle = poststring.substring(index, newIndex);
	newIndex++
	index = poststring.indexOf('\n', newIndex);
	const timecode = poststring.substring(newIndex, index);
	const file = poststring.substring(index);
	return {
		title: title,
		subtitle: subtitle,
		timecode: timecode,
		file: file
	}
}

/**
 * Inserts a string into a specific place in a file
 * 
 * @param {String} filePath Path to the file to insert data into
 * @param {Number} position Position to begin inserting
 * @param {String} string String to insert
 * @param {String | Buffer} [fileContents] If the file to be modified has already been loaded, you can pass it in here and avoid having to load it again.
 */

function addTimecode(filePath) { //Inserts a string into a specific place in a file
	var code = Date.now();
	var fileData = fs.readFileSync(filePath).toString();
	var insertIndex = fileData.indexOf("\n",fileData.indexOf("\n") + 1) + 1; //Get the position after the second newline (So the 3rd line)

	var fileEnd = fileData.substring(insertIndex);

	var file = fs.openSync(filePath, 'r+');
	var newFileEnd = code + "\n" + fileEnd;
	fs.writeSync(file, newFileEnd, insertIndex); //Replaces the end of the file with the timecode, followed by the rest of the file.
	fs.close(file);
	return code;
}

function fillTemplate(template, params) {
	var out = template;
	for (var p in params) {
		out = out.replace('$' + p + '$', params[p]);
	}
	return out;
}

function sendErrorMessage(err, res) {
	console.log("Failed, " + err.code)
	res.type("html");
	res.send("<h1>Error</h1>" + NLtoBR(errorMessages[err.code]));
}

function NLtoBR(string) {
	return string.replace(/(?:\r\n|\r|\n)/g, "<br>")
}