import { Simple } from '@glimmer/runtime';
import { tracked } from '@glimmer/component';
import { Dict } from '@glimmer/util';

class Component {
  element: Simple.Element;
  shadowDom: Simple.Element;
  debugName: string;
  @tracked attributes: Dict<string>;

  static create(injections: any) {
    return new this(injections);
  }

  constructor(options: object) {
    Object.assign(this, options);
  }

  didInsertElement() { }

  didUpdate() { }

  willDestroy() { }

  destroy() {
    this.willDestroy();
  }

  toString() {
    return `${this.debugName} component`;
  }
}

export default Component;

export interface ComponentFactory {
  create(injections: object): Component;
}
