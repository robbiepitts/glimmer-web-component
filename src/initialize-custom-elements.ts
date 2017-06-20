import Application from '@glimmer/application';
import glimmerElementFactory from './glimmer-element';

export function initializeCustomElements(app: Application, customElementDefinitions: string[]): void {
  customElementDefinitions.forEach(name => {
    initializeCustomElement(app, name);
  });
}

export function initializeCustomElement(app: Application, name: string): void {
  window.customElements.define(name, glimmerElementFactory(app, name));
}
