import {EditableObject} from "../../../jsonViewer/jsonViewer.js";

export class Sidebar {
	static expandedWidth = '300px';
	static collapsedWidth = '0px';

	constructor(htmlParent, state) {
		this.state = state

		this.container = document.createElement("div"); //Containing HTML element
		this.container.className = 'sidebar';

		var a = document.createElement('a');
		a.href = 'javascript:void(0)';  //Makes it so you don't reload the page when clicked
		a.innerHTML = '&times;';        // X char- renders as × in this font
		a.onclick = this.close.bind(this);
		a.className = 'closebtn';        //For styling
		this.container.appendChild(a);   //Add it to container

		htmlParent.appendChild(this.container);
	}
	open() {
		if (this.viewer) {
			this.viewer.remove();
			this.viewer = null;
		}
		this.viewer = new EditableObject(this.container, this.state.currentEditingBlock, this.onEdit);
		this.container.style.width = Sidebar.expandedWidth;
	}
	close() {
		this.container.style.width = Sidebar.collapsedWidth;
		this.viewer.remove();
		this.viewer = null;
	}
	onEdit(editedBlock) {
		this.state.currentEditingBlock = editedBlock;
	}
}