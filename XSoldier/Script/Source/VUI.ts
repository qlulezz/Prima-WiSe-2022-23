namespace xsoldier {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  export class VUI extends ƒ.Mutable {
    public score: number = 0;
    public stage: string = "1 - 1";
    public hp: number = 3;
    public power: string = "1-1-1";
    public info: string = "";
    private controller: ƒui.Controller;

    constructor() {
      super();
      const element: HTMLElement = document.querySelector("#vui");
      this.controller = new ƒui.Controller(this, element);
      element.style.display = "block";
      console.log(this.controller);
    }

    protected reduceMutator(_mutator: ƒ.Mutator): void { /* */ }
  }

}