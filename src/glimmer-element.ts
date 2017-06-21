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
        app.renderComponent(componentName, shadowRoot);
      }
    },

    // Respond to attribute changes.
    attributeChangedCallback: {
      value: function attributeChangedCallback(attr, oldValue, newValue) {
        console.log('text changed!');
        if (attr == 'text') {
          console.log('text changed!');
        }
      }   
    }   
  });

  return GlimmerElement;
}

export default glimmerElementFactory;
