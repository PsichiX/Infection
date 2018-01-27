import { System } from 'oxygen-core';

export function instantiatePrefab(path) {
  if (typeof path !== 'string') {
    throw new Error('`path` is not type of String!');
  }

  const { AssetSystem, EntitySystem } = System.systems;
  const asset = AssetSystem.get(path);
  if (!asset) {
    throw new Error(`There is no asset: ${path}`);
  }

  return EntitySystem.buildEntity(asset.data);
}

export function clamp(value, from, to) {
  return Math.max(from, Math.min(to, value))
}
