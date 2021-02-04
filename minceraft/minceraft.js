var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth
canvas.height = window.innerHeight
var mince = {
	rafts: [],
	fragments: [],
	mouseLineTable: [],
	create(x, y, s, c) {
		mince.rafts.push({
			x: x,
			y: y,
			xVel: (Math.random() * 20) - 10,
			yVel: -10,
			si: s,
			co: c,
			rot: Math.round(Math.random() * 360 * (Math.PI / 180))
		});
	},
	render(rafts, fragments, mouseLineTable) {
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
		for (i = 0; i < rafts.length; i++) {
			data = rafts[i]
			ctx.beginPath();
			ctx.save()
			ctx.fillStyle = data.co
			ctx.translate(data.x, data.y)
			ctx.rotate(data.rot)
			ctx.fillRect(0, 0, data.si, data.si * 1.88)
			ctx.restore()
			ctx.arc(data.x, data.y, 10, 0, 2 * Math.PI)
			ctx.fill();
		}
		for (fragm in fragments) {

		}
		ctx.beginPath()
		ctx.fillStyle = 'rgb(0,0,0)'
		ctx.moveTo(mouseLineTable[0].x, mouseLineTable[0].y);
		for (segment of mouseLineTable) {
			ctx.lineTo(segment.x, segment.y)
		}
		ctx.stroke();
	},
	main() {
		mince.process(mouseX, mouseY);
		mince.render(mince.rafts, mince.fragments, mince.mouseLineTable);
		requestAnimationFrame(mince.main);
	},
	process(mousex, mousey) {
		var len = JSON.parse(JSON.stringify(mince.rafts.length));
		for (i = 0; i < len; i++) {
			var data = mince.rafts[i]
			if (!data) {
				continue;
			}
			//gravity
			if (data.yVel < 30) {
				data.yVel += 0.1
			}
			//apply velocities
			data.x += data.xVel
			data.y += data.yVel
			//get rid of stuff too far off the screen
			if (!mince.inCanvas(data.x, data.y, 0)) {
				mince.rafts.splice(i, 1)
			}
		}
		mince.mouseLineTable.push({ x: mousex, y: mousey });
		if (mince.mouseLineTable.length > 10) {
			mince.mouseLineTable.shift()
		}

	},
	rIC(x, y, padding) {
		if (x && y) {
			return [((Math.random() * canvas.width - 2 * padding) + padding), ((Math.random() * canvas.height - 2 * padding) + padding)]
		}
		if (y) {
			return ((Math.random() * canvas.height - 2 * padding) + padding)
		}
		if (x) {
			return ((Math.random() * canvas.width - 2 * padding) + padding)
		}
	},
	inCanvas(x, y, padding) {
		if (x < 0 - padding || x > canvas.width + padding || y < 0 - padding || y > canvas.height + padding) {
			return false
		} else {
			return true
		}
	},
	intersects(a, b, c, d, p, q, r, s) {//checks to see if a line from a,b to c,d intersects with the line from p,q to r,s.
		//Make sure neither of the lines are length 0
		if ((a == c && b == d) || (p == r && q == s)) {
			return false
		}

		var det, gamma, lambda;
		det = (c - a) * (s - q) - (r - p) * (d - b);

		//Lines are parallel
		if (det === 0) {
			return false;
		}

		lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
		gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;

		if ((0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)) {
			return {
				x: a + lambda * (c - a),
				y: b + lambda * (d - b)
			}
		};
		return false;
	}
};

window.onload = function () {
	function makeRaft() {
		mince.create(mince.rIC(true, false, 100), canvas.height, 100, 'rgb(10,20,3)');
		setTimeout(makeRaft, Math.random() * 1000);
	}
	window.setTimeout(function (e) {
		makeRaft();
	}, 1000)

	mince.main();
};

var mouseX = 0, mouseY = 0;

window.addEventListener("mousemove", (e) => {
	window.mouseX = e.x;
	window.mouseY = e.y
})