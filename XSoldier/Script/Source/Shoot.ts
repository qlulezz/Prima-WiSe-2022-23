namespace xsoldier {
  import ƒ = FudgeCore;

  // shoot based on weaponType and powerLevel
  export function shoot(avatar: Avatar, projectiles: ƒ.Node): void {
    const posX: number = avatar.mtxLocal.translation.x;
    const posY: number = avatar.mtxLocal.translation.y;

    switch (avatar.weaponType) {
      case 0: {
        switch (avatar.powerLevel[0]) {
          case 1: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .1, posY), 0, 10);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .1, posY), 0, 10);
            break;
          }
          case 2: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .1, posY), 0, 20);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .1, posY), 0, 20);
            break;
          }
          case 3: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .1, posY), 0, 30);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .1, posY), 0, 30);
            break;
          }
          case 4: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY + .1), 0, 30);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .2, posY), 0, 30);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .2, posY), 0, 30);
            break;
          }
          case 5: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY + .1), 0, 40);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .2, posY), 0, 40);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .2, posY), 0, 40);
            break;
          }
          case 6: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .075, posY + .1), 0, 30);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .075, posY + .1), 0, 30);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .25, posY), 0, 30);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .25, posY), 0, 30);
            break;
          }
          case 7: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .075, posY + .1), 0, 30);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .075, posY + .1), 0, 30);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .25, posY), 0, 30);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .25, posY), 0, 30);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 180, 30);
            break;
          }
          case 8: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .075, posY + .1), 0, 30);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .075, posY + .1), 0, 30);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .25, posY), 0, 30);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .25, posY), 0, 30);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .075, posY), 180, 30);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .075, posY), 180, 30);
            break;
          }
        }
        break;
      }
      case 1: {
        switch (avatar.powerLevel[1]) {
          case 1: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0);
            break;
          }
          case 2: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 10);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), -10);
            break;
          }
          case 3: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 10);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), -10);
            break;
          }
          case 4: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 7);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), -7);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 15);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), -15);
            break;
          }
          default: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 7);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), -7);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 15);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), -15);
          }
        }
        break;
      }
      case 2: {
        switch (avatar.powerLevel[2]) {
          case 1: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0, 20);
            break;
          }
          case 2: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0, 30);
            break;
          }
          case 3: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .1, posY), 0, 30);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .1, posY), 0, 30);
            break;
          }
          case 4: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .1, posY), 0, 40);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .1, posY), 0, 40);
            break;
          }
          case 5: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .1, posY), 0, 50);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .1, posY), 0, 50);
            break;
          }
          case 6: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0, 40);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .2, posY), 0, 40);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .2, posY), 0, 40);
            break;
          }
          case 7: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0, 50);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .2, posY), 0, 50);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .2, posY), 0, 50);
            break;
          }
          case 8: {
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX, posY), 0, 60);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX + .2, posY), 0, 60);
            createProjectile(avatar, projectiles, new ƒ.Vector2(posX - .2, posY), 0, 60);
            break;
          }
        }
        break;
      }
    }

    const fireRate: number = config.projectile[avatar.weaponType].fireRate;
    ƒ.Time.game.setTimer(fireRate, 1, () => avatar.gunReady = true);
  }

  export function createProjectile(avatar: Avatar, projectiles: ƒ.Node, pos: ƒ.Vector2, angle: number, strength: number = 10): void {
    const projectile: Projectile = new Projectile(pos, angle);
    projectile.initializeAnimations(avatar.weaponType, strength);
    projectiles.addChild(projectile);
    avatar.gunReady = false;
  }
}