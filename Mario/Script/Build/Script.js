"use strict";
var Mario;
(function (Mario) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Avatar extends ƒAid.NodeSprite {
        xSpeedDefault = .9;
        xSpeedSprint = 2;
        jumpForce = 4.5;
        ySpeed = 0;
        speed = this.xSpeedDefault;
        animationState = "stand";
        dead = false;
        animWalk;
        animSprint;
        animJump;
        animLook;
        animDeath;
        // Sounds from https://themushroomkingdom.net/media/smw/wav
        // Music https://www.youtube.com/watch?v=tAaGKo4XVvM
        audioJump;
        audioDeath;
        constructor() {
            super("Avatar");
            this.addComponent(new ƒ.ComponentTransform());
        }
        update(_deltaTime) {
            this.ySpeed -= Mario.gravity * _deltaTime;
            let yOffset = this.ySpeed * _deltaTime;
            this.mtxLocal.translateY(yOffset);
        }
        reset() {
            Mario.cmpAudio.volume = 6;
            this.mtxLocal.set(new ƒ.Matrix4x4());
            this.mtxLocal.translateY(0);
            this.mtxLocal.translateX(-1);
            this.mtxLocal.translateZ(0.001);
            this.ySpeed = 0;
            this.dead = false;
        }
        checkDeath() {
            // Check for death
            console.log(this.dead);
            let pos = this.mtxLocal.translation;
            if (pos.y < -1 && !this.dead) {
                this.dead = true;
                Mario.cmpAudio.setAudio(this.audioDeath);
                Mario.cmpAudio.play(true);
                this.setAnimation(this.animDeath);
                this.ySpeed = this.jumpForce * .8;
                Mario.viewport.draw();
                return true;
            }
            // If dead, stop game and reset avatar
            if (this.dead) {
                Mario.cmpAudio.volume = 10;
                pos.y = -1;
                ƒ.Time.game.setTimer(3000, 1, () => {
                    this.reset();
                });
                Mario.viewport.draw();
                return true;
            }
            return false;
        }
        jump() {
            this.ySpeed = this.jumpForce;
            Mario.cmpAudio.volume = 6;
            Mario.cmpAudio.setAudio(this.audioJump);
            Mario.cmpAudio.play(true);
        }
        setJumpAnimation() {
            if (this.ySpeed > 0) {
                this.animationState = "jump";
                this.setAnimation(this.animJump);
                this.showFrame(0);
            }
            else if (this.ySpeed < 0) {
                this.animationState = "jump";
                this.setAnimation(this.animJump);
                this.showFrame(1);
            }
            if (this.ySpeed === 0 && this.animationState.includes("jump")) {
                this.setAnimation(this.animWalk);
                this.animationState = "walk";
            }
        }
        sprint(sprinting) {
            this.speed = this.xSpeedDefault;
            if (sprinting)
                this.speed = this.xSpeedSprint;
        }
        // Check if blocks are below player
        checkCollision() {
            let blocks = Mario.graph.getChildrenByName("Blocks")[0];
            let pos = this.mtxLocal.translation;
            for (let block of blocks.getChildren()) {
                let posBlock = block.mtxLocal.translation;
                if (Math.abs(pos.x - posBlock.x) < 0.5) {
                    if (pos.y < posBlock.y + 0.5) {
                        pos.y = posBlock.y + 0.5;
                        this.mtxLocal.translation = pos;
                        this.ySpeed = 0;
                    }
                }
            }
        }
        initializeSounds() {
            this.audioJump = new ƒ.Audio("./Sounds/smw_jump.wav");
            this.audioDeath = new ƒ.Audio("./Sounds/smw_lost_a_life.wav");
        }
        initializeAnimations(imgSpriteSheet) {
            let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
            this.animWalk = new ƒAid.SpriteSheetAnimation("Walk", coat);
            this.animWalk.generateByGrid(ƒ.Rectangle.GET(0, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
            this.animSprint = new ƒAid.SpriteSheetAnimation("Sprint", coat);
            this.animSprint.generateByGrid(ƒ.Rectangle.GET(0, 24, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
            this.animJump = new ƒAid.SpriteSheetAnimation("Jump", coat);
            this.animJump.generateByGrid(ƒ.Rectangle.GET(64, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
            this.animLook = new ƒAid.SpriteSheetAnimation("Look", coat);
            this.animLook.generateByGrid(ƒ.Rectangle.GET(32, 0, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
            this.animDeath = new ƒAid.SpriteSheetAnimation("Death", coat);
            this.animDeath.generateByGrid(ƒ.Rectangle.GET(32, 24, 16, 24), 2, 64, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
            this.setAnimation(this.animWalk);
            this.framerate = 20;
        }
    }
    Mario.Avatar = Avatar;
})(Mario || (Mario = {}));
var Mario;
(function (Mario) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Mario); // Register the namespace to FUDGE for serialization
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
    Mario.CustomComponentScript = CustomComponentScript;
})(Mario || (Mario = {}));
var Mario;
(function (Mario) {
    var ƒ = FudgeCore;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        Mario.viewport = _event.detail;
        hndLoad(_event);
    }
    // Load Mario Sprite and Audio
    let avatar;
    let clouds;
    async function hndLoad(_event) {
        avatar = new Mario.Avatar();
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("./Images/Mario_Spritesheet.png");
        avatar.initializeAnimations(imgSpriteSheet);
        avatar.initializeSounds();
        avatar.mtxLocal.translateY(0);
        avatar.mtxLocal.translateX(-1);
        avatar.mtxLocal.translateZ(0.001);
        Mario.graph = Mario.viewport.getBranch();
        Mario.graph.addChild(avatar);
        clouds = Mario.graph.getChildrenByName("Clouds")[0].getComponent(ƒ.ComponentMaterial);
        Mario.cmpAudio = Mario.graph.getComponent(ƒ.ComponentAudio);
        Mario.cmpAudio.connect(true);
        Mario.cmpAudio.volume = 1;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
    }
    Mario.gravity = 9.81;
    function update(_event) {
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        avatar.update(deltaTime);
        // Check for death, if dead, stop game and reset
        const dead = avatar.checkDeath();
        if (dead)
            return;
        // Check if blocks are below player
        avatar.checkCollision();
        avatar.sprint(false);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT]))
            avatar.sprint(true);
        // Check for key presses and move player accordingly
        checkInput(avatar);
        // Rotate based on direction
        avatar.mtxLocal.rotation = ƒ.Vector3.Y(avatar.animationState.includes("Left") ? 180 : 0);
        // Jumping
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && avatar.ySpeed === 0) {
            avatar.jump();
        }
        avatar.setJumpAnimation();
        // Move clouds
        clouds.mtxPivot.translateX(.0001);
        Mario.viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function checkInput(avatar) {
        // Calculate travel distance
        const moveDistance = avatar.speed * ƒ.Loop.timeFrameGame / 1000;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            avatar.mtxLocal.translateX(moveDistance);
            if (avatar.speed > avatar.xSpeedDefault && avatar.animationState !== "sprintRight") {
                avatar.setAnimation(avatar.animSprint);
                avatar.animationState = "sprintRight";
                return;
            }
            if (avatar.speed <= avatar.xSpeedDefault && avatar.animationState !== "walkRight") {
                avatar.setAnimation(avatar.animWalk);
                avatar.animationState = "walkRight";
                return;
            }
            return;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            avatar.mtxLocal.translateX(moveDistance);
            if (avatar.speed > avatar.xSpeedDefault && avatar.animationState !== "sprintLeft") {
                avatar.setAnimation(avatar.animSprint);
                avatar.animationState = "sprintLeft";
                return;
            }
            if (avatar.speed <= avatar.xSpeedDefault && avatar.animationState !== "walkLeft") {
                avatar.setAnimation(avatar.animWalk);
                avatar.animationState = "walkLeft";
                return;
            }
            return;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]) && !avatar.animationState.includes("look")) {
            avatar.animationState = `look ${avatar.animationState.includes("Left") && "Left"}`;
            avatar.setAnimation(avatar.animLook);
            avatar.showFrame(1);
            return;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]) && !avatar.animationState.includes("duck")) {
            avatar.animationState = `duck ${avatar.animationState.includes("Left") && "Left"}`;
            avatar.setAnimation(avatar.animLook);
            avatar.showFrame(0);
            return;
        }
        if (avatar.animationState.includes("stand")) {
            avatar.setAnimation(avatar.animWalk);
            avatar.showFrame(0);
            return;
        }
        avatar.animationState = `stand ${avatar.animationState.includes("Left") && "Left"}`;
    }
})(Mario || (Mario = {}));
//# sourceMappingURL=Script.js.map