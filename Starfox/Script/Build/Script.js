"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Starfox;
(function (Starfox) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        reduceMutator(_mutator) { }
        height = "1";
        velocity = "2";
        controller;
        constructor() {
            super();
            this.controller = new ƒui.Controller(this, document.querySelector("#vui"));
            console.log(this.controller);
        }
    }
    Starfox.GameState = GameState;
})(Starfox || (Starfox = {}));
var Starfox;
(function (Starfox) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        Starfox.viewport = _event.detail;
        Starfox.gameState = new Starfox.GameState();
        Starfox.viewport.camera.projectCentral(null, 80);
        Starfox.viewport.camera.mtxPivot.translateZ(10);
        Starfox.viewport.camera.mtxPivot.translateY(.5);
        Starfox.viewport.camera.mtxPivot.rotateY(180);
        Starfox.terrain = Starfox.viewport.getBranch().getChildrenByName("City Terrain")[0].getComponent(ƒ.ComponentMesh);
        let audio = Starfox.viewport.getBranch().getChildrenByName("Audio")[0];
        Starfox.deathSound = audio.getComponent(ƒ.ComponentAudio);
        Starfox.deathSound.connect(true);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        ƒ.Physics.simulate();
        Starfox.viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Starfox || (Starfox = {}));
var Starfox;
(function (Starfox) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Starfox); // Register the namespace to FUDGE for serialization
    class ScriptForce extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(ScriptForce);
        // Properties may be mutated by users in the editor via the automatically created user interface
        speed = 2;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    //ƒ.Debug.log(this.message, this.node);
                    this.node.addEventListener("renderPrepare" /* ƒ.EVENT.RENDER_PREPARE */, () => this.update(this.node));
                    window.addEventListener("mousemove", this.handleMouse);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    this.node.getComponent(ƒ.ComponentRigidbody).addEventListener("ColliderEnteredCollision" /* ƒ.EVENT_PHYSICS.COLLISION_ENTER */, () => this.hndCollision);
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
        ship;
        width = 0;
        height = 0;
        xAxis = 0;
        yAxis = 0;
        handleMouse = (e) => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            let mousePositionY = e.clientY;
            let mousePositionX = e.clientX;
            this.xAxis = 2 * (mousePositionX / this.width) - 1;
            this.yAxis = 2 * (mousePositionY / this.height) - 1;
        };
        forceRot = 0.1;
        forceRoll = 5;
        forceMove = 30;
        relativeX;
        relativeY;
        relativeZ;
        last = false;
        update(graph) {
            this.calculateRelative(graph);
            this.ship = graph.getComponent(ƒ.ComponentRigidbody);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W]))
                this.ship.applyForce(ƒ.Vector3.SCALE(this.relativeZ, this.forceMove));
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A]))
                this.ship.applyTorque(ƒ.Vector3.SCALE(this.relativeZ, this.forceRoll));
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S]))
                this.ship.applyForce(ƒ.Vector3.SCALE(this.relativeZ, -this.forceMove));
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D]))
                this.ship.applyTorque(ƒ.Vector3.SCALE(this.relativeZ, -this.forceRoll));
            this.ship.applyAngularImpulse(new ƒ.Vector3(0, this.xAxis * -this.forceRot * 1.5, 0));
            this.ship.applyAngularImpulse(ƒ.Vector3.SCALE(this.relativeX, this.yAxis * -this.forceRot));
            if (!Starfox.terrain)
                return;
            let terrainInfo = Starfox.terrain.mesh.getTerrainInfo(this.node.mtxLocal.translation, Starfox.terrain.mtxWorld);
            let distance = terrainInfo.distance;
            Starfox.gameState.height = `Height: ${distance.toFixed(3)} m`;
            Starfox.gameState.velocity = `Speed: ${this.ship.getVelocity().magnitude.toFixed(2)} m/s`;
            if (distance <= 0) {
                if (!this.last) {
                    console.log("BUMM");
                    Starfox.deathSound.play(true);
                }
                this.last = true;
                return;
            }
            this.last = false;
        }
        calculateRelative(graph) {
            this.relativeX = ƒ.Vector3.X(5);
            this.relativeX.transform(graph.mtxWorld, false);
            this.relativeY = ƒ.Vector3.Y(5);
            this.relativeY.transform(graph.mtxWorld, false);
            this.relativeZ = ƒ.Vector3.Z(5);
            this.relativeZ.transform(graph.mtxWorld, false);
        }
        hndCollision() {
            console.log("Collision!");
        }
    }
    Starfox.ScriptForce = ScriptForce;
})(Starfox || (Starfox = {}));
//# sourceMappingURL=Script.js.map