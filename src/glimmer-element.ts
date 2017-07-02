import Application, { prepareNamedArgs } from '@glimmer/application';
import { Dict, EMPTY_ARRAY } from '@glimmer/util';

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
        let attributesWithValues = htmlAttributes.reduce((memo, current): Dict<string> => {
          return Object.assign({}, memo, { [current]: this.attributes[current].value });
        }, <Dict<string>>{});
        let args = this.args = {
          positional: EMPTY_ARRAY,
          named: prepareNamedArgs({ htmlAttributes: attributesWithValues })
        };

        this.result = app.renderComponent(componentName, shadowRoot, { args });
      }
    },

    attributeChangedCallback: {
      value: function attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;
        if (!this.args) return;

        let htmlAttributes = Object.assign({}, this.args.named.htmlAttributes.value(), { [attr]: newValue })

        this.args.named.htmlAttributes.set(htmlAttributes);
        this.result.update();
      }   
    }   
  });

  return GlimmerElement;
}

export default glimmerElementFactory;
