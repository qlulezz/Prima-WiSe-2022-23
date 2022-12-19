namespace xsoldier {
  import ƒ = FudgeCore;

  export let stageAudio: ƒ.ComponentAudio;
  export let weaponAudio: ƒ.ComponentAudio;
  export let largeExplosionAudio: ƒ.ComponentAudio;
  export let smallExplosionAudio: ƒ.ComponentAudio;

  let soundLaser: ƒ.Audio;
  let soundGun: ƒ.Audio;
  let soundBomb: ƒ.Audio;

  export function initializeSound(): void {
    soundLaser = new ƒ.Audio("./Assets/Sounds/Laser Shot.mp3");
    soundGun = new ƒ.Audio("./Assets/Sounds/Gun Shot.mp3");
    soundBomb = new ƒ.Audio("./Assets/Sounds/Bomb Shot.mp3");
  }

  export function setSound(graph: ƒ.Node): void {
    let audio: ƒ.Node = graph.getChildrenByName("Audio")[0];

    stageAudio = audio.getChildrenByName("StageMusic")[0].getComponent(ƒ.ComponentAudio);
    stageAudio.connect(true);
    stageAudio.setAudio(getStageMusic(0, "Menu"));
    stageAudio.play(true);

    largeExplosionAudio = audio.getChildrenByName("PlayerExplosion")[0].getComponent(ƒ.ComponentAudio);
    smallExplosionAudio = audio.getChildrenByName("EnemyExplosion")[0].getComponent(ƒ.ComponentAudio);

    weaponAudio = audio.getChildrenByName("Weapon")[0].getComponent(ƒ.ComponentAudio);
    weaponAudio.connect(true);
    weaponAudio.setAudio(soundLaser);
  }

  // Returns a random background / stage music using specific stage number
  function getStageMusic(stageNumber: number, option?: string): ƒ.Audio {
    const basePath: string = "./Assets/Music/";

    if (stageNumber == 0) {
      /* if (option == "menu") {
        return new ƒ.Audio(`0-${basePath}Menu.flac`);
      } */
      return new ƒ.Audio(`${basePath}0-${option}.mp3`);
    } else if (option == "Boss") {
      return new ƒ.Audio(`${basePath}${stageNumber}-Boss-1.mp3`);
    }

    return new ƒ.Audio(`${basePath}${stageNumber}.mp3`);
  }

  // Plays audio only once
  export function oneTimeAudio(name: string): void {
    stageAudio.setAudio(getStageMusic(0, name));
    stageAudio.play(true);
    stageAudio.loop = false;
  }

  export function setStageMusic(stageNumber: number, boss?: boolean): void {
    stageAudio.setAudio(getStageMusic(stageNumber));

    if (boss)
      stageAudio.setAudio(getStageMusic(stageNumber, "Boss"));

    stageAudio.play(true);
  }

  export function playWeaponSound(): void {
    weaponAudio.play(true);
  }

  export function setWeaponSound(weaponType: number): void {
    switch (weaponType) {
      case 0: {
        weaponAudio.setAudio(soundLaser);
        break;
      }
      case 1: {
        weaponAudio.setAudio(soundGun);
        break;
      }
      case 2: {
        weaponAudio.setAudio(soundBomb);
        break;
      }
    }
  }
}