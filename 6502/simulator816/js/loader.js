
export class Loader {
    constructor(memory) {
        this.memor
    }
    /** Loads a ROM image
     * @param {string} url
     */
    loadRom(url) {
        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.responseType = 'arraybuffer';
        req.addEventListener('load', (e) => {
            if (req.status == 200) {
                let dataView = new DataView(req.response);
                let wordCount = dataView.byteLength >> 1;
                //Convert to host endianess
                for (let wordIndex = 0; wordIndex < wordCount; wordIndex++) {

                }
            } else {
                alert(`Failed to load ROM from <code>${url}</code>, recieved status "${req.statusText}".`)
            }
        })
        req.send(null);
    }
}