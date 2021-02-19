function applyStyle(element, style) {
	for (var s in style) {
		element.style[s] = style[s]
	}
}
class CQEditor {
	constructor(htmlElement) {
		this.map = {
			data: [

			],
			startText: "",
			directions: { 
				"north": { "x": 0, "y": -1, "opp": "south" }, 
				"south": { "x": 0, "y": 1, "opp": "north" }, 
				"east": { "x": 1, "y": 0, "opp": "west" }, 
				"west": { "x": -1, "y": 0, "opp": "east" } 
			}
		}
		this.player = {
			x: 0,
			y: 0,
			lastMove: 'not',
			inventory: {}
		};
		this.items = {};
		this.container = htmlElement;
		this.style = {
			dataTable: {
				fontFamily: 'monospace',
				margin: '0px',
				padding: '0px',
				whiteSpace: 'pre',
				background: 'rgb(150,150,150)'
			},
			dataTableSelected: {
				background: 'rgb(130,130,227)'
			}
		}

		this.dataElement = {};
		this.dataElement.element = document.createElement('table');

		this.dataElement.rows = [];
		for (var i=0;i<10;i++) {
			this.dataElement.rows[i] = {};
			this.dataElement.rows[i].element = document.createElement('tr')
			this.dataElement.element.appendChild(this.dataElement.rows[i].element);
			this.dataElement.rows[i].data = [];
			for (var j=0;j<10;j++) {

				this.dataElement.rows[i].data[j] = document.createElement('td');
				this.dataElement.rows[i].data[j].innerHTML = " ";

				this.dataElement.rows[i].data[j].addEventListener('mouseover', this.onhover);
				this.dataElement.rows[i].data[j].addEventListener('mouseout', this.nothover.bind(this));
				this.dataElement.rows[i].data[j].addEventListener('click', this.onclick.bind(this));

				applyStyle(this.dataElement.rows[i].data[j], this.style.dataTable)

				this.dataElement.rows[i].element.appendChild(this.dataElement.rows[i].data[j]);
			}
		}

		this.container.appendChild(this.dataElement.element);
		this.container.appendChild(document.createTextNode("adfasdfasdf"))
		document.body.addEventListener("keypress", this.onkey.bind(this))

		this.selected = {x:-1,y:-1};
	}
	onhover(e) {
		applyStyle(e.target,this.style.dataTableSelected);
	}
	nothover(e) {
		if (e.srcElement.cellIndex != this.selected.x || e.srcElement.parentElement.rowIndex != this.selected.y) {
			applyStyle(e.target,this.style.dataTable);
		}
	}
	onclick(e) {
		if (this.selected.x > 1) {
			applyStyle(this.dataElement.rows[this.selected.y].data[this.selected.x], this.style.dataTable);
		}
		this.selected = {
		 x: e.srcElement.cellIndex,
		 y: e.srcElement.parentElement.rowIndex,
		}
		console.log(this.selected)
		applyStyle(e.srcElement,this.style.dataTableSelected)
	}
	onkey(e) {
		this.dataElement.rows[this.selected.y].data[this.selected.x].innerHTML = e.key;
		console.log(e.key)
	}
	static addEditor(htmlElement) {
		return new CQEditor(htmlElement)
	}
}
window.addEventListener('load', (e) => {
	var d = document.createElement('div');
	document.body.appendChild(d);
	CQEditor.addEditor(d);
})