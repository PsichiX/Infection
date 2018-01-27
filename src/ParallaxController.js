import { Script } from 'oxygen-core';

export default class ParallaxController extends Script {

  static get propsTypes() {
    return {
      ...Script.propsTypes,
      camera: 'string',
      tileWidth: 'number'
    };
  }

  static factory() {
    return new ParallaxController();
  }

  constructor() {
    super();

    this.camera = '.';
    this.tileWidth = 100;
    this._camera = null;
    this._renderer = null;
    this._offset = 0;
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
    const { tileWidth, _camera, _renderer, _offset } = this;
    if (!!_camera && !!_renderer) {
      const { entity, overrideUniforms } = _renderer;
      const scale = _camera.cachedWorldWidth / tileWidth;
      entity.setScale(scale, 1);
      overrideUniforms.uTiles = [scale, 1];
      overrideUniforms.uOffset = [_offset / scale, 0];
      _renderer.overrideUniforms = overrideUniforms;
    }
  }

}
