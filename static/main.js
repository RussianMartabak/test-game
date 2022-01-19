//aliases
const Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite,
    Container = PIXI.Container;
    

const app = new Application({width: 500, height: 500});
console.log(app);

document.body.appendChild(app.view);
let tank, state, sovSoldier, currentInterval;
const ppshSound = document.querySelector('#ppsh');

//add sounds
//sounds.load(['wpnfire_ppsh_plyr_blnc_ed3.wav']);
//sounds.whenLoaded = () => console.log('sound loaded');
//const ppshFire = sounds['wpnfire_ppsh_plyr_blnc_ed3.wav'];

//add onprogresslistener
loader.onProgress.add(loading);
//load an image to WebGL texture
loader
    .add('static/assets/tank.png')
    .add('static/assets/soviet.json')
    .load(setup);

//log when loading
function loading(loader, resources){
    console.log(`loading ${resources.url}`);
    console.log(`progress ${loader.progress} %`)
}

//what to do when loaded
function setup() {
    tank = new PIXI.Sprite(
        resources['static/assets/tank.png'].texture
    );
    const id = resources['static/assets/soviet.json'].textures;
    const background = new Sprite(id['snowbg.png']);
    
    const ppsh = firearm([id['ppsh.png'], id['ppsh-fire.png']], 20, ppshSound);
    console.log(ppsh.sound);
    ppsh.sound.volume = 0.05;
    const body = new Sprite(id['soviet-soldier.png']);
    sovSoldier = gruppen([body, ppsh]);
    
    

    console.log(sovSoldier.children);

    app.stage.addChild(background);  

    //controls 
    const up = keyboard(87),
      down = keyboard(83),
      left = keyboard(65),
      right = keyboard(68),
      space = keyboard(32);
      
    
    
    app.stage.addChild(sovSoldier);
    
    
    sovSoldier.position.set(100, 250);
    sovSoldier.vx = 0;
    sovSoldier.vy = 0;

    //controls controller
    up.press = () => {
      sovSoldier.vy = -1.5;
    }

    up.release = () => {
      if(!down.isDown) {
        sovSoldier.vy = 0;
      } else {
        sovSoldier.vy = 1.5;
      }
    }
    
    down.press = () => {
      sovSoldier.vy = 1.5;
    }

    down.release = () => {
      if(!up.isDown) {
        sovSoldier.vy = 0;
      } else {
        sovSoldier.vy = -1.5;
      }
      console.log(sovSoldier.y);
    }
    
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

    space.press = () => {
      ppsh.loop = true;
      ppsh.animationSpeed = 0.5;
      ppsh.play();
      currentInterval = setInterval(() => {
        ppsh.sound.currentTime = 0;
        ppsh.sound.play();
      }, 1000/ppsh.rps);

      
    }

    space.release = () => {
      clearInterval(currentInterval);
      ppsh.gotoAndStop(0);
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

//make animated sprite
function animation(textureArray) {
  let anim = new PIXI.AnimatedSprite(textureArray);
  
  return anim; 
}

//make a gun constructor that inherit animatedsprite
function firearm(textureArray, rps, sound) {
  let anim = new PIXI.AnimatedSprite(textureArray);
  
  anim.rps = rps;
  anim.sound = sound;
  return anim;
}