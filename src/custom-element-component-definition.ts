import {
  ComponentDefinition as GlimmerComponentDefinition,
  Template
} from '@glimmer/runtime';
import ComponentManager, { ComponentStateBucket } from './custom-element-component-manager';
import { CustomElementComponentFactory } from './custom-element-component';
import { TemplateMeta } from '@glimmer/component';

export default class ComponentDefinition extends GlimmerComponentDefinition<ComponentStateBucket> {
  componentFactory: CustomElementComponentFactory;
  template: Template<TemplateMeta>;

  constructor(name: string, manager: ComponentManager, template: Template<TemplateMeta>, componentFactory: CustomElementComponentFactory) {
    super(name, manager, componentFactory);

    this.template = template;
    this.componentFactory = componentFactory;
  }

  toJSON() {
    return { GlimmerDebug: `<component-definition name="${this.name}">` };
  }
}
