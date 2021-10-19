initComments();
refreshComments(false);
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
		paddingBottom: '15px'
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
	var ap = 'About ';//Approximator; about or approx and things like that
	var unknown = '???'

	var elapsed = currentTime - timestamp;
	if (!timestamp) {
		return unknown

	} else if (elapsed < 0) {
		return unknown

	} else if (elapsed < msPerMinute) {
		return formatNice(Math.round(elapsed / 1000), 'second');

	} else if (elapsed < msPerHour) {
		return formatNice(Math.round(elapsed / msPerMinute), 'minute');

	} else if (elapsed < msPerDay) {
		return formatNice(Math.round(elapsed / msPerHour), 'hour');

	} else if (elapsed < msPerMonth) {
		return ap + formatNice(Math.round(elapsed / msPerDay), 'day');

	} else if (elapsed < msPerYear) {
		return ap + formatNice(Math.round(elapsed / msPerMonth), 'month');

	} else {
		return ap + formatNice(Math.round(elapsed / msPerYear), 'year');
	}

}
function formatNice(value, units) {
	if (value != 1) {
		return `${value} ${units}s ago`
	}
	return `${value} ${units} ago`
}
function initComments() {

	var container = document.createElement('div');
	container.id = 'comment-widget';
	document.getElementsByClassName('mainbox')[0].appendChild(container);

	var commentsContainer = document.createElement('div');
	commentsContainer.id = 'comments';
	container.appendChild(commentsContainer)

	addCommentInterface(container);
}
function refreshComments(scroll) {


	var container = document.getElementById('comments');

	if (document.getElementById('comment-list')) {
		container.removeChild(document.getElementById('comment-list'))
	}

	var commentList = document.createElement('ul');
	commentList.id = 'comment-list'
	container.appendChild(commentList)

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
			if(scroll) {
				window.scrollTo(0,document.body.scrollHeight);
			}

			if (typeof noms != 'undefined') {
				//Resize dynamic backgroud if it has been created (It's created after page load)
				noms.resize();
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
function addCommentInterface(container) {
	var interface = document.createElement('div');
	interface.id = 'submit-comment'

	//createInput(interface, 'text', 'name', 'Name: ', 'nameInput')
	createInput(interface, 'text', 'comment', 'Comment: ', 'commentInput')

	var submitButton = document.createElement('input')
	submitButton.type = 'button'

	var errorMessage = document.createElement('p');
	errorMessage.style.color = "rgb(225,0,0)"
	interface.appendChild(errorMessage)

	function oc(e) {

		console.groupCollapsed('SENDING COMMENT')

		var send_xhr = new XMLHttpRequest()

		send_xhr.onreadystatechange = function (e) {
			console.log(this.readyState + " " + this.status)

			if (this.readyState == 4 && this.status == 200) {
				console.log('Server Response:');
				console.log(this.responseText);
				var resp = JSON.parse(this.responseText);
				if (!resp.success) {
					errorMessage.innerHTML = resp.desc
				} else {
					errorMessage.innerHTML = "";
				}

				refreshComments(true);

				console.groupEnd();

			}
		}

		send_xhr.open("GET", "getComments.php/?action=send_comment&comment=" + document.getElementById('commentInput').value);
		send_xhr.send();
	}
	submitButton.onclick = oc.bind(this);

	submitButton.value = 'Submit'
	interface.appendChild(submitButton)


	container.appendChild(interface);
}