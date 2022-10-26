namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  // Initialize Viewport
  let viewport: ƒ.Viewport;
  let branch: ƒ.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    hndLoad(_event);
  }

  let animWalk: ƒAid.SpriteSheetAnimation;
  let animSprint: ƒAid.SpriteSheetAnimation;
  let animJump: ƒAid.SpriteSheetAnimation;
  let animLook: ƒAid.SpriteSheetAnimation;
  let animDeath: ƒAid.SpriteSheetAnimation;

  function initializeAnimations(coat: ƒ.CoatTextured): void {
    animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
    animWalk.generateByGrid(ƒ.Rectangle.GET(0, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));

    animSprint = new ƒAid.SpriteSheetAnimation("Sprint", coat);
    animSprint.generateByGrid(ƒ.Rectangle.GET(0, 24, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));

    animJump = new ƒAid.SpriteSheetAnimation("Jump", coat);
    animJump.generateByGrid(ƒ.Rectangle.GET(64, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));

    animLook = new ƒAid.SpriteSheetAnimation("Look", coat);
    animLook.generateByGrid(ƒ.Rectangle.GET(32, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));

    animDeath = new ƒAid.SpriteSheetAnimation("Death", coat);
    animDeath.generateByGrid(ƒ.Rectangle.GET(32, 24, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
  }

  // Load Sprite
  let avatar: ƒAid.NodeSprite;
  async function hndLoad(_event: Event): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Images/Mario_Spritesheet.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

    initializeAnimations(coat);

    avatar = new ƒAid.NodeSprite("Avatar");
    avatar.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    avatar.setAnimation(animWalk);
    avatar.setFrameDirection(1);
    avatar.framerate = 20;

    avatar.mtxLocal.translateY(0);
    avatar.mtxLocal.translateX(-1);
    avatar.mtxLocal.translateZ(0.001);

    branch = viewport.getBranch();
    branch.addChild(avatar);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
  }

  const xSpeedDefault: number = .9;
  const xSpeedSprint: number = 2;
  const jumpForce: number = 4.5;
  let ySpeed: number = 0;
  let gravity: number = 9.81;

  let animationState: string = "stand";
  let dead: boolean = false;

  function update(_event: Event): void {
    let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
    ySpeed -= gravity * deltaTime;
    let yOffset: number = ySpeed * deltaTime;
    avatar.mtxLocal.translateY(yOffset);

    // Check for death
    let pos: ƒ.Vector3 = avatar.mtxLocal.translation;
    if (dead) {
      pos.y = -1;
      ƒ.Time.game.setTimer(1000, 1, () => window.location.reload());
      viewport.draw();
      return;
    }
    if (pos.y < -1 && !dead) {
      dead = true;
      avatar.setAnimation(animDeath);
      ySpeed = jumpForce * .8;
      viewport.draw();
      return;
    }

    /*
    let pos: ƒ.Vector3 = avatar.mtxLocal.translation;
    if (pos.y + yOffset > 0)
      avatar.mtxLocal.translateY(yOffset);
    else {
      ySpeed = 0;
      pos.y = 0;
      avatar.mtxLocal.translation = pos;
    } */

    // Check if blocks are below player
    checkCollision();

    let speed: number = xSpeedDefault;
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT]))
      speed = xSpeedSprint;

    // Calculate (walk) speed
    const moveDistance = speed * ƒ.Loop.timeFrameGame / 1000;

    // Check for key presses and move player accordingly
    checkInput(moveDistance, speed);

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && ySpeed === 0) {
      //avatar.mtxLocal.translation = new ƒ.Vector3(pos.x, 0, 0.001);
      ySpeed = jumpForce;
    }

    if (ySpeed > 0) {
      avatar.setAnimation(animJump);
      avatar.showFrame(0);
    } else if (ySpeed < 0) {
      avatar.setAnimation(animJump);
      avatar.showFrame(1);
    }

    // Rotate based on direction
    avatar.mtxLocal.rotation = ƒ.Vector3.Y(animationState.includes("Left") ? 180 : 0);

    viewport.draw();
    //ƒ.AudioManager.default.update();
  }

  function checkInput(moveDistance: number, speed: number): void {
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      avatar.mtxLocal.translateX(moveDistance);
      if (speed > xSpeedDefault && animationState !== "sprintRight") {
        avatar.setAnimation(animSprint);
        animationState = "sprintRight";
        return;
      }
      if (speed <= xSpeedDefault && animationState !== "walkRight") {
        avatar.setAnimation(animWalk);
        animationState = "walkRight";
        return;
      }
      return;
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      avatar.mtxLocal.translateX(moveDistance);
      if (speed > xSpeedDefault && animationState !== "sprintLeft") {
        avatar.setAnimation(animSprint);
        animationState = "sprintLeft";
        return;
      }
      if (speed <= xSpeedDefault && animationState !== "walkLeft") {
        avatar.setAnimation(animWalk);
        animationState = "walkLeft";
        return;
      }
      return;
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) && !animationState.includes("look")) {
      animationState = `look ${animationState.includes("Left") && "Left"}`;
      avatar.setAnimation(animLook);
      avatar.showFrame(1);
      return;
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]) && !animationState.includes("duck")) {
      animationState = `duck ${animationState.includes("Left") && "Left"}`;
      avatar.setAnimation(animLook);
      avatar.showFrame(0);
      return;
    }

    if (animationState.includes("stand")) {
      avatar.setAnimation(animWalk);
      avatar.showFrame(0);
      return;
    }
    animationState = `stand ${animationState.includes("Left") && "Left"}`;
  }

  function checkCollision(): void {
    let blocks: ƒ.Node = branch.getChildrenByName("Blocks")[0];
    let pos: ƒ.Vector3 = avatar.mtxLocal.translation;
    for (let block of blocks.getChildren()) {
      let posBlock: ƒ.Vector3 = block.mtxLocal.translation;
      if (Math.abs(pos.x - posBlock.x) < 0.5) {
        if (pos.y < posBlock.y + 0.5) {
          pos.y = posBlock.y + 0.5;
          avatar.mtxLocal.translation = pos;
          ySpeed = 0;
        }
      }
    }
  }
}