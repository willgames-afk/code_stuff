class AnyInterpereter {
    constructor(input, output, config = {}) {
        if (typeof input == "object") {
            this.inputElement = input
            this.input = input.innerHTML;
        }
        if (typeof output == "object") {
            this.outputType = 'HTMLElement'
            this.outputElement = output
        } else {
            this.outputType = 'string'
        }
        this.verbose = config.verbose
        this.callback = this.run.bind(this, this.input);
        if (this.verbose) {
            console.group('AnyInt Verbose Start')
            console.log(this);
        }
        console.groupEnd()
    }
    set output(s) {
        this._output = s
        if (this.outputType == 'HTMLElement') {
            this.outputElement.innerHTML = s;
            this.outputElement.style.height = "";
            this.outputElement.style.height = Math.min(this.outputElement.scrollHeight, 300) + 'px';
        }
    }
    get output() {
        return this._output
    }
    run(code) {
        if (typeof code == "object") {
            this.input = code.value;
        } else {
            this.input = code
        }

        this.clearOut()
        if (this.verbose) {
            console.group('AnyInt Verbose Run');
            this.output += '\nAnyInt Verbose Run';
            this.println('Input Text: ' + code);
            this.println('Clearing Output and Formatting Input...');
        }
        this.code = this.sanitize(this.input);
        if (this.verbose) {
            this.print('Done')
            this.println('Code:'+this.code)
            this.println('Expression Length:' + this.code[0].length)
        };
        if (!(this.code && ((this.code.length > 0) && (this.code[0].length > 0)))) { this.throw('No code to interperet'); console.groupEnd(); return false };



        var tokens = [];
        var storedNum = false;
        for(var i=0;i<this.code[0].length;i++) {
            var cc = this.code[0][i]
            if (/[+*/-]/.test(cc)) {
                tokens.push(storedNum)
                tokens.push(cc)
                storedNum = false;
            } else if (/[0-9]/.test(cc)) {
                if (storedNum) {
                    storedNum = parseInt(storedNum+cc)
                } else {
                    storedNum = parseInt(cc)
                }
            }
        }
        tokens.push(storedNum)

        console.log(tokens)

        //Evaluate tokens

        console.groupEnd()
        return this.code
    }
    sanitize(t = '') {
        var lines = t.split('\n');
        for (var i = 0; i < lines.length; i++) {
            lines[i] = lines[i].split(';')[0].replace(/^\s+/, "").replace(/\s+$/, "");
        }
        return lines
    }
    print(t) {
        this.output += t;
        console.log(t)
    }
    println(t) {
        this.output += '\n' + t;
        console.log(t);
    }
    clearOut() {
        this.output = '';
    }
    throw(e) {
        this.output += '\n' + 'Error: ' + e;
        console.error('AnyInterpereter Error: ' + e);
    }
};
var output = document.getElementById('out');
var textarea = document.getElementById('in');
let textarearesizer = new ResizeObserver(function () { things.resize(); }.bind(this)); textarearesizer.observe(textarea);
textarea.addEventListener('input', () => {
    textarea.style.height = "";
    textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
});
var interpereter = new AnyInterpereter(textarea, output, { verbose: true });
var button = document.getElementById('run');
button.addEventListener('click', ()=>{
    interpereter.run(textarea.value)
});