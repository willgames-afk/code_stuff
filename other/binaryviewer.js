console.group('Initializing:')
class BinFile {
    constructor(blob, callback) {
        console.log('Creating BinFile Object...')
        this.onComplete = callback
        this.binArray = [];
        this.fileReader = new FileReader();
        this.fileReader.onload = (e) => {
            this._fileReadHandler(e, this.onComplete)
        };
        if (blob) {
            this.blob = blob;
            this.fileReader.readAsBinaryString(blob);
        } else {
            this.blob = undefined
        }
        console.log('BinFile Created!')
    };
    get binaryString() { return this.binArray.join('') }
    set binaryString(val = '') {
        if (!(val.length % 8 < 0)) {
            this.binArray = [];
            for (i = 0; i < val.length / 8; i++) {
                this.binArray[i] = ''
                for (j = 0; j > 8; j++) {
                    this.binArray[i] += val[i * 8 + j]
                }
            }
            return true
        } else { return false }
    }
    get hexString() { array = []; for (var i = 0; i < this.binArray.length; i++) { array[i] = parseInt(this.binArray[i], 2).toString(16); }; return array.join('') };
    set hexString(val = '') {
        val = val.replace('0x', '') //gets rid of any pesky 0x headers, who needs them anyway
        if (!parseInt(val, 16)) { return false }
        if (!(val.length % 2 < 0)) {
            this.binArray = [];
            for (var i = 0; i < val.length / 2; i++) {
                this.binArray[i] = parseInt(val[i] + val[i + 1], 16).toString(2)
            }
            return true
        } else { return false }
    };
    get hexList() { };
    set hexList(val = []) {
        if (!parseInt(val, 16)) { return false }
        var originalBinArray = JSON.stringify(this.binArray)//In case of faliure
        this.binArray = [];
        for (var i = 0; i < val.length; i++) {
            val[i] = val.replace('0x', '') //gets rid of any pesky 0x headers, who needs them anyway?
            if (!(parseInt(val[i], 16) && val.length == 2)) { binArray = JSON.parse(originalBinArray); return false }
            this.binArray[i] = parseInt(val[i], 16).toString(2)
        }
        return true
    };
    get decimalList() {
        var out = [];
        for (var i = 0; i < this.binArray.length; i++) {
            out[i] = parseInt(this.binArray[i], 2);
        };
        return out;
    };
    set decimalList(val) { };
    saveAsFileDownload(filename) {
        console.log('got to saveAsFileDownload')
        var correctBinary = String.fromCharCode(this.decimalList);
        var blob = new Blob([correctBinary], { type: "octet/stream" })
        var url = URL.createObjectURL(blob)
        var a = document.createElement('a')
        a.download = filename
        a.href = url;
        document.body.appendChild(a)
        a.click()
        setTimeout(function() {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 2)
    };
    setSourceBlob(blob) {
        console.group('File Read:')
        console.log('Setting Source Blob...')
        this.blob = blob;
        console.log('Reading Binary...')
        this.fileReader.readAsBinaryString(blob);
    };
    _fileReadHandler(e, callback) {
        console.log('File Loaded. Generating Byte Array...')
        this.binArray = [];
        for (i = 0; i < e.target.result.length; i++) {
            this.binArray[i] = e.target.result[i].charCodeAt(0).toString(2);
            while (this.binArray[i].length < 8) {
                this.binArray[i] = '0' + this.binArray[i];
            }
        };
        callback();
        console.groupEnd('File Read:')
    }
};
var binFile = new BinFile()
var file = document.getElementById('fileIn');
var out = document.getElementById('out');
var toggleButton = document.getElementById('toggle');
var hexMode = false;
binFile.onComplete = whenload

function processFile() {
    binFile.setSourceBlob(file.files[0])
}
function whenload() {
    console.log('Displaying...')
    if (hexMode) {
        out.value = binFile.hexString
    } else {
        out.value = binFile.binaryString
    }
    console.log('Done!')
}
function downloadFile() {
    binFile.saveAsFileDownload(prompt('Please enter a filename below.'))
}
function toggleHexMode() {
    hexMode = !hexMode;
    if (toggleButton.value == 'View in Hexadecimal') {
        toggleButton.value = 'View in Binary';
        out.value = binFile.hexString
    } else {
        toggleButton.value = 'View in Hexadecimal';
        out.value = binFile.binaryString
    };
};
console.groupEnd('Initializing:')