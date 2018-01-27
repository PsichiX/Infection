import { Script } from 'oxygen-core';
import { instantiatePrefab } from './utils';

const REPETITIONS = 1;
const TRIES_LIMIT = 10;

export default class GameController extends Script {

  static get propsTypes() {
    return {
      ...Script.propsTypes,
      buildings: 'string',
      actors: 'string',
      buildingsSeparation: 'number',
      buildingsCount: 'number',
      buildingPrefabs: 'array(string)',
      lampPrefabs: 'array(string)',
      hydrantPrefabs: 'array(string)'
    };
  }

  static factory() {
    return new GameController();
  }

  constructor() {
    super();

    this.buildings = '.';
    this.actors = '.';
    this.buildingsSeparation = 100;
    this.buildingsCount = 5;
    this.buildingPrefabs = null;
    this.lampPrefabs = null;
    this.hydrantPrefabs = null;
    this._buildings = null;
    this._actors = null;
  }

  dispose() {
    super.dispose();

    this.buildings = null;
    this.actors = null;
    this.buildingPrefabs = null;
    this.lampPrefabs = null;
    this.hydrantPrefabs = null;
    this._buildings = null;
    this._actors = null;
  }

  onAttach() {
    super.onAttach();

    const { entity } = this;
    this._buildings = entity.findEntity(this.buildings);
    if (!this._buildings) {
      throw new Error(`There is no entity: ${this.buildings}`);
    }

    this._actors = entity.findEntity(this.buildings);
    if (!this._actors) {
      throw new Error(`There is no entity: ${this.actors}`);
    }

    this.populateBuildings();
  }

  populateBuildings() {
    const {
      buildingsSeparation,
      buildingsCount,
      buildingPrefabs,
      lampPrefabs,
      hydrantPrefabs,
      _buildings
    } = this;
    const distance = buildingsSeparation * buildingsCount;
    const hd = distance * 0.5;
    const hbs = buildingsSeparation * 0.5;
    const hds = hd - hbs;
    const ho = buildingsSeparation * 0.25;

    // DISCLAIMER: THIS IS VERY UGLY< VERY BAD GAME JAM CODE.
    // DO NOT DO THINGS LIKE THAT!!!

    let lastPrefab = null;
    let lastPrefabAccum = 0;
    let prefab = null;
    let triesLimit = TRIES_LIMIT;
    for (let i = 0; i < buildingsCount; ++i) {
      const p = -hd + buildingsSeparation * i;
      // pick random prefab and allow for certain number of repeats.
      while (--triesLimit > 0) {
        prefab = buildingPrefabs[(Math.random() * buildingPrefabs.length) | 0];
        if (prefab === lastPrefab && buildingPrefabs.length > 1) {
          if (lastPrefabAccum < REPETITIONS) {
            ++lastPrefabAccum;
            break;
          } else {
            continue;
          }
        } else {
          lastPrefabAccum = 0;
          break;
        }
      }
      triesLimit = TRIES_LIMIT;
      lastPrefab = prefab;
      const instance = instantiatePrefab(prefab);
      instance.setPosition(p + hbs, 0);
      instance.parent = _buildings;
    }

    lastPrefab = null;
    lastPrefabAccum = 0;
    prefab = null;
    triesLimit = TRIES_LIMIT;
    for (let i = -1; i < buildingsCount; ++i) {
      const p = -hds + buildingsSeparation * i;
      // pick random prefab and allow for certain number of repeats.
      while (--triesLimit > 0) {
        prefab = lampPrefabs[(Math.random() * lampPrefabs.length) | 0];
        if (prefab === lastPrefab && lampPrefabs.length > 1) {
          if (lastPrefabAccum < REPETITIONS) {
            ++lastPrefabAccum;
            break;
          } else {
            continue;
          }
        } else {
          lastPrefabAccum = 0;
          break;
        }
      }
      triesLimit = TRIES_LIMIT;
      lastPrefab = prefab;
      const instance = instantiatePrefab(prefab);
      instance.setPosition(p + hbs, 170);
      instance.parent = _buildings;
    }

    lastPrefab = null;
    lastPrefabAccum = 0;
    prefab = null;
    triesLimit = TRIES_LIMIT;
    for (let i = -1; i < buildingsCount; i += 2) {
      const p = -hds + buildingsSeparation * i;
      // pick random prefab and allow for certain number of repeats.
      while (--triesLimit > 0) {
        prefab = hydrantPrefabs[(Math.random() * hydrantPrefabs.length) | 0];
        if (prefab === lastPrefab && hydrantPrefabs.length > 1) {
          if (lastPrefabAccum < REPETITIONS) {
            ++lastPrefabAccum;
            break;
          } else {
            continue;
          }
        } else {
          lastPrefabAccum = 0;
          break;
        }
      }
      triesLimit = TRIES_LIMIT;
      lastPrefab = prefab;
      const instance = instantiatePrefab(prefab);
      instance.setPosition(p + hbs + ho + Math.random() * hbs, 170);
      instance.parent = _buildings;
    }
  }

}
