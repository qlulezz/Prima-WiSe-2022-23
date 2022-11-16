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
