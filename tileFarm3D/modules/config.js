
export const version = '0.1.0';

export var cacheEnabled = true; //Enable THREEjs cacheing and storing of assets in localstorage
export var loadTextures = true; //Use textures. When false, uses simple colors.
export var fullLoadPreStart = false; //Load all the assets before the game launches. By default it will load only essentials before launching the menus

export var devMode = true; //changes a number of settings
if (devMode == true) {
    cacheEnabled = false;
    fullLoadPreStart = true;
}