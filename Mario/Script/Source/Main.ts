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

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  const framerate = 8;

  let spriteNode: ƒAid.NodeSprite;

  async function hndLoad(_event: Event): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Images/characters.gif");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

    let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
    animation.generateByGrid(ƒ.Rectangle.GET(297, 1, 16, 32), 3, 48, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(17));

    spriteNode = new ƒAid.NodeSprite("Sprite");
    spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    spriteNode.setAnimation(animation);
    spriteNode.setFrameDirection(1);
    spriteNode.mtxLocal.translateY(-.65);
    spriteNode.mtxLocal.translateX(-.5);
    spriteNode.mtxLocal.translateZ(1);
    spriteNode.framerate = framerate;

    let graph = viewport.getBranch();
    let mario = graph.getChildrenByName("Mario")[0];
    mario.addChild(spriteNode);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, framerate);
  }
}