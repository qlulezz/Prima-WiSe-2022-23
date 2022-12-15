namespace Starfox {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  export class GameState extends ƒ.Mutable {
    protected reduceMutator(_mutator: ƒ.Mutator): void {
      //delete(_mutator)
    }
  
    public height: string = "1";
    public velocity: string = "2";
    private controller: ƒui.Controller;

    constructor() {
      super();
      this.controller = new ƒui.Controller(this, document.querySelector("#vui"));
      console.log(this.controller);
      console.log(this.getMutator());
    }

  }

}