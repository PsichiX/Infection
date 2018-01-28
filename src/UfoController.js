import { Script } from 'oxygen-core';

export default class UfoController extends Script {

  static get propsTypes() {
    return {
      ...Script.propsTypes,
      phase: 'number',
      speed: 'number',
      range: 'number'
    };
  }

  static factory() {
    return new UfoController();
  }

  constructor() {
    super();

    this.phase = 0;
    this.speed = 1;
    this.range = 100;
  }

  onUpdate(deltaTime) {
    this.phase += this.speed * deltaTime * 0.001;
    this.entity.setPosition(0, this.range * Math.sin(this.phase));
  }

}
