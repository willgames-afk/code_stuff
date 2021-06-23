
export class TrackDOM {
    constructor(notes = [], DOMParent) {
        this._notes = notes, this.DOMParent = DOMParent;

        this.htmlTable = document.createElement("table"); //Create Table

        console.dir(this.htmlTable)

        for (var i = 0; i < this._notes.length; i++) { //Iterate through rows
            this.addNote(this._notes[i])
        }

        this.DOMParent.appendChild(this.htmlTable); //Finally, add cell to parent element
    }
    get list() {
        return this._list;
    }
    set list(v) {

        this._list = v;

        //Regenerate HTML table here
    }

    addNote(note) {

        console.log(note.html)

        var row = document.createElement("tr"); //Create row element

        var noteNumber = document.createElement("td"); //Create Note number label
        noteNumber.innerText = this.htmlTable.rows.length;         //Set its value
        row.appendChild(noteNumber);    //Add it to row

        row.appendChild(note.html);            //Add to row

        this.htmlTable.appendChild(row);
        //return row;
    }
}

export class Note {
    constructor(value = "---", onComplete) {
        this.html = document.createElement("td");
        this.noteElement = document.createElement("span");
        this.noteElement.innerText = value;
        this.keycount = 0;
        this.html.appendChild(this.noteElement);
        this.html.addEventListener("click", this.select.bind(this));
        this.onComplete = onComplete;
    }

    keydown(e) {
        console.log(`KEYPRESS ${this.keycount}, "${e.key}"`)

        if (this.keycount == 0) { //Key 1 is the key, ABCDEF or G

            if (/[a-gA-G]/.test(e.key) && e.key.length == 1) {
                this.noteElement.innerText = e.key.toUpperCase() + '--';
                this.keycount++;
                /*var durEl = document.querySelector('[index ="' + element.getAttribute('index') + '"][class="duration"]');
                if (durEl.innerHTML == '--') {
                    durEl.innerHTML = '01';
                }*/
            } else if (e.key == 'Backspace' || e.key == ' ' || e.key == '-') {
                this.noteElement.innerText = '---'
                this._onComplete()
            }

        } else if (this.keycount == 1) {

            if (/[# -]/.test(e.key)) { //Key 2 is wether it's sharp or not (No flats supported yet)
                if (e.key == '#') {
                    this.noteElement.innerText = this.noteElement.innerText[0] + '#-';
                } else {
                    this.noteElement.innerText = this.noteElement.innerText[0] + '--';
                }
                this.keycount++;
            } else if (/[0-9]/.test(e.key)) { //If user types a number, skip ahead to Key 3
                this.noteElement.innerText = this.noteElement.innerText[0] + '-' + e.key;
                this.keycount++;
                this._onComplete()
            }

        } else if (this.keycount == 2) {

            if (/[0-9]/.test(e.key)) { //Key 3 is the Octave, 12345678 or 9
                this.noteElement.innerText = this.noteElement.innerText.slice(0, 2) + e.key;
                this._onComplete()
            }
        }
    }
    _onComplete() {
        this.deselect();
        console.log("completed");
        this.onComplete();
    }

    select() {
        if (this.selected) return false;

        this.selected = true;
        this.keycount = 0;
        this.html.setAttribute("selected", '');
        document.body.addEventListener("keydown", this.keydown.bind(this));
    }

    deselect() {
        if (!this.selected) return false;
        this.selected = false;

        console.log(this.noteElement)
        console.log(this.keycount)
        if (this.keycount != 2) {
            console.log('Incomplete!');
            this.noteElement.innerHTML = '---';
        }
        this.html.removeAttribute("selected");
        document.body.removeEventListener("keydown", this.keydown.bind(this))
    }
    getNoteFormatted() {
        var s = this.noteElement.innerText;
        return s[0] + (s[1] == "#" ? s[1] + s[2] : s[2]); //Ignore dashes
    }
    setNoteFromFormatted(string) {
        if (string.length == 2) {
            this.noteElement.innerText = string[0] + '-' + string[1];
        } else {
            this.noteElement.innerText = string;
        }
    }
    static format(string) {
        if (string.length == 2) {
            return string[0] + '-' + string[1];
        }
        return string;
    }
}

