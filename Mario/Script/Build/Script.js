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
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    // Initialize Viewport
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        hndLoad(_event);
    }
    let walkAnimation;
    let sprintAnimation;
    let jumpAnimation;
    let lookAnimation;
    let deathAnimation;
    function initializeAnimations(coat) {
        walkAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
        walkAnimation.generateByGrid(ƒ.Rectangle.GET(0, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
        sprintAnimation = new ƒAid.SpriteSheetAnimation("Sprint", coat);
        sprintAnimation.generateByGrid(ƒ.Rectangle.GET(0, 24, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
        jumpAnimation = new ƒAid.SpriteSheetAnimation("Jump", coat);
        jumpAnimation.generateByGrid(ƒ.Rectangle.GET(0, 48, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
        lookAnimation = new ƒAid.SpriteSheetAnimation("Look", coat);
        lookAnimation.generateByGrid(ƒ.Rectangle.GET(32, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
        deathAnimation = new ƒAid.SpriteSheetAnimation("Death", coat);
        deathAnimation.generateByGrid(ƒ.Rectangle.GET(32, 24, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
    }
    // Load Sprite
    let player;
    async function hndLoad(_event) {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("./Images/Mario_Spritesheet.png");
        let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
        initializeAnimations(coat);
        player = new ƒAid.NodeSprite("Sprite");
        player.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        player.setAnimation(walkAnimation);
        player.setFrameDirection(1);
        player.framerate = 20;
        player.mtxLocal.translateY(-.3);
        player.mtxLocal.translateX(-1);
        player.mtxLocal.translateZ(1.001);
        let branch = viewport.getBranch();
        let mario = branch.getChildrenByName("Mario")[0];
        mario.addChild(player);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
    }
    let leftDirection = false;
    let lastLeftDirection = false;
    let speed = .8;
    let prevSprint = false;
    function update(_event) {
        speed = .9;
        if (leftDirection) {
            speed = -.9;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT])) {
            speed = 2;
            if (leftDirection) {
                speed = -2;
            }
        }
        // Calculate (walk) speed
        const amount = speed * ƒ.Loop.timeFrameGame / 1000;
        // Check for key presses
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            player.mtxLocal.translateX(-amount);
            leftDirection = true;
            player.setFrameDirection(1);
            if (speed < -1) {
                if (!prevSprint) {
                    prevSprint = true;
                    player.setAnimation(sprintAnimation);
                }
            }
            else {
                prevSprint = false;
            }
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            player.mtxLocal.translateX(amount);
            leftDirection = false;
            player.setFrameDirection(1);
            if (speed > 1) {
                if (!prevSprint) {
                    prevSprint = true;
                    player.setAnimation(sprintAnimation);
                }
            }
            else {
                prevSprint = false;
            }
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
            player.setAnimation(lookAnimation);
            player.showFrame(1);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
            player.setAnimation(lookAnimation);
            player.showFrame(0);
        }
        else {
            player.showFrame(0);
            player.setAnimation(walkAnimation);
        }
        // Rotate based on direction
        if (leftDirection && !lastLeftDirection) {
            // turn left
            player.mtxLocal.rotation = ƒ.Vector3.Y(180);
            lastLeftDirection = true;
        }
        else if (!leftDirection && lastLeftDirection) {
            // turn right
            player.mtxLocal.rotation = ƒ.Vector3.Y(0);
            lastLeftDirection = false;
        }
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map