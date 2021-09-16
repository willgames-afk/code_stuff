import { SimplexNoise } from "../../libs/simplex-noise.js";
import { Matrix4, PlaneBufferGeometry, Mesh, MeshLambertMaterial, FrontSide, DoubleSide } from "../../libs/three.module.js";
import * as BufferGeoUtils from "../../libs/bufferGeoUtils.js"

const CHUNK_HEIGHT = 256;
const CHUNK_SIZE = 16;

export class World {
	constructor(game) {
		this.game = game;
		this.noise = new SimplexNoise(this.game.seed);
	}
	loadChunk(x, z) {
		//Loads a specific chunk

		//If chunk has aleady generated, add it to the list of loaded chunks
		if (this.game.chunks[x + ":" + z]) {
			this.game.addLoadedChunk(this.game.chunks[x + ":" + z]);
		} else {
			const c = this.generateChunk(x, z);
			this.game.chunks[x + ":" + z] = c
			this.game.addLoadedChunk(c);
		}
	}
	generateChunk(x, z) {
		var newChunk = {};
		newChunk.pos = [x, z];
		newChunk.data = [];
		for (var bx = 0; bx < CHUNK_SIZE; bx++) {
			newChunk.data[bx] = [];
			for (var bz = 0; bz < CHUNK_SIZE; bz++) {
				newChunk.data[bx][bz] = [];
				for (var by = 0; by < CHUNK_HEIGHT; by++) {
					newChunk.data[bx][bz][by] = this.isBlock(bx + x * 16, by, bz + z * 16);
				}
			}
		}
		newChunk.mesh = this.generateChunkMesh(newChunk);
		return newChunk;
	}
	isBlock(x, y, z) {
		const smoothness = 50; //How smooth the noise should be
		const groundHeight = (this.noise.noise2D(x / smoothness, z / smoothness) + 1) * 10; //Generates a random block height from 0 to 20;

		return y < groundHeight; //If the block is 'underground', then it's a solid block
	}
	generateChunkMesh(chunk) {
		//console.log(chunk)

		//Create all the required cube faces
		const pxgeo = new PlaneBufferGeometry(1, 1);
		pxgeo.rotateY(Math.PI / 2);
		pxgeo.translate(0.5, 0, 0);

		const nxgeo = new PlaneBufferGeometry(1, 1);
		nxgeo.rotateY(-Math.PI / 2);
		nxgeo.translate(-0.5, 0, 0);

		const pygeo = new PlaneBufferGeometry(1, 1);
		pygeo.rotateX(-Math.PI / 2);
		pygeo.translate(0, 0.5, 0);

		const nygeo = new PlaneBufferGeometry(1, 1);
		nygeo.rotateY(Math.PI / 2);
		nygeo.translate(0, -0.5, 0);

		const pzgeo = new PlaneBufferGeometry(1, 1);
		pzgeo.translate(0, 0, 0.5);

		const nzgeo = new PlaneBufferGeometry(1, 1);
		nzgeo.rotateX(Math.PI)
		nzgeo.translate(0, 0, -0.5);


		//Generate planes here
		var faces = [];
		var matrix = new Matrix4();
		for (var bx = 0; bx < CHUNK_SIZE; bx++) {
			for (var bz = 0; bz < CHUNK_SIZE; bz++) {
				for (var by = 0; by < CHUNK_HEIGHT; by++) {
					matrix.makeTranslation(bx, by, bz);

					if (chunk.data[bx] && chunk.data[bx][bz] && chunk.data[bx][bz][by]) {
						if (bx == 0) {
							if (!this.isBlock(chunk.pos[0] * 16 - 1, by, chunk.pos[1] * 16 + bz)) faces.push(nxgeo.clone().applyMatrix4(matrix));
						} else if (!chunk.data[bx - 1][bz][by]) {
							faces.push(nxgeo.clone().applyMatrix4(matrix)); //Create a copy of our nz-facing plane and shift it to where it needs to be, then add it to the geo
						}
						if (bz == 0) {
							if (!this.isBlock(chunk.pos[0] * 16 + bx, by, chunk.pos[1] * 16 - 1)) faces.push(nzgeo.clone().applyMatrix4(matrix));
						} else if (!chunk.data[bx][bz - 1]?.[by]) {
							faces.push(nzgeo.clone().applyMatrix4(matrix));
						}

						if (!chunk.data[bx][bz][by - 1]) {
							faces.push(nygeo.clone().applyMatrix4(matrix));
						}

						if (bx == CHUNK_SIZE - 1) {
							if (!this.isBlock((chunk.pos[0] + 1) * 16, by, chunk.pos[1] * 16 + bz)) faces.push(pxgeo.clone().applyMatrix4(matrix));
						} else if (!chunk.data[bx + 1][bz][by]) {
							faces.push(pxgeo.clone().applyMatrix4(matrix)); //Create a copy of our nz-facing plane and shift it to where it needs to be, then add it to the geo
						}
						if (bz == CHUNK_SIZE - 1) {
							if (!this.isBlock(chunk.pos[0] * 16 + bx, by, (chunk.pos[1] + 1) * 16)) faces.push(pzgeo.clone().applyMatrix4(matrix));
						} else if (!chunk.data[bx][bz + 1]?.[by]) {
							faces.push(pzgeo.clone().applyMatrix4(matrix));
						}

						if (!chunk.data[bx][bz][by + 1]) {
							faces.push(pygeo.clone().applyMatrix4(matrix));
						}
					}
				}
			}
		}
		//console.log(faces)
		//Merge all the planes together into one geometry
		var geo = BufferGeoUtils.mergeBufferGeometries(faces);
		var mesh = new Mesh(geo, new MeshLambertMaterial({ map: this.game.assets.dirtTexture, side: FrontSide }));
		mesh.translateX(chunk.pos[0] * 16);
		mesh.translateZ(chunk.pos[1] * 16);
		return mesh
	}
}