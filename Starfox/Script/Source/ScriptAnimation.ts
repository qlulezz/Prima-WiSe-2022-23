namespace Starfox {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Starfox);  // Register the namespace to FUDGE for serialization

  export class ScriptAnimation extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(ScriptAnimation);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "CustomComponentScript added to ";


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
          this.update(this.node);
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

    public update(graph: ƒ.Node): void {
      //const item = graph.getComponent(ƒ.ComponentTransform);

      let animseq: ƒ.AnimationSequence = new ƒ.AnimationSequence();
      animseq.addKey(new ƒ.AnimationKey(0, 0));
      animseq.addKey(new ƒ.AnimationKey(2000, 1));
      animseq.addKey(new ƒ.AnimationKey(4000, 0));

      let animseq2: ƒ.AnimationSequence = new ƒ.AnimationSequence();
      animseq2.addKey(new ƒ.AnimationKey(0, 0, 0, 360 / 4000));
      animseq2.addKey(new ƒ.AnimationKey(4000, 360, 360 / 4000, 0));

      let animStructure: ƒ.AnimationStructure = {
        components: {
          ComponentTransform: [
            {
              "ƒ.ComponentTransform": {
                mtxLocal: {
                  translation: {
                    y: animseq
                  },
                  rotation: {
                    y: animseq2
                  }
                }
              }
            }
          ]
        }
      };

      let animation: ƒ.Animation = new ƒ.Animation("testAnimation", animStructure, 60);
      let cmpAnimator: ƒ.ComponentAnimator = new ƒ.ComponentAnimator(
        animation,
        ƒ.ANIMATION_PLAYMODE.LOOP,
        ƒ.ANIMATION_PLAYBACK.TIMEBASED_CONTINOUS
      );

      animation.setEvent("animationEvent", 0);
      cmpAnimator.addEventListener("animationEvent", (_event: Event) => {
        let time: number = (<ƒ.ComponentAnimator>_event.target).time;
        console.log(`Event fired with delay of ${Math.round(time)}ms`, _event);
      });

      graph.addComponent(cmpAnimator);
      cmpAnimator.activate(true);
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}