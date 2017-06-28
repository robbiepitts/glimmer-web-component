import Application from '@glimmer/application';
import { Simple } from '@glimmer/runtime';
import { Dict } from '@glimmer/util';

function glimmerElementFactory(app: Application, componentName: string, htmlAttributes: string[]) {
  function GlimmerElement() {
    return Reflect.construct(HTMLElement, [], GlimmerElement);
  }

  GlimmerElement.observedAttributes = htmlAttributes;
  GlimmerElement.prototype = Object.create(HTMLElement.prototype, {
    constructor: { value: GlimmerElement },
    connectedCallback: {
      value: function connectedCallback(): void {
        let shadowRoot = this.attachShadow({ mode: 'open' });
        let attributesWithValues = htmlAttributes.reduceRight((memo, current): Dict<string> => {
          return Object.assign({}, memo, { [current]: this.attributes[current].value });
        }, <Dict<string>>{});

        app.renderComponent(componentName, shadowRoot, {
          args: { htmlAttributes: attributesWithValues }
        });
      }
    },

    attributeChangedCallback: {
      value: function attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
        if (!this.component) return;
        let htmlAttributes = Object.assign({}, this.component.args.htmlAttributes, { [attr]: newValue })
        this.component.args = { htmlAttributes };
      }   
    }   
  });

  return GlimmerElement;
}

export default glimmerElementFactory;
