/*

  TODO:
    - Bomb shoot easing
    - Different enemy types
      - Lvl 2: Animation, left - right Movement
      - Lvl 3: State Machine, downwards - found player - attack
      - Lvl 4: Vanilla, fly towards player
      - Lvl 5: shoots at player
      - Lvl 6: ???
    - Scoring system
    - Stages (8)
    - Bosses
    - Global Leaderboard

*/

namespace xsoldier {
  import ƒ = FudgeCore;

  // Initialize Viewport
  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    viewport.camera.mtxPivot.translateZ(5);
    viewport.camera.mtxPivot.rotateY(180);

    hndLoad(_event);
  }

  let avatar: Avatar;
  export let config: Config;
  export let vui: VUI;
  export let projectileTypes: ƒAid.SpriteSheetAnimation[] = [];
  export let enemyTypes: ƒAid.SpriteSheetAnimation[] = [];
  export let itemSprite: ƒAid.SpriteSheetAnimation;
  export let starTypes: ƒAid.SpriteSheetAnimation[] = [];
  export let expLarge: ƒAid.SpriteSheetAnimation;
  export let expSmall: ƒAid.SpriteSheetAnimation;

  let projectiles: ƒ.Node = new ƒ.Node("Projectiles");
  let enemies: ƒ.Node = new ƒ.Node("Enemies");
  let items: ƒ.Node = new ƒ.Node("Items");
  let stars: ƒ.Node = new ƒ.Node("Stars");
  let explosions: ƒ.Node = new ƒ.Node("Explosions");

  let enemyReady: boolean = true;
  let enemyType: number = 0;
  let gameOver: boolean = false;
  let lastStage: number = 0;
  let currentStage: number = 0;
  let stageEnemies: number = 0;
  let lastBoss: boolean = false;
  let currentBoss: boolean = false;

  async function initializeSpriteSheets(): Promise<void> {
    projectileTypes[0] = await createSprite("PlayerShot1", 15, 26, 26, 2);
    projectileTypes[1] = await createSprite("PlayerShot2", 32, 32, 32, 2);
    projectileTypes[2] = await createSprite("PlayerShot3", 128, 128, 128, 3);

    enemyTypes[0] = await createSprite("Enemy1", 32, 32, 32, 8);
    enemyTypes[1] = await createSprite("Enemy2", 32, 32, 32, 8);
    enemyTypes[2] = await createSprite("Enemy3", 32, 32, 32, 8);

    itemSprite = await createSprite("Item", 32, 32, 32, 4);

    starTypes[0] = await createSprite("Star1", 4, 4, 4, 4);
    starTypes[1] = await createSprite("Star2", 4, 12, 12, 4);

    expLarge = await createSprite("ExpLarge", 66, 66, 66, 4);
    expSmall = await createSprite("ExpSmall", 32, 32, 32, 5);
  }

  // Creates a new Sprite based on file, width, height, offset and number of frames
  async function createSprite(name: string, _w: number, _h: number, _offset: number, _frames: number): Promise<ƒAid.SpriteSheetAnimation> {
    let spriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await spriteSheet.load(`./Assets/Sprites/${name}.png`);
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, spriteSheet);
    let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation(name, coat);
    animation.generateByGrid(ƒ.Rectangle.GET(0, 0, _w, _h), _frames, 128, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.Y(_offset));
    return animation;
  }

  async function hndLoad(_event: Event): Promise<void> {
    // Load config
    config = await (await fetch("./config.json")).json();

    vui = new VUI();

    // Load spritesheets
    await initializeSpriteSheets();
    const imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Assets/Sprites/Player.png");

    // Create avatar
    avatar = new Avatar();
    avatar.initializeAnimations(imgSpriteSheet);

    let graph: ƒ.Node = viewport.getBranch();
    graph.addChild(avatar);
    graph.addChild(projectiles);
    graph.addChild(enemies);
    graph.addChild(items);
    graph.addChild(stars);
    graph.addChild(explosions);

    // Prepare sound
    initializeSound();
    setSound(graph);

    // Create stars for background
    for (let i: number = 0; i < 40; i++) {
      stars.addChild(new Star());
    }

    // Start game loop
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
  }

  function update(_event: Event): void {
    // Move background stars
    for (const star of stars.getChildren() as Star[]) {
      star.move();
    }

    switch (currentStage) {
      case 0: {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
          avatar.resetPosition(true);
          currentStage++;
          document.querySelector(".start").setAttribute("style", "display: none");
          document.documentElement.style.setProperty("--vui-visible", "block");
        }
        return;
      }
      default: {
        updateStage();
        break;
      }
    }

    // Disable all movement if hp drops to 0
    if (gameOver) {
      endGame();
      return;
    }

    // Check for keypresses and move player
    movePlayer(avatar);

    // Check if player is inside boundaries and stop movement if not
    checkBoundaries(avatar);

    // Generate new enemies
    if (enemyReady && stageEnemies > 0) {
      const enemy: Enemy = new Enemy(enemyType);
      enemy.initializeAnimations();
      enemies.addChild(enemy);
      enemyReady = false;
      stageEnemies--;
      console.log(stageEnemies);
      const birthRate: number = config.enemy[enemyType].birthRate;
      ƒ.Time.game.setTimer(birthRate, 1, () => enemyReady = true);
    }

    // Remove enemy if outside of space
    for (const enemy of enemies.getChildren() as Enemy[]) {
      enemy.move();
      if (enemy.mtxLocal.translation.y < config.space.limitBottom - .5) {
        enemy.stopAnimation();
        enemies.removeChild(enemy);
      }
    }

    // Check for player collision with enemies
    for (const enemy of enemies.getChildren() as Enemy[]) {
      if (getDistance(enemy, avatar) < config.player.size && !avatar.invincible) {
        enemy.stopAnimation();
        enemies.removeChild(enemy);
        createLargeExplosion(avatar.mtxLocal.translation);
        largeExplosionAudio.play(true);
        gameOver = avatar.hit();
      }
    }

    // Move items
    for (const item of items.getChildren() as Item[]) {
      item.move();
      if (item.mtxLocal.translation.y < config.space.limitBottom - .5) {
        item.stopAnimation();
        items.removeChild(item);
      }
    }

    // Check for player collision with items
    for (const item of items.getChildren() as Item[]) {
      if (getDistance(item, avatar) < config.player.size) {
        item.stopAnimation();
        items.removeChild(item);
        avatar.setItem(item.type);
      }
    }

    // Shoot when SPACE is pressed
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
      if (avatar.gunReady && !avatar.invincible) {
        shoot(avatar, projectiles);
        playWeaponSound();
      }
    } else if (!avatar.invincible) {
      vui.score += 2;
    }

    // Check for projectile collision
    for (const projectile of projectiles.getChildren() as Projectile[]) {
      projectile.move();

      for (const enemy of enemies.getChildren() as Enemy[]) {

        // If player hits enemy
        if (getDistance(enemy, projectile) < config.player.accuracy) {

          // If weaponType is bomb, check for ships in hit radius
          if (avatar.weaponType == 2) {
            for (const nearbyEnemy of enemies.getChildren() as Enemy[]) {
              if (getDistance(nearbyEnemy, enemy) < .4) {
                nearbyEnemy.stopAnimation();
                enemies.removeChild(nearbyEnemy);
              }
            }
          }

          createSmallExplosion(enemy.mtxLocal.translation);
          smallExplosionAudio.play(true);

          vui.score += 100;

          const delay: number = projectile.hit(avatar.weaponType);
          ƒ.Time.game.setTimer(delay, 1, () => {
            projectile.stopAnimation();
            projectiles.removeChild(projectile);
          });
          enemy.stopAnimation();
          enemies.removeChild(enemy);

          if (Math.random() < config.item.dropRate) {
            const item: Item = new Item(enemy.mtxLocal.translation.toVector2());
            item.initialize();
            items.addChild(item);
          }
        }
      }

      // Remove projectile if outside of space
      if (projectile.mtxLocal.translation.y > config.space.limitTop + .5
        || projectile.mtxLocal.translation.y < config.space.limitBottom - .5
        || projectile.mtxLocal.translation.x > config.space.limitRight + .5
        || projectile.mtxLocal.translation.x < config.space.limitLeft - .5) {
        projectile.stopAnimation();
        projectiles.removeChild(projectile);
      }
    }

    // blinking animation when player is invincible
    if (avatar.invincible) {
      respawnAnimation();
    }

    //console.log(Object.keys(ƒ.Time.game.getTimers()).length);
    //let timers = Object.keys(ƒ.Time.game.getTimers());
    //console.log(timers);

    // Draw on canvas and update sounds
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  // Returns distance between to NodeSprites, used for checking for collision
  // FIXME: Apparently Math.hypot is very slow, should be replaced by different Math method
  function getDistance(a: ƒAid.NodeSprite, b: ƒAid.NodeSprite): number {
    return Math.hypot(
      a.mtxLocal.translation.x - b.mtxLocal.translation.x,
      a.mtxLocal.translation.y - b.mtxLocal.translation.y
    );
  }

  // FIXME: refactor so it uses timer instead if modulo on frames
  // I'm lazy and this was the first thing I came up with
  // (I don't know how to do it any other way)
  let frames: number = 0;
  function respawnAnimation(): void {
    frames++;
    if (frames % 2 == 0 || frames % 3 == 0 || frames % 4 == 0) {
      avatar.showFrame(5);
    }
  }

  // Creates a single explosion on a given position
  function createSmallExplosion(pos: ƒ.Vector3): void {
    const explosion: ƒAid.NodeSprite = new ƒAid.NodeSprite("LargeExplosion");
    explosion.addComponent(new ƒ.ComponentTransform());

    explosion.mtxLocal.translation = pos;
    explosion.setAnimation(expSmall);
    explosion.framerate = 20;

    explosions.addChild(explosion);

    ƒ.Time.game.setTimer(300, 1, () => {
      explosion.stopAnimation();
      explosions.removeChild(explosion);
    });
  }

  // Creates multiple randomized explosions near a given position
  function createLargeExplosion(pos: ƒ.Vector3): void {
    const count: number = 4;
    const offset: number = 50;
    const size: number = .25;

    for (let i: number = 0; i < count; i++) {
      const explosion: ƒAid.NodeSprite = new ƒAid.NodeSprite("LargeExplosion");
      explosion.addComponent(new ƒ.ComponentTransform());

      explosion.mtxLocal.translation = pos;
      explosion.mtxLocal.translateX(random(-size, size));
      explosion.mtxLocal.translateY(random(-size, size));
      explosion.mtxLocal.rotateZ(i * 90);

      ƒ.Time.game.setTimer(offset * i, 1, () => {
        explosion.setAnimation(expLarge);
        explosion.framerate = 20;

        explosions.addChild(explosion);

        ƒ.Time.game.setTimer(2000, 1, () => {
          explosion.stopAnimation();
          explosions.removeChild(explosion);
        });
      });
    }
  }

  // Ends the game by exploding avatar and clearing screen
  function endGame(): void {
    if (avatar.invincible) {
      createLargeExplosion(avatar.mtxLocal.translation);
      avatar.showFrame(5);
      avatar.invincible = false;
      oneTimeAudio("Game Over");
    }

    for (const enemy of enemies.getChildren() as Enemy[]) {
      enemies.removeChild(enemy);
    }
    for (const projectile of projectiles.getChildren() as Projectile[]) {
      projectiles.removeChild(projectile);
    }
    for (const item of items.getChildren() as Item[]) {
      items.removeChild(item);
    }

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function updateStage(): void {
    if (currentStage != lastStage || currentBoss != lastBoss) {
      /* if (currentStage + 1 == 9) {
        oneTimeAudio("All Clear");
        lastStage = currentStage;
        return;
      } */

      console.log(currentStage, lastStage, currentBoss, lastBoss);

      if (!currentBoss) {
        vui.info = "STAGE " + currentStage;
      }

      setStageMusic(currentStage, currentBoss);
      ƒ.Time.game.setTimer(2500, 1, () => {
        vui.info = "";
      });
      vui.stage = "1 - " + currentStage;

      lastStage = currentStage;
      lastBoss = currentBoss;
      if (!currentBoss)
        stageEnemies = config.stage[currentStage - 1].enemyCount[0];
    }

    if (stageEnemies <= 0) {
      currentBoss = true;
    }
  }
}