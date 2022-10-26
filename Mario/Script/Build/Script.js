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
    let branch;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        hndLoad(_event);
    }
    let animWalk;
    let animSprint;
    let animJump;
    let animLook;
    let animDeath;
    function initializeAnimations(coat) {
        animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
        animWalk.generateByGrid(ƒ.Rectangle.GET(0, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
        animSprint = new ƒAid.SpriteSheetAnimation("Sprint", coat);
        animSprint.generateByGrid(ƒ.Rectangle.GET(0, 24, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
        animJump = new ƒAid.SpriteSheetAnimation("Jump", coat);
        animJump.generateByGrid(ƒ.Rectangle.GET(64, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
        animLook = new ƒAid.SpriteSheetAnimation("Look", coat);
        animLook.generateByGrid(ƒ.Rectangle.GET(32, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
        animDeath = new ƒAid.SpriteSheetAnimation("Death", coat);
        animDeath.generateByGrid(ƒ.Rectangle.GET(32, 24, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
    }
    // Load Sprite
    let avatar;
    async function hndLoad(_event) {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("./Images/Mario_Spritesheet.png");
        let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
        initializeAnimations(coat);
        avatar = new ƒAid.NodeSprite("Avatar");
        avatar.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        avatar.setAnimation(animWalk);
        avatar.setFrameDirection(1);
        avatar.framerate = 20;
        avatar.mtxLocal.translateY(0);
        avatar.mtxLocal.translateX(-1);
        avatar.mtxLocal.translateZ(0.001);
        branch = viewport.getBranch();
        branch.addChild(avatar);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
    }
    const xSpeedDefault = .9;
    const xSpeedSprint = 2;
    const jumpForce = 4.5;
    let ySpeed = 0;
    let gravity = 9.81;
    let animationState = "stand";
    let dead = false;
    function update(_event) {
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        ySpeed -= gravity * deltaTime;
        let yOffset = ySpeed * deltaTime;
        avatar.mtxLocal.translateY(yOffset);
        // Check for death
        let pos = avatar.mtxLocal.translation;
        if (dead) {
            pos.y = -1;
            ƒ.Time.game.setTimer(1000, 1, () => window.location.reload());
            viewport.draw();
            return;
        }
        if (pos.y < -1 && !dead) {
            dead = true;
            avatar.setAnimation(animDeath);
            ySpeed = jumpForce * .8;
            viewport.draw();
            return;
        }
        /*
        let pos: ƒ.Vector3 = avatar.mtxLocal.translation;
        if (pos.y + yOffset > 0)
          avatar.mtxLocal.translateY(yOffset);
        else {
          ySpeed = 0;
          pos.y = 0;
          avatar.mtxLocal.translation = pos;
        } */
        // Check if blocks are below player
        checkCollision();
        let speed = xSpeedDefault;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT]))
            speed = xSpeedSprint;
        // Calculate (walk) speed
        const moveDistance = speed * ƒ.Loop.timeFrameGame / 1000;
        // Check for key presses and move player accordingly
        checkInput(moveDistance, speed);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && ySpeed === 0) {
            //avatar.mtxLocal.translation = new ƒ.Vector3(pos.x, 0, 0.001);
            ySpeed = jumpForce;
        }
        if (ySpeed > 0) {
            avatar.setAnimation(animJump);
            avatar.showFrame(0);
        }
        else if (ySpeed < 0) {
            avatar.setAnimation(animJump);
            avatar.showFrame(1);
        }
        // Rotate based on direction
        avatar.mtxLocal.rotation = ƒ.Vector3.Y(animationState.includes("Left") ? 180 : 0);
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }
    function checkInput(moveDistance, speed) {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            avatar.mtxLocal.translateX(moveDistance);
            if (speed > xSpeedDefault && animationState !== "sprintRight") {
                avatar.setAnimation(animSprint);
                animationState = "sprintRight";
                return;
            }
            if (speed <= xSpeedDefault && animationState !== "walkRight") {
                avatar.setAnimation(animWalk);
                animationState = "walkRight";
                return;
            }
            return;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            avatar.mtxLocal.translateX(moveDistance);
            if (speed > xSpeedDefault && animationState !== "sprintLeft") {
                avatar.setAnimation(animSprint);
                animationState = "sprintLeft";
                return;
            }
            if (speed <= xSpeedDefault && animationState !== "walkLeft") {
                avatar.setAnimation(animWalk);
                animationState = "walkLeft";
                return;
            }
            return;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) && !animationState.includes("look")) {
            animationState = `look ${animationState.includes("Left") && "Left"}`;
            avatar.setAnimation(animLook);
            avatar.showFrame(1);
            return;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]) && !animationState.includes("duck")) {
            animationState = `duck ${animationState.includes("Left") && "Left"}`;
            avatar.setAnimation(animLook);
            avatar.showFrame(0);
            return;
        }
        if (animationState.includes("stand")) {
            avatar.setAnimation(animWalk);
            avatar.showFrame(0);
            return;
        }
        animationState = `stand ${animationState.includes("Left") && "Left"}`;
    }
    function checkCollision() {
        let blocks = branch.getChildrenByName("Blocks")[0];
        let pos = avatar.mtxLocal.translation;
        for (let block of blocks.getChildren()) {
            let posBlock = block.mtxLocal.translation;
            if (Math.abs(pos.x - posBlock.x) < 0.5) {
                if (pos.y < posBlock.y + 0.5) {
                    pos.y = posBlock.y + 0.5;
                    avatar.mtxLocal.translation = pos;
                    ySpeed = 0;
                }
            }
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map