"use strict";
var xsoldier;
(function (xsoldier) {
    var ƒ = FudgeCore;
    let soundLaser;
    let soundGun;
    let soundBomb;
    function initializeSound() {
        soundLaser = new ƒ.Audio("./Assets/Sounds/Laser Shot.mp3");
        soundGun = new ƒ.Audio("./Assets/Sounds/Gun Shot.mp3");
        soundBomb = new ƒ.Audio("./Assets/Sounds/Bomb Shot.mp3");
    }
    xsoldier.initializeSound = initializeSound;
    function setSound(graph) {
        let audio = graph.getChildrenByName("Audio")[0];
        xsoldier.stageAudio = audio.getChildrenByName("StageMusic")[0].getComponent(ƒ.ComponentAudio);
        xsoldier.stageAudio.connect(true);
        xsoldier.stageAudio.setAudio(getStageMusic(0, "Menu"));
        xsoldier.stageAudio.play(true);
        xsoldier.largeExplosionAudio = audio.getChildrenByName("PlayerExplosion")[0].getComponent(ƒ.ComponentAudio);
        xsoldier.smallExplosionAudio = audio.getChildrenByName("EnemyExplosion")[0].getComponent(ƒ.ComponentAudio);
        xsoldier.weaponAudio = audio.getChildrenByName("Weapon")[0].getComponent(ƒ.ComponentAudio);
        xsoldier.weaponAudio.connect(true);
        xsoldier.weaponAudio.setAudio(soundLaser);
    }
    xsoldier.setSound = setSound;
    function getStageMusic(stageNumber, option) {
        const basePath = "./Assets/Music/";
        if (stageNumber == 0) {
            return new ƒ.Audio(`${basePath}0-${option}.mp3`);
        }
        else if (option == "Boss") {
            return new ƒ.Audio(`${basePath}${stageNumber}-Boss-1.mp3`);
        }
        return new ƒ.Audio(`${basePath}${stageNumber}.mp3`);
    }
    function oneTimeAudio(name) {
        xsoldier.stageAudio.setAudio(getStageMusic(0, name));
        xsoldier.stageAudio.play(true);
        xsoldier.stageAudio.loop = false;
    }
    xsoldier.oneTimeAudio = oneTimeAudio;
    function setStageMusic(stageNumber, boss) {
        xsoldier.stageAudio.setAudio(getStageMusic(stageNumber));
        if (boss)
            xsoldier.stageAudio.setAudio(getStageMusic(stageNumber, "Boss"));
        xsoldier.stageAudio.play(true);
    }
    xsoldier.setStageMusic = setStageMusic;
    function playWeaponSound() {
        xsoldier.weaponAudio.play(true);
    }
    xsoldier.playWeaponSound = playWeaponSound;
    function setWeaponSound(weaponType) {
        switch (weaponType) {
            case 0: {
                xsoldier.weaponAudio.setAudio(soundLaser);
                break;
            }
            case 1: {
                xsoldier.weaponAudio.setAudio(soundGun);
                break;
            }
            case 2: {
                xsoldier.weaponAudio.setAudio(soundBomb);
                break;
            }
        }
    }
    xsoldier.setWeaponSound = setWeaponSound;
})(xsoldier || (xsoldier = {}));
var xsoldier;
(function (xsoldier) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Avatar extends ƒAid.NodeSprite {
        gunReady = true;
        weaponType = 0;
        powerLevel = [1, 1, 1];
        invincible = true;
        allowMovement = true;
        lives = 3;
        maxPowerLevel = 8;
        constructor() {
            super("Mothership");
            this.addComponent(new ƒ.ComponentTransform());
        }
        initializeAnimations(imgSpriteSheet) {
            let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
            let animation = new ƒAid.SpriteSheetAnimation("Fly", coat);
            animation.generateByGrid(ƒ.Rectangle.GET(0, 0, 32, 32), 6, 128, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.Y(32));
            this.resetPosition(true);
            this.setAnimation(animation);
            this.setFrameDirection(0);
        }
        setItem(itemType) {
            if (this.invincible)
                return;
            if (itemType == 0) {
                for (let i = 0; i < this.powerLevel.length; i++) {
                    if (this.powerLevel[i] < this.maxPowerLevel) {
                        this.powerLevel[i] += 1;
                    }
                }
                this.updatePowerLevel();
                return;
            }
            if (itemType > 0) {
                if (this.weaponType == itemType - 1) {
                    if (this.powerLevel[itemType - 1] < this.maxPowerLevel) {
                        this.powerLevel[itemType - 1] += 1;
                    }
                    this.updatePowerLevel();
                    return;
                }
                this.weaponType = itemType - 1;
                xsoldier.setWeaponSound(this.weaponType);
                this.updatePowerLevel();
                return;
            }
        }
        hit() {
            if (this.invincible)
                return false;
            this.resetPosition();
            this.lives--;
            xsoldier.vui.hp = this.lives;
            if (this.lives == 0) {
                xsoldier.vui.info = "GAME OVER";
                return true;
            }
            return false;
        }
        resetPosition(initial = false) {
            this.invincible = true;
            if (initial) {
                this.mtxLocal.set(new ƒ.Matrix4x4());
                this.mtxLocal.translateY(-2);
                ƒ.Time.game.setTimer(2000, 1, () => {
                    this.invincible = false;
                });
                return;
            }
            this.allowMovement = false;
            ƒ.Time.game.setTimer(2000, 1, () => {
                this.mtxLocal.set(new ƒ.Matrix4x4());
                this.mtxLocal.translateY(-2);
                this.allowMovement = true;
            });
            ƒ.Time.game.setTimer(4000, 1, () => {
                this.invincible = false;
            });
        }
        updatePowerLevel() {
            xsoldier.vui.power = `${this.powerLevel[0]}-${this.powerLevel[1]}-${this.powerLevel[2]}`;
        }
    }
    xsoldier.Avatar = Avatar;
})(xsoldier || (xsoldier = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);
    class CustomComponentScript extends ƒ.ComponentScript {
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd", this.hndEvent);
            this.addEventListener("componentRemove", this.hndEvent);
            this.addEventListener("nodeDeserialized", this.hndEvent);
        }
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd":
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove":
                    this.removeEventListener("componentAdd", this.hndEvent);
                    this.removeEventListener("componentRemove", this.hndEvent);
                    break;
                case "nodeDeserialized":
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var xsoldier;
(function (xsoldier) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Enemy extends ƒAid.NodeSprite {
        static count = 0;
        flySpeed;
        enemyType;
        constructor(_enemyType) {
            super("Enemy" + (Enemy.count++));
            this.enemyType = _enemyType;
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translateY(2.45);
            this.mtxLocal.rotateZ(180);
            this.mtxLocal.translateX(xsoldier.random(xsoldier.config.space.limitLeft, xsoldier.config.space.limitRight));
        }
        move() {
            switch (this.enemyType) {
                case 0: {
                    this.mtxLocal.translateY(this.flySpeed * ƒ.Loop.timeFrameReal / 1000);
                    break;
                }
                case 1: {
                    break;
                }
                case 2: {
                    break;
                }
                case 3: {
                    break;
                }
                case 4: {
                    break;
                }
                case 5: {
                    break;
                }
            }
        }
        initializeAnimations() {
            this.setAnimation(xsoldier.enemyTypes[this.enemyType]);
            this.flySpeed = xsoldier.config.enemy[this.enemyType].speed;
            const tolerance = xsoldier.config.enemy[this.enemyType].speedTolerance;
            this.flySpeed += xsoldier.random(-tolerance, tolerance);
            this.setFrameDirection(0);
        }
    }
    xsoldier.Enemy = Enemy;
})(xsoldier || (xsoldier = {}));
var xsoldier;
(function (xsoldier) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Item extends ƒAid.NodeSprite {
        static count = 0;
        type;
        dropSpeed;
        constructor(_pos) {
            super("Item" + (Item.count++));
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translateX(_pos.x);
            this.mtxLocal.translateY(_pos.y);
        }
        initialize() {
            this.dropSpeed = xsoldier.random(-0.2, -1.5);
            this.type = Math.floor(xsoldier.random(0, 4));
            this.setAnimation(xsoldier.itemSprite);
            this.setFrameDirection(0);
            this.showFrame(this.type);
        }
        move() {
            this.mtxLocal.translateY(this.dropSpeed * ƒ.Loop.timeFrameReal / 1000);
        }
    }
    xsoldier.Item = Item;
})(xsoldier || (xsoldier = {}));
var xsoldier;
(function (xsoldier) {
    var ƒ = FudgeCore;
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        viewport.camera.mtxPivot.translateZ(5);
        viewport.camera.mtxPivot.rotateY(180);
        hndLoad(_event);
    }
    let avatar;
    xsoldier.projectileTypes = [];
    xsoldier.enemyTypes = [];
    xsoldier.starTypes = [];
    let projectiles = new ƒ.Node("Projectiles");
    let enemies = new ƒ.Node("Enemies");
    let items = new ƒ.Node("Items");
    let stars = new ƒ.Node("Stars");
    let explosions = new ƒ.Node("Explosions");
    let enemyReady = true;
    let enemyType = 0;
    let gameOver = false;
    let lastStage = 0;
    let currentStage = 0;
    let stageEnemies = 0;
    let lastBoss = false;
    let currentBoss = false;
    async function initializeSpriteSheets() {
        xsoldier.projectileTypes[0] = await createSprite("PlayerShot1", 15, 26, 26, 2);
        xsoldier.projectileTypes[1] = await createSprite("PlayerShot2", 32, 32, 32, 2);
        xsoldier.projectileTypes[2] = await createSprite("PlayerShot3", 128, 128, 128, 3);
        xsoldier.enemyTypes[0] = await createSprite("Enemy1", 32, 32, 32, 8);
        xsoldier.enemyTypes[1] = await createSprite("Enemy2", 32, 32, 32, 8);
        xsoldier.enemyTypes[2] = await createSprite("Enemy3", 32, 32, 32, 8);
        xsoldier.itemSprite = await createSprite("Item", 32, 32, 32, 4);
        xsoldier.starTypes[0] = await createSprite("Star1", 4, 4, 4, 4);
        xsoldier.starTypes[1] = await createSprite("Star2", 4, 12, 12, 4);
        xsoldier.expLarge = await createSprite("expLarge", 66, 66, 66, 4);
        xsoldier.expSmall = await createSprite("expSmall", 32, 32, 32, 5);
    }
    async function createSprite(name, _w, _h, _offset, _frames) {
        let spriteSheet = new ƒ.TextureImage();
        await spriteSheet.load(`./Assets/Sprites/PNG/${name}.png`);
        let coat = new ƒ.CoatTextured(undefined, spriteSheet);
        let animation = new ƒAid.SpriteSheetAnimation(name, coat);
        animation.generateByGrid(ƒ.Rectangle.GET(0, 0, _w, _h), _frames, 128, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.Y(_offset));
        return animation;
    }
    async function hndLoad(_event) {
        xsoldier.config = await (await fetch("../../config.json")).json();
        xsoldier.vui = new xsoldier.VUI();
        await initializeSpriteSheets();
        const imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("./Assets/Sprites/PNG/Player.png");
        avatar = new xsoldier.Avatar();
        avatar.initializeAnimations(imgSpriteSheet);
        let graph = viewport.getBranch();
        graph.addChild(avatar);
        graph.addChild(projectiles);
        graph.addChild(enemies);
        graph.addChild(items);
        graph.addChild(stars);
        graph.addChild(explosions);
        xsoldier.initializeSound();
        xsoldier.setSound(graph);
        for (let i = 0; i < 40; i++) {
            stars.addChild(new xsoldier.Star());
        }
        ƒ.Loop.addEventListener("loopFrame", update);
        ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
    }
    function update(_event) {
        for (const star of stars.getChildren()) {
            star.move();
        }
        switch (currentStage) {
            case 0: {
                xsoldier.vui.info = "Click To Start";
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
                    avatar.resetPosition(true);
                    currentStage++;
                }
                return;
            }
            default: {
                updateStage();
                break;
            }
        }
        if (gameOver) {
            endGame();
            return;
        }
        xsoldier.movePlayer(avatar);
        xsoldier.checkBoundaries(avatar);
        if (enemyReady && stageEnemies > 0) {
            const enemy = new xsoldier.Enemy(enemyType);
            enemy.initializeAnimations();
            enemies.addChild(enemy);
            enemyReady = false;
            stageEnemies--;
            console.log(stageEnemies);
            const birthRate = xsoldier.config.enemy[enemyType].birthRate;
            ƒ.Time.game.setTimer(birthRate, 1, () => enemyReady = true);
        }
        for (const enemy of enemies.getChildren()) {
            enemy.move();
            if (enemy.mtxLocal.translation.y < xsoldier.config.space.limitBottom - .5) {
                enemy.stopAnimation();
                enemies.removeChild(enemy);
            }
        }
        for (const enemy of enemies.getChildren()) {
            if (getDistance(enemy, avatar) < xsoldier.config.player.size && !avatar.invincible) {
                enemy.stopAnimation();
                enemies.removeChild(enemy);
                createLargeExplosion(avatar.mtxLocal.translation);
                xsoldier.largeExplosionAudio.play(true);
                gameOver = avatar.hit();
            }
        }
        for (const item of items.getChildren()) {
            item.move();
            if (item.mtxLocal.translation.y < xsoldier.config.space.limitBottom - .5) {
                item.stopAnimation();
                items.removeChild(item);
            }
        }
        for (const item of items.getChildren()) {
            if (getDistance(item, avatar) < xsoldier.config.player.size) {
                item.stopAnimation();
                items.removeChild(item);
                avatar.setItem(item.type);
            }
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            if (avatar.gunReady && !avatar.invincible) {
                xsoldier.shoot(avatar, projectiles);
                xsoldier.playWeaponSound();
            }
        }
        else if (!avatar.invincible) {
            xsoldier.vui.score += 2;
        }
        for (const projectile of projectiles.getChildren()) {
            projectile.move();
            for (const enemy of enemies.getChildren()) {
                if (getDistance(enemy, projectile) < xsoldier.config.player.accuracy) {
                    if (avatar.weaponType == 2) {
                        for (const nearbyEnemy of enemies.getChildren()) {
                            if (getDistance(nearbyEnemy, enemy) < .4) {
                                nearbyEnemy.stopAnimation();
                                enemies.removeChild(nearbyEnemy);
                            }
                        }
                    }
                    createSmallExplosion(enemy.mtxLocal.translation);
                    xsoldier.smallExplosionAudio.play(true);
                    xsoldier.vui.score += 100;
                    const delay = projectile.hit(avatar.weaponType);
                    ƒ.Time.game.setTimer(delay, 1, () => {
                        projectile.stopAnimation();
                        projectiles.removeChild(projectile);
                    });
                    enemy.stopAnimation();
                    enemies.removeChild(enemy);
                    if (Math.random() < xsoldier.config.item.dropRate) {
                        const item = new xsoldier.Item(enemy.mtxLocal.translation.toVector2());
                        item.initialize();
                        items.addChild(item);
                    }
                }
            }
            if (projectile.mtxLocal.translation.y > xsoldier.config.space.limitTop + .5
                || projectile.mtxLocal.translation.y < xsoldier.config.space.limitBottom - .5
                || projectile.mtxLocal.translation.x > xsoldier.config.space.limitRight + .5
                || projectile.mtxLocal.translation.x < xsoldier.config.space.limitLeft - .5) {
                projectile.stopAnimation();
                projectiles.removeChild(projectile);
            }
        }
        if (avatar.invincible) {
            respawnAnimation();
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function getDistance(a, b) {
        return Math.hypot(a.mtxLocal.translation.x - b.mtxLocal.translation.x, a.mtxLocal.translation.y - b.mtxLocal.translation.y);
    }
    let frames = 0;
    function respawnAnimation() {
        frames++;
        if (frames % 2 == 0 || frames % 3 == 0 || frames % 4 == 0) {
            avatar.showFrame(5);
        }
    }
    function createSmallExplosion(pos) {
        const explosion = new ƒAid.NodeSprite("LargeExplosion");
        explosion.addComponent(new ƒ.ComponentTransform());
        explosion.mtxLocal.translation = pos;
        explosion.setAnimation(xsoldier.expSmall);
        explosion.framerate = 20;
        explosions.addChild(explosion);
        ƒ.Time.game.setTimer(300, 1, () => {
            explosion.stopAnimation();
            explosions.removeChild(explosion);
        });
    }
    function createLargeExplosion(pos) {
        const count = 4;
        const offset = 50;
        const size = .25;
        for (let i = 0; i < count; i++) {
            const explosion = new ƒAid.NodeSprite("LargeExplosion");
            explosion.addComponent(new ƒ.ComponentTransform());
            explosion.mtxLocal.translation = pos;
            explosion.mtxLocal.translateX(xsoldier.random(-size, size));
            explosion.mtxLocal.translateY(xsoldier.random(-size, size));
            explosion.mtxLocal.rotateZ(i * 90);
            ƒ.Time.game.setTimer(offset * i, 1, () => {
                explosion.setAnimation(xsoldier.expLarge);
                explosion.framerate = 20;
                explosions.addChild(explosion);
                ƒ.Time.game.setTimer(2000, 1, () => {
                    explosion.stopAnimation();
                    explosions.removeChild(explosion);
                });
            });
        }
    }
    function endGame() {
        if (avatar.invincible) {
            createLargeExplosion(avatar.mtxLocal.translation);
            avatar.showFrame(5);
            avatar.invincible = false;
            xsoldier.oneTimeAudio("Game Over");
        }
        for (const enemy of enemies.getChildren()) {
            enemies.removeChild(enemy);
        }
        for (const projectile of projectiles.getChildren()) {
            projectiles.removeChild(projectile);
        }
        for (const item of items.getChildren()) {
            items.removeChild(item);
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function updateStage() {
        if (currentStage != lastStage || currentBoss != lastBoss) {
            xsoldier.vui.info = "STAGE " + currentStage;
            xsoldier.setStageMusic(currentStage, currentBoss);
            ƒ.Time.game.setTimer(2500, 1, () => {
                xsoldier.vui.info = "";
            });
            xsoldier.vui.stage = "1 - " + currentStage;
            lastStage = currentStage;
            lastBoss = currentBoss;
            if (!currentBoss)
                stageEnemies = xsoldier.config.stage[currentStage - 1].enemyCount[0];
        }
        if (stageEnemies <= 0) {
            currentBoss = true;
        }
    }
})(xsoldier || (xsoldier = {}));
var xsoldier;
(function (xsoldier) {
    function movePlayer(player) {
        if (!player.allowMovement) {
            player.showFrame(5);
            return;
        }
        player.showFrame(0);
        let speed = xsoldier.config.player.flySpeed;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT]))
            speed = xsoldier.config.player.boostSpeed;
        const distance = speed * ƒ.Loop.timeFrameGame / 1000;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
            player.mtxLocal.translateY(distance);
            player.showFrame(0);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
            player.mtxLocal.translateY(-distance);
            player.showFrame(0);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            player.mtxLocal.translateX(-distance);
            player.showFrame(1);
            if (speed > xsoldier.config.player.flySpeed)
                player.showFrame(2);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            player.mtxLocal.translateX(distance);
            player.showFrame(3);
            if (speed > xsoldier.config.player.flySpeed)
                player.showFrame(4);
        }
    }
    xsoldier.movePlayer = movePlayer;
    function checkBoundaries(player) {
        const xPos = player.mtxLocal.translation.x;
        const yPos = player.mtxLocal.translation.y;
        if (xPos < xsoldier.config.space.limitLeft)
            player.mtxLocal.translation = new ƒ.Vector3(xsoldier.config.space.limitLeft, yPos, 0);
        else if (xPos > xsoldier.config.space.limitRight)
            player.mtxLocal.translation = new ƒ.Vector3(xsoldier.config.space.limitRight, yPos, 0);
        if (yPos < xsoldier.config.space.limitBottom)
            player.mtxLocal.translation = new ƒ.Vector3(xPos, xsoldier.config.space.limitBottom, 0);
        else if (yPos > xsoldier.config.space.limitTop)
            player.mtxLocal.translation = new ƒ.Vector3(xPos, xsoldier.config.space.limitTop, 0);
    }
    xsoldier.checkBoundaries = checkBoundaries;
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }
    xsoldier.random = random;
})(xsoldier || (xsoldier = {}));
var xsoldier;
(function (xsoldier) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Projectile extends ƒAid.NodeSprite {
        static count = 0;
        flySpeed;
        strength;
        hasHit = false;
        constructor(_pos, _angle) {
            super("Projectile" + (Projectile.count++));
            this.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
            this.mtxLocal.translateX(_pos.x);
            this.mtxLocal.translateY(_pos.y);
            this.mtxLocal.rotateZ(_angle);
        }
        move() {
            if (!this.hasHit) {
                this.mtxLocal.translateY(this.flySpeed * ƒ.Loop.timeFrameReal / 1000);
            }
        }
        initializeAnimations(projectileType, strength) {
            this.setAnimation(xsoldier.projectileTypes[projectileType]);
            this.flySpeed = xsoldier.config.projectile[projectileType].speed;
            this.setFrameDirection(0);
            this.strength = strength;
        }
        hit(projectileType) {
            this.hasHit = true;
            this.framerate = 10;
            this.showFrame(1);
            if (projectileType > 0) {
                this.setFrameDirection(1);
                return 200;
            }
            this.setFrameDirection(0);
            return 50;
        }
        getStrength() {
            return this.strength;
        }
    }
    xsoldier.Projectile = Projectile;
})(xsoldier || (xsoldier = {}));
var xsoldier;
(function (xsoldier) {
    var ƒ = FudgeCore;
    function shoot(avatar, projectiles) {
        const posX = avatar.mtxLocal.translation.x;
        const posY = avatar.mtxLocal.translation.y;
        switch (avatar.weaponType) {
            case 0: {
                switch (avatar.powerLevel[0]) {
                    case 1: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .1, posY), 0, 10);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .1, posY), 0, 10);
                        break;
                    }
                    case 2: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .1, posY), 0, 20);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .1, posY), 0, 20);
                        break;
                    }
                    case 3: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .1, posY), 0, 30);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .1, posY), 0, 30);
                        break;
                    }
                    case 4: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY + .1), 0, 30);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .2, posY), 0, 30);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .2, posY), 0, 30);
                        break;
                    }
                    case 5: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY + .1), 0, 40);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .2, posY), 0, 40);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .2, posY), 0, 40);
                        break;
                    }
                    case 6: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .075, posY + .1), 0, 30);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .075, posY + .1), 0, 30);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .25, posY), 0, 30);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .25, posY), 0, 30);
                        break;
                    }
                    case 7: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .075, posY + .1), 0, 30);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .075, posY + .1), 0, 30);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .25, posY), 0, 30);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .25, posY), 0, 30);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 180, 30);
                        break;
                    }
                    case 8: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .075, posY + .1), 0, 30);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .075, posY + .1), 0, 30);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .25, posY), 0, 30);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .25, posY), 0, 30);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .075, posY), 180, 30);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .075, posY), 180, 30);
                        break;
                    }
                }
                break;
            }
            case 1: {
                switch (avatar.powerLevel[1]) {
                    case 1: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0);
                        break;
                    }
                    case 2: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 10);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), -10);
                        break;
                    }
                    case 3: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 10);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), -10);
                        break;
                    }
                    case 4: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 7);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), -7);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 15);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), -15);
                        break;
                    }
                    default: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0);
                    }
                }
                break;
            }
            case 2: {
                switch (avatar.powerLevel[2]) {
                    case 1: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0, 20);
                        break;
                    }
                    case 2: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0, 30);
                        break;
                    }
                    case 3: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .1, posY), 0, 30);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .1, posY), 0, 30);
                        break;
                    }
                    case 4: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .1, posY), 0, 40);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .1, posY), 0, 40);
                        break;
                    }
                    case 5: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .1, posY), 0, 50);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .1, posY), 0, 50);
                        break;
                    }
                    case 6: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0, 40);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .2, posY), 0, 40);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .2, posY), 0, 40);
                        break;
                    }
                    case 7: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0, 50);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .2, posY), 0, 50);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .2, posY), 0, 50);
                        break;
                    }
                    case 8: {
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0, 60);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .2, posY), 0, 60);
                        createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .2, posY), 0, 60);
                        break;
                    }
                }
                break;
            }
        }
        const fireRate = xsoldier.config.projectile[avatar.weaponType].fireRate;
        ƒ.Time.game.setTimer(fireRate, 1, () => avatar.gunReady = true);
    }
    xsoldier.shoot = shoot;
    function createProjectile(avatar, projectiles, pos, angle, strength = 10) {
        const projectile = new xsoldier.Projectile(pos, angle);
        projectile.initializeAnimations(avatar.weaponType, strength);
        projectiles.addChild(projectile);
        avatar.gunReady = false;
    }
    xsoldier.createProjectile = createProjectile;
})(xsoldier || (xsoldier = {}));
var xsoldier;
(function (xsoldier) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Star extends ƒAid.NodeSprite {
        static count = 0;
        flySpeed = -2.5;
        constructor() {
            super("Star" + (Star.count++));
            this.addComponent(new ƒ.ComponentTransform());
            this.resetPosition();
            this.mtxLocal.translateY(xsoldier.random(-3, 7));
            this.setAnimation(xsoldier.starTypes[Math.random() < 0.5 ? 0 : 1]);
            this.framerate = 6;
        }
        move() {
            if (this.mtxLocal.translation.y < -7) {
                this.resetPosition();
                this.mtxLocal.translateY(xsoldier.random(4, 12));
                return;
            }
            this.mtxLocal.translateY(this.flySpeed * ƒ.Loop.timeFrameReal / 1000);
        }
        resetPosition() {
            this.mtxLocal.set(new ƒ.Matrix4x4());
            this.mtxLocal.scale(new ƒ.Vector3(2, 2, 2));
            this.mtxLocal.translateZ(xsoldier.random(-1, -3));
            this.mtxLocal.translateX(xsoldier.random(xsoldier.config.space.limitLeft - 1, xsoldier.config.space.limitRight + 1));
        }
    }
    xsoldier.Star = Star;
})(xsoldier || (xsoldier = {}));
var xsoldier;
(function (xsoldier) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class VUI extends ƒ.Mutable {
        score = 0;
        stage = "1 - 1";
        hp = 3;
        power = "1-1-1";
        info = "";
        controller;
        constructor() {
            super();
            const element = document.querySelector("#vui");
            this.controller = new ƒui.Controller(this, element);
            element.style.display = "block";
            console.log(this.controller);
        }
        reduceMutator(_mutator) { }
    }
    xsoldier.VUI = VUI;
})(xsoldier || (xsoldier = {}));
//# sourceMappingURL=Script.js.map