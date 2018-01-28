import { System, Script, vec2 } from 'oxygen-core';

const cachedVec2 = vec2.create();

export default class ParasiteController extends Script {

  static get propsTypes() {
    return {
      ...Script.propsTypes,
      input: 'string',
      gravity: 'number',
      speed: 'number'
    };
  }

  static factory() {
    return new ParasiteController();
  }

  constructor() {
    super();

    this.input = '.';
    this.gravity = 0;
    this.speed = 100;
    this._xVelocity = 0;
    this._yVelocity = 0;
    this._input = null;
    this._controlling = null;
    this._isDead = false;
  }

  dispose() {
    super.dispose();

    this.input = null;
    this._input = null;
    this._controlling = null;
  }

  onAttach() {
    super.onAttach();

    const { input, entity } = this;

    const inputEntity = entity.findEntity(input);
    if (!inputEntity) {
      throw new Error(`There is no entity: ${input}`);
    }

    this._input = inputEntity.getComponent('InputHandler');
    if (!this._input) {
      throw new Error('There is no InputHandler component!');
    }
  }

  onUpdate(deltaTime) {
    if (!!this._isDead) {
      return;
    }

    deltaTime *= 0.001;

    if (!this._controlling) {
      const { _input } = this;
      const { entity } = this;
      const { position } = entity;
      this._xVelocity += _input.getAxis('move-x') * this.speed;
      this._xVelocity *= 0.92;
      this._yVelocity += this.gravity * deltaTime;

      const targetX = position[0] + this._xVelocity * deltaTime;
      const targetY = position[1] + this._yVelocity * deltaTime;
      vec2.set(
        cachedVec2,
        targetX - position[0],
        targetY - position[1]
      );
      vec2.normalize(cachedVec2, cachedVec2);
      const angle = Math.atan2(cachedVec2[1], cachedVec2[0]);
      entity.setPosition(targetX, targetY);
      entity.setRotation(angle);

      if (targetY >= 0) {
        this._isDead = true;
        System.events.trigger('game-lost');
      }
    }
  }

}
