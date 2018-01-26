import { System, Script } from 'oxygen-core';

export default class SkyController extends Script {

  static get propsTypes() {
    return {
      ...Script.propsTypes,
      tileWidth: 'number'
    };
  }

  static factory() {
    return new SkyController();
  }

  constructor() {
    super();

    this.tileWidth = 100;
  }

  dispose() {
    super.dispose();

    this._renderer = null;
  }

  onAttach() {
    super.onAttach();

    this._renderer = this.entity.getComponent('Sprite');
    if (!this._renderer) {
      throw new Error(`There is no Sprite: ${this.entity.path}`);
    }
  }

  onUpdate() {
    const { RenderSystem } = System.systems;
    const { tileWidth, _renderer } = this;
    if (!!_renderer) {
      const { overrideUniforms } = _renderer;
      overrideUniforms.uTiles = [
        4 * RenderSystem.canvas.clientWidth / tileWidth,
        1
      ];
      _renderer.overrideUniforms = overrideUniforms;
    }
  }

}
