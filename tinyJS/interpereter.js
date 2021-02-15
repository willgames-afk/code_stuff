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
        this.verbose = config.verbose
        this.callback = this.run.bind(this, this.input);
        if (this.verbose) {
            console.group('AnyInt Verbose Start')
            console.log(this);
        }
        console.groupEnd()
    }
    run(code) {

        if (this.verbose) {
            console.group('AnyInt Verbose Run');
            this.output('\nAnyInt Verbose Run');
            this.println('Input Text: ' + code);
            this.println('Clearing Output and Formatting Input...');
        }
        //Remove 
        this.code = this.sanitize(this.input);
        if (this.verbose) {
            this.print('Done')
            this.println('Code:'+this.code)
            this.println('Expression Length:' + this.code[0].length)
        };

        //If no code, don't do anything
        if (!(this.code && ((this.code.length > 0) && (this.code[0].length > 0)))) { this.throw('No code to interperet'); console.groupEnd(); return false };


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