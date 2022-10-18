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

  // Load Sprite
  let spriteNode: ƒAid.NodeSprite;
  let animation: ƒAid.SpriteSheetAnimation;
  async function hndLoad(_event: Event): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Images/Mario_Walk.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

    animation = new ƒAid.SpriteSheetAnimation("Walk", coat);
    animation.generateByGrid(ƒ.Rectangle.GET(0, 16, 16, 16), 3, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));

    spriteNode = new ƒAid.NodeSprite("Sprite");
    spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    spriteNode.setAnimation(animation);
    spriteNode.setFrameDirection(1);
    spriteNode.framerate = 8;

    spriteNode.mtxLocal.translateY(-.3);
    spriteNode.mtxLocal.translateX(-1);
    spriteNode.mtxLocal.translateZ(1.001);

    let branch: ƒ.Node = viewport.getBranch();
    let mario: ƒ.Node = branch.getChildrenByName("Mario")[0];
    mario.addChild(spriteNode);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
  }

  let leftDirection = false;
  let lastDirection = false;

  let walkSpeed: number = 1;

  function update(_event: Event): void {

    let amount = walkSpeed * ƒ.Loop.timeFrameGame / 1000;
    
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      spriteNode.mtxLocal.translateX(-amount);
      leftDirection = true;
      spriteNode.setFrameDirection(1);
    } else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      spriteNode.mtxLocal.translateX(amount);
      leftDirection = false;
      spriteNode.setFrameDirection(1);
    } else {
      spriteNode.showFrame(0);
    }

    if (leftDirection && !lastDirection) {
      spriteNode.mtxLocal.rotation = ƒ.Vector3.Y(180);
      lastDirection = true;
      walkSpeed = -walkSpeed;
    } else if (!leftDirection && lastDirection) {
      spriteNode.mtxLocal.rotation = ƒ.Vector3.Y(0);
      lastDirection = false;
      walkSpeed = -walkSpeed;
    }

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

}