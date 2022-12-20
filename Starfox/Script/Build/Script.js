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
        reduceMutator(_mutator) {
            //delete(_mutator)
        }
        height = "1";
        velocity = "2";
        controller;
        constructor() {
            super();
            this.controller = new ƒui.Controller(this, document.querySelector("#vui"));
            console.log(this.controller);
            console.log(this.getMutator());
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
        //startGuard();
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
    class ScriptAnimation extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(ScriptAnimation);
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
                    //ƒ.Debug.log(this.message, this.node);
                    this.update(this.node);
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
        update(graph) {
            //const item = graph.getComponent(ƒ.ComponentTransform);
            let animseq = new ƒ.AnimationSequence();
            animseq.addKey(new ƒ.AnimationKey(0, 0));
            animseq.addKey(new ƒ.AnimationKey(2000, 1));
            animseq.addKey(new ƒ.AnimationKey(4000, 0));
            let animseq2 = new ƒ.AnimationSequence();
            animseq2.addKey(new ƒ.AnimationKey(0, 0, 0, 360 / 4000));
            animseq2.addKey(new ƒ.AnimationKey(4000, 360, 360 / 4000, 0));
            let animStructure = {
                components: {
                    ComponentTransform: [
                        {
                            "ƒ.ComponentTransform": {
                                mtxLocal: {
                                    translation: {
                                        y: animseq
                                    },
                                    rotation: {
                                        y: animseq2
                                    }
                                }
                            }
                        }
                    ]
                }
            };
            let animation = new ƒ.Animation("testAnimation", animStructure, 60);
            let cmpAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE.LOOP, ƒ.ANIMATION_PLAYBACK.TIMEBASED_CONTINOUS);
            animation.setEvent("animationEvent", 0);
            cmpAnimator.addEventListener("animationEvent", (_event) => {
                let time = _event.target.time;
                console.log(`Event fired with delay of ${Math.round(time)}ms`, _event);
            });
            graph.addComponent(cmpAnimator);
            cmpAnimator.activate(true);
        }
    }
    Starfox.ScriptAnimation = ScriptAnimation;
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
var Starfox;
(function (Starfox) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.Project.registerScriptNamespace(Starfox); // Register the namespace to FUDGE for serialization
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["ATTACK"] = 1] = "ATTACK";
    })(JOB || (JOB = {}));
    class ScriptStateMachine extends ƒAid.ComponentStateMachine {
        static iSubclass = ƒ.Component.registerSubclass(ScriptStateMachine);
        static instructions = ScriptStateMachine.get();
        constructor() {
            super();
            this.instructions = ScriptStateMachine.instructions; // setup instructions with the static set
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = ScriptStateMachine.transitDefault;
            setup.actDefault = ScriptStateMachine.actDefault;
            setup.setAction(JOB.IDLE, this.actIdle);
            setup.setAction(JOB.ATTACK, this.actAttack);
            setup.setTransition(JOB.IDLE, JOB.ATTACK, this.transitAttack);
            return setup;
        }
        static transitDefault(_machine) {
            console.log("Transit to", _machine.stateNext);
        }
        static async actDefault(_machine) {
            console.log(JOB[_machine.stateCurrent]);
        }
        static async actIdle(_machine) {
            //console.log("actIDLE");
            _machine.node.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(1);
            ScriptStateMachine.actDefault(_machine);
        }
        static async actAttack(_machine) {
            //console.log("actATTACK";)
            _machine.node.getComponent(ƒ.ComponentTransform).mtxLocal.rotateY(3);
            ScriptStateMachine.actDefault(_machine);
        }
        static transitAttack(_machine) {
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    //ƒ.Debug.log(this.message, this.node);
                    ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
                    this.transit(JOB.IDLE);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    this.transit(JOB.IDLE);
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    /* let transform: ƒ.ComponentTransform = this.node.getComponent(ƒ.ComponentTransform);
                    let ship: ƒ.ComponentTransform = viewport.getBranch().getChildrenByName("Avatar")[0].getComponent(ƒ.ComponentTransform);
                    let distance: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(ship.mtxWorld.translation, _machine.node.mtxWorld.translation);
                    console.log(distance);
          
                    if (distance.magnitude > 10) {
                      _machine.transit(JOB.ATTACK);
                    } */
                    break;
            }
        };
        update = (_event) => {
            this.act();
        };
        getDistance(a, b) {
            return Math.hypot(a.mtxLocal.translation.x - b.mtxLocal.translation.x, a.mtxLocal.translation.y - b.mtxLocal.translation.y);
        }
    }
    Starfox.ScriptStateMachine = ScriptStateMachine;
})(Starfox || (Starfox = {}));
//# sourceMappingURL=Script.js.map