namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    hndLoad(_event);
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  let keyA = false;
  let keyD = false;

  window.addEventListener("keydown", onKeyDown, false);
  window.addEventListener("keyup", onKeyUp, false);

  function onKeyDown(event: KeyboardEvent) {
    var keyCode = event.keyCode;
    switch (keyCode) {
      case 65: //a
        keyA = true;
        break;
      case 68: //d
        keyD = true;
        break;
    }
  }

  function onKeyUp(event: KeyboardEvent) {
    var keyCode = event.keyCode;

    switch (keyCode) {
      case 65: //a
        keyA = false;
        break;
      case 68: //d
        keyD = false;
        break;
    }
  }

  let x: number = .05;
  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();

    if (keyA == true) {
      spriteNode.mtxLocal.translateX(-x);
    }
    if (keyD == true) {
      spriteNode.mtxLocal.translateX(x);
    }
    ƒ.AudioManager.default.update();
  }

  let spriteNode: ƒAid.NodeSprite;

  async function hndLoad(_event: Event): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Images/Mario_Walk.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

    let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
    animation.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 64, ƒ.ORIGIN2D.BOTTOMLEFT, ƒ.Vector2.X(17));

    spriteNode = new ƒAid.NodeSprite("Sprite");
    spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    spriteNode.setAnimation(animation);
    spriteNode.setFrameDirection(1);
    spriteNode.framerate = 8;

    spriteNode.mtxLocal.translateY(-.3);
    spriteNode.mtxLocal.translateX(-1);
    spriteNode.mtxLocal.translateZ(1.01);

    let branch: ƒ.Node = viewport.getBranch();
    let mario: ƒ.Node = branch.getChildrenByName("Mario")[0];
    mario.addChild(spriteNode);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
  }
}