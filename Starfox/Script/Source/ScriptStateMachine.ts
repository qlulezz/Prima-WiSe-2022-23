namespace Starfox {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Project.registerScriptNamespace(Starfox);  // Register the namespace to FUDGE for serialization

  enum JOB {
    IDLE, ATTACK
  }

  export class ScriptStateMachine extends ƒAid.ComponentStateMachine<JOB> {
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(ScriptStateMachine);
    private static instructions: ƒAid.StateMachineInstructions<JOB> = ScriptStateMachine.get();

    constructor() {
      super();
      this.instructions = ScriptStateMachine.instructions; // setup instructions with the static set

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    public static get(): ƒAid.StateMachineInstructions<JOB> {
      let setup: ƒAid.StateMachineInstructions<JOB> = new ƒAid.StateMachineInstructions();
      setup.transitDefault = ScriptStateMachine.transitDefault;
      setup.actDefault = ScriptStateMachine.actDefault;
      setup.setAction(JOB.IDLE, <ƒ.General>this.actIdle);
      setup.setAction(JOB.ATTACK, <ƒ.General>this.actAttack);
      setup.setTransition(JOB.IDLE, JOB.ATTACK, <ƒ.General>this.transitAttack);
      return setup;
    }

    private static transitDefault(_machine: ScriptStateMachine): void {
      console.log("Transit to", _machine.stateNext);
    }

    private static async actDefault(_machine: ScriptStateMachine): Promise<void> {
      console.log(JOB[_machine.stateCurrent]);
    }

    private static async actIdle(_machine: ScriptStateMachine): Promise<void> {
      //console.log("actIDLE");
      _machine.node.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(1);
      ScriptStateMachine.actDefault(_machine);
    }

    private static async actAttack(_machine: ScriptStateMachine): Promise<void> {
      //console.log("actATTACK";)
      _machine.node.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(3);
      ScriptStateMachine.actDefault(_machine);
    }

    private static transitAttack(_machine: ScriptStateMachine): void {

    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          //ƒ.Debug.log(this.message, this.node);
          ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          this.transit(JOB.IDLE);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          this.transit(JOB.IDLE);
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible

          /* let transform: ƒ.ComponentTransform = this.node.getComponent(ƒ.ComponentTransform);
          let ship: ƒ.ComponentTransform = viewport.getBranch().getChildrenByName("Avatar")[0].getComponent(ƒ.ComponentTransform);
          let distance: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(ship.mtxWorld.translation, _machine.node.mtxWorld.translation);
          console.log(distance);

          if (distance.magnitude > 10) {
            _machine.transit(JOB.ATTACK);
          } */

          break;
      }
    }

    private update = (_event: Event): void => {
      this.act();
    }

    private getDistance(a: ƒ.ComponentTransform, b: ƒ.ComponentTransform): number {
      return Math.hypot(
        a.mtxLocal.translation.x - b.mtxLocal.translation.x,
        a.mtxLocal.translation.y - b.mtxLocal.translation.y
      );
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}