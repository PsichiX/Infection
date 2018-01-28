import { System, Script } from 'oxygen-core';

export default class ParasiteController extends Script {

  static get propsTypes() {
    return {
      ...Script.propsTypes,
      input: 'string',
      gravity: 'number'
    };
  }

  static factory() {
    return new ParasiteController();
  }

  constructor() {
    super();

    this.input = '.';
    this.gravity = 0;
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
      const targetY = position[1] + this.gravity * deltaTime;

      entity.setPosition(position[0], targetY);

      if (targetY >= 0) {
        this._isDead = true;
        System.events.trigger('game-lost');
      }
    }
  }

}
