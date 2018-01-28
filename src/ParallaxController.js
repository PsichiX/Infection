import { Script } from 'oxygen-core';

export default class ParallaxController extends Script {

  static get propsTypes() {
    return {
      ...Script.propsTypes,
      camera: 'string',
      tileWidth: 'number',
      tileScale: 'number',
      offset: 'number',
      cameraLock: 'string_null',
      cameraLockOffset: 'number'
    };
  }

  static factory() {
    return new ParallaxController();
  }

  constructor() {
    super();

    this.camera = '.';
    this.tileWidth = 100;
    this.tileScale = 1;
    this.offset = 0;
    this.cameraLock = null;
    this.cameraLockOffset = 0;
    this._camera = null;
    this._renderer = null;
  }

  dispose() {
    super.dispose();

    this.camera = null;
    this.cameraLock = null;
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
    const {
      tileWidth,
      tileScale,
      offset,
      cameraLock,
      cameraLockOffset,
      _camera,
      _renderer
    } = this;
    if (!!_camera && !!_renderer) {
      const { entity, overrideUniforms } = _renderer;
      // this magic number is an ugly hack to make sure to remove blank borders.
      const scale = 1.001 * _camera.cachedWorldWidth / tileWidth;
      entity.setScale(scale, tileScale);
      if (cameraLock === 'top') {
        entity.setPosition(0, -_camera.cachedWorldHeight + cameraLockOffset);
      }
      overrideUniforms.uTiles = [scale / tileScale, 1];
      overrideUniforms.uOffset = [offset / scale, 0];
      _renderer.overrideUniforms = overrideUniforms;
    }
  }

}
