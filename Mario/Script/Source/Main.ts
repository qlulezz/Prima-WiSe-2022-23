namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  // Initialize Viewport
  let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
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

  // Sounds from https://themushroomkingdom.net/media/smw/wav
  // Music https://www.youtube.com/watch?v=tAaGKo4XVvM
  let audioJump: ƒ.Audio;
  let audioDeath: ƒ.Audio;

  function initializeSounds(): void {
    audioJump = new ƒ.Audio("./Sounds/smw_jump.wav");
    audioDeath = new ƒ.Audio("./Sounds/smw_lost_a_life.wav");
  }

  // Load Mario Sprite and Audio
  let avatar: ƒAid.NodeSprite;
  let cmpAudio: ƒ.ComponentAudio;
  let clouds: ƒ.ComponentMaterial;
  async function hndLoad(_event: Event): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Images/Mario_Spritesheet.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

    initializeAnimations(coat);
    initializeSounds();

    avatar = new ƒAid.NodeSprite("Avatar");
    avatar.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    avatar.setAnimation(animWalk);
    avatar.setFrameDirection(1);
    avatar.framerate = 20;

    avatar.mtxLocal.translateY(0);
    avatar.mtxLocal.translateX(-1);
    avatar.mtxLocal.translateZ(0.001);

    graph = viewport.getBranch();
    graph.addChild(avatar);
    clouds = graph.getChildrenByName("Clouds")[0].getComponent(ƒ.ComponentMaterial);

    cmpAudio = graph.getComponent(ƒ.ComponentAudio);
    cmpAudio.connect(true);
    cmpAudio.volume = 1;

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
    if (pos.y < -1 && !dead) {
      dead = true;
      cmpAudio.setAudio(audioDeath);
      cmpAudio.play(true);
      avatar.setAnimation(animDeath);
      ySpeed = jumpForce * .8;
      viewport.draw();
      return;
    }
    // If dead, stop game and reset page
    if (dead) {
      cmpAudio.volume = 10;
      pos.y = -1;
      ƒ.Time.game.setTimer(3000, 1, () => window.location.reload());
      viewport.draw();
      return;
    }

    // Check if blocks are below player
    checkCollision();

    let speed: number = xSpeedDefault;
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT]))
      speed = xSpeedSprint;

    // Calculate travel distance
    const moveDistance = speed * ƒ.Loop.timeFrameGame / 1000;

    // Check for key presses and move player accordingly
    checkInput(moveDistance, speed);

    // Rotate based on direction
    avatar.mtxLocal.rotation = ƒ.Vector3.Y(animationState.includes("Left") ? 180 : 0);

    // Jumping
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && ySpeed === 0) {
      ySpeed = jumpForce;
      cmpAudio.volume = 6;
      cmpAudio.setAudio(audioJump);
      cmpAudio.play(true);
    }

    if (ySpeed > 0) {
      animationState = "jump";
      avatar.setAnimation(animJump);
      avatar.showFrame(0);
    } else if (ySpeed < 0) {
      animationState = "jump";
      avatar.setAnimation(animJump);
      avatar.showFrame(1);
    }

    if (ySpeed === 0 && animationState.includes("jump")) {
      avatar.setAnimation(animWalk);
      animationState = "walk";
    }

    // Move clouds
    clouds.mtxPivot.translateX(.0001);

    viewport.draw();
    ƒ.AudioManager.default.update();
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
    let blocks: ƒ.Node = graph.getChildrenByName("Blocks")[0];
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