//Loading of modules
const fs = require('fs');            //Files
const express = require('express');  //Server
const showdown = require("showdown");//Markdown to HTML
const katex = require("katex");      //LATeX to HTML

//Setup
const app = express();
const port = 3000;

//error code lookup
const errorMessages = {
	ENOENT: "Couldn't find this file :( \n(ENOENT)",
	EACCES: "Sorry, but you don't have access to that! \n(EACCES)",
	ECONNREFUSED: "Connection Refused. \n(ECONNREFUSED)" ,
	ECONNRESET: "Connection reset by peer. :( \n(ECONNRESET)" ,
	EMFILE: "Too many open files in system. (Probably due to Will writing bad code) \n(EMFILE)",
	ENOTFOUND: "DNS lookup failed. \n(ENOTFOUND)",
	EPERM: "Sorry,but you don't have the permissions to do that. \n(EPERM)" ,
	ETIMEDOUT: "Timed Out :( \nMaybe try refresing? \n(ETIMEDOUT)",
}


//Resource Loading
const res_dir = "./resources/"
const basepage = fs.readFileSync(res_dir + "base.html").toString(); //Page Template
var publicFiles = searchDir('./public');
console.dir(publicFiles, {depth: null});

//express app setup
app.get('/', (req, res) => {
	res.send(basepage.replace('$content$', "<p>Hello World!</p>"))
});

//Anything in the images folder is fair game.
app.use('/public/',(req,res)=>{
	try {
		res.send(fs.readFileSync("./public/"+req.url));
	} catch (err) {
		res.send("<h1>Error</h1>" + errorMessages[err.code].replace(/(?:\r\n|\r|\n)/g, '<br>'))
	}
})

//Resources
app.use('/resources/',(req,res)=>{
	res.type("."+req.url.replace(/.+\./,"")) //Send correct filetype
	res.send(fs.readFileSync("./resources/"+req.url));
})

//Blog posts are stored as Markdown which needs to be converted to HTML
app.use('/blog/', (req, res) => {
	if (req.path == '/') {
		res.send(basepage.replace('$content$', "Blog Homepage"))
		return
	}
	const converter = new showdown.Converter(); //Get a converter
	const file = fs.readFileSync("./posts/" + req.url + '.md') //Get the file
	const mainPage = basepage.replace("$content$", converter.makeHtml(preconvertLatex(file.toString())))
	
	res.send();
})

//Start the app
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
})


function preconvertLatex (mdstring) {
	console.log(mdstring);
	var convertibles = mdstring.matchAll(/```latex\n[^`]+\n```/g);
	for (var match of convertibles) {
		var toConvert = match[0].substring(9,match[0].length-4)
		console.log("Converting:"+toConvert);
		var converted = katex.renderToString(toConvert);
		console.log(match)
		mdstring = replace(mdstring,match.index,match.index + match[0].length,converted)
	}
	return mdstring;
}


function replace(replacestring,index1,index2,string) {
	var part1 = replacestring.substring(0,index1);
	var part2 = replacestring.substring(index2)
	console.log(`Part One: ${part1} \nString: ${string} \nPart Two: ${part2}`)
	return part1 + "<br>" + string +"<br>"+ part2;
}

function searchDir(path) {
	const _dir = fs.readdirSync(path,{withFileTypes: true});
	var dir = [];
	for (var i=0;i<_dir.length;i++) {
		if (_dir[i].name !== ".DS_Store") {
			if (_dir[i].isDirectory()) {
				dir.push({name: _dir[i].name, type: 'dir', files: searchDir(path + '/' + _dir[i].name)});
			} else {
				dir.push({name: _dir[i].name, type: 'file', loaded: false});
			}
		}
	}
	return dir;
}

function hasFile(path) {
	var re
}