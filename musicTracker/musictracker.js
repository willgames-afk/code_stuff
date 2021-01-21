config = {
    selectTextBackgroundColor: '#1c76fd',
    hoverTextBackgroundColor: 'rgba(28,118,253,0.33)'
}

class Song {
    constructor(json) {
        if (!json) { this.tracks = {}; return }
        if (typeof json == 'string') {
            try {
                json = JSON.parse(json)
            } catch (error) {
                console.error(error)
                return
            }
        }
        for (var item in json) {
            this[item] = json[item]
        }

        for (var trackName in this.tracks) { // Turns the config for the synth and the Part into actual synths and Parts that play the music.
            this.tracks[trackName].instrument = new Tone.Synth(this.tracks[trackName].instrument).toDestination();
            this.tracks[trackName].part = new Tone.Part(function (synth) {
                return function (time, note) { //Fanciness to deal with the fact that it is a callback. Man, I hate callbacks.
                    synth.triggerAttackRelease(note.note, note.duration, time);
                }
            }(this.tracks[trackName].instrument), this.tracks[trackName].data);
            var bData = JSON.stringify(this.tracks[trackName].data)
            Object.defineProperty(this.tracks[trackName], "data", {
                set(val) {
                    this._data = val;
                    this.part = new Tone.Part(function (synth) {
                        return function (time, note) { //Fanciness to deal with the fact that it is a callback. Man, I hate callbacks.
                            synth.triggerAttackRelease(note.note, note.duration, time);
                        }
                    }(this.instrument), val);
                },
                get() {
                    return this._data
                }
            })
            this.tracks[trackName].data = JSON.parse(bData)
        }
    }
    play() {
        for (var trackName in this.tracks) {
            this.tracks[trackName].part.start();
        }
        console.log('success!')
    }

    addTrack(track) {
        this.tracks.push(track)
    }
    static Track(instrument, data, name) {
        track = { name: name, instrument: instrument, data: data }
        track.addNote = function (time, note, duration) {
            this.data.push({ 'time': time, 'note': note, 'duration': duration })
        }
        return track
    }
}


//init(document.getElementById('musictracker'))
function init(element) {
    var currentSong = new Song({
        tracks: {
            Square_1: {
                instrument: {
                    oscillator: {
                        type: 'square',
                        portamento: 0,
                        volume: -20
                    },
                    envelope: {
                        attack: 0,
                        decay: 0,
                        sustain: 1,
                        release: 0
                    }
                },
                data: [
                    {},
                    {},
                ]
            },
            Triangle_1: {
                instrument: {
                    oscillator: {
                        type: 'triangle',
                        portamento: 0,
                        volume: -20
                    },
                    envelope: {
                        attack: 0,
                        decay: 0,
                        sustain: 1,
                        release: 0,
                    }
                },
                data: [
                    {},
                    {},
                ]
            }
        }
    })

    //We've launched, so no more launch button
    document.getElementById('launchbutton').remove();
    console.log(currentSong);

    //create menu
    var menu = document.createElement('div');
    menu.setAttribute('class', 'menu');

    var playbutton = document.createElement('button');
    playbutton.innerText = 'Play';
    playbutton.addEventListener("click", function () {
        currentSong.play();
        if (Tone.Transport.state == 'started') {
            Tone.Transport.stop();
            playbutton.innerHTML = 'play';
        } else {
            Tone.Transport.start();
            playbutton.innerHTML = 'stop';
        }
    })
    menu.appendChild(playbutton);

    var addTrackB = document.createElement('button');
    addTrackB.innerText = 'Add Track';
    addTrackB.addEventListener("click", function() {

    })

    element.appendChild(menu);


    for (var currentTrack in currentSong.tracks) {

        var instrument = document.createElement("ol")
        var instName = document.createElement("p");
        instName.innerText = currentTrack.replace('_',' ')
        instrument.appendChild(instName);


        for (var i = 0; i < currentSong.tracks[currentTrack].data.length; i++) {
            //Make a span element to contain note data
            note = document.createElement("span")
            if (currentSong.tracks[currentTrack].data[i].note) {
                note.innerHTML = currentSong.tracks[currentTrack].data[i].note
            } else {
                note.innerHTML = "---"
            }
            //Set up event listeners to allow for editing 
            note.addEventListener('mouseover', hover);
            note.addEventListener('click', select);
            note.addEventListener('mouseout', nothover);
            //Set up attrubutes
            note.setAttribute("status", 'deselected')
            note.setAttribute("index", i.toString(10))
            note.setAttribute("instrument", (0).toString(10))
            note.setAttribute('class', 'note')
            //make another span element to contain duration data, pretty much the same as note
            duration = document.createElement("span")
            if (currentSong.tracks[currentTrack].data[i].duration) {
                duration.innerHTML = currentSong.tracks[currentTrack].data[i].duration
            } else {
                duration.innerHTML = '--'
            }

            duration.addEventListener('mouseover', hover);
            duration.addEventListener('click', select);
            duration.addEventListener('mouseout', nothover);

            duration.setAttribute("status", "deselected")
            duration.setAttribute('index', i.toString(10))
            duration.setAttribute('instrument', (0).toString(10))
            duration.setAttribute('class', 'duration')
            //add them both to a list element
            li = document.createElement('li')
            li.appendChild(note)
            li.appendChild(duration)

            label = document.createElement("p")
            label.innerText = pad(i.toString(16), 2, '0') + ' '

            instrument.appendChild(li);

            li.insertBefore(label, note)
        }
        instrument.style.verticalAlign = 'top'
        element.appendChild(instrument)
    }
    document.addEventListener('keydown', keydown)
}
function hover(e) {
    if (this.getAttribute("status") == 'deselected') {
        this.setAttribute("status", 'hovering')
        this.style.backgroundColor = config.hoverTextBackgroundColor
    }
}
var keycount = 0
function select(e) {
    var prevElement = document.querySelectorAll('[status="selected"]')[0]
    if (prevElement == this) return;
    keycount = 0;
    if (prevElement) {
        if (prevElement.getAttribute('class') == 'note' && (keycount <= 3 && keycount > 0) && !(prevElement.innerHTML == '---')) {
            console.log('Incomplete!');
            prevElement.innerHTML = '---';
        }
        prevElement.setAttribute("status", 'deselected')
        prevElement.style = null;
    }
    this.style.backgroundColor = config.selectTextBackgroundColor
    this.style.borderBottom = "thick solid #0000FF";
    this.setAttribute("status", 'selected')
}
function selectElement(e) {
    var prevElement = document.querySelectorAll('[status="selected"]')[0]
    if (prevElement == e) return;
    keycount = 0;
    if (prevElement) {

        prevElement.setAttribute("status", 'deselected')
        prevElement.style = null;
    }
    e.style.backgroundColor = config.selectTextBackgroundColor
    e.style.borderBottom = "thick solid #0000FF";
    e.setAttribute("status", "selected")
}
function nothover(e) {
    if (!(this.getAttribute("status") == 'selected')) {
        this.style = null;
        this.setAttribute("status", 'deselected')
    }
}
function keydown(e) {
    element = document.querySelectorAll('[status="selected"]')[0]
    console.log(e.key)

    if (element) {
        if (element.getAttribute('class') == 'note') {
            if (keycount == 0) { //Key 1 is the key, ABCDEF or G
                if (/[a-gA-G]/.test(e.key) && e.key.length == 1) {
                    element.innerHTML = e.key.toUpperCase() + '--';
                    keycount++;
                    durEl = document.querySelector('[index ="' + element.getAttribute('index') + '"][class="duration"]');
                    if (durEl.innerHTML == '--') {
                        durEl.innerHTML = '01';
                    }
                } else if (e.key == 'Backspace' || e.key == ' ' || e.key == '-') {
                    element.innerHTML = '---'
                    nextDurInput(element)
                }
            } else if (keycount == 1) {
                if (/[# -]/.test(e.key)) { //Key 2 is wether it's sharp or not (No flats supported yet)
                    if (e.key == '#') {
                        element.innerHTML = element.innerHTML[0] + '#-';
                    } else {
                        element.innerHTML = element.innerHTML[0] + '--';
                    }
                    keycount++;
                } else if (/[0-9]/.test(e.key)) { //If user types a number, skip ahead to Key 3
                    element.innerHTML = element.innerHTML[0] + '-' + e.key;
                    nextDurInput(element)
                }
            } else if (keycount == 2) {
                if (/[0-9]/.test(e.key)) { //Key 3 is the Octave, 12345678 or 9
                    element.innerHTML = element.innerHTML.slice(0, 2) + e.key;
                    nextDurInput(element)
                }
            }
        } else if (element.getAttribute('class') == 'duration') {
            if (keycount == 0) { // digit one of Duration (how many beats the not should play), 12345678 or 9.
                if (/[0-9]/.test(e.key) && e.key.length == 1) {
                    element.innerHTML = '0' + e.key;
                    keycount++;
                } else if (e.key == 'Backspace') {
                    element.innerHTML = '--'
                    keycount = 2;
                }
            } else if (keycount == 1) {
                if (/[0-9]/.test(e.key) && e.key.length == 1) { //digit 2 of Duration
                    element.innerHTML = element.innerHTML[1] + e.key;
                    nextNoteInput(element)
                } else if (e.key == ' ' || e.key == 'Enter') {
                    element.innerHTML = '0' + element.innerHTML[1]
                    nextNoteInput(element);
                }
            }
        }
    }
}
function nextNoteInput(element) {
    keycount = 0;
    var nextSelected = document.querySelector('[index ="' + (parseInt(element.getAttribute('index'), 10) + 1).toString(10) + '"][class="note"]');
    selectElement(nextSelected);
}
function nextDurInput(element) {
    keycount = 0;
    nextSelected = document.querySelector('[index ="' + element.getAttribute('index') + '"][class="duration"]');
    selectElement(nextSelected);
}
function pad(string, padlen, padchar = " ", padfromright = false) {
    if (string.length >= padlen) return string;
    out = string;
    if (padfromright) {
        while (out.length < padlen) {
            out = out + padchar
        }
    } else {
        while (out.length < padlen) {
            out = padchar + out;
        }
    }
    return out;
}