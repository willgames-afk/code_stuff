import * as Graphics from "./src/graphics.js"
import {log,optLog} from "./src/logging.js"
log("Main is up and running!")

var disp = new Graphics.Display(document.body, window.innerWidth, window.innerHeight);
var renderer = new Graphics.Rendererer(disp);
renderer.render();