//aliases
const Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite;


const app = new Application({width: 500, height: 500});
console.log(app);

document.body.appendChild(app.view);

//load an image to WebGL texture
PIXI.Loader.shared
    .add('assets/tank.png')
    .load(setup);

//what to do when loaded
function setup() {
    let tank = new PIXI.Sprite(
        PIXI.Loader.shared.resources['assets/tank.png'].texture
    );
    
    tank.width = 50;
    tank.height = 50;
    app.stage.addChild(tank);
}