import { System, Events } from 'oxygen-core';
import ContactBox from './ContactBox';

export default class ContactSystem extends System {

  constructor() {
    super();

    this._boxes = new Set();
  }

  dispose() {
    super.dispose();

    this._boxes = null;
  }

  registerBox(box) {
    if (!(box instanceof ContactBox)) {
      throw new Error('`box` is not type of ContactBox!');
    }

    this._boxes.add(box);
  }

  unregisterBox(box) {
    if (!(box instanceof ContactBox)) {
      throw new Error('`box` is not type of Entity!');
    }

    this._boxes.delete(box);
  }

  containsBox(box) {
    if (!(box instanceof ContactBox)) {
      throw new Error('`box` is not type of ContactBox!');
    }

    return this._boxes.has(box);
  }

  findContact(x, y) {
    const { _boxes } = this;
    for (const box of _boxes.values()) {
      if (box.entity.active && box.intersects(x, y)) {
        return box;
      }
    }

    return null;
  }

  findContacts(x, y) {
    const { _boxes } = this;
    const list = [];
    for (const box of _boxes.values()) {
      if (box.entity.active && box.intersects(x, y)) {
        list.push(box);
      }
    }

    return list;
  }

}
