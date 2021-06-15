var chats = document.getElementById("chats");
var input = document.getElementById("input");
var send  = document.getElementById("send")
function addLocalMessage(text) {
    const row = document.createElement("tr");
    const chat = document.createElement("td");
    chat.innerText = chat;
    row.appendChild(chat);
    chats.appendChild(row);
    const time = document.createElement("td");
    time.innerText = Date();
    row.appendChild(time);
}
function postGlobalMessage(text) {
    var req = new XMLHttpRequest();
    req.addEventListener("error",error);
    req.addEventListener("abort",abort);

    req.open("POST","server.php");
    req.send(text);
}
function onSend() {
    postGlobalMessage(input.value);
    addLocalMessage(input.value)
}

send.addEventListener("click",onSend.bind(this));