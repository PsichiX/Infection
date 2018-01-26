import { Script } from 'oxygen-core';

export default class ParallaxController extends Script {

  static get propsTypes() {
    return {
      ...Script.propsTypes,
      camera: 'string'
    };
  }

  static factory() {
    return new ParallaxController();
  }

  constructor() {
    super();

    this.camera = '.';
    this._camera = null;
    this._renderer = null;
  }

  dispose() {
    super.dispose();

    this.camera = null;
    this._camera = null;
    this._renderer = null;
  }

  onAttach() {
    const camera = this.entity.findEntity(this.camera);
    if (!camera) {
      throw new Error(`There is no entity: ${this.camera}`);
    }

    this._camera = camera.getComponent('Camera2D');
    if (!this._camera) {
      throw new Error(`Entity has no Camera2D component: ${this.camera}`);
    }

    this._renderer = this.entity.getComponent('Sprite');
    if (!this._renderer) {
      throw new Error(`Entity has no Sprite component: ${this.camera}`);
    }
  }

  onUpdate(deltaTime) {
    const { _camera, _renderer } = this;
    if (!!_camera && !!_renderer) {
      _renderer.width = _camera.cachedWorldWidth * 2;
    }
  }

}
