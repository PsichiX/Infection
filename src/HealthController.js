import { Script } from 'oxygen-core';
import { instantiatePrefab } from './utils';

export default class HealthController extends Script {
    static factory() {
        return new HealthController();
    }

    onAttach() {
        const { entity } = this;
        let instance = this.instantiatePrefab;
    }
}