namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    viewport.camera.projectCentral(null, 80);
    viewport.camera.mtxPivot.translateZ(10);
    viewport.camera.mtxPivot.translateY(.5);
    viewport.camera.mtxPivot.rotateY(180);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}