
let gameOver=false;
let morreu = false;
let cont = 0;
let moeda = 20;
let score = 0;
let scoreText;
let nivel=1;
let txtKill;
let nivelTxt;
let level = 1;
var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 800,
    height: 512,
    physics: {
        default: 'arcade'
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};
var map = [
    [0, -1, 0, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, 0, -1, -1, -1, 0, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, 0],
    [-1, -1, -1, 0, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, 0, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, 0]];
var game = new Phaser.Game(config);

var graphics;
var path;
var ENEMY_SPEED = 1 / 10000;
function preload() {
    // load the game assets – enemy and turret atlas
    this.load.atlas('torre1', '/sprite/orcsheet.png', '/sprite/orcsheet.json');
    this.load.atlas('torre2', '/sprite/1.png', '/sprite/1.json');
    this.load.atlas('torre3', '/sprite/2.png', '/sprite/2.json');
    this.load.image('bullet1', '/sprite/bala.png');
    this.load.image('bullet2', '/sprite/bala2.png');
    this.load.image('mapa1', '/cenarios/mapa.png');
    this.load.atlas('over', '/imgs/valorant-vergaderzaal-kingdom-come.png', '/imgs/valorant-vergaderzaal-kingdom-come.json');
}
var Enemy = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
        function Enemy(scene) {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'torre1', 'enemy');
            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        },
    update: function (time, delta) {
        // move the t point along the path, 0 is the start and 0 is the end
        this.follower.t += ENEMY_SPEED * delta;

        // get the new x and y coordinates in vec
        path.getPoint(this.follower.t, this.follower.vec);

        // update enemy x and y to the newly obtained x and y
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        // if we have reached the end of the path, remove the enemy
        if (this.follower.t >= 1) {
            this.setActive(false);
            this.setVisible(false);
            location.href = "gameOver";
        }
 
    },
    startOnPath: function () {
        // set the t parameter at the start of the path
        this.follower.t = 0;

        // get x and y of the given t point            
        path.getPoint(this.follower.t, this.follower.vec);

        // set the x and y of our enemy to the received from the previous step
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        if (cont < 10)
            this.hp = 100;
        if (cont > 10)
            this.hp = 300;
    },
    receiveDamage: function (damage) {
        this.hp -= damage;

        // if hp drops below 0 we deactivate this enemy
        if (this.hp <= 0) {
            this.setActive(false);
            this.setVisible(false);
            morreu = true;
            moeda+=10;
            console.log(moeda);
        }
    },


});

var Turret = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
        function Turret(scene) {
            if(level==1){
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'torre2', 'turret');
            this.nextTic = 0;
            level++;
        }else{
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'torre3', 'turret');
            this.nextTic = 0;
        }
        },
    // we will place the turret according to the grid
    place: function (i, j) {
       
        this.y = i * 64 + 64 / 2;
        this.x = j * 64 + 64 / 2;
        map[i][j] = 1;
        moeda-=10;
  
    

    },
    fire: function () {
        var enemy = getEnemy(this.x, this.y, 150);
        if (enemy) {
            var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
            addBullet(this.x, this.y, angle);
            this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
        }
    },
    update: function (time, delta) {
        if (time > this.nextTic) {
            this.fire();
            this.nextTic = time + 1000;
        }
    }
});

function placeTurret(pointer) {
  


        var i = Math.floor(pointer.y / 64);
        var j = Math.floor(pointer.x / 64);
        if (canPlaceTurret(i, j)) {
            var turret = turrets.get();
            if (turret) {
                turret.setActive(true);
                turret.setVisible(true);
                turret.place(i, j);
            }
        }
        
    
}
function canPlaceTurret(i, j) {
    if(moeda>=10){
        return map[i][j] === 0;
        moeda-=10;
        console.log(moeda);
        
    }
   
}
function drawGrid(graphics) {
    graphics.lineStyle(1, 0x0000ff, 0.8);
    for (var i = 0; i < 8; i++) {
        graphics.moveTo(0, i * 64);
        graphics.lineTo(640, i * 64);
    }
    for (var j = 0; j < 10; j++) {
        graphics.moveTo(j * 64, 0);
        graphics.lineTo(j * 64, 512);
    }
    graphics.strokePath();
}
var Bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
        function Bullet(scene) {
            if(level==1){
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet1');
         
               
            }else{
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet2');
               
            }
            this.dx = 0;
            this.dy = 0;
            this.lifespan = 0;
            this.speed = Phaser.Math.GetSpeed(600, 1);
           
        },
    fire: function (x, y, angle) {
        this.setActive(true);
        this.setVisible(true);
        //  Bullets fire from the middle of the screen to the given x/y
        this.setPosition(x, y);
        //  we don't need to rotate the bullets as they are round
                    
        this.setRotation(angle);
        this.dx = Math.cos(angle);
        this.dy = Math.sin(angle);
        this.lifespan = 300;
    },
    update: function (time, delta) {
        this.lifespan -= delta;
        this.x += this.dx * (this.speed * delta);
        this.y += this.dy * (this.speed * delta);
        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
});
function addBullet(x, y, angle) {
    var bullet = bullets.get();
    if (bullet) {
        bullet.fire(x, y, angle);
    }
}
function getEnemy(x, y, distance) {
    var enemyUnits = enemies.getChildren();
    for (var i = 0; i < enemyUnits.length; i++) {
        if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance)
            return enemyUnits[i];
    }
    return false;
}
function damageEnemy(enemy, bullet) {
    let BULLET_DAMAGE = 20+((nivel-1)*10);
    // only if both enemy and bullet are alive
    if (enemy.active === true && bullet.active === true) {
        // we remove the bullet right away
        bullet.setActive(false);
        bullet.setVisible(false);

        // decrease the enemy hp with BULLET_DAMAGE
        enemy.receiveDamage(BULLET_DAMAGE);
    }
}


function create() {
    this.add.image(320, 250, 'mapa1');

    // the path for our enemies
    // parameters are the start x and y of our path
    path = this.add.path(130, -32);
    path.lineTo(130, 164);
    path.lineTo(480, 164);
    path.lineTo(480, 544);

    enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    this.nextEnemy = 0;

    turrets = this.add.group({ classType: Turret, runChildUpdate: true });

   
        this.input.on('pointerdown', placeTurret);
       
    
   
    bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
    this.physics.add.overlap(enemies, bullets, damageEnemy);
    var enemy = enemies.get();
    enemy.setActive(true);
    enemy.setVisible(true);
    enemy.startOnPath();
    scoreText = this.add.text(50, 420, 'Moeda: '+moeda, { font: '32px Courier'});
    killTxt = this.add.text(50, 450, 'Kill:    '+cont, { font: '32px Courier'});
    nivelTxt = this.add.text(50, 480, 'Nivel: '+nivel, { font: '32px Courier'});
        scoreText.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
        killTxt.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
        nivelTxt.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

 

}


function update(time, delta) {

    scoreText.setText('Moeda: ' + moeda);
    killTxt.setText('Kill: ' + cont);
    nivelTxt.setText('Nivel: ' + nivel);
    // if its time for the next enemy
    if (time > this.nextEnemy && morreu) {
        var enemy = enemies.get();
        if (enemy) {
            enemy.setActive(true);
            enemy.setVisible(true);

            // place the enemy at the start of the path
            enemy.startOnPath();


            this.nextEnemy = time + 2000;



            console.log(cont);
        }
        cont++;
        morreu = false;
        if(cont%10==0&&cont>1)
        nivel++;

    }
 
}
