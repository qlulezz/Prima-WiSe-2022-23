namespace xsoldier {
  export function movePlayer(player: Avatar): void {
    // Ignore if player just got hit
    if (!player.allowMovement) {
      player.showFrame(5);
      return;
    }

    // Default: Player is not moving
    player.showFrame(0);

    // Get default speed from config
    let speed: number = config.player.flySpeed;
    // Speed up player if shift is pressed
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT]))
      speed = config.player.boostSpeed;

    // Calculate distance to move
    const distance: number = speed * ƒ.Loop.timeFrameGame / 1000;

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])) {
      player.mtxLocal.translateY(distance);
      player.showFrame(0);
    } else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])) {
      player.mtxLocal.translateY(-distance);
      player.showFrame(0);
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
      player.mtxLocal.translateX(-distance);
      player.showFrame(1);
      if (speed > config.player.flySpeed)
        player.showFrame(2);
    } else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      player.mtxLocal.translateX(distance);
      player.showFrame(3);
      if (speed > config.player.flySpeed)
        player.showFrame(4);
    }
  }

  export function checkBoundaries(player: Avatar): void {
    // TODO: Fix player moving outside area when pressing more than one button

    const xPos: number = player.mtxLocal.translation.x;
    const yPos: number = player.mtxLocal.translation.y;

    if (xPos < config.space.limitLeft)
      player.mtxLocal.translation = new ƒ.Vector3(config.space.limitLeft, yPos, 0);
    else if (xPos > config.space.limitRight)
      player.mtxLocal.translation = new ƒ.Vector3(config.space.limitRight, yPos, 0);

    if (yPos < config.space.limitBottom)
      player.mtxLocal.translation = new ƒ.Vector3(xPos, config.space.limitBottom, 0);
    else if (yPos > config.space.limitTop)
      player.mtxLocal.translation = new ƒ.Vector3(xPos, config.space.limitTop, 0);
  }

  export function random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}