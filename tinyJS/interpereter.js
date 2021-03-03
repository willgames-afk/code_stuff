class TinyInterpereter {
    constructor(input, config = {}, outputCallback) {
        if (typeof input == "object") { //If input is not a string (HTML Element), treat it as such.
            this.inputElement = input
            this.input = input.innerHTML;
        }
        if (outputCallback) { 
            this.outputType = 'function'
            this.output = outputCallback;
        } else {
            this.outputType = 'string'
        }
        this.callback = this.run.bind(this, this.input);
    }
    run(code) {
        //Remove unnecicary whitespace and whatnot
        this.code = this.sanitize(this.inputElement.value);
        //If no code, don't do anything
        console.log(this.code)
        if (!(this.code && ((this.code.length > 0) && (this.code[0].length > 0)))) { this.throw('No code to interperet');  return false };

        //Tokenize
        var outCode = [];
        for (var i = 0; i<this.code.length; i++) {
            outCode[i] = [];
            var line = this.code[i];
            outCode[i] = this.code[i].split(" ")
            if (outCode[i].includes("=")) {
                var loc = outCode[i].indexOf("=");
                outCode[i][loc+1] = objectifyExpression(outCode[i][loc+1]);

                
            }
            console.log(outCode[i])
        }

        //Evaluate tokens

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