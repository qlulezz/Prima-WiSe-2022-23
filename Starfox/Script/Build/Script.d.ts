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
    let viewport: ƒ.Viewport;
    let terrain: ƒ.ComponentMesh;
    let deathSound: ƒ.ComponentAudio;
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
