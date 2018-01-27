import { Script } from 'oxygen-core';
import { instantiatePrefab } from './utils';

export default class BuildingController extends Script {

  static get propsTypes() {
    return {
      ...Script.propsTypes,
      condignationsMin: 'number',
      condignationsMax: 'number',
      condignationHeight: 'number',
      condignationPrefab: 'string',
      bottomTextures: 'array(string)',
      middleTextures: 'array(string)',
      topTextures: 'array(string)'
    };
  }

  static factory() {
    return new BuildingController();
  }

  constructor() {
    super();

    this.condignationsMin = 3;
    this.condignationsMax = 6;
    this.condignationHeight = 100;
    this.condignationPrefab = null;
    this.bottomTextures = [];
    this.middleTextures = [];
    this.topTextures = [];
  }

  dispose() {
    super.dispose();

    this.condignationPrefab = null;
    this.bottomTextures = null;
    this.middleTextures = null;
    this.topTextures = null;
  }

  onAttach() {
    super.onAttach();

    const {
      entity,
      condignationsMin,
      condignationsMax,
      condignationHeight,
      bottomTextures,
      middleTextures,
      topTextures
    } = this;
    if (condignationsMin < 2) {
      throw new Error('`condignationsMin` cannot be smaller than 2!');
    }
    if (condignationsMax < 2) {
      throw new Error('`condignationsMax` cannot be smaller than 2!');
    }
    if (condignationsMax < condignationsMin) {
      throw new Error('`condignationsMax` cannot be smaller than `condignationsMin`!');
    }

    const count = 1 + (Math.random() * (condignationsMax - 2)) | 0;
    let instance = this.instantiateCondignation(bottomTextures);
    instance.parent = entity;
    let p = condignationHeight;

    for (let i = 0; i < count; ++i) {
      instance = this.instantiateCondignation(middleTextures);
      instance.setPosition(0, -p);
      instance.parent = entity;
      p += condignationHeight;
    }

    instance = this.instantiateCondignation(topTextures);
    instance.setPosition(0, -p);
    instance.parent = entity;
  }

  instantiateCondignation(textures) {
    const { condignationPrefab } = this;
    let instance = instantiatePrefab(condignationPrefab);
    let renderer = instance.getComponent('Sprite');
    renderer.overrideBaseTexture = textures[
      (Math.random() * textures.length) | 0
    ];

    return instance;
  }

}
