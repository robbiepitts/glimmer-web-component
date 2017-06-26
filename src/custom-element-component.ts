import { Simple } from '@glimmer/runtime';
import { tracked } from '@glimmer/component';
import { Dict } from '@glimmer/util';

class Component {
  @tracked element: Simple.Element;
  @tracked customElementAttributes = {};
  shadowDom: Simple.Element;
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


// // caller
// <my-button text='bar'>
// </my-button>

// // my-button/template.hbs
// <button>
//   {{text}}
// </button>
