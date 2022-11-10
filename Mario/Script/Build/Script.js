"use strict";
var Mario;
(function (Mario) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let ACTION;
    (function (ACTION) {
        ACTION[ACTION["IDLE"] = 0] = "IDLE";
        ACTION[ACTION["WALK"] = 1] = "WALK";
        ACTION[ACTION["SPRINT"] = 2] = "SPRINT";
        ACTION[ACTION["CROUCH"] = 3] = "CROUCH";
        ACTION[ACTION["LOOK"] = 4] = "LOOK";
    })(ACTION = Mario.ACTION || (Mario.ACTION = {}));
    class Avatar extends ƒAid.NodeSprite {
        animationState = "stand";
        speedWalk = .9;
        speedSprint = 2;
        jumpForce = 4.5;
        ySpeed = 0;
        xSpeed = this.speedWalk;
        animWalk;
        animSprint;
        animJump;
        animLook;
        animDeath;
        audioJump;
        audioDeath;
        dead = false;
        animationCurrent;
        constructor() {
            super("Avatar");
            this.addComponent(new ƒ.ComponentTransform());
        }
        checkDeath() {
            // Check for death
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
                    if (this.dead) {
                        this.reset();
                    }
                });
                Mario.viewport.draw();
                return true;
            }
            return false;
        }
        jump() {
            if (this.ySpeed !== 0)
                return;
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
        update(_deltaTime, dead) {
            this.ySpeed -= Mario.gravity * _deltaTime;
            let yOffset = this.ySpeed * _deltaTime;
            this.mtxLocal.translateY(yOffset);
            if (!dead)
                this.mtxLocal.translateX(this.xSpeed * _deltaTime, true);
        }
        act(_action) {
            let animation;
            this.xSpeed = 0;
            switch (_action) {
                case ACTION.WALK:
                    this.xSpeed = this.speedWalk;
                    animation = this.animWalk;
                    break;
                case ACTION.SPRINT:
                    this.xSpeed = this.speedSprint;
                    animation = this.animSprint;
                    break;
                case ACTION.IDLE:
                    this.showFrame(0);
                    animation = this.animWalk;
                    break;
                case ACTION.CROUCH:
                    this.showFrame(0);
                    animation = this.animLook;
                    break;
                case ACTION.LOOK:
                    this.showFrame(1);
                    animation = this.animLook;
                    break;
            }
            if (animation != this.animationCurrent) {
                this.setAnimation(animation);
                this.animationCurrent = animation;
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
        reset() {
            this.dead = false;
            this.ySpeed = 0;
            Mario.cmpAudio.volume = 6;
            this.mtxLocal.set(new ƒ.Matrix4x4());
            this.mtxLocal.translateY(1);
            this.mtxLocal.translateX(-1);
            this.mtxLocal.translateZ(0.001);
        }
    }
    Mario.Avatar = Avatar;
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
        const deltaTime = ƒ.Loop.timeFrameGame / 1000;
        const dead = avatar.checkDeath();
        // Update avatar movement
        avatar.update(deltaTime, dead);
        // Check for death, if dead, stop game and reset
        if (dead)
            return;
        // Check if blocks are below player
        avatar.checkCollision();
        // Check for key presses and move player accordingly
        checkInput();
        // Jumping
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]))
            avatar.jump();
        avatar.setJumpAnimation();
        // Move clouds
        clouds.mtxPivot.translateX(.0001);
        Mario.viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function checkInput() {
        // Check for key presses
        let run = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT]);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            avatar.mtxLocal.rotation = ƒ.Vector3.Y(180);
            avatar.act(run ? Mario.ACTION.SPRINT : Mario.ACTION.WALK);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            avatar.mtxLocal.rotation = ƒ.Vector3.Y(0);
            avatar.act(run ? Mario.ACTION.SPRINT : Mario.ACTION.WALK);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]))
            avatar.act(Mario.ACTION.LOOK);
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]))
            avatar.act(Mario.ACTION.CROUCH);
        else
            avatar.act(Mario.ACTION.IDLE);
    }
})(Mario || (Mario = {}));
var Mario;
(function (Mario) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Mario); // Register the namespace to FUDGE for serialization
    class ScriptRotator extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(ScriptRotator);
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
                    this.node.addEventListener("renderPrepare" /* ƒ.EVENT.RENDER_PREPARE */, () => this.rotate(this.node));
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
        rotate(node) {
            node.getComponent(ƒ.ComponentMesh).mtxPivot.rotateY(this.speed);
        }
    }
    Mario.ScriptRotator = ScriptRotator;
})(Mario || (Mario = {}));
//# sourceMappingURL=Script.js.map