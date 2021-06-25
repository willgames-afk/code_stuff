import * as Color from "./colors"

const PXWIDTH = 640, PXHEIGHT = 480

var canvas = document.getElementById("maincanvas");
canvas.width = PXWIDTH;
canvas.height = PXHEIGHT;
var ctx = canvas.getContext("2d");
var imgdata = ctx.getImageData(0, 0, PXWIDTH, PXHEIGHT);
var img = imgdata.data;

