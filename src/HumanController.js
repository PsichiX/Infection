import { System, Script } from 'oxygen-core';
import { randomRange } from './utils';

export default class HumanController extends Script {

  static get propsTypes() {
    return {
      ...Script.propsTypes,
      area: 'array(number)',
      speedWalk: 'number',
      speedRun: 'number',
      yRange: 'number',
      speedRandomOffset: 'number'
    };
  }

  static factory() {
    return new HumanController();
  }

  constructor() {
    super();

    this.area = [-100, 100];
    this.speedWalk = 100;
    this.speedRun = 200;
    this.yRange = 0;
    this.speedRandomOffset = 0;
    this._direction = Math.random() > 0.5 ? 1 : -1;
    this._isRunning = false;
  }

  dispose() {
    super.dispose();

    this.area = null;
  }

  onAttach() {
    super.onAttach();

    const { area, yRange, speedRandomOffset } = this;
    this.entity.setPosition(
      randomRange(area[0], area[1]),
      randomRange(-yRange, yRange)
    );

    this.speedWalk += speedRandomOffset * (Math.random() * 2 - 1);
    this.speedRun += speedRandomOffset * (Math.random() * 2 - 1);

    System.events.trigger('register-human', this);
  }

  onDetach() {
    System.events.trigger('unregister-human', this);
  }

  onUpdate(deltaTime) {
    const { entity, area, speedWalk, speedRun } = this;
    const { position, scale } = entity;
    const speed = !!this._isRunning ? speedRun : speedWalk;
    const targetX = position[0] + this._direction * speed;

    if (targetX < area[0]) {
      this._direction = 1;
      entity.setPosition(area[0], position[1]);
    } else if (targetX > area[1]) {
      this._direction = -1;
      entity.setPosition(area[1], position[1]);
    } else {
      entity.setPosition(targetX, position[1]);
    }

    if (Math.sign(scale[0]) !== Math.sign(-this._direction)) {
      entity.setScale(Math.abs(scale[0]) * -this._direction, scale[1]);
    }
  }

}
