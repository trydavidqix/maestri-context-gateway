import fs from 'fs';
import vm from 'vm';

// get the module content
const m = await import('./src/dashboard-ui.mjs');
const html = m.dashboardHtml;
const scriptMatch = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)?.[1];

const elements = new Map();
const mockDoc = {
  title: '',
  getElementById: (id) => {
    if (!elements.has(id)) {
      elements.set(id, {
        innerHTML: '',
        textContent: '',
        setAttribute: () => {},
        classList: { add: () => {}, remove: () => {}, toggle: () => {} },
        dataset: {},
        addEventListener: () => {},
        focus: () => {},
        parentElement: { classList: { toggle: () => {} } }
      });
    }
    return elements.get(id);
  },
  querySelectorAll: () => [],
  querySelector: () => ({ content: '' }),
  documentElement: { dataset: {}, style: {} }
};

const mockContext = vm.createContext({
  document: mockDoc,
  window: {
    scrollTo: () => {},
    matchMedia: () => ({ matches: false, addEventListener: () => {} }),
    addEventListener: () => {}
  },
  history: { pushState: () => {} },
  location: { pathname: '/', search: '' },
  localStorage: { getItem: () => null, setItem: () => {} },
  fetch: async () => ({ ok: true, json: async () => ({ views: {} }) }),
  EventSource: class { addEventListener() {} close() {} },
  Intl,
  URLSearchParams,
  console,
  setInterval: () => {},
  clearInterval: () => {}
});

try {
  vm.runInContext(scriptMatch, mockContext);
  vm.runInContext('selectView("Tasks").catch(console.error)', mockContext);
  setTimeout(() => {
    console.log("Title after view change:", mockContext.document.title);
  }, 100);
} catch(e) {
  console.error(e);
}
