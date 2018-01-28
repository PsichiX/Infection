import { System } from 'oxygen-core';
import TWEEN from '@tweenjs/tween.js';

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

export function randomRange(from, to) {
  return from + (Math.random() * (to - from));
}

export function lerp(f, t, v) {
  return (t - f) * v + f;
}

export function tween(from, to, time, callback, easing = TWEEN.Easing.Linear.None) {
  const { RenderSystem } = System.systems;
  if (!RenderSystem) {
    throw new Error('There is no registered RenderSystem!');
  }

  return new Promise((resolve, reject) => {
    const t = { v: from };

    callback(from);
    new TWEEN.Tween(t)
      .to({ v: to }, time)
      .onUpdate(() => callback(t.v))
      .onComplete(() => {
        callback(to);
        resolve();
      })
      .onStop(() => {
        callback(to);
        reject();
      })
      .easing(easing)
      .start(RenderSystem.passedTime);
  });
}

export function wait(milliseconds) {
  return new Promise(resolve => setTimeout(() => resolve(), milliseconds))
}
