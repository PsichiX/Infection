import { System, Script } from 'oxygen-core';
import { instantiatePrefab, randomRange } from './utils';

const State = {
  IDLE: 'idle',
  WALK: 'walk',
  RUN: 'run',
  LIFT: 'lift',
  THROW: 'throw'
};

const StateLooping = {
  'idle': true,
  'walk': true,
  'run': true,
  'lift': false,
  'throw': false
}

export default class HumanController extends Script {

  static get propsTypes() {
    return {
      ...Script.propsTypes,
      area: 'array(number)',
      speedWalk: 'number',
      speedRun: 'number',
      yRange: 'number',
      speedRandomOffset: 'number',
      prefabs: 'array(string)'
    };
  }

  static get State() {
    return State;
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
    this.prefabs = [];
    this._direction = Math.random() > 0.5 ? 1 : -1;
    this._skeleton = null;
    this._state = State.WALK;
    this._isControlled = false;
  }

  dispose() {
    super.dispose();

    this.area = null;
    this.prefabs = null;
    this._skeleton = null;
  }

  triggerState(id, forced = false) {
    const { _state, _skeleton } = this;
    if (!!_skeleton && (!!forced || _state !== id)) {
      this._state = id;
      _skeleton.playAnimation(id, StateLooping[id]);
    }
  }

  onAttach() {
    super.onAttach();

    const { area, yRange, speedRandomOffset, prefabs } = this;
    this.entity.setPosition(
      randomRange(area[0], area[1]),
      randomRange(-yRange, yRange)
    );

    this.speedWalk += speedRandomOffset * (Math.random() * 2 - 1);
    this.speedRun += speedRandomOffset * (Math.random() * 2 - 1);

    System.events.trigger('register-human', this);

    const instance = instantiatePrefab(
      prefabs[(Math.random() * prefabs.length) | 0]
    );
    instance.setScale(0.5, 0.5);
    instance.parent = this.entity;
    const skeleton = this._skeleton = instance.getComponent('Skeleton');
    if (!skeleton) {
      throw new Error('There is no human Skeleton component!');
    }

    this.triggerState(this._state, true);
  }

  onDetach() {
    System.events.trigger('unregister-human', this);
  }

  onUpdate(deltaTime) {
    const { entity, area, speedWalk, speedRun } = this;
    const { position, scale } = entity;
    const speed = this._state === State.RUN ? speedRun : speedWalk;
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
