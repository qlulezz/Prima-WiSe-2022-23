declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
}
declare namespace Starfox {
    import ƒ = FudgeCore;
    class ScriptForce extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        speed: number;
        constructor();
        hndEvent: (_event: Event) => void;
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
        update(graph: ƒ.Node): void;
        private calculateRelative;
    }
}
