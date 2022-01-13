class Sprite {};
class Game{};
class Background{};

var game = new Game({
	init(O) {
		O.load("spritesheet", "sprites.json");
		O.screen.width = 180;
		O.screen.height = 120;
	},
	start() {
		var background = new Background("background");
		var sprite = new Sprite("orange",0,0);
	},
	loop(O) {
		if (O.input.x) {
			stop();
		}
	}
});

document.appendChild(game);