import * as THREE from "https://unpkg.com/three@latest/build/three.module.js"
import { loadCrossOrigin, assetPath } from "./config.js"

export const Load = { //Maps filenames to specific face textures efficiently, see below
    blockTextures: {
        "dirt": "dirt.png",
        "log": {
            sides: "log.png",
            py: "log-top.png",
            ny: "log-top.png"
        },
        "yellow": "#FFFF00"
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
    constructor(onloadCallback = () => { return }) {
        this.onloadCallback = onloadCallback


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
        if (this.total !== false) { // !== because I need to diferentiate between '0' and 'false'
            console.log(`${this.total} files still loading...`);
            this.total--
            if (this.total === 0) {
                console.log("Fully Loaded!");
                this.state = 3;
                this.onloadCallback();
            }
        } else {
            console.log("No Total")
        }
    }
    load() {
        //TODO- Fix Double-loading- see log texture

        if (this.state > 0) {
            console.error("Already started loading!")
            return
        }
        this.state = 1;

        const loader = new THREE.ImageLoader(); //Set up loader
        loader.setPath(assetPath);

        var total = 1; //Number of assets to load; has to be incremented by one because I call it an extra time 
        this.total = false; //Invalid; have to figure out how many to load first

        for (var blockName in Load.blockTextures) {

            var data = Load.blockTextures[blockName]

            if (typeof data == "string") {
                if (/#[\da-fA-F]{6}/.test(data)) { //If Color Code
                    this.addFaceTexture(blockName, 'all', data); //Transfer
                } else {
                    //If filename, load file
                    total++
                    loader.load(data, this.wrapOnFaceLoad(blockName));
                }
                continue;
            } //else 
            console.log(blockName, "required per-face texture")
            for (var faceName in Load.blockTextures[blockName]) {
                data = Load.blockTextures[blockName][faceName]
                if (typeof data == "string") {
                    if (/#[\da-fA-F]{6}/.test(data)) { //If Color Code
                        this.addFaceTexture(blockName, faceName, data); //Transfer
                    } else {
                        //If filename, load file
                        total++
                        loader.load(data, this.wrapOnFaceLoad(blockName, faceName));
                    }
                    continue;
                } //else 
            }
        }
        this.total = total;

        this.onload(); //Prevents an edge case where all images load before this.total is registered
    }
    wrapOnFaceLoad(blockName, face = 'all') { //Wrapped onBlockTextureload
        return function (img) {
            //console.log(img)
            this.addFaceTexture(blockName, face, img)
            console.log(`Loaded ${blockName} (${face})!`)
            document.body.appendChild(img)
            this.onload();
        }.bind(this)
    }
    addFaceTexture(blockName, faceName, imgOrColor) {
        if (!this.blockTextures[blockName]) {
            this.blockTextures[blockName] = {};
        }

        const img = imgOrColor;
        //console.log(img);
        //console.log(blockName, faceName, texture, this.blockTextures[blockName])
        const block = this.blockTextures[blockName];
        if (faceName == "sides") {
            if (!this.blockTextures[blockName]) {
                this.blockTextures[blockName] = {};
            }
            //console.log(this.blockTextures[blockName])
            if (!block.px) this.blockTextures[blockName].px = img; //Have to edit directly; editing `block` wouldn't change this.blockTexturs...
            if (!block.nx) this.blockTextures[blockName].nx = img;
            if (!block.pz) this.blockTextures[blockName].pz = img;
            if (!block.nz) this.blockTextures[blockName].nz = img;
            /*if (faceName == "all") {
                if (!block.py) this.blockTextures[blockName].py = texture;
                if (!block.ny) this.blockTextures[blockName].ny = texture;
            }*/
        } else if (faceName == "all" && !(typeof imgOrColor == "string")) {
            console.log(`Single texture loaded, building '${blockName}'.`)
            this.blockTextures[blockName] = new THREE.Texture(img);
            this.blockTextures[blockName].magFilter = THREE.NearestFilter;
            this.blockTextures[blockName].needsUpdate = true;
            return
        } else {
            this.blockTextures[blockName][faceName] = img;
        }
        if (block.px && block.nx && block.py && block.ny && block.pz && block.nz) {
            console.log(`All textures present, building '${blockName}'.`)
            console.log(block);
            this.blockTextures[blockName] = new THREE.CubeTexture();
            this.blockTextures[blockName].images = [
                block.px, block.nx,
                block.py, block.ny,
                block.pz, block.nz
            ]
            //this.blockTextures[blockName].magFilter = THREE.NearestFilter
            this.blockTextures[blockName].needsUpdate = true;
        }
    }
    createBlock(type) {
        const texture = this.blockTextures[type].texture
        const geo = new THREE.BoxGeometry(1, 1, 1);
        var mats = [];

        if (typeof texture == "string") {
            //It's a color, make a colored material
            return new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color: texture }));
        } //Else

        //console.log(texture)
        return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: texture }));

    }
}