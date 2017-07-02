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
import { ComponentManager, RootReference } from '@glimmer/component';
import { Dict, Destroyable, Opaque } from '@glimmer/util';
import { Tag } from "@glimmer/reference";
import { Simple } from "@glimmer/interfaces";

export interface ConstructorOptions {
  env: Environment;
}

export class ComponentStateBucket {
  public name: string;
  public component: Component;
  public args: CapturedArguments;

  constructor(definition: ComponentDefinition, args: CapturedArguments, owner: Owner) {
    let componentFactory = definition.componentFactory;
    let name = definition.name;

    this.args = args;

    let injections = {
      debugName: name,
      args: this.namedArgsSnapshot()
    };

    setOwner(injections, owner);
    this.component = componentFactory.create(injections);
  }

  get tag(): Tag {
    return this.args.tag;
  }

  namedArgsSnapshot(): Readonly<Dict<Opaque>> {
    return Object.freeze(this.args.named.value());
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
    builder.wrapLayout(this.template);
  }
}

export default class CustomElementComponentManager extends ComponentManager {
  layoutFor(definition: ComponentDefinition, bucket: ComponentStateBucket, env: Environment): CompiledDynamicProgram {
    let template = definition.template;

    return compileLayout(new LayoutCompiler(definition.name, template), this.env);
  }

  didRenderLayout(bucket: ComponentStateBucket, bounds: Bounds) {
    bucket.component.element = (bounds.parentElement() as any as ShadowRoot).host as Simple.Element;
  }

  didCreate(bucket: ComponentStateBucket) {
    (bucket.component.element as any)['component'] = bucket.component;
    bucket.component.didAppendLayout();
  }
}
