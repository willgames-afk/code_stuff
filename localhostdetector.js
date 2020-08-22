out = document.getElementById('localhost?')
if (location.hostname == 'localhost') {
    console.log('Locally Hosted!')
    out.innerHTML = 'Locally Hosted on Port '+location.port+'!'
}