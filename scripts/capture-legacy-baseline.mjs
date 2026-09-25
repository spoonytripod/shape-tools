import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

class Element {
  constructor() {
    this.children = [];
    this.listeners = new Map();
    this.style = { setProperty() {} };
    this.classList = { add() {}, remove() {}, toggle() {} };
    this.value = '';
    this._innerHTML = '';
  }

  set innerHTML(value) {
    this._innerHTML = value;
    this.children = [];
  }

  get innerHTML() { return this._innerHTML; }
  appendChild(child) { this.children.push(child); return child; }
  addEventListener(type, handler) { this.listeners.set(type, handler); }
  dispatch(type) {
    this.listeners.get(type)?.({ target: this });
    while (frames.length) frames.shift()();
  }
}

const frames = [];
const elements = new Map();
const getElementById = (id) => {
  if (!elements.has(id)) elements.set(id, new Element());
  return elements.get(id);
};
const document = {
  getElementById,
  querySelectorAll: () => [],
  createElement: () => new Element(),
  createTextNode: (text) => ({ textContent: text }),
};

const html = readFileSync('index.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error('Legacy script not found');
vm.runInNewContext(script, {
  document,
  location: { hash: '' },
  requestAnimationFrame: (callback) => { frames.push(callback); return frames.length; },
}, { filename: 'legacy-index.js' });

const tools = [
  { id: 'pyramid', prefix: 'pyr', sliders: [['layersSlider', 2, 8], ['gapSlider', 5, 20]] },
  { id: 'stairs', prefix: 'str', sliders: [['stepsSlider', 2, 8], ['heightSlider', 20, 120]] },
  { id: 'circular-arrows', prefix: 'arr', sliders: [['arrowsSlider', 1, 5], ['thicknessSlider', 14, 140], ['gapSlider', 0, 30], ['headSlider', 1, 40]] },
];
const results = {};
for (const tool of tools) {
  const svg = () => getElementById(`${tool.prefix}-svgContainer`).innerHTML;
  results[tool.id] = { default: svg(), ratios: [], extremes: [] };
  for (let ratio = 0; ratio < 5; ratio++) {
    const select = getElementById(`${tool.prefix}-ratioSelect`);
    select.value = String(ratio);
    select.dispatch('change');
    results[tool.id].ratios.push(svg());
  }
  const select = getElementById(`${tool.prefix}-ratioSelect`);
  select.value = '0';
  select.dispatch('change');
  for (const [suffix, min, max] of tool.sliders) {
    const slider = getElementById(`${tool.prefix}-${suffix}`);
    slider.value = String(min);
    slider.dispatch('input');
    results[tool.id].extremes.push({ control: suffix, value: min, svg: svg() });
    slider.value = String(max);
    slider.dispatch('input');
    results[tool.id].extremes.push({ control: suffix, value: max, svg: svg() });
  }
  if (tool.id === 'circular-arrows') {
    getElementById('arr-dirCcw').dispatch('click');
    results[tool.id].counterClockwise = svg();
  }
}
writeFileSync('tests/fixtures/legacy-svg.json', JSON.stringify(results, null, 2) + '\n');
