import { Component, System, Utils, vec2 } from 'oxygen-core';

const cachedVec2 = vec2.create();

export default class ContactBox extends Component {

  static factory() {
    return new ContactBox();
  }

  static get propsTypes() {
    return {
      width: 'number',
      height: 'number',
      xOrigin: 'number',
      yOrigin: 'number',
      xOffset: 'number',
      yOffset: 'number'
    };
  }

  get width() {
    return this._width;
  }

  set width(value) {
    if (typeof value !== 'number') {
      throw new Error('`value` is not type of Number!');
    }

    this._width = value;
  }

  get height() {
    return this._height;
  }

  set height(value) {
    if (typeof value !== 'number') {
      throw new Error('`value` is not type of Number!');
    }

    this._height = value;
  }

  get xOffset() {
    return this._xOffset;
  }

  set xOffset(value) {
    if (typeof value !== 'number') {
      throw new Error('`value` is not type of Number!');
    }

    this._xOffset = value;
  }

  get yOffset() {
    return this._yOffset;
  }

  set yOffset(value) {
    if (typeof value !== 'number') {
      throw new Error('`value` is not type of Number!');
    }

    this._yOffset = value;
  }

  get xOrigin() {
    return this._xOrigin;
  }

  set xOrigin(value) {
    if (typeof value !== 'number') {
      throw new Error('`value` is not type of Number!');
    }

    this._xOrigin = value;
  }

  get yOrigin() {
    return this._yOrigin;
  }

  set yOrigin(value) {
    if (typeof value !== 'number') {
      throw new Error('`value` is not type of Number!');
    }

    this._yOrigin = value;
  }

  constructor() {
    super();

    this._width = 1;
    this._height = 1;
    this._xOrigin = 0;
    this._yOrigin = 0;
    this._xOffset = 0;
    this._yOffset = 0;
  }

  onAttach() {
    const { ContactSystem } = System.systems;
    if (!ContactSystem) {
      throw new Error('There is no registered ContactSystem!');
    }

    ContactSystem.registerBox(this);
  }

  onDetach() {
    const { ContactSystem } = System.systems;
    if (!ContactSystem) {
      throw new Error('There is no registered ContactSystem!');
    }

    ContactSystem.unregisterBox(this);
  }

  intersects(x, y) {
    vec2.set(cachedVec2, x, y);

    return Utils.isGlobalPointInGlobalBoundingBox(
      cachedVec2,
      this._width,
      this._height,
      this._width * this._xOrigin + this._xOffset,
      this._height * this._yOrigin + his._yOffset,
      this.entity.transform
    );
  }

  pointInLocalSpace(target, globalPosition, entityPath = null) {
    const entity = !entityPath ? this.entity : this.entity.findEntity(entityPath);

    Utils.convertGlobalPointToLocalPoint(
      target,
      globalPosition,
      entity.transform
    );
  }

  pointInGlobalSpace(target, localPosition, entityPath = null) {
    const entity = !entityPath ? this.entity : this.entity.findEntity(entityPath);

    Utils.convertLocalPointToGlobalPoint(
      target,
      localPosition,
      entity.transform
    );
  }

}
