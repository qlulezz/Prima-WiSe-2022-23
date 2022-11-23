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
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

    private readonly forceRot: number = .2;
    private readonly forceMove: number = -30;

    public update(graph: ƒ.Node): void {
      const ship = graph.getComponent(ƒ.ComponentRigidbody);

      // FIXME: Should rotate based one direction its currently pointing
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W]))
        ship.applyAngularImpulse(new ƒ.Vector3(-this.forceRot, 0, 0));

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A]))
        ship.applyAngularImpulse(new ƒ.Vector3(0, 0, this.forceRot));

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S]))
        ship.applyAngularImpulse(new ƒ.Vector3(this.forceRot, 0, 0));

      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D]))
        ship.applyAngularImpulse(new ƒ.Vector3(0, 0, -this.forceRot));

      // FIXME: Should move in direction its currently pointing
      ship.applyForce(new ƒ.Vector3(0, 0, this.forceMove));
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}