/*things.process = function() {
    canvas.width = window.innerWidth     //Makes canvas the same size as window, no matter what window does   
    canvas.height = window.innerHeight
    for (i=things.noms.length-1;i>=0;i--) {
        nom = things.noms[i]
        nom.x += nom.xVel
        nom.y += nom.yVel
        if (nom.x<1 || nom.x>canvas.width) {
            nom.xVel = 0-nom.xVel
        }
        if (nom.y<1 || nom.y>canvas.height) {
            nom.yVel = 0-nom.yVel
        }
    }
}*/

function click(e) {
    things.make(e.clientX,e.clientY,things.randomColor())
}

//window.addEventListener("mousedown", click, false)
//for (i=0;i<10;i++) {
//    things.make(undefined,undefined,things.randomColor())
//}
things.make(20, 20, 'rgb(0,0,0)',1,0)
things.make(50,20,things.randomColor(),0,0)

window.onload = function(){requestAnimationFrame(things.main)}
/*for (k=0;k<20;k++) {
    things.process()
}
*/