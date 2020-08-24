things = {
    noms: [],
    configs: {

    },
    make(
        x = things.randomXInCanvas(10),
        y = things.randomYInCanvas(10),
        color = things.randomColor(),
        xVel = Math.random() * 2 - 1,
        yVel = Math.random() * 2 - 1,
        mass = 10,
        radius = 10
    ) {
        if (typeof x == 'object' && !Array.isArray(x)) {
            //if it is an object and not an array
            y = x.y
            color = x.color
            xVel = x.xVel
            yVel = x.yVel
            x = x.x
        }
        things.noms.push({ x: x, y: y, xVel: xVel, yVel: yVel, color: color, mass: mass, radius: radius, colliding: false })
    },
    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (i = 0; i < things.noms.length; i++) {
            nom = things.noms[i]
            ctx.beginPath()
            ctx.arc(nom.x, nom.y, 10, 0, 2 * Math.PI, false)
            ctx.fillStyle = nom.color
            ctx.fill()
        }
    },
    process() {

        for (i = 0; i < things.noms.length; i++) {
            var nom = things.noms[i]
            //move noms
            nom.x += nom.xVel
            nom.y += nom.yVel

            //check wall collision
            if (nom.x < nom.radius) {
                nom.xVel = 0 - nom.xVel
                nom.x = nom.radius
            } else if (nom.x > canvas.width - nom.radius) {
                nom.xVel = 0 - nom.xVel
                nom.x = canvas.width - nom.radius
            }
            if (nom.y < nom.radius) {
                nom.yVel = 0 - nom.yVel
                nom.y = nom.radius
            } else if (nom.y > canvas.height - 10 && !nom.wallcollide) {
                nom.yVel = 0 - nom.yVel
                nom.y = canvas.height - nom.radius
            }

            if (things.noms.length > 1) {

                //check collision with other noms
                nom.closest = things.findClosest(i)
                if (nom.closest.distance < 20) {

                    if (!nom.colliding) {

                        var nom2 = things.noms[nom.closest.index]

                        nom.colliding = true
                        nom2.colliding = true

                        //calculating new velocities
                        var newxVel1 = (nom.xVel * (nom.mass - nom2.mass) + (2 * nom2.mass * nom2.xVel)) / (nom.mass + nom2.mass);
                        var newyVel1 = (nom.yVel * (nom.mass - nom2.mass) + (2 * nom2.mass * nom2.yVel)) / (nom.mass + nom2.mass);
                        var newxVel2 = (nom2.xVel * (nom2.mass - nom.mass) + (2 * nom.mass * nom.xVel)) / (nom.mass + nom2.mass);
                        var newyVel2 = (nom2.yVel * (nom2.mass - nom.mass) + (2 * nom.mass * nom.yVel)) / (nom.mass + nom2.mass);
                        //applying new velocities
                        nom.xVel = newxVel1
                        nom.yVel = newyVel1
                        nom2.xVel = newxVel2
                        nom2.yVel = newyVel2
                    }

                } else {
                    nom.colliding = false;
                }
            }
        }
    },
    findClosest(thingNumber) {
        //finds distances to all points, then sorts them and returns 
        //the index of the closest dot, as well as the distance to that dot.
        distances = things.findDistances(thingNumber)
        distances.sort((a, b) => a.distance - b.distance)
        return distances[0]
    },

    findFurthest(thingNumber) {
        //same as findClosest but sorts the opposite way
        distances = things.findDistances(thingNumber)
        distances.sort((a, b) => b.distance - a.distance)
        return distances[0]
    },

    findDistances(thingNumber) {
        //calculates the distances from the a point to all other points
        noms = things.noms //convinience
        distances = []
        for (i2 = 0; i2 < noms.length; i2++) {

            if (i2 === thingNumber) {
                //Don't count yourself!
                continue;
            }

            //calculate the distance
            yDist = Math.abs(noms[i2].y - things.noms[thingNumber].y)
            xDist = Math.abs(noms[i2].x - things.noms[thingNumber].x)
            //push it to distances
            distances.push({ index: i2, distance: Math.sqrt(yDist * yDist + xDist * xDist) })

        }
        return distances
    },
    rgbify(r, g, b) {
        //returns an RGB string from 3 rgb values.
        return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    randomColor() {
        //returns a random color in the form of an RGB string
        return things.rgbify(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255))
    },
    main() {
        //mainloop
        things.process()
        things.render()
        requestAnimationFrame(things.main)
    },
    randomXInCanvas(pad) {
        //returns a random x coordanate inside canvas with padding.
        return (Math.random() * (canvas.width - 2 * pad)) + pad
    },
    randomYInCanvas(pad) {
        //same as randomXInCanvas but for Y coordanate
        return (Math.random() * (canvas.height - 2 * pad)) + pad
    },
    resize(){
        //resize handler
        //console.log('resize detected')
        if (document.body.scrollWidth > window.innerWidth) {
            canvas.width = document.body.scrollWidth 
        } else {
            canvas.width = window.innerWidth
        }
        if (document.body.scrollHeight > window.innerHeight) {
            canvas.height = document.body.scrollHeight 
        } else {
            canvas.height = window.innerHeight
        }
    },
}

canvas = document.getElementById('dotcanvas')
ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
window.onresize = things.resize