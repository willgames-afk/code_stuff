var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth
canvas.height = window.innerHeight
var mince = {
    rafts: [],
    fragments: [],
    create(x, y, s, c) {
        mince.rafts.push({
            x: x,
            y: y,
						xVel: (Math.random()*20)-10,
						yVel: -10,
            si: s,
            co: c,
            rot: Math.round(Math.random() * 360 * (Math.PI / 180))
        });
    },
    render(rafts,fragments) {
				canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        for (i=0;i<rafts.length;i++) {
            data = rafts[i]
            ctx.save()
            ctx.fillStyle = data.co
            ctx.translate(data.x,data.y)
            ctx.rotate(data.rot)
            ctx.fillRect(0,0,data.si,data.si*1.88)
            ctx.restore()
        }
        for (fragm in fragments) {

        }
    },
    main() {
				mince.process()
        mince.render(mince.rafts,mince.fragments)
        console.log('I Live')
        requestAnimationFrame(mince.main)
    },
		process(mousex,mousey) {
				for (i=0;i<mince.rafts.length;i++) {
					data = mince.rafts[i]
					//gravity
					if (data.yVel < 30) {
						data.yVel += 1
					}
					//apply velocities
					data.x += data.xVel
					data.y += data.yVel
					console.log(data)
					//get rid of stuff too far off the screen
					if (!mince.inCanvas(data.x,data.y,100)) {
						mince.rafts.shift(i,1)
					}
				}
		},
		rIC(x,y,padding) {
			if (x && y) {
				return [((Math.random()*canvas.width-2*padding)+padding),((Math.random()*canvas.height-2*padding)+padding)]
			}
			if (y) {
				return ((Math.random()*canvas.height-2*padding)+padding)
			}
			if (x) {
				return ((Math.random()*canvas.width-2*padding)+padding)
			}
		},
		inCanvas(x,y,padding) {
			if (x < -padding || x > canvas.width+padding || y < -padding || y > canvas.height+padding){
				return false
			} else {
				return true
			}
		},
		intersects(a,b,c,d,p,q,r,s) {//checks to see if a line from a,b to c,d intersects with the line from p,q to r,s.
  		var det, gamma, lambda;
  		det = (c - a) * (s - q) - (r - p) * (d - b);
  		if (det === 0) {
    		return false;
  		} 
			else {
    		lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    		gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    		return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  		}
		}
};

window.onload = function() {
    mince.create(mince.rIC(true,false,100),mince.rIC(false,true,100),100,'rgb(10,20,3)')
    mince.main();
};
