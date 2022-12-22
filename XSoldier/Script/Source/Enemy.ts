namespace xsoldier {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export class Enemy extends ƒAid.NodeSprite {
    private static count: number = 0;
    private flySpeed: number;
    private enemyType: number;

    constructor(_enemyType: number) {
      super("Enemy" + (Enemy.count++));
      this.enemyType = _enemyType;
      this.addComponent(new ƒ.ComponentTransform());
      this.mtxLocal.translateY(2.45);
      this.mtxLocal.rotateZ(180);
      this.mtxLocal.translateX(random(config.space.limitLeft, config.space.limitRight));
    }

    public move(): void {
      this.mtxLocal.translateY(this.flySpeed * ƒ.Loop.timeFrameReal / 1000);
    }

    public initializeAnimations(): void {
      this.setAnimation(enemyTypes[this.enemyType]);
      this.flySpeed = config.enemy[this.enemyType].speed;
      const tolerance: number = config.enemy[this.enemyType].speedTolerance;
      this.flySpeed += random(-tolerance, tolerance);
      this.setFrameDirection(0);

      switch (this.enemyType) {
        case 2: {
          let startPos: number = random(config.space.limitLeft, config.space.limitRight);
          let animseq: ƒ.AnimationSequence = new ƒ.AnimationSequence();
          animseq.addKey(new ƒ.AnimationKey(0, startPos + 0));
          animseq.addKey(new ƒ.AnimationKey(1000, startPos + 1));
          animseq.addKey(new ƒ.AnimationKey(2000, startPos + 0));

          let animStructure: ƒ.AnimationStructure = {
            components: {
              ComponentTransform: [
                {
                  "ƒ.ComponentTransform": {
                    mtxLocal: {
                      translation: {
                        x: animseq
                      }
                    }
                  }
                }
              ]
            }
          };

          let animation: ƒ.Animation = new ƒ.Animation("emeny2Animation", animStructure, 60);
          let cmpAnimator: ƒ.ComponentAnimator = new ƒ.ComponentAnimator(
            animation,
            ƒ.ANIMATION_PLAYMODE.LOOP,
            ƒ.ANIMATION_PLAYBACK.TIMEBASED_CONTINOUS
          );

          /* animation.setEvent("animationEvent", 0);
          cmpAnimator.addEventListener("animationEvent", (_event: Event) => {
            let time: number = (<ƒ.ComponentAnimator>_event.target).time;
            console.log(`Event fired with delay of ${Math.round(time)}ms`, _event);
          }); */

          this.addComponent(cmpAnimator);
          cmpAnimator.activate(true);
        }
      }
    }
  }
}