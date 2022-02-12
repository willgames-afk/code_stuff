
const SVGNS = document.documentElement.namespaceURI;

function makeRect(x, y, w, h, fill) {
	var self = makeSVGEl("rect");
	self.setAttribute("x", x);
	self.setAttribute("y", y);
	self.setAttribute("width", w);
	self.setAttribute("height", h);

	self.setAttribute("fill", fill);
	return self;
}
function makeG(fill, stroke, strokeWidth) {
	var self = makeSVGEl("g");
	self.setAttribute("fill", fill);
	self.setAttribute("stroke", stroke);
	self.setAttribute("stroke-width", strokeWidth);
	return self;
}
function makeSVG(iw,ih,xw,xh) {
	var self = makeSVGEl("svg");
	self.setAttributeNS(SVGNS, "viewBox",`0 0 ${iw} ${ih}`);
	self.setAttribute("width",xw);
	self.setAttribute("height",xh);
	self.setAttribute("xmlns",SVGNS)
	return self;
}
function makeSVGEl(name) {
	return document.createElementNS(SVGNS, name)
}


console.log (makeRect(0,0,"100%","100%","#696969"))

document.getElementById("mainSVG").appendChild(makeRect(0,0,"100%","100%","#696969"));