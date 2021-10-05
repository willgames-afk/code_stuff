const express = require("express");
const fs = require("fs")
const mime = require("mime-types")
const app = express();
const port = 8080;

app.use((req,res)=>{
	console.log(`GET ${"." + req.url}`)
	if (fs.lstatSync("."+req.url).isDirectory()) {
		console.log(req.url + ((req.url[req.url.length-1] == '/') ?  "" : "/") + "index.html")
		res.sendFile("." + req.url + ((req.url[req.url.length-1] == '/') ?  "" : "/") + "index.html",{root: "/home/runner/codestuff"} )
	} else {
		res.sendFile("."+req.url, {root: "/home/runner/codestuff/"});
	}
})

app.listen(port,()=>{
	console.log("Express Localhost Server Launched");
})