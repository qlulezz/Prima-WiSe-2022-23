namespace Mario {
  import ƒ = FudgeCore;
  //import ƒAid = FudgeAid;

  // Initialize Viewport
  export let viewport: ƒ.Viewport;
  export let graph: ƒ.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    hndLoad(_event);
  }

  // Load Mario Sprite and Audio
  let avatar: Avatar;
  export let cmpAudio: ƒ.ComponentAudio;
  let clouds: ƒ.ComponentMaterial;
  async function hndLoad(_event: Event): Promise<void> {
    avatar = new Avatar();
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Images/Mario_Spritesheet.png");

    avatar.initializeAnimations(imgSpriteSheet);
    avatar.initializeSounds();

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

  export let gravity: number = 9.81;

  function update(_event: Event): void {
    let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
    avatar.update(deltaTime);

    // Check for death, if dead, stop game and reset
    const dead = avatar.checkDeath();
    if (dead) return;

    // Check if blocks are below player
    avatar.checkCollision();

    avatar.sprint(false);
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT]))
      avatar.sprint(true);

    // Check for key presses and move player accordingly
    checkInput(avatar);

    // Rotate based on direction
    avatar.mtxLocal.rotation = ƒ.Vector3.Y(avatar.animationState.includes("Left") ? 180 : 0);

    // Jumping
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && avatar.ySpeed === 0) {
      avatar.jump();
    }
    avatar.setJumpAnimation();

    // Move clouds
    clouds.mtxPivot.translateX(.0001);

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function checkInput(avatar: Avatar): void {
    // Calculate travel distance
    const moveDistance = avatar.speed * ƒ.Loop.timeFrameGame / 1000;
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      avatar.mtxLocal.translateX(moveDistance);
      if (avatar.speed > avatar.xSpeedDefault && avatar.animationState !== "sprintRight") {
        avatar.setAnimation(avatar.animSprint);
        avatar.animationState = "sprintRight";
        return;
      }
      if (avatar.speed <= avatar.xSpeedDefault && avatar.animationState !== "walkRight") {
        avatar.setAnimation(avatar.animWalk);
        avatar.animationState = "walkRight";
        return;
      }
      return;
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      avatar.mtxLocal.translateX(moveDistance);
      if (avatar.speed > avatar.xSpeedDefault && avatar.animationState !== "sprintLeft") {
        avatar.setAnimation(avatar.animSprint);
        avatar.animationState = "sprintLeft";
        return;
      }
      if (avatar.speed <= avatar.xSpeedDefault && avatar.animationState !== "walkLeft") {
        avatar.setAnimation(avatar.animWalk);
        avatar.animationState = "walkLeft";
        return;
      }
      return;
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) && !avatar.animationState.includes("look")) {
      avatar.animationState = `look ${avatar.animationState.includes("Left") && "Left"}`;
      avatar.setAnimation(avatar.animLook);
      avatar.showFrame(1);
      return;
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]) && !avatar.animationState.includes("duck")) {
      avatar.animationState = `duck ${avatar.animationState.includes("Left") && "Left"}`;
      avatar.setAnimation(avatar.animLook);
      avatar.showFrame(0);
      return;
    }

    if (avatar.animationState.includes("stand")) {
      avatar.setAnimation(avatar.animWalk);
      avatar.showFrame(0);
      return;
    }
    avatar.animationState = `stand ${avatar.animationState.includes("Left") && "Left"}`;
  }
}