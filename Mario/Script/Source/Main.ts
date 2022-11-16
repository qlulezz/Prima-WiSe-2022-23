namespace Mario {
  import ƒ = FudgeCore;
  //import ƒAid = FudgeAid;

  // Initialize Viewport
  export let viewport: ƒ.Viewport;
  export let graph: ƒ.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    viewport.camera.mtxPivot.translateZ(5);
    viewport.camera.mtxPivot.translateY(.5);
    viewport.camera.mtxPivot.rotateY(180);
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
    const deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
    const dead: boolean = avatar.checkDeath();

    //viewport.camera.mtxPivot.translation = avatar.mtxLocal.translation;

    // Update avatar movement
    avatar.update(deltaTime, dead);

    // Check for death, if dead, stop game and reset
    if (dead) return;

    // Check if blocks are below player
    avatar.checkCollision();

    // Check for key presses and move player accordingly
    checkInput();

    // Jumping
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]))
      avatar.jump();
    avatar.setJumpAnimation();

    // Move clouds
    clouds.mtxPivot.translateX(.0001);

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function checkInput(): void {
    // Check for key presses
    let run: boolean = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT]);

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      avatar.mtxLocal.rotation = ƒ.Vector3.Y(180);
      avatar.act(run ? ACTION.SPRINT : ACTION.WALK);
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      avatar.mtxLocal.rotation = ƒ.Vector3.Y(0);
      avatar.act(run ? ACTION.SPRINT : ACTION.WALK);
    }
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]))
      avatar.act(ACTION.LOOK);
    else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]))
      avatar.act(ACTION.CROUCH);
    else
      avatar.act(ACTION.IDLE);
  }
}