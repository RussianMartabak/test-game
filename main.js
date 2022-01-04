//aliases
const Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite;


const app = new Application({width: 500, height: 500});
console.log(app);

document.body.appendChild(app.view);

//add onprogresslistener
loader.onProgress.add(loading);
//load an image to WebGL texture
loader
    .add('assets/tank.png')
    .load(setup);

//log when loading
function loading(loader, resources){
    console.log(`loading ${resources.url}`);
    console.log(`progress ${loader.progress} %`)
}

//what to do when loaded
function setup() {
    let tank = new PIXI.Sprite(
        resources['assets/tank.png'].texture
    );
    
    tank.width = 100;
    tank.height = 100;
    tank.position.set(150, 150);
    app.stage.addChild(tank);
    tank.anchor.set(0.5, 0.5);
    rotateForever(tank);
}

function rotateForever(sprite){
    setInterval(() => sprite.rotation += 0.1, 100);
}