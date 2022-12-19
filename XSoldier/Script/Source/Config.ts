namespace xsoldier {
    export interface Config {
        space:      Space;
        player:     Player;
        item:       Item;
        projectile: Projectile[];
        enemy:      Enemy[];
        stage:      Stage[];
    }
    
    export interface Enemy {
        speed:          number;
        speedTolerance: number;
        birthRate:      number;
    }
    
    export interface Item {
        dropRate: number;
    }
    
    export interface Player {
        flySpeed:   number;
        boostSpeed: number;
        accuracy:   number;
        size:       number;
    }
    
    export interface Projectile {
        speed:      number;
        fireRate:   number;
        baseDamage: number;
    }
    
    export interface Space {
        limitTop:    number;
        limitBottom: number;
        limitLeft:   number;
        limitRight:  number;
    }
    
    export interface Stage {
        enemyCount: number[];
    }
}