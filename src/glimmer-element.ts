import Application from '@glimmer/application';

function glimmerElementFactory(app: Application, componentName: string, attributes: string[]) {
  function GlimmerElement() {
    return Reflect.construct(HTMLElement, [], GlimmerElement);
  }

  GlimmerElement.observedAttributes = attributes;
  GlimmerElement.prototype = Object.create(HTMLElement.prototype, {
    constructor: { value: GlimmerElement },
    connectedCallback: {
      value: function connectedCallback(): void {
        let shadowRoot = this.attachShadow({ mode: 'open' });
        app.renderComponent(componentName, shadowRoot, { injections: { customElementAttributes: { color: this.attributes.color.value } } });
      }
    },

    attributeChangedCallback: {
      value: function attributeChangedCallback(attr, oldValue, newValue) {
        if (!this.component) return;
        this.component.customElementAttributes = Object.assign({}, this.component.customElementAttributes, { [attr]: newValue });
      }   
    }   
  });

  return GlimmerElement;
}

export default glimmerElementFactory;
