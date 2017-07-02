import Component from '@glimmer/component';
import { Dict } from '@glimmer/util';

export interface CustomElementComponentArgs {
  htmlAttributes: Dict<string>;
}

export interface CustomElementComponentFactory {
  create(injections: object): CustomElementComponent;
}

export default class CustomElementComponent extends Component {
  args: CustomElementComponentArgs;

  didAppendLayout() { }
}
