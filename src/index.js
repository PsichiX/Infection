import { lazyInitialization, System, vec4 } from 'oxygen-core';
import SkyController from './SkyController';
import ParallaxController from './ParallaxController';
import GameController from './GameController';
import BuildingController from './BuildingController';
import HealthController from "./HealthController";
import HumanController from "./HumanController";
import CameraController from "./CameraController";

lazyInitialization({
  render: { screen: 'screen-0' },
  store: { id: 'infection' },
  asset: { pathPrefix: 'assets/', cache: 'no-store' }
});

const {
  AssetSystem,
  RenderSystem,
  EntitySystem
} = System.systems;

EntitySystem.registerComponent('SkyController', SkyController.factory);
EntitySystem.registerComponent('ParallaxController', ParallaxController.factory);
EntitySystem.registerComponent('GameController', GameController.factory);
EntitySystem.registerComponent('BuildingController', BuildingController.factory);
EntitySystem.registerComponent('HealthController', HealthController.factory);
EntitySystem.registerComponent('HumanController', HumanController.factory);
EntitySystem.registerComponent('CameraController', CameraController.factory);

vec4.set(RenderSystem.clearColor, 0, 0, 0, 0);

AssetSystem.load('json://config.json')
// AssetSystem.load('pack://assets.pack')
//   .then(packAsset => AssetSystem.fetchEngine = packAsset.makeFetchEngine())
//   .then(() => AssetSystem.load('json://config.json'))
  .then(configAsset => AssetSystem.loadAll(configAsset.data.assets))
  .then(() => System.events.triggerLater(
    'change-scene',
    'scene://scenes/game.json'
  ));
