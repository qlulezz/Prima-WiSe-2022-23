namespace Starfox {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  export let terrain: ƒ.ComponentMesh;
  export let deathSound: ƒ.ComponentAudio;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    viewport.camera.projectCentral(null, 80);
    viewport.camera.mtxPivot.translateZ(10);
    viewport.camera.mtxPivot.translateY(.5);
    viewport.camera.mtxPivot.rotateY(180);

    terrain = viewport.getBranch().getChildrenByName("City Terrain")[0].getComponent(ƒ.ComponentMesh);

    let audio: ƒ.Node = viewport.getBranch().getChildrenByName("Audio")[0];
    deathSound = audio.getComponent(ƒ.ComponentAudio);
    deathSound.connect(true);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}