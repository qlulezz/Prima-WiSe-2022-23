namespace Starfox {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Starfox);  // Register the namespace to FUDGE for serialization

  export class ScriptForce extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(ScriptForce);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public speed: number = 2;

    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          //ƒ.Debug.log(this.message, this.node);
          this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, () => this.update(this.node));

          window.addEventListener("mousemove", this.handleMouse);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          this.node.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, () => this.hndCollision);
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

    public ship: ƒ.ComponentRigidbody;

    private width: number = 0;
    private height: number = 0;
    private xAxis: number = 0;
    private yAxis: number = 0;

    handleMouse = (e: MouseEvent): void => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      let mousePositionY: number = e.clientY;
      let mousePositionX: number = e.clientX;

      this.xAxis = 2 * (mousePositionX / this.width) - 1;
      this.yAxis = 2 * (mousePositionY / this.height) - 1;
    }

    private readonly forceRot: number = 0.1;
    private readonly forceRoll: number = 5;
    private readonly forceMove: number = 30;

    private relativeX: ƒ.Vector3;
    private relativeY: ƒ.Vector3;
    private relativeZ: ƒ.Vector3;

    private last: boolean = false;

    public update(graph: ƒ.Node): void {
      this.calculateRelative(graph);
      this.ship = graph.getComponent(ƒ.ComponentRigidbody);

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W]))
        this.ship.applyForce(ƒ.Vector3.SCALE(this.relativeZ, this.forceMove));

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A]))
        this.ship.applyTorque(ƒ.Vector3.SCALE(this.relativeZ, this.forceRoll));

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S]))
        this.ship.applyForce(ƒ.Vector3.SCALE(this.relativeZ, -this.forceMove));

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D]))
        this.ship.applyTorque(ƒ.Vector3.SCALE(this.relativeZ, -this.forceRoll));

      this.ship.applyAngularImpulse(new ƒ.Vector3(0, this.xAxis * -this.forceRot * 1.5, 0));
      this.ship.applyAngularImpulse(ƒ.Vector3.SCALE(this.relativeX, this.yAxis * -this.forceRot));

      if (!terrain) return;

      let terrainInfo: ƒ.TerrainInfo = (<ƒ.MeshTerrain>terrain.mesh).getTerrainInfo(this.node.mtxLocal.translation, terrain.mtxWorld);
      let distance: number = terrainInfo.distance;

      if (distance <= 0) {
        if (!this.last) {         
          console.log("BUMM");
          deathSound.play(true);
        }
        this.last = true;
        return;
      }
      this.last = false;
    }

    private calculateRelative(graph: ƒ.Node): void {
      this.relativeX = ƒ.Vector3.X(5);
      this.relativeX.transform(graph.mtxWorld, false);
      this.relativeY = ƒ.Vector3.Y(5);
      this.relativeY.transform(graph.mtxWorld, false);
      this.relativeZ = ƒ.Vector3.Z(5);
      this.relativeZ.transform(graph.mtxWorld, false);
    }

    private hndCollision(): void {
      console.log("Collision!");
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}