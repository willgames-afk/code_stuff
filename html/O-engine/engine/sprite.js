export class Sprite {
	constructor(tex, x, y, xv, yv, layer) {
		this.texture = tex;
		this.x = x;
		this.y = y;
		if (typeof layer !== "undefined") {
			this.layer = layer;
		} else if (typeof xv !== "undefined" && typeof yv === "undefined") {
			this.layer = xv
		} else {
			this.layer = 2;
		}
		if (typeof xv !== "undefined") {
			this.xv = xv;
		} else {
			this.xv = 0;
		}
		if (typeof yv !== "undefined") {
			this.yv = yv;
		} else {
			this.yv = 0;
		}

		this.frame = 0;
	}
}