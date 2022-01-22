import * as PIXI from 'pixi.js';
import keyboard from './keyboard';

//aliases
const Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite,
    Container = PIXI.Container;
    

const app = new Application({width: 500, height: 500});
console.log(app);

document.body.appendChild(app.view);
let tank, state, sovSoldier, currentInterval, bullet;
let movingBullets = [];
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
    
    const messageStyle = new PIXI.TextStyle({
      fontSize: 18,
      fontFamily: "Helvetica",
    })
    const message = new PIXI.Text("John Mctavish, 62nd Guards Rifle Division", messageStyle);
    message.y = 450;
    

    const ppsh = firearm([id['ppsh.png'], id['ppsh-fire.png']], 20, ppshSound);
    console.log(ppsh.sound);
    ppsh.sound.volume = 0.05;
    const body = new Sprite(id['soviet-soldier.png']);
    sovSoldier = gruppen([body, ppsh]);
    
    bullet = new Sprite(id["bullet.png"]);

    console.log(sovSoldier.children);

    app.stage.addChild(background);  
    app.stage.addChild(message);
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
        
        let bullet = liveBullet(ppsh, 6);
        app.stage.addChild(bullet);
        movingBullets.push(bullet);
      }, 1000/ppsh.rps);

      
    }

    space.release = () => {
      console.log(movingBullets);
      
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
    movingBullets.forEach((e, index) => {
      if (e.x < e.limitx) {
        e.x += e.vx;
      } else if (e.x > e.limitx) {
        movingBullets.splice(index, 1);
        app.stage.removeChild(e);
      }
    })
}

function stop(delta) {
    //empty so when the game state is stop nothing happened
}
//either this or setTimeout but the dlay multiplied by the limit to create delayed loop
//function rotateForever(sprite){
//    setInterval(() => sprite.angle += 10, 100);
//}



//make a grouped sprite
function gruppen(spriteArray) {
  let group = new Container()
  spriteArray.forEach(element => {
    group.addChild(element)
  });
  return group;
}

function move(sprite, vx, vy) {
  //inside the gameloop move the object at their velocity props
}

//make a gun constructor that inherit animatedsprite
function firearm(textureArray, rps, sound) {
  let anim = new PIXI.AnimatedSprite(textureArray);
  
  anim.rps = rps;
  anim.sound = sound;
  anim.firing = false;
  return anim;
}

function moveBullet(object) {
  
}

function liveBullet(firearm, velocity) {
  let firearmPos = firearm.parent.toGlobal(firearm.position);
  const liveProps = {
    x : firearmPos.x + firearm.width / 2,
    y : firearmPos.y,
    vx : velocity,
    limitx : 495
  }
  return Object.assign(bullet, liveProps);
  //return {x, y, vx, limitx};
}