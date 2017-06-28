import { Simple } from '@glimmer/runtime';
import { tracked } from '@glimmer/component';
import { Dict } from '@glimmer/util';

export interface CustomElementComponentArgs {
  htmlAttributes: Dict<string>;
}

class Component {
  element: Simple.Element;
  @tracked args: CustomElementComponentArgs;
  debugName: string;

  static create(injections: any) {
    return new this(injections);
  }

  constructor(options: object) {
    Object.assign(this, options);
  }

  didAppendLayout() { }

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
