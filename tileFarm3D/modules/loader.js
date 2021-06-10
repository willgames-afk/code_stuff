import {loadCrossOrigin,assetPath} from "./config.js"

export const Load = { //Maps filenames to specific face textures efficiently, see below
    blockTextures: {
        "dirt": "dirt.png",
        "log": {
            sides: "log.png",
            py: "log-top.png",
            ny: "log-top.png"
        }
    },
    terrainTextures: {
        "grass": "#0FFF00"
    }
}
/*  Texture Layout!

    Blocks-
        For blocks that have the same texture on all sides, just put the texture filename/color code.
        Otherwise, use a blockTextureObject (see below)
    
    Terrain- 
        Low-poly terrain textures- just put texture filename/color

    blockTextureObject Attributes-
        px-nz-
            px is the texture filename/color for the positive-x-facing side of the block. 
            (nz is negative z-facing, etc.)
        
        sides (optional)-
            Textures all sides except py and ny with whatever texture/color specified 
            that haven't been textured by px-nz

        all (optional)-
            Texture all sides that havent already been textured by px-nz or sides
*/



export class Assets {
    constructor(onloadCallback) {
        this.onloadCallback = onloadCallback

        //Setup of THREEjs Asset Manager- Keeps track of loads and such
        this.manager = new THREE.LoadingManager();
        this.manager.onStart = (url) => {
            console.log(`Started loading ${url}`);
        }
        this.manager.onProgress = this.onProgress;
        this.manager.onLoad = this.onload;
        this.manager.onError = this.onError;

        this.state = 0;
        /*  State Info:
            0- Not started
            1- Started Loading
            2- Essentials Loaded (Title Screen)
            3- Fully Loaded
        */

        this.blockTextures = {}; //Holds block textures.
    }
    onload() {
        console.log("Fully Loaded!");
        this.onloadCallback();
    }
    onProgress(url,loaded,total) {
        console.log(`loading file ${url} (${loaded} of ${total} files loaded)`)
    }
    startload() {
        const loader = new THREE.ImageLoader(this.manager);
        loader.setPath(assetPath);

        for (var blockName in Load.blockTextures) {
            var data = Load.blockTextures[blockName]
            if (typeof data == "string") {
                if (/#[\da-fA-F]{6}/.test(data)) { //If Color Code
                    this.blockTextures[blockName] = data; //Transfer
                } else {
                    //If filename, load file
                    loader.load(data, this.wOnBlockTxload(this.blockTextures[blockname]));
                }
                continue;
            } //else 
            for (var faceName in Load.blockTextures[blockName]) {
                if (typeof data == "string") {
                    if (/#[\da-fA-F]{6}/.test(data)) { //If Color Code
                        addFaceTexture(this.blockTextures[blockName],faceName,data); //Transfer
                    } else {
                        //If filename, load file
                        loader.load(data, this.wOnBlockTxload(this.blockTextures[blockname]));
                    }
                    continue;
                } //else 
            }
        }

    }
    wOnBlockTxload(block,face) { //Wrapped onBlockTextureload
        if (arguments.length == 1) {
            return function (img) {
                block = new THREE.Texture(img);
            }
        }
        return function (img) {
            addFaceTexture(block,face,img)
        }
    }
    addFaceTexture(block,faceName,imgOrColor) {
        const texture = (typeof imgOrColor == "string") ? img :  new THREE.Texture(img);
        if (faceName === "sides" || faceName === "all") {
            if (!block.px) block.px = texture;
            if (!block.nx) block.nx = texture;
            if (!block.pz) block.pz = texture;
            if (!block.nz) block.nz = texture;
            if (faceName === "all") {
                if (!block.pz) block.py = texture;
                if (!block.nz) block.ny = texture;
            }
        } else {
            block[faceName] = texture;
        }
    }
    onError(url) {
        console.error(`Error loading ${url}`)
    }
}