declare namespace Mario {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    class Avatar extends ƒAid.NodeSprite {
        readonly xSpeedDefault: number;
        readonly xSpeedSprint: number;
        readonly jumpForce: number;
        ySpeed: number;
        speed: number;
        animationState: string;
        dead: boolean;
        animWalk: ƒAid.SpriteSheetAnimation;
        animSprint: ƒAid.SpriteSheetAnimation;
        animJump: ƒAid.SpriteSheetAnimation;
        animLook: ƒAid.SpriteSheetAnimation;
        animDeath: ƒAid.SpriteSheetAnimation;
        private audioJump;
        private audioDeath;
        constructor();
        update(_deltaTime: number): void;
        private reset;
        checkDeath(): boolean;
        jump(): void;
        setJumpAnimation(): void;
        sprint(sprinting: boolean): void;
        checkCollision(): void;
        initializeSounds(): void;
        initializeAnimations(imgSpriteSheet: ƒ.TextureImage): void;
    }
}
declare namespace Mario {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Mario {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
    let graph: ƒ.Node;
    let cmpAudio: ƒ.ComponentAudio;
    let gravity: number;
}
