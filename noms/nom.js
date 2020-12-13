things = {
    noms: [],
    lines: [],
    configs: {
        connectLinesByHover: false,
        lineValuesShown: false,
        dotValuesShown: false,
        physicsQuality: 1,
        /*
        0: No phisics at all, noms can pass straight through each other

        1: lowest quality physics; each nom will only check for collision against the nearest nom to it
        and noms at high speed may glith through other noms entirely.

        2 (recommended): noms use an AABB to check for collision against all other noms, high speed noms 
        can still glitch through other noms

        3 highest quality physics; same as 2 except High Speed noms can no longer glitch through other 
        noms
        */
        wallCollision: true,
        gravityY: 0,
        gravityX: 0,
        maxVel: 19,
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
            mass = x.mass
            radius = x.radius
        }
        things.noms.push({
            x: x,
            y: y,
            xVel: xVel,
            yVel: yVel,
            color: color,
            mass: mass,
            radius: radius,
            colliding: false,
            rotation: Math.atan2(yVel,xVel),
            aabb: {
                x: x - radius,
                y: y - radius,
                width: 2 * radius,
                height: 2 * radius,

            }
        })
    },
    makeLine(p1, p2, value, color = 'rgb(0,0,0)') {
        things.lines.push({ p1: p1, p2: p2, value: value, color: color })
    },
    makeRect(x,y,width,height,mass,xVel=0,yVel=0,color) {
        if (typeof x == 'object' && !Array.isArray(x)) {
            //if it is an object and not an array
            y = x.y
            color = x.color
            xVel = x.xVel
            yVel = x.yVel
            x = x.x
            width = x.width
            height = x.height
            mass = x.mass
        }
        things.noms.push({
            x:x,
            y:y,
            xVel:xVel,
            yVel:yVel,
            color:color,
            mass:mass,
            width:width,
            height:height,
        })
    },
    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (i = 0; i < things.lines.length; i++) {
            line = things.lines[i]
            lineCoords = { x1: things.noms[line.p1].x, y1: things.noms[line.p1].y, x2: things.noms[line.p2].x, y2: things.noms[line.p2].y }
            ctx.fillStyle = line.color
            ctx.beginPath()
            ctx.moveTo(lineCoords.x1, lineCoords.y1)
            ctx.lineTo(lineCoords.x2, lineCoords.y2)
            ctx.stroke()
        }
        for (i = 0; i < things.noms.length; i++) {
            nom = things.noms[i]
            ctx.beginPath()
            ctx.arc(nom.x, nom.y, 10, 0, 2 * Math.PI, false)
            ctx.fillStyle = nom.color
            ctx.fill()
        }
    },
    process() {
        if (things.configs.physicsQuality > 0) {
            things.processPhysics()
        }
    },
    processPhysics() {
        var AABBCollisionBuffer = []
        var config = things.configs
        var i, k
        for (i = 0; i < things.noms.length; i++) {
            var nom = things.noms[i]
            //move noms & apply gravity
            nom.x += nom.xVel
            nom.y += nom.yVel
            nom.yVel += config.gravityY
            nom.xVel += config.gravityX

            //make sure velocities don't exceed the max
            if (nom.xVel > config.maxVel) {
                nom.xVel = config.maxVel
            }
            if (nom.yVel > config.maxVel) {
                nom.yVel = config.maxVel
            }

            //check wall collision (if we need to)
            if (config.wallCollision) {
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
            }

            //check nom-nom collision (if there are at least two noms)
            if (things.noms.length > 1) {
                if (config.physicsQuality == 1) {

                    //only checks against the closest nom
                    closest = things.findClosest(i)
                    if (closest.distance < nom.radius + things.noms[closest.index].radius) {
                        //if we havent already processed the collision
                        if (!nom.colliding) {
                            nom.colliding = true
                            things.noms[closest.index].colliding = true
                            things.processNomCollision(i, closest.index)
                        }
                    } else {
                        nom.colliding = false;
                    }
                } else if (config.physicsQuality >= 2) {
                    //for physicsQuality 2 we have to do an AABB check to save on system resources
                    //if (i < things.noms.length - 1) { //don't have to check the last AABB because it will have already been checked against all other AABBs
                        for (k = i; k < things.noms.length; k++) {
                            //check AABB collision for nom #i and nom #k
                            aabb1 = nom.aabb
                            aabb2 = things.noms[k].aabb
                            if (aabb1.x < aabb2.x + aabb2.width &&
                                aabb1.x + aabb1.width > aabb2.x &&
                                aabb1.y < aabb2.y + aabb2.height &&
                                aabb1.y + aabb1.height > aabb2.y) {
                                //We have an AABB collision! Stick it in the buffer to deal with later.
                                AABBCollisionBuffer.push({nomIndex1:k, nomIndex2:i})
                            }
                        }
                    //}
                }
            }
        }
        //now we deal with any AABB collisions we found 6 brackets ago
        if (! (AABBCollisionBuffer.length == 0)) {
            console.log(AABBCollisionBuffer.length)
            for (i=0;i<AABBCollisionBuffer.length;i++) {
                var nomIndex1 = AABBCollisionBuffer[i].nomIndex1;
                var nomIndex2 = AABBCollisionBuffer[i].nomIndex2;
                var nom1 = things.noms[nomIndex1];
                var nom2 = things.noms[nomIndex2];
                if (things.findDistance(nomIndex1,nomIndex2) < nom1.radius+nom2.radius) {
                    nom1.colliding = true;
                    nom2.colliding = true;
                    things.processNomCollision(nomIndex1,nomIndex2);
                }
            }
            //We've processed through all the AABB collisions, so we can clear the AABB buffer
            AABBCollisionBuffer = [];
            console.log(AABBCollisionBuffer.length)
        }
    },
    processNomCollision(nomIndex1, nomIndex2) {
        //locating noms
        nom = things.noms[nomIndex1]
        nom2 = things.noms[nomIndex2]

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
    },
    findClosest(nomIndex) {
        //finds distances to all points, then sorts them and returns 
        //the index of the closest dot, as well as the distance to that dot.
        distances = things.findDistances(nomIndex)
        distances.sort((a, b) => a.distance - b.distance)
        return distances[0]
    },
    findFurthest(nomIndex) {
        //same as findClosest but sorts the opposite way
        distances = things.findDistances(nomIndex)
        distances.sort((a, b) => b.distance - a.distance)
        return distances[0]
    },
    findDistances(nomIndex) {
        //calculates the distances from the a point to all other points
        noms = things.noms //convinience
        distances = []
        for (i2 = 0; i2 < noms.length; i2++) {
            if (i2 === nomIndex) {
                //Don't count yourself!
                continue;
            }
            //Calculate distance and store it
            distances.push({ index: i2, distance: things.findDistance(nomIndex,i2)})

        }
        return distances
    },
    findDistance(nomIndex1,nomIndex2) {
        //calculates the distance between 2 noms
        return Math.hypot(Math.abs(things.noms[nomIndex1].x - things.noms[nomIndex2].x), Math.abs(things.noms[nomIndex1].y - things.noms[nomIndex2].y))
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
    resize() {
        //resize handler
        //console.log('resize detected')
        if (document.body.scrollWidth > window.innerWidth) {
            canvas.width = document.body.scrollWidth + document.body.style.marginleft + document.body.style.marginRight
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
window.onresize = things.resize