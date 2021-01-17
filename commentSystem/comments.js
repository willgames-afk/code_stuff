addComments();
addCommentInterface();
var elementStyle = {
	name: {
		margin: "0px",
		padding: "0px",
		fontWeight: "bold",
		fontFamily: "arial",
		display: "inline"
	},
	content: {
		margin: "0px",
		padding: "0px"
	},
	comment: {

	},
	timestamp: {
		fontSize: "9px",
		margin: '0px 0px 0px 5px',
		padding: '0px',
		display: "inline"
	}
}
function addComments() {
	var commentList = document.createElement('ul');
	commentList.id = 'comments'
	document.getElementsByClassName('mainbox')[0].appendChild(commentList)
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function (e) {
		if (this.readyState == 4 && this.status == 200) {
			var comments = JSON.parse(this.responseText);
			for (var i = 0; i < comments.length; i++) {
				var li = document.createElement('li');
				addP(li,comments[i].name, elementStyle.name);
				var date = new Date(parseInt(comments[i].timestamp, 10));
				addP(li, date.toString(), elementStyle.timestamp)
				addP(li,comments[i].text, elementStyle.content);
				applyStyle(li, elementStyle.comment)
				commentList.appendChild(li);
			}
		}
	}
	xhr.open("GET", "getComments.php/?action=get_comments");
	xhr.send();
}
function addP(li,text,style) {
	var a = document.createElement('p');
	a.innerText = text;
	applyStyle(a,style)
	li.appendChild(a);
}
function applyStyle(element, style) {
	for (var s in style) {
		element.style[s] = style[s]
	}
}
function createInput(form, type, name, label, id) {
	if (label) {
		form.appendChild(document.createTextNode(label))
	}
	var element = document.createElement('input');
	element.name = name;
	element.id = id
	element.type = type;
	form.appendChild(element)
	form.appendChild(document.createElement('br'))
}
function addCommentInterface() {
	var interface = document.createElement('div');
	
	createInput(interface,'text','name','Name: ', 'nameInput')
	createInput(interface,'text','comment','Comment: ', 'commentInput')
	var submitButton = document.createElement('input')
	submitButton.type = 'button'
	function oc (e)  {
		console.log('SENDING COMMENT')
		var xhr = new XMLHttpRequest()
		xhr.onreadystatechange = function (e) {
			console.log(this.readyState+" "+this.status)
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText)
			}
		}
		xhr.open("GET","getComments.php/?action=send_comment&user="+document.getElementById('nameInput').value+"&comment="+document.getElementById('commentInput').value);
		xhr.send();
	}
	submitButton.onclick = oc.bind(this)
	submitButton.value = 'Submit'
	interface.appendChild(submitButton)
	document.getElementsByClassName('mainbox')[0].appendChild(interface);
}