import { lazyInitialization, System, vec4 } from 'oxygen-core';
import SkyController from './SkyController';
import ParallaxController from './ParallaxController';

lazyInitialization({
  render: { screen: 'screen-0' },
  store: { id: 'infection' },
  asset: { pathPrefix: 'assets/' }
});

const {
  AssetSystem,
  RenderSystem,
  EntitySystem
} = System.systems;

EntitySystem.registerComponent('SkyController', SkyController.factory);
EntitySystem.registerComponent('ParallaxController', ParallaxController.factory);

vec4.set(RenderSystem.clearColor, 0, 0, 0, 0);

AssetSystem.load('json://config.json');
