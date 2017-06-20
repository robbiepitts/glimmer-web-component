import Application from '@glimmer/application';
import { initializeCustomElements } from '../src/initialize-custom-elements';
import { Option } from "@glimmer/util";

const { module, test } = QUnit;

let containerElement: HTMLDivElement;
let renderPromise: Promise<void>;

module('initializeCustomElements', {
  before() {
    let app = setupApp();
    initializeCustomElements(app as Application, ['hello-world']);
  },

  beforeEach() {
    containerElement = document.createElement('div');
    document.body.appendChild(containerElement);
  },

  afterEach() {
    containerElement.remove();
    containerElement = null;
  }
});

test('renders glimmer component into custom element shadow dom', function(assert) {
  assert.expect(2);

  let customElement = document.createElement('hello-world');

  customElement.setAttribute('whatevs', 'lol');
  customElement.appendChild(document.createTextNode('Roberto'));
  containerElement.appendChild(customElement);

  assert.equal(customElement.outerHTML, '<hello-world whatevs="lol">Roberto</hello-world>');
  assert.equal(customElement.shadowRoot.innerHTML, 'Hello <slot></slot>!');
});

function setupApp(): object {
  return {
    renderComponent(name, parent): void {
      parent.innerHTML = 'Hello <slot></slot>!';
    }
  };
}
