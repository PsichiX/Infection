import { System, Script } from 'oxygen-core';

export default class CameraController extends Script {

  static get propsTypes() {
    return {
      ...Script.propsTypes,
      zoomOut: 'number',
      xOffset: 'number',
      yOffset: 'number'
    };
  }

  static factory() {
    return new CameraController();
  }

  constructor() {
    super();

    this.zoomOut = 1024,
    this.x = 0;
    this.y = 0;
    this.xOffset = 0;
    this.yOffset = 0;
    this._camera = null;
    this._onTargetPosition = this.onTargetPosition.bind(this);
    this._onZoomOut = this.onZoomOut.bind(this);
  }

  dispose() {
    super.dispsoe();

    this._camera = null;
    this._onTargetPosition = null;
    this._onZoomOut = null;
  }

  placeCamera() {
    const { _camera } = this;
    if (!!_camera) {
      _camera.zoomOut = this.zoomOut;
    }
    this.entity.setPosition(
      this.x + this.xOffset,
      this.y + this.yOffset - this.zoomOut * 0.5
    );
  }

  onAttach() {
    this._camera = this.entity.getComponent('Camera2D');
    if (!this._camera) {
      throw new Error('There is no Camera2D component!');
    }

    this.placeCamera();
  }

  onTargetPosition(x, y) {
    this.x = x;
    this.y = y;
    // TODO: maybe add tweening?
    this.placeCamera();
  }

  onZoomOut(value) {
    this.zoomOut = value;
    // TODO: maybe add tweening?
    this.placeCamera();
  }

}
