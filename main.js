//aliases
const Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite,
    Container = PIXI.Container;
    

const app = new Application({width: 500, height: 500});
console.log(app);

document.body.appendChild(app.view);
let tank, state, sovSoldier;

//add onprogresslistener
loader.onProgress.add(loading);
//load an image to WebGL texture
loader
    .add('assets/tank.png')
    .add('assets/soviet.json')
    .load(setup);

//log when loading
function loading(loader, resources){
    console.log(`loading ${resources.url}`);
    console.log(`progress ${loader.progress} %`)
}

//what to do when loaded
function setup() {
    tank = new PIXI.Sprite(
        resources['assets/tank.png'].texture
    );
    const id = resources['assets/soviet.json'].textures;
    const background = new Sprite(id['snowbg.png']);
    
    const ppsh = new Sprite(id['ppsh.png']);
    const body = new Sprite(id['soviet-soldier.png']);
    sovSoldier = gruppen([body, ppsh]);
    
    console.log(sovSoldier.children);
    
    

    app.stage.addChild(background);  

    //controls 
    const up = keyboard(87),
      down = keyboard(83),
      left = keyboard(65),
      right = keyboard(68);
    
    
    
    app.stage.addChild(sovSoldier);
    
    
    sovSoldier.position.set(100, 250);
    sovSoldier.vx = 0;
    sovSoldier.vy = 0;

    //controls controller
    right.press = () => {
      sovSoldier.vx = 1.5;
    }

    right.release = () => {
      if(!left.isDown) {
        sovSoldier.vx = 0;
      } else {
        sovSoldier.vx = -1.5;
      }
    }
    
    left.press = () => {
      sovSoldier.vx = -1.5;
    }

    left.release = () => {
      if(!right.isDown) {
        sovSoldier.vx = 0
      } else {
        sovSoldier.vx = 1.5;
      }
    }
    
    state = play;
    //animate tank move right 60 fps
    app.ticker.add((delta) => gameLoop(delta));
    

}

function gameLoop(delta) {
    state(delta);
}

function play(delta) {
    sovSoldier.y += sovSoldier.vy;
    sovSoldier.x += sovSoldier.vx;
}

function stop(delta) {
    //empty so when the game state is stop nothing happened
}
//either this or setTimeout but the dlay multiplied by the limit to create delayed loop
//function rotateForever(sprite){
//    setInterval(() => sprite.angle += 10, 100);
//}

//The `keyboard` helper function
function keyboard(keyCode) {
    const key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = (event) => {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) {
          key.press();
        }
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
    };
  
    //The `upHandler`
    key.upHandler = (event) => {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) {
          key.release();
        }
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
    };
  
    //Attach event listeners
    window.addEventListener("keydown", key.downHandler.bind(key), false);
    window.addEventListener("keyup", key.upHandler.bind(key), false);
    return key;
  }

//make a grouped sprite
function gruppen(spriteArray) {
  let group = new Container()
  spriteArray.forEach(element => {
    group.addChild(element)
  });
  return group;
}