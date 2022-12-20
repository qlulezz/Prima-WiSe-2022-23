declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Starfox {
    import ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        protected reduceMutator(_mutator: ƒ.Mutator): void;
        height: string;
        velocity: string;
        private controller;
        constructor();
    }
}
declare namespace Starfox {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
    let terrain: ƒ.ComponentMesh;
    let deathSound: ƒ.ComponentAudio;
    let gameState: GameState;
}
declare namespace Starfox {
    import ƒ = FudgeCore;
    class ScriptAnimation extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
        update(graph: ƒ.Node): void;
    }
}
declare namespace Starfox {
    import ƒ = FudgeCore;
    class ScriptForce extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        speed: number;
        constructor();
        hndEvent: (_event: Event) => void;
        ship: ƒ.ComponentRigidbody;
        private width;
        private height;
        private xAxis;
        private yAxis;
        handleMouse: (e: MouseEvent) => void;
        private readonly forceRot;
        private readonly forceRoll;
        private readonly forceMove;
        private relativeX;
        private relativeY;
        private relativeZ;
        private last;
        update(graph: ƒ.Node): void;
        private calculateRelative;
        private hndCollision;
    }
}
declare namespace Starfox {
    import ƒAid = FudgeAid;
    enum JOB {
        IDLE = 0,
        ATTACK = 1
    }
    export class ScriptStateMachine extends ƒAid.ComponentStateMachine<JOB> {
        static readonly iSubclass: number;
        private static instructions;
        constructor();
        static get(): ƒAid.StateMachineInstructions<JOB>;
        private static transitDefault;
        private static actDefault;
        private static actIdle;
        private static actAttack;
        private static transitAttack;
        hndEvent: (_event: Event) => void;
        private update;
        private getDistance;
    }
    export {};
}
