//Loading of modules
const fs = require('fs');            //Files
const express = require('express');  //Server
const showdown = require("showdown");//Markdown to HTML
const katex = require("katex");      //LATeX to HTML
const { getMaxListeners } = require('process');

//Setup
const app = express();
const port = 3000;

//error code lookup
const errorMessages = {
	ENOENT: "Couldn't find this file :( \n(ENOENT)",
	EACCES: "Sorry, but you don't have access to that! \n(EACCES)",
	ECONNREFUSED: "Connection Refused. \n(ECONNREFUSED)",
	ECONNRESET: "Connection reset by peer. :( \n(ECONNRESET)",
	EMFILE: "Too many open files in system. (Probably due to Will writing bad code) \n(EMFILE)",
	ENOTFOUND: "DNS lookup failed. \n(ENOTFOUND)",
	EPERM: "Sorry,but you don't have the permissions to do that. \n(EPERM)",
	ETIMEDOUT: "Timed Out :( \nMaybe try refresing? \n(ETIMEDOUT)",
}


//Resource Loading
const res_dir = "./resources/"
function loadpage(url) {
	return fs.readFileSync(res_dir + url + ".html").toString();
}
const basepage = loadpage("post") //Page Template
const index = loadpage("index")   //Site Index.html
var publicFiles = searchDir('./public');
console.dir(publicFiles, { depth: null });

//express app setup
app.get('/', (req, res) => {
	res.send(index)
});

//Anything in the images folder is fair game.
app.use('/public/', (req, res) => {
	try {
		res.send(fs.readFileSync("./public/" + req.url));
	} catch (err) {
		res.send("<h1>Error</h1>" + errorMessages[err.code].replace(/(?:\r\n|\r|\n)/g, '<br>'))
	}
})

//Resources
app.use('/resources/', (req, res) => {
	res.type("." + req.url.replace(/.+\./, "")) //Send correct filetype
	res.send(fs.readFileSync("./resources/" + req.url));
})

//Blog posts are stored as Markdown which needs to be converted to HTML
app.use('/blog/', (req, res) => {
	if (req.path == '/') {
		res.send(basepage.replace('$content$', "Blog Homepage"))
		return
	} else if (req.path) {

	}
	const converter = new showdown.Converter(); //Get a converter
	const rawfile = fs.readFileSync("./posts/" + req.url + '.md'); //Get the file
	const fileObj = splitFile(rawfile.toString());
	if (!fileObj.timecode) {

	}

	const mainPage = converter.makeHtml(preconvertLatex(fileObj.file));

	res.send();
})

//Start the app
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
})


function preconvertLatex(mdstring) {
	console.log(mdstring);
	var convertibles = mdstring.matchAll(/```latex\n[^`]+\n```/g);
	for (var match of convertibles) {
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


function insertStringSync(filePath, position, string, fileContents) { //Inserts a string into a specific place in a file
	try {
		var fileData = fileContents ? fileContens : fs.readFileSync(filePath);
		var file_content = (typeof fileData == "string") ? fileData : fileData.toString();
		file_content = file_content.substring(position);
		var file = fs.openSync(file_path, 'r+');
		var bufferedText = new Buffer.from(new_text + file_content);
		fs.writeSync(file, bufferedText, 0, bufferedText.length, position);
		fs.close(file);
	} catch (err) {
		throw err;
	}
}