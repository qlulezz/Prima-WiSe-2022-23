namespace Mario {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export class Avatar extends ƒAid.NodeSprite {

    public readonly xSpeedDefault: number = .9;
    readonly xSpeedSprint: number = 2;
    readonly jumpForce: number = 4.5;
    public ySpeed: number = 0;
    public speed: number = this.xSpeedDefault;

    public animationState: string = "stand";
    dead: boolean = false;

    public animWalk: ƒAid.SpriteSheetAnimation;
    public animSprint: ƒAid.SpriteSheetAnimation;
    public animJump: ƒAid.SpriteSheetAnimation;
    public animLook: ƒAid.SpriteSheetAnimation;
    public animDeath: ƒAid.SpriteSheetAnimation;

    // Sounds from https://themushroomkingdom.net/media/smw/wav
    // Music https://www.youtube.com/watch?v=tAaGKo4XVvM
    private audioJump: ƒ.Audio;
    private audioDeath: ƒ.Audio;

    public constructor() {
      super("Avatar");
      this.addComponent(new ƒ.ComponentTransform());
    }

    public update(_deltaTime: number): void {
      this.ySpeed -= gravity * _deltaTime;
      let yOffset: number = this.ySpeed * _deltaTime;
      this.mtxLocal.translateY(yOffset);
    }

    private reset() {
      cmpAudio.volume = 6;
      this.mtxLocal.set(new ƒ.Matrix4x4());
      this.mtxLocal.translateY(0);
      this.mtxLocal.translateX(-1);
      this.mtxLocal.translateZ(0.001);

      this.ySpeed = 0;
      this.dead = false;
    }

    public checkDeath(): boolean {
      // Check for death
      console.log(this.dead);
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
          this.reset();
        });
        viewport.draw();
        return true;
      }
      return false;
    }

    public jump() {
      this.ySpeed = this.jumpForce;
      cmpAudio.volume = 6;
      cmpAudio.setAudio(this.audioJump);
      cmpAudio.play(true);
    }

    public setJumpAnimation() {
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

    public sprint(sprinting: boolean) {
      this.speed = this.xSpeedDefault;
      if (sprinting)
        this.speed = this.xSpeedSprint;
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
  }
} 