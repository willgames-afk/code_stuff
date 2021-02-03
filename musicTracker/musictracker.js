/*
TO DO:
Change all refrences to Duration to Effect, I changed things
Add "Stop Note" Thing.

*/

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
                    console.log(time+":"+note)
                    if (!note.note) {return};
                    synth.triggerAttackRelease(note.note, note.duration, time);
                }
            }(this.tracks[trackName].instrument), this.tracks[trackName].data);

            var bData = JSON.stringify(this.tracks[trackName].data)
            Object.defineProperty(this.tracks[trackName], "data", {
                set(val) {
                    this._data = val;
                    console.log("Track Data set to "+ JSON.stringify(val))
                    this.part = new Tone.Part(function (synth) {
                        return function (time, note) { //Fanciness to deal with the fact that it is a callback. Man, I hate callbacks.
                            console.log(time+":"+JSON.stringify(note))
                            if (!note.note) {return}
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
        console.log(this.tracks)
        for (var trackName in this.tracks) {
            this.tracks[trackName].data = this.tracks[trackName].data //Update
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
class MusicTracker {
    constructor(element) {
        this.keycount = 0;
        this.container = element;
        this.currentSong = new Song({
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
                        { note: 'C4', time: 0, duration:'4n' },
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
                        { note: 'C4', time: 0, duration:'4n' },
                    ]
                }
            }
        });

        //We've launched, so no more launch button
        if (document.getElementById('launchbutton')) {
            document.getElementById('launchbutton').remove();
        }
        console.log(this.currentSong);

        //create menu
        this.menu = {};

        this.menu.container = document.createElement('div');
        this.menu.container.setAttribute('class', 'menu');


        this.menu.playbutton = document.createElement('button');
        this.menu.playbutton.innerText = 'Play';
        this.menu.playbutton.addEventListener("click", function () {
            if (Tone.Transport.state == 'started') {
                Tone.Transport.stop();
                this.menu.playbutton.innerHTML = 'play';
            } else {
                this.currentSong.play();
                Tone.Transport.start();
                this.menu.playbutton.innerHTML = 'stop';
            }
        }.bind(this))
        this.menu.container.appendChild(this.menu.playbutton);

        this.menu.addTrackButton = document.createElement('button');
        this.menu.addTrackButton.innerText = 'Add Track';
        this.menu.addTrackButton.addEventListener("click", function () {

        })

        this.container.appendChild(this.menu.container);


        for (var currentTrack in this.currentSong.tracks) {

            var track = document.createElement("ol")
            track.setAttribute("track", currentTrack)
            track.setAttribute("class", "track")
            element.appendChild(track)

            var instName = document.createElement("p");
            instName.innerText = currentTrack.replace('_', ' ')
            track.appendChild(instName);

            console.log(this.currentSong.tracks[currentTrack])

            for (var i = 0; i < this.currentSong.tracks[currentTrack].data.length; i++) {

                //Make a span element to contain note data
                this.addNote(currentTrack, i,this.currentSong.tracks[currentTrack].data[i].note)
            }
            track.style.verticalAlign = 'top'
        }
        document.addEventListener('keydown', this.keydown.bind(this))
    }
    hover(e) {
        if (this.getAttribute("status") == 'deselected') {
            this.setAttribute("status", 'hovering')
            this.style.backgroundColor = config.hoverTextBackgroundColor
        }
    }
    select(e) {
        var element = e.srcElement
        var prevElement = document.querySelectorAll('[status="selected"]')[0]
        if (prevElement == this) return;
        if (prevElement) {
            console.log(prevElement)
            console.log(this.keycount)
            if (prevElement.getAttribute('class') == 'note' && ((this.keycount <= 3) && (this.keycount > 0)) && !(prevElement.innerHTML == '---')) {
                console.log('Incomplete!');
                prevElement.innerHTML = '---';
            }
            prevElement.setAttribute("status", 'deselected')
            prevElement.style = null;
        }
        this.keycount = 0;
        element.style.backgroundColor = config.selectTextBackgroundColor
        element.style.borderBottom = "thick solid #0000FF";
        element.setAttribute("status", 'selected')
    }
    selectElement(e) {
        var prevElement = document.querySelectorAll('[status="selected"]')[0]
        if (prevElement == e) return;
        this.keycount = 0;
        if (prevElement) {

            prevElement.setAttribute("status", 'deselected')
            prevElement.style = null;
        }
        e.style.backgroundColor = config.selectTextBackgroundColor
        e.style.borderBottom = "thick solid #0000FF";
        e.setAttribute("status", "selected")
    }
    nothover(e) {
        if (!(this.getAttribute("status") == 'selected')) {
            this.style = null;
            this.setAttribute("status", 'deselected')
        }
    }
    keydown(e) {
        var element = document.querySelectorAll('[status="selected"]')[0]
        console.log(e.key)

        if (element) {
            if (element.getAttribute('class') == 'note') {
                if (this.keycount == 0) { //Key 1 is the key, ABCDEF or G
                    if (/[a-gA-G]/.test(e.key) && e.key.length == 1) {
                        element.innerHTML = e.key.toUpperCase() + '--';
                        this.keycount++;
                        /*var durEl = document.querySelector('[index ="' + element.getAttribute('index') + '"][class="duration"]');
                        if (durEl.innerHTML == '--') {
                            durEl.innerHTML = '01';
                        }*/
                    } else if (e.key == 'Backspace' || e.key == ' ' || e.key == '-') {
                        element.innerHTML = '---'
                        this.completeNote(element)
                    }
                } else if (this.keycount == 1) {
                    if (/[# -]/.test(e.key)) { //Key 2 is wether it's sharp or not (No flats supported yet)
                        if (e.key == '#') {
                            element.innerHTML = element.innerHTML[0] + '#-';
                        } else {
                            element.innerHTML = element.innerHTML[0] + '--';
                        }
                        this.keycount++;
                    } else if (/[0-9]/.test(e.key)) { //If user types a number, skip ahead to Key 3
                        element.innerHTML = element.innerHTML[0] + '-' + e.key;
                        this.completeNote(element)
                    }
                } else if (this.keycount == 2) {
                    if (/[0-9]/.test(e.key)) { //Key 3 is the Octave, 12345678 or 9
                        element.innerHTML = element.innerHTML.slice(0, 2) + e.key;
                        this.completeNote(element)
                    }
                }
            } else if (element.getAttribute('class') == 'duration') {
                if (this.keycount == 0) { // digit one of Duration (how many beats the not should play), 12345678 or 9.
                    if (/[0-9]/.test(e.key) && e.key.length == 1) {
                        element.innerHTML = '0' + e.key;
                        this.keycount++;
                    } else if (e.key == 'Backspace') {
                        element.innerHTML = '--'
                        this.keycount = 2;
                    }
                } else if (this.keycount == 1) {
                    if (/[0-9]/.test(e.key) && e.key.length == 1) { //digit 2 of Duration
                        element.innerHTML = element.innerHTML[1] + e.key;
                        this.completeDur(element)
                    } else if (e.key == ' ' || e.key == 'Enter') {
                        element.innerHTML = '0' + element.innerHTML[1]
                        this.completeDur(element);
                    }
                }
            }
        }
    }
    completeDur(element) {
        //Runs when the duration of a note is entered
        this.keycount = 0;
        var nextSelected = document.querySelector('[index ="' + (parseInt(element.getAttribute('index'), 10) + 1).toString(10) + '"][class="duration"]');
        console.log(element.getAttribute('index'))
        this.selectElement(nextSelected);
    }
    completeNote(element) {
        //Runs when a note is entered
        this.keycount = 0;
        var nextSelected = document.querySelector('[index ="' + (parseInt(element.getAttribute('index'), 10) + 1).toString(10) + '"][class="note"][track="'+element.getAttribute('track')+'"]');
        if (!nextSelected) {
            nextSelected = this.addNote(element.getAttribute("track"), false, "---", true)
        }
        console.log(element.getAttribute('index'))
        this.selectElement(nextSelected);
        console.log(element)
        console.log("Writing "+element.innerHTML.replaceAll('-',""))
        this.currentSong.tracks[element.getAttribute('track')].data[element.getAttribute('index')].note = element.innerHTML.replaceAll('-',"")
    }
    pad(string, padlen, padchar = " ", padfromright = false) {
        if (string.length >= padlen) return string;
        var out = string;
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
    addNote(track, index, note, addToPlayableTrack) {
        console.log(this.currentSong.tracks[track])

        var i = index;
        if (addToPlayableTrack) {
            if (!i) {
                i = this.currentSong.tracks[track].data.length;
            }
            if (note) {
                this.currentSong.tracks[track].data.push({ "note": note.replaceAll('-',""), "time": Math.floor(i/4)+":"+i%4, "duration":'4n' })
            } else {
                this.currentSong.tracks[track].data.push({ /*"note": '---',*/ "time": Math.floor(i/4)+":"+i%4, "duration":'4n' })
            }
        }
        if (!i) {
            i = this.currentSong.tracks[track].data.length-1;
        }

        var noteElement = document.createElement("span")
        if (note) {
            if (note.length == 2) {
                noteElement.innerHTML = note[0] + '-' + note[1]
            } else {
                noteElement.innerHTML = note
            }
        } else { 
            noteElement.innerHTML = "---"
        }
        //Set up event listeners to allow for editing 
        noteElement.addEventListener('mouseover', this.hover);
        noteElement.addEventListener('click', this.select);
        noteElement.addEventListener('mouseout', this.nothover);

        //Set up attrubutes
        noteElement.setAttribute("status", 'deselected')
        noteElement.setAttribute("index", i.toString(10))
        noteElement.setAttribute("track", track)
        noteElement.setAttribute('class', 'note')

        //add to a list element
        var li = document.createElement('li')
        li.appendChild(noteElement)

        //Give it a number (label)
        var label = document.createElement("p")
        label.innerText = this.pad(i.toString(16), 2, '0') + ' ';
        li.insertBefore(label, noteElement)

        var trackElement = document.querySelector('[track=' + track + '][class="track"]');
        trackElement.appendChild(li);

        return noteElement
    }
}

function onstart() {
    var launchbutton = document.createElement('button');
    launchbutton.id = 'launchbutton';
    launchbutton.innerText = 'Launch!'
    launchbutton.addEventListener('click', (e) => {
        //Yes, I'm defining this globally.
        window.musicTracker = new MusicTracker(document.getElementById('musictracker'));
        var test = new Song({
            "tracks": {
                "Square_1": {
                    "instrument": {
                        "oscillator": {
                            "type": "square",
                            "portamento": 0,
                            "volume": -20
                        },
                        "envelope": {
                            "attack": 0,
                            "decay": 0,
                            "sustain": 1,
                            "release": 0
                        }
                    },
                    "data": [
                        {
                            "time": "0",
                            "note": "A#4",
                            "duration": "2n+8n"
                        },
                        {
                            "time": "0:2.5",
                            "note": "F4",
                            "duration": "8n"
                        },
                        {
                            "time": "0:3",
                            "note": "F4",
                            "duration": "8n"
                        },
                        {
                            "time": "0:3.5",
                            "note": "A#4",
                            "duration": "8n"
                        },
                        {
                            "time": "1:0",
                            "note": "G#4",
                            "duration": "16n"
                        },
                        {
                            "time": "1:0.25",
                            "note": "F#4",
                            "duration": "16n"
                        },
                        {
                            "time": "1:0.5",
                            "note": "G#4",
                            "duration": "2n+4n."
                        },
                        {
                            "time": "2:0",
                            "note": "A#4",
                            "duration": "2n+8n"
                        },
                        {
                            "time": "2:2.5",
                            "note": "F#4",
                            "duration": "8n"
                        },
                        {
                            "time": "2:3",
                            "note": "F#4",
                            "duration": "8n"
                        },
                        {
                            "time": "2:3.5",
                            "note": "A#4",
                            "duration": "8n"
                        },
                        {
                            "time": "3:0",
                            "note": "A4",
                            "duration": "16n"
                        },
                        {
                            "time": "3:0.25",
                            "note": "G4",
                            "duration": "16n"
                        },
                        {
                            "time": "3:0.5",
                            "note": "A4",
                            "duration": "2n.+8n"
                        }
                    ]
                },
                "Triange_1": {
                    "instrument": {
                        "oscillator": {
                            "type": "triangle",
                            "portamento": 0,
                            "volume": -20
                        },
                        "envelope": {
                            "attack": 0,
                            "decay": 0,
                            "sustain": 1,
                            "release": 0
                        }
                    },
                    "data": [
                        {
                            "time": 0,
                            "note": "A#2",
                            "duration": "4n"
                        },
                        {
                            "time": "0:1",
                            "note": "F3",
                            "duration": "4n"
                        },
                        {
                            "time": "0:2",
                            "note": "A#3",
                            "duration": "2n"
                        },
                        {
                            "time": "1:0",
                            "note": "G#2",
                            "duration": "4n"
                        },
                        {
                            "time": "1:1",
                            "note": "D#3",
                            "duration": "4n"
                        },
                        {
                            "time": "1:2",
                            "note": "G#3",
                            "duration": "2n"
                        },
                        {
                            "time": "2:0",
                            "note": "F#2",
                            "duration": "4n"
                        },
                        {
                            "time": "2:1",
                            "note": "C#3",
                            "duration": "4n"
                        },
                        {
                            "time": "2:2",
                            "note": "F#3",
                            "duration": "2n"
                        },
                        {
                            "time": "3:0",
                            "note": "F2",
                            "duration": "4n"
                        },
                        {
                            "time": "3:1",
                            "note": "C3",
                            "duration": "4n"
                        },
                        {
                            "time": "3:2",
                            "note": "F3",
                            "duration": "2n"
                        }
                    ]
                }
            }
        })
        //test.play();
        //Tone.Transport.start();
    })
    document.body.appendChild(launchbutton);
};
window.addEventListener('load', onstart);