declare namespace Mario {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    enum ACTION {
        IDLE = 0,
        WALK = 1,
        SPRINT = 2,
        CROUCH = 3,
        LOOK = 4
    }
    class Avatar extends ƒAid.NodeSprite {
        animationState: string;
        readonly speedWalk: number;
        readonly speedSprint: number;
        readonly jumpForce: number;
        private ySpeed;
        private xSpeed;
        private animWalk;
        private animSprint;
        private animJump;
        private animLook;
        private animDeath;
        private audioJump;
        private audioDeath;
        private dead;
        private animationCurrent;
        constructor();
        checkDeath(): boolean;
        jump(): void;
        setJumpAnimation(): void;
        checkCollision(): void;
        update(_deltaTime: number, dead: boolean): void;
        act(_action: ACTION): void;
        initializeSounds(): void;
        initializeAnimations(imgSpriteSheet: ƒ.TextureImage): void;
        private reset;
    }
}
declare namespace Mario {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
    let graph: ƒ.Node;
    let cmpAudio: ƒ.ComponentAudio;
    let gravity: number;
}
declare namespace Mario {
    import ƒ = FudgeCore;
    class ScriptRotator extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        speed: number;
        constructor();
        hndEvent: (_event: Event) => void;
        rotate(node: ƒ.Node): void;
    }
}
