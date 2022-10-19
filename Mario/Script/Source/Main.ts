namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  // Initialize Viewport
  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    hndLoad(_event);
  }

  let walkAnimation: ƒAid.SpriteSheetAnimation;
  let sprintAnimation: ƒAid.SpriteSheetAnimation;
  let jumpAnimation: ƒAid.SpriteSheetAnimation;
  let lookAnimation: ƒAid.SpriteSheetAnimation;
  let deathAnimation: ƒAid.SpriteSheetAnimation;

  function initializeAnimations(coat: ƒ.CoatTextured) {
    walkAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
    walkAnimation.generateByGrid(ƒ.Rectangle.GET(0, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));

    sprintAnimation = new ƒAid.SpriteSheetAnimation("Sprint", coat);
    sprintAnimation.generateByGrid(ƒ.Rectangle.GET(0, 24, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));

    jumpAnimation = new ƒAid.SpriteSheetAnimation("Jump", coat);
    jumpAnimation.generateByGrid(ƒ.Rectangle.GET(0, 48, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));

    lookAnimation = new ƒAid.SpriteSheetAnimation("Look", coat);
    lookAnimation.generateByGrid(ƒ.Rectangle.GET(32, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));

    deathAnimation = new ƒAid.SpriteSheetAnimation("Death", coat);
    deathAnimation.generateByGrid(ƒ.Rectangle.GET(32, 24, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
  }

  // Load Sprite
  let player: ƒAid.NodeSprite;
  async function hndLoad(_event: Event): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Images/Mario_Spritesheet.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

    initializeAnimations(coat);

    player = new ƒAid.NodeSprite("Sprite");
    player.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    player.setAnimation(walkAnimation);
    player.setFrameDirection(1);
    player.framerate = 20;

    player.mtxLocal.translateY(-.3);
    player.mtxLocal.translateX(-1);
    player.mtxLocal.translateZ(1.001);

    let branch: ƒ.Node = viewport.getBranch();
    let mario: ƒ.Node = branch.getChildrenByName("Mario")[0];
    mario.addChild(player);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
  }

  let leftDirection: boolean = false;
  let lastLeftDirection: boolean = false;
  let speed: number = .8;
  let prevSprint: boolean = false;

  function update(_event: Event): void {
    speed = .9;
    if (leftDirection) {
      speed = -.9
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT])) {
      speed = 2;
      if (leftDirection) {
        speed = -2;
      }
    }

    // Calculate (walk) speed
    const amount = speed * ƒ.Loop.timeFrameGame / 1000;

    // Check for key presses
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      player.mtxLocal.translateX(-amount);
      leftDirection = true;
      player.setFrameDirection(1);
      if (speed < -1) {
        if (!prevSprint) {
          prevSprint = true;
          player.setAnimation(sprintAnimation);
        }
      } else {
        prevSprint = false;
      }
    } else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      player.mtxLocal.translateX(amount);
      leftDirection = false;
      player.setFrameDirection(1);
      if (speed > 1) {
        if (!prevSprint) {
          prevSprint = true;
          player.setAnimation(sprintAnimation);
        }
      } else {
        prevSprint = false;
      }
    } else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
      player.setAnimation(lookAnimation);
      player.showFrame(1);
    } else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
      player.setAnimation(lookAnimation);
      player.showFrame(0);
    } else {
      player.showFrame(0);
      player.setAnimation(walkAnimation);
    }

    // Rotate based on direction
    if (leftDirection && !lastLeftDirection) {
      // turn left
      player.mtxLocal.rotation = ƒ.Vector3.Y(180);
      lastLeftDirection = true;
    } else if (!leftDirection && lastLeftDirection) {
      // turn right
      player.mtxLocal.rotation = ƒ.Vector3.Y(0);
      lastLeftDirection = false;
    }

    viewport.draw();
    //ƒ.AudioManager.default.update();
  }

}