canvas = document.getElementById('dotcanvas')
ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
things = {
    noms: [],
    make(
        x = things.randomXInCanvas(10), 
        y = things.randomYInCanvas(10), 
        color, 
        xVel = Math.random() * 2 - 1, 
        yVel = Math.random() * 2 - 1
        ) {
        things.noms.push({ x: x, y: y, xVel: xVel, yVel: yVel, color: color, mass: 10, radius: 10, colliding:false })
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
        canvas.width = window.innerWidth     //Makes canvas the same size as window, no matter what window does   
        canvas.height = window.innerHeight
        for (i = things.noms.length - 1; i >= 0; i--) {
            nom = things.noms[i]
            nom.x += nom.xVel
            nom.y += nom.yVel
            if (nom.x < 10 || nom.x > canvas.width - 10) {
                nom.xVel = 0 - nom.xVel
            }
            if (nom.y < 10 || nom.y > canvas.height - 10) {
                nom.yVel = 0 - nom.yVel
            }
            if (things.noms.length > 1 && !nom.colliding) {
                nom.closest = things.findClosest(i)
                //console.log(nom.closest)
                if (nom.closest.distance < 20) {
                    nom.colliding = true
                    //console.log('Collision!!'+JSON.stringify(nom.closest))
                    nom2 = things.noms[nom.closest.index]
                    nom2.colliding = true
                    console.log(nom2)
                    console.log(nom)

                    nom.xVel = nom2.xVel//(nom.xVel * (nom.mass - nom2.mass) + (2 * nom2.mass * nom2.xVel)) / (nom.mass + nom2.mass);
                    nom.yVel = nom2.yVel//(nom.yVel * (nom.mass - nom2.mass) + (2 * nom2.mass * nom2.yVel)) / (nom.mass + nom2.mass);
                    nom2.xVel = nom.xVel//(nom2.xVel * (nom2.mass - nom.mass) + (2 * nom.mass * nom.xVel)) / (nom.mass + nom2.mass);
                    nom2.yVel = nom.yVel//(nom2.yVel * (nom2.mass - nom.mass) + (2 * nom.mass * nom.yVel)) / (nom.mass + nom2.mass);
                    console.log(JSON.stringify(nom2)+JSON.stringify(nom))
                    things.noms[nom.closest.index] = nom2

                }
            }
        }
    },
    findClosest(thingNumber) {
        distances = things.findDistances(thingNumber)
        distances.sort((a, b) => a.distance - b.distance)
        console.log(distances)
        return distances[0]
    },
    findFurthest(thingNumber) {
        distances = things.findDistances(thingNumber)
        distances.sort((a, b) => b.distance - a.distance)
        return distances[0]
    },
    findDistances(thingNumber) {
        noms = things.noms
        distances = []
        for (i2 = 0; i2 < noms.length; i2++) {

            console.log(i2)  // uses i2 to prevent things calling it from having their is messed up
            yDist = Math.abs(noms[i2].y - things.noms[thingNumber].y)
            xDist = Math.abs(noms[i2].x - things.noms[thingNumber].x)
            distances.push({ index: i2, distance: Math.sqrt(yDist * yDist + xDist * xDist) })

        }
        final = distances.sli(0,1)
        console.log(distances)
        console.log(final)
        return final
    },
    rgbify(r, g, b) {
        return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    randomColor() {
        return things.rgbify(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255))
    },
    main() {
        things.process()
        things.render()
        requestAnimationFrame(things.main)
    },
    randomXInCanvas(pad) {
        return (Math.random() * (canvas.width - 2 * pad)) + pad
    },
    randomYInCanvas(pad) {
        return (Math.random() * (canvas.height - 2 * pad)) + pad
    },
}