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
function timeDifference(timestamp) {
	var currentTime = new Date().getTime();
	var msPerMinute = 60000;
	var msPerHour = msPerMinute * 60;
	var msPerDay = msPerHour * 24;
	var msPerMonth = msPerDay * 30;
	var msPerYear = msPerMonth * 365;
	var ap = 'about ';//Approximator; about or approx and things like that
	var unknown = '???'

	var elapsed = currentTime - timestamp;
	if (!timestamp) {
		return unknown

	} else if (elapsed < 0) {
		return unknown

	} else if (elapsed < msPerMinute) {
		return addS(Math.round(elapsed / 1000),'second','ago');

	} else if (elapsed < msPerHour) {
		return addS(Math.round(elapsed / msPerMinute), 'minute', 'ago');

	} else if (elapsed < msPerDay) {
		return addS(Math.round(elapsed / msPerHour),'hours', 'ago');

	} else if (elapsed < msPerMonth) {
		return ap + addS(Math.round(elapsed / msPerDay), 'days', 'ago');

	} else if (elapsed < msPerYear) {
		return ap + addS(Math.round(elapsed / msPerMonth), 'month', 'ago');

	} else {
		return ap + addS(Math.round(elapsed / msPerYear),'year','ago');

	}

}
function addS(value, units, suffix) {
	if (value > 1) {
		return value + ' '+units + 's ' + suffix
	}
	return value+' '+units+' '+suffix
}
function addComments() {
	if (document.getElementById('comments')) {
		document.getElementsByClassName('mainbox')[0].removeChild(document.getElementById('comments'))
	}
	var commentList = document.createElement('ul');
	commentList.id = 'comments'
	document.getElementsByClassName('mainbox')[0].appendChild(commentList)
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function (e) {
		if (this.readyState == 4 && this.status == 200) {
			var comments = JSON.parse(this.responseText);
			for (var i = 0; i < comments.length; i++) {
				var li = document.createElement('li');
				addP(li, comments[i].name, elementStyle.name);
				addP(li, timeDifference(parseInt(comments[i].timestamp, 10) * 1000), elementStyle.timestamp)
				addP(li, comments[i].text, elementStyle.content);
				applyStyle(li, elementStyle.comment)
				commentList.appendChild(li);
			}
		}
	}
	xhr.open("GET", "getComments.php/?action=get_comments");
	xhr.send();
}
function addP(li, text, style) {
	var a = document.createElement('p');
	a.innerText = text;
	applyStyle(a, style)
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

	createInput(interface, 'text', 'name', 'Name: ', 'nameInput')
	createInput(interface, 'text', 'comment', 'Comment: ', 'commentInput')
	var submitButton = document.createElement('input')
	submitButton.type = 'button'
	function oc(e) {
		console.groupCollapsed('SENDING COMMENT')
		var send_xhr = new XMLHttpRequest()
		send_xhr.onreadystatechange = function (e) {
			console.log(this.readyState + " " + this.status)
			if (this.readyState == 4 && this.status == 200) {
				console.log('Server Response:')
				console.log(this.responseText)
				addComments();
				console.groupEnd();
			}
		}
		send_xhr.open("GET", "getComments.php/?action=send_comment&user=" + document.getElementById('nameInput').value + "&comment=" + document.getElementById('commentInput').value);
		send_xhr.send();
	}
	submitButton.onclick = oc.bind(this)
	submitButton.value = 'Submit'
	interface.appendChild(submitButton)
	document.getElementsByClassName('mainbox')[0].appendChild(interface);
	things.resize();
}