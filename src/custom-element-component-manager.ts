import {
  getOwner,
  setOwner,
  Factory,
  Owner
} from '@glimmer/di';
import {
  Bounds,
  ComponentManager as GlimmerComponentManager,
  DynamicScope,
  Environment,
  Simple,
  CompiledDynamicProgram,
  Arguments,
  Template,
  CapturedArguments,
  compileLayout,
  ComponentLayoutBuilder
} from '@glimmer/runtime';
import {
  TemplateMeta
} from '@glimmer/wire-format';
import Component from './custom-element-component';
import ComponentDefinition from './custom-element-component-definition';
import { RootReference } from '@glimmer/component';
import { Dict, Destroyable } from '@glimmer/util';

export interface ConstructorOptions {
  env: Environment;
}

export class ComponentStateBucket {
  public name: string;
  public component: Component;

  constructor(definition: ComponentDefinition, owner: Owner) {
    let componentFactory = definition.componentFactory;
    let name = definition.name;

    let injections = {
      debugName: name
    };

    setOwner(injections, owner);
    this.component = componentFactory.create(injections);
  }
}

class LayoutCompiler {
  name: string;
  template: Template<TemplateMeta>;

  constructor(name: string, template: Template<TemplateMeta>) {
    this.template = template;
    this.name = name;
  }

  compile(builder: ComponentLayoutBuilder): void {
    builder.fromLayout(this.name, this.template);
  }
}

export default class ComponentManager implements GlimmerComponentManager<ComponentStateBucket> {
  private env: Environment;

  static create(options: ConstructorOptions): ComponentManager {
    return new ComponentManager(options);
  }

  constructor(options: ConstructorOptions) {
    this.env = options.env;
  }

  prepareArgs(definition: ComponentDefinition, args: Arguments): null {
    return null;
  }

  create(environment: Environment, definition: ComponentDefinition): ComponentStateBucket {
    let componentFactory = definition.componentFactory;
    if (!componentFactory) { throw 'Bad'; }

    let owner = getOwner(this.env);
    return new ComponentStateBucket(definition, owner);
  }

  createComponentDefinition(name: string, template: Template<any>, componentFactory: Factory<Component>): ComponentDefinition {
    return new ComponentDefinition(name, this, template, componentFactory);
  }

  layoutFor(definition: ComponentDefinition, bucket: ComponentStateBucket, env: Environment): CompiledDynamicProgram {
    let template = definition.template;

    return compileLayout(new LayoutCompiler(definition.name, template), this.env);
  }

  getSelf(bucket: ComponentStateBucket): RootReference {
    if (!bucket) { throw 'Bad'; }
    return new RootReference(bucket.component);
  }

  didCreateElement(bucket: ComponentStateBucket, element: Simple.Element) {
    bucket.component.shadowDom = element;
  }

  didRenderLayout(bucket: ComponentStateBucket, bounds: Bounds) {
  }

  didCreate(bucket: ComponentStateBucket) {
    bucket.component.element = bucket.component.shadowDom.parentNode.host;
    bucket.component.didInsertElement();
  }

  getTag(): null {
    return null;
  }

  update(bucket: ComponentStateBucket, scope: DynamicScope) {
    if (!bucket) { return; }

    // TODO: This should be moved to `didUpdate`, but there's currently a
    // Glimmer bug that causes it not to be called if the layout doesn't update.
    let { component } = bucket;

    component.didUpdate();
  }

  didUpdateLayout() {}

  didUpdate(bucket: ComponentStateBucket) { }

  getDestructor(bucket: ComponentStateBucket): Destroyable {
    if (!bucket) { throw 'Bad'; }

    return bucket.component;
  }
}
