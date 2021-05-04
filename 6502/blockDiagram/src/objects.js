export class Point {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	get 0() { return this.x };
	get 1() { return this.y };
}

export class Rectangle {
	constructor(x = 0, y = 0, width = 0, height = 0) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	get x1() { return this.x };
	get y1() { return this.y };
	set x1(v) {
		this.x = v;
	};
	set y1(v) {
		this.y = v;
	};
	get x2() { return this.x + this.width; }
	set x2(v) {
		this.width = v - this.x;
	}
	get y2() { return this.y + this.height; }
	set y2(v) {
		this.height = v - this.y ;
	}
	get position() { return this.p1 }
	set position(v) { this.p1 = v }
	get p1() { return new Point(this.x, this.y) };
	set p1(v) {
		this.x = v[0];
		this.y = v[1];
	}
	get p2() { return new Point(this.x2, this.y2) };
	set p2(v) {
		this.x2 = v[0];
		this.y2 = v[1];

	}
}
export class RenderableRect extends Rectangle {
	constructor(x, y, w, h, s = {
		fill: true,
		fillColor: 'rgb(20,20,20)',
		outline: false,
		borderWeight: '1px'
	}, c) {
		super(x, y, w, h);
		this.style = s;
		if (c) {
			this.context = c;
		}
		if (this.style.fill && !this.style.fillColor) {
			console.error('RenderableRect Error: fillColor not defined');
		}
		if (this.style.outline && !(this.style.borderColor)) {
			console.error('RenderableRect Error: borderColor not defined');
		}
	}
	drawToCanvas(c) {
		var ctx = c || this.context;
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		if (this.style.fill) {
			ctx.fillStyle = this.style.fillColor;
			ctx.fill();
		}
		if (this.style.outline) {
			ctx.strokeStyle = this.style.borderColor;
			ctx.lineWidth = this.style.borderWeight;
			ctx.stroke();
		}

	}
}
class EndPoint extends Point {
	constructor(x, y, d) {
		super(x, y);
		this.direction = d;
	}
}
export class Connection {
	constructor(x1, y1, d1, x2, y2, d2) {
		this.points = [];
		this.points.push(new Point(x1, y1));
		this.points.push(new Point(x2, y2));
		this.endpoints = [
			new EndPoint(x1, y1, d1),
			new EndPoint(x2, y2, d2)
		]
	}
}
export class Block extends RenderableRect {
	constructor(x = 0, y = 0, w = 0, h = 0, l = '', st = 1, s = {
		fill: true,
		fillColor: 'rgb(20,20,20)',
		outline: false,
		borderWeight: '1px',
		textColor: 'rgb(200,200,200)',
		strokeText: false
	}, c = [], i) {
		super(x, y, w, h, s);
		this.label = l;
		this.connections = c;
		if (i) {
			this.internals = i;
		}
		this.state = st;
	}
	renderToCanvas(c) {
		//Draw the base rectangle;
		this.drawToCanvas(c);
		var ctx = c || this.context;
		ctx.fillStyle = this.style.textColor;
		if (this.style.font) {
			ctx.font = this.style.font;
		}
		if (this.style.strokeText) {
			ctx.strokeText(
				this.blocks[i].name,
				this.blocks[i].x1 + (this.blocks[i].width / 2) - (ctx.measureText(this.blocks[i].name).width / 2),
				//X-pos of block + offset to get the x of the text center - 1/2 of text's length to get the text centered
				this.blocks[i].y1 + (this.blocks[i].height / 2)
			)
		} else {
			ctx.fillText(
				this.blocks[i].name,
				this.blocks[i].x1 + (this.blocks[i].width / 2) - (ctx.measureText(this.blocks[i].name).width / 2),
				//X-pos of block + offset to get the x of the text center - 1/2 of text's length to get the text centered
				this.blocks[i].y1 + (this.blocks[i].height / 2)
			)
		}
	}
}