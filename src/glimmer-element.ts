import Application from '@glimmer/application';

function glimmerElementFactory(app: Application, componentName: string) {
  function GlimmerElement() {
    return Reflect.construct(HTMLElement, [], GlimmerElement);
  }

  GlimmerElement.prototype = Object.create(HTMLElement.prototype, {
    constructor: { value: GlimmerElement },
    connectedCallback: {
      value: function connectedCallback(): void {
        let shadowRoot = this.attachShadow({ mode: 'open' });
        app.renderComponent(componentName, shadowRoot);
      }
    }
  });

  return GlimmerElement;
}

export default glimmerElementFactory;
