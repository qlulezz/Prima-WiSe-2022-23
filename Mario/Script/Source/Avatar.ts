namespace Mario {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export enum ACTION {
    IDLE, WALK, SPRINT, CROUCH, LOOK
  }

  export class Avatar extends ƒAid.NodeSprite {
    public animationState: string = "stand";

    public readonly speedWalk: number = .9;
    readonly speedSprint: number = 2;
    readonly jumpForce: number = 4.5;
    private ySpeed: number = 0;
    private xSpeed: number = this.speedWalk;

    private animWalk: ƒAid.SpriteSheetAnimation;
    private animSprint: ƒAid.SpriteSheetAnimation;
    private animJump: ƒAid.SpriteSheetAnimation;
    private animLook: ƒAid.SpriteSheetAnimation;
    private animDeath: ƒAid.SpriteSheetAnimation;

    private audioJump: ƒ.Audio;
    private audioDeath: ƒ.Audio;

    private dead: boolean = false;
    private animationCurrent: ƒAid.SpriteSheetAnimation;

    public constructor() {
      super("Avatar");
      this.addComponent(new ƒ.ComponentTransform());
    }

    public checkDeath(): boolean {
      // Check for death
      let pos: ƒ.Vector3 = this.mtxLocal.translation;
      if (pos.y < -1 && !this.dead) {
        this.dead = true;
        cmpAudio.setAudio(this.audioDeath);
        cmpAudio.play(true);
        this.setAnimation(this.animDeath);
        this.ySpeed = this.jumpForce * .8;
        viewport.draw();
        return true;
      }
      // If dead, stop game and reset avatar
      if (this.dead) {
        cmpAudio.volume = 10;
        pos.y = -1;
        ƒ.Time.game.setTimer(3000, 1, () => {
          if (this.dead) {
            this.reset();
          }
        });
        viewport.draw();
        return true;
      }
      return false;
    }

    public jump(): void {
      if (this.ySpeed !== 0)
        return;

      this.ySpeed = this.jumpForce;
      cmpAudio.volume = 6;
      cmpAudio.setAudio(this.audioJump);
      cmpAudio.play(true);
    }

    public setJumpAnimation(): void {
      if (this.ySpeed > 0) {
        this.animationState = "jump";
        this.setAnimation(this.animJump);
        this.showFrame(0);
      } else if (this.ySpeed < 0) {
        this.animationState = "jump";
        this.setAnimation(this.animJump);
        this.showFrame(1);
      }

      if (this.ySpeed === 0 && this.animationState.includes("jump")) {
        this.setAnimation(this.animWalk);
        this.animationState = "walk";
      }
    }

    // Check if blocks are below player
    public checkCollision(): void {
      let blocks: ƒ.Node = graph.getChildrenByName("Blocks")[0];
      let pos: ƒ.Vector3 = this.mtxLocal.translation;
      for (let block of blocks.getChildren()) {
        let posBlock: ƒ.Vector3 = block.mtxLocal.translation;
        if (Math.abs(pos.x - posBlock.x) < 0.5) {
          if (pos.y < posBlock.y + 0.5) {
            pos.y = posBlock.y + 0.5;
            this.mtxLocal.translation = pos;
            this.ySpeed = 0;
          }
        }
      }
    }

    public update(_deltaTime: number, dead: boolean): void {
      this.ySpeed -= gravity * _deltaTime;
      let yOffset: number = this.ySpeed * _deltaTime;
      this.mtxLocal.translateY(yOffset);
      if (!dead)
        this.mtxLocal.translateX(this.xSpeed * _deltaTime, true);
    }

    public act(_action: ACTION): void {
      let animation: ƒAid.SpriteSheetAnimation;
      this.xSpeed = 0;
      switch (_action) {
        case ACTION.WALK:
          this.xSpeed = this.speedWalk;
          animation = this.animWalk;
          break;
        case ACTION.SPRINT:
          this.xSpeed = this.speedSprint;
          animation = this.animSprint;
          break;
        case ACTION.IDLE:
          this.showFrame(0);
          animation = this.animWalk;
          break;
        case ACTION.CROUCH:
          this.showFrame(0);
          animation = this.animLook;
          break;
        case ACTION.LOOK:
          this.showFrame(1);
          animation = this.animLook;
          break;
      }

      if (animation != this.animationCurrent) {
        this.setAnimation(animation);
        this.animationCurrent = animation;
      }
    }

    public initializeSounds(): void {
      this.audioJump = new ƒ.Audio("./Sounds/smw_jump.wav");
      this.audioDeath = new ƒ.Audio("./Sounds/smw_lost_a_life.wav");
    }

    public initializeAnimations(imgSpriteSheet: ƒ.TextureImage): void {
      let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

      this.animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
      this.animWalk.generateByGrid(ƒ.Rectangle.GET(0, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));

      this.animSprint = new ƒAid.SpriteSheetAnimation("Sprint", coat);
      this.animSprint.generateByGrid(ƒ.Rectangle.GET(0, 24, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));

      this.animJump = new ƒAid.SpriteSheetAnimation("Jump", coat);
      this.animJump.generateByGrid(ƒ.Rectangle.GET(64, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));

      this.animLook = new ƒAid.SpriteSheetAnimation("Look", coat);
      this.animLook.generateByGrid(ƒ.Rectangle.GET(32, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));

      this.animDeath = new ƒAid.SpriteSheetAnimation("Death", coat);
      this.animDeath.generateByGrid(ƒ.Rectangle.GET(32, 24, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));

      this.setAnimation(this.animWalk);
      this.framerate = 20;
    }

    private reset(): void {
      this.dead = false;
      this.ySpeed = 0;

      cmpAudio.volume = 6;
      this.mtxLocal.set(new ƒ.Matrix4x4());
      this.mtxLocal.translateY(1);
      this.mtxLocal.translateX(-1);
      this.mtxLocal.translateZ(0.001);
    }
  }
} 