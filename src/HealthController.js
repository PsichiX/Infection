import { System, Script } from 'oxygen-core';
import { clamp } from './utils';

export default class HealthController extends Script {

  static get propsTypes() {
    return {
      ...Script.propsTypes,
      progressEntity: 'string',
      iconEntity: 'string',
      icons: 'map(string)',
      progressMaxWidth: 'number'
    };
  }

  static factory() {
      return new HealthController();
  }

  constructor() {
    super();

    this.progressEntity = '.';
    this.iconEntity = '.';
    this.icons = {};
    this.progressMaxWidth = 100;
    this._progress = null;
    this._icon = null;
    // we store event callback bound to this instance to properly handle event context.
    this._onHealthChange = this.onHealthChange.bind(this);
    this._onIconChange = this.onIconChange.bind(this);
  }

  dispose() {
    super.dispose();

    this.progressEntity = null;
    this.iconEntity = null;
    this.icons = null;
    this._progress = null;
    this._icon = null;
    this._onHealthChange = null;
    this._onIconChange = null;
  }

  onAttach() {
    const { entity, iconEntity, progressEntity } = this;
    const icon = entity.findEntity(iconEntity);
    if (!icon) {
      throw new Error(`There is no entity: ${iconEntity}`);
    }
    const progress = entity.findEntity(progressEntity);
    if (!progress) {
      throw new Error(`There is no entity: ${progressEntity}`);
    }

    this._icon = icon.getComponent('Sprite');
    if (!this._icon) {
      throw new Error('There is no icon Sprite component!');
    }
    this._progress = icon.getComponent('Sprite');
    if (!this._progress) {
      throw new Error('There is no progress Sprite component!');
    }

    System.events.on('health-change', this._onHealthChange);
    System.events.on('icon-change', this._onIconChange);
  }

  onDetach() {
    System.events.off('health-change', this._onHealthChange);
    System.events.off('icon-change', this._onIconChange);
  }

  onHealthChange(percent) {
    const { progressMaxWidth, _progress } = this;
    if (!!_progress) {
      _progress.width = progressMaxWidth * clamp(percent, 0, 1);
    }
  }

  onIconChange(name){
    const { icons, _icon } = this;
    if (!!icons && _icon && name in icons) {
      _icon.overrideBaseTexture = icons[name];
    }
  }

}
