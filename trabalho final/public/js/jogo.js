
let morreu = false;
let cont = 0;
let moeda = 20;
let score = 0;
let scoreTxt;
let nivel = 1;
let txtKill;
let nivelTxt;
let level = 1;
let levelTxt;

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
    [ 0,-1, 0,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1, 0,-1,-1,-1, 0,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1, 0],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1, 0],
    [-1,-1,-1, 0,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1, 0,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1, 0]];
var game = new Phaser.Game(config);

var graphics;
var path;
var ENEMY_SPEED = 1 / 10000;
function preload() {
    this.load.image('upButton', '/imgs/button.png');
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

        this.follower.t += ENEMY_SPEED * delta;

        path.getPoint(this.follower.t, this.follower.vec);


        this.setPosition(this.follower.vec.x, this.follower.vec.y);

        if (this.follower.t >= 1) {
            this.setActive(false);
            this.setVisible(false);
            document.getElementById("valorhighScore2").value=cont;
         document.getElementById("gameOver").submit();

        }

    },
    startOnPath: function () {
    
        this.follower.t = 0;

        
        path.getPoint(this.follower.t, this.follower.vec);

 
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        if (cont <= 10)
            this.hp = 100;
        if (cont > 10)
            this.hp = 300;
    },
    receiveDamage: function (damage) {
        this.hp -= damage;

        if (this.hp <= 0) {
            this.setActive(false);
            this.setVisible(false);
            morreu = true;
            moeda += 10;
         
        }
    },


});

var Turret = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
        function Turret(scene) {
            if (level == 1) {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'torre2', 'turret');
                this.nextTic = 0;

            } else {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'torre3', 'turret');
                this.nextTic = 0;
            }
        },
    place: function (i, j) {

        this.y = i * 64 + 64 / 2;
        this.x = j * 64 + 64 / 2;
        map[i][j] = 1;
        moeda -= 10;



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
    if (moeda >= 10) {
        return map[i][j] === 0;
        moeda -= 10;


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

            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet1');

            this.dx = 0;
            this.dy = 0;
            this.lifespan = 0;
            this.speed = Phaser.Math.GetSpeed(600, 1);

        },
    fire: function (x, y, angle) {

        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);

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
    let BULLET_DAMAGE = 20 + ((level - 1) * 10);
    if (enemy.active === true && bullet.active === true) {
        bullet.setActive(false);
        bullet.setVisible(false);

        enemy.receiveDamage(BULLET_DAMAGE);
    
    }
}


function create() {

    this.add.image(320, 250, 'mapa1');
    let up = this.add.image(80, 370, 'upButton').setInteractive();




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
    levelTxt = this.add.text(50, 390, 'Level: ' + level, { font: '32px Courier' });
    scoreTxt = this.add.text(50, 420, 'Moeda: ' + moeda, { font: '32px Courier' });
    killTxt = this.add.text(50, 450, 'Kill:    ' + cont, { font: '32px Courier' });
    nivelTxt = this.add.text(50, 480, 'Nivel: ' + nivel, { font: '32px Courier' });
    scoreTxt.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
    killTxt.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
    nivelTxt.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
    levelTxt.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
    up.on('pointerdown', function () {

        this.setTint(0xff44ff);
        if (moeda >= 10*level) {

            bullets.setTint(0xff44ff);
            moeda -= 10*level;
            level++;
        }
    });
    up.on('pointerup', function () {

        this.clearTint();

    });


}


function update(time, delta) {

    scoreTxt.setText('Moeda: ' + moeda);
    killTxt.setText('Kill: ' + cont);
    nivelTxt.setText('Nivel: ' + nivel);
    levelTxt.setText('Level: ' + level);

    if (time > this.nextEnemy && morreu) {
        var enemy = enemies.get();
        if (enemy) {
            enemy.setActive(true);
            enemy.setVisible(true);

      
            enemy.startOnPath();


            this.nextEnemy = time + 2000;



        

        }
        cont++;
        morreu = false;
        if (cont % 10 == 0 && cont > 1)
            nivel++;

    }

}
