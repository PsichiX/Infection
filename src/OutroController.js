import { System, Script, vec4 } from 'oxygen-core';
import TWEEN from '@tweenjs/tween.js';
import { tween, lerp, wait } from './utils';

export default class OutroController extends Script {

    static factory() {
        return new OutroController();
    }

    constructor() {
        super();

        this._input = null;
        this._interactive = false;
    }

    dispose() {
        super.dispose();

        this._input = null;
    }

    onAttach() {
        const { entity } = this;
        this._input = entity.getComponent('InputHandler');
        if (!this._input) {
            throw new Error('There is no InputHandler component!');
        }

        const { AssetSystem } = System.systems;
        this._input.setup(AssetSystem.get('json://config.json').data.input);

        tween(1, 0, 300, v => {
            const fadeout = entity
                .findEntity('./fadeout')
                .getComponent('RectangleRenderer');
            vec4.set(fadeout.color, 0, 0, 0, v);

            entity.setPosition(0, lerp(0, 400, v));
        }, TWEEN.Easing.Quadratic.Out)
            .then(() => Promise.all([
                tween(0, 1, 2000, v => {
                    const gameOver = entity
                        .findEntity('./game-over')
                        .getComponent('Sprite');
                    vec4.set(gameOver.color, 1, 1, 1, v);
                }, TWEEN.Easing.Quadratic.Out),
                wait(700).then(() => tween(0, 1, 1000, v => {
                    const press = entity
                        .findEntity('./press-to-restart')
                        .getComponent('Sprite');
                    vec4.set(press.color, 1, 1, 1, v);
                }, TWEEN.Easing.Quadratic.Out))
            ]))
            .then(() => this._interactive = true);
    }

    onUpdate(deltaTime) {
        const { _input } = this;
        if (this._interactive && _input.isTriggerPressed('select')) {
            const { entity } = this;

            tween(1, 0, 500, v => {
                const gameOver = entity
                    .findEntity('./game-over')
                    .getComponent('Sprite');
                const press = entity
                    .findEntity('./press-to-restart')
                    .getComponent('Sprite');

                vec4.set(gameOver.color, 1, 1, 1, v);
                vec4.set(press.color, 1, 1, 1, v);
            }, TWEEN.Easing.Quadratic.In)
                .then(() => tween(0, 1, 1000, v => {
                    const fadeout = entity
                        .findEntity('./fadeout')
                        .getComponent('RectangleRenderer');
                    vec4.set(fadeout.color, 0, 0, 0, v);

                    entity.setPosition(0, lerp(0, -400, v));
                }, TWEEN.Easing.Quadratic.In))
                .then(() => System.events.triggerLater(
                    'change-scene',
                    'scene://scenes/game.json'
                ));

            this._interactive = false;
        }
    }

}
