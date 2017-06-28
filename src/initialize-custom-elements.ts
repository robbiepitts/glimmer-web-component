import Application from '@glimmer/application';
import glimmerElementFactory from './glimmer-element';

export function initializeCustomElements(app: Application, customElementDefinitions: string[]): void {
  customElementDefinitions.forEach(name => {
    initializeCustomElement(app, name, name, []);
  });
}

export function initializeCustomElement(app: Application, componentName: string, elementName: string, attributes: string[]): void {
  window.customElements.define(elementName, glimmerElementFactory(app, componentName, attributes));
}
