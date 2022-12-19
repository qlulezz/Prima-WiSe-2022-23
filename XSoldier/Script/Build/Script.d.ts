declare namespace xsoldier {
    import ƒ = FudgeCore;
    let stageAudio: ƒ.ComponentAudio;
    let weaponAudio: ƒ.ComponentAudio;
    let largeExplosionAudio: ƒ.ComponentAudio;
    let smallExplosionAudio: ƒ.ComponentAudio;
    function initializeSound(): void;
    function setSound(graph: ƒ.Node): void;
    function oneTimeAudio(name: string): void;
    function setStageMusic(stageNumber: number, boss?: boolean): void;
    function playWeaponSound(): void;
    function setWeaponSound(weaponType: number): void;
}
declare namespace xsoldier {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    class Avatar extends ƒAid.NodeSprite {
        gunReady: boolean;
        weaponType: number;
        powerLevel: number[];
        invincible: boolean;
        allowMovement: boolean;
        private lives;
        private readonly maxPowerLevel;
        constructor();
        initializeAnimations(imgSpriteSheet: ƒ.TextureImage): void;
        setItem(itemType: number): void;
        hit(): boolean;
        resetPosition(initial?: boolean): void;
        private updatePowerLevel;
    }
}
declare namespace xsoldier {
    interface Config {
        space: Space;
        player: Player;
        item: Item;
        projectile: Projectile[];
        enemy: Enemy[];
        stage: Stage[];
    }
    interface Enemy {
        speed: number;
        speedTolerance: number;
        birthRate: number;
    }
    interface Item {
        dropRate: number;
    }
    interface Player {
        flySpeed: number;
        boostSpeed: number;
        accuracy: number;
        size: number;
    }
    interface Projectile {
        speed: number;
        fireRate: number;
        baseDamage: number;
    }
    interface Space {
        limitTop: number;
        limitBottom: number;
        limitLeft: number;
        limitRight: number;
    }
    interface Stage {
        enemyCount: number[];
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace xsoldier {
    import ƒAid = FudgeAid;
    class Enemy extends ƒAid.NodeSprite {
        private static count;
        private flySpeed;
        private enemyType;
        constructor(_enemyType: number);
        move(): void;
        initializeAnimations(): void;
    }
}
declare namespace xsoldier {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    class Item extends ƒAid.NodeSprite {
        private static count;
        type: number;
        private dropSpeed;
        constructor(_pos: ƒ.Vector2);
        initialize(): void;
        move(): void;
    }
}
declare namespace xsoldier {
    let config: Config;
    let vui: VUI;
    let projectileTypes: ƒAid.SpriteSheetAnimation[];
    let enemyTypes: ƒAid.SpriteSheetAnimation[];
    let itemSprite: ƒAid.SpriteSheetAnimation;
    let starTypes: ƒAid.SpriteSheetAnimation[];
    let expLarge: ƒAid.SpriteSheetAnimation;
    let expSmall: ƒAid.SpriteSheetAnimation;
}
declare namespace xsoldier {
    function movePlayer(player: Avatar): void;
    function checkBoundaries(player: Avatar): void;
    function random(min: number, max: number): number;
}
declare namespace xsoldier {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    class Projectile extends ƒAid.NodeSprite {
        private static count;
        private flySpeed;
        private strength;
        private hasHit;
        constructor(_pos: ƒ.Vector2, _angle: number);
        move(): void;
        initializeAnimations(projectileType: number, strength: number): void;
        hit(projectileType: number): number;
        getStrength(): number;
    }
}
declare namespace xsoldier {
    import ƒ = FudgeCore;
    function shoot(avatar: Avatar, projectiles: ƒ.Node): void;
    function createProjectile(avatar: Avatar, projectiles: ƒ.Node, pos: ƒ.Vector2, angle: number, strength?: number): void;
}
declare namespace xsoldier {
    import ƒAid = FudgeAid;
    class Star extends ƒAid.NodeSprite {
        private static count;
        private flySpeed;
        constructor();
        move(): void;
        private resetPosition;
    }
}
declare namespace xsoldier {
    import ƒ = FudgeCore;
    class VUI extends ƒ.Mutable {
        score: number;
        stage: string;
        hp: number;
        power: string;
        info: string;
        private controller;
        constructor();
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
