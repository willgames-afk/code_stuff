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
        console.log("%cINPUT: %c" + this.code, "color:green;", "color:white;")
        if (!(this.code && ((this.code.length > 0) && (this.code[0].length > 0)))) { this.throw('No code to interperet');  return false };

        //Tokenize
        var tokens = this.tokenize();
        console.log(tokens)

        var outCode = tokens.join(", ");

        //Evaluate tokens

        return outCode
    }
    tokenize() {
        var tokens = [];
        var i = 0;
        var ct = 0;
        while (i < this.code.length) {
            if (this.code[i] == " ") {
                i++; //Ignore spaces; who likes them anyway?
                ct++
            } else if (this.code[i] == "(") {
                ct++
            } else {
                if (!tokens[ct]) {tokens[ct] = ""}
                tokens[ct] += this.code[i];
                i++
            }
        }
        return tokens
    }
    sanitize(t = '') {
        //var lines = t.split('\n');
        t = t.replace(/^\s+/, "").replace(/\s+$/, "");
        return t
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

function demoProgram() {
    var test = "this is a test";
    const object = {
        string: "I am an object",
        number: 42,
        "Multi Word Key": `Backticked String!!`,
        list: [
            "bannanas",
            243,
            {},
            [],
            true,
        ],
        boolean: false,
    }
}