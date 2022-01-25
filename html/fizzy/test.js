import {Game} from "./engine/main.js"

var game = new Game({
	init(O) {
		O.load("spritesheet", "sheet.json");
		O.width = 180;
		O.height = 120;
	},
	start(O) {
		O.make("orange","banana",0,0);
	},
	loop(O) {
		/*if (O.input.x) {
			stop();
		}*/
	}
});

document.body.appendChild(game.canvas);