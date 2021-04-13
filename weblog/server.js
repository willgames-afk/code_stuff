//Built-in node modules
const fs = require("fs");

//External modules
const express = require('express');
const {create} = require('xmlbuilder2')

//Class Declarations
class FileName extends String {
	constructor(v) {
		super(v)
	}
	get name() {
		return this.getName();
	}
	getName() {
		return this.valueOf().replace(/\.[\s\S]+/, "");
	}
	get extention() {
		return this.getExtention();
	}
	getExtention() {
		return this.valueOf().replace(/((?!\.).)+/, "");
	}
}


//App Config
const app = express();
const port = 3000;
var postnames = [];
const postpath = "./posts/"
const postExtentions = [
	".txt",
	".xml",
	".post",
	'.wp'
]
updatePosts();

app.use('/blog', (req, res) => {
	console.log(`${req.method} ${req.url}`)
	//Serve blog homepage
	if (req.url == '/') {
		res.send('Blog Homepage!');
		return
	}
	//If no post, return error.
	var postFilename = postnames.find(value => { return value.name == req.url.slice(1) })
	if (!postFilename) {
		console.log(`404; blog post not found.`)
		res.status(404).send(`I couldn't find ${req.url}...`)
		return
	}

	//If we got to this point, the user requsted an existing blog post, so get it:
	console.log(postpath + postFilename)
	var data = fs.readFileSync(postpath + postFilename).toString();
	
	const doc = create("<root>"+data+"</root>");
	console.log(doc);
})

app.get('/', (req, res) => {
	console.log(`${req.method} ${req.url}`)
	res.send("Homepage!");
})

app.listen(port, () => {
	console.log(`Listening on port ${port} (http://localhost:${port})`);
})

function updatePosts() {
	const files = fs.readdirSync(postpath);
	console.group(`Finding Blog Files in directory ${postpath}`)
	files.forEach(entry => {
		const fn = new FileName(entry);
		if (postExtentions.includes(fn.extention)) {
			console.log(`Found File "${fn.name}" (${fn.extention})`)
			postnames.push(fn)
		} else {
			console.log(`Ignored File "${fn.name}" because it had a bad filetype (${fn.extention})`)
		}
	})
	console.groupEnd();
}