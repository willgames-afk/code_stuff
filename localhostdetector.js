out = document.getElementById('localhost?')
if (location.hostname == 'localhost') {
    console.log('Locally Hosted!')
    out.innerHTML = 'Locally Hosted on Port ' + location.port + '!'
}
if (document.getElementById('cookie')) {
    cookieImage = document.getElementById('cookie');
    cookieImage.width = 20;
    cookieImage.height = 20;
}
function handleCookieClick() {
    console.log("And everybody was cookie clicking");
    cookieText = document.getElementById('cookieText');
    cookieText.innerHTML = '1 cookie click'
}
class CookieManager {
    constructor(property = 'a', value, exdays = 1) {
        this.cookies = {}
    }

    get cookies() {
        str = docuemnt.cookie
        str = str.split(', ');
        var result = {};
        for (var i = 0; i < str.length; i++) {
            var cur = str[i].split('=');
            result[cur[0]] = cur[1];
        }
        return result;
    }

    set cookies(value) {

    }

    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 86400000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    deleteCookie(cname) {
        setCookie(cname,'',-1)
    }

    checkCookie(cname) {
        //returns true if the cookie exists, false if it doesn't
        var c = getCookie(cname);
        if (c != "") {
            return true
        } else {
            return false
        }
    }
}