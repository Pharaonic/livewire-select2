/*! pharaonic/livewire-select2 | MIT License */

// resources/js/functions.js
var FUNCTION_OPTIONS = Object.freeze([
  "templateResult",
  "templateSelection",
  "matcher",
  "sorter",
  "escapeMarkup",
  "createTag",
  "insertTag",
  "tokenizer",
  "ajax.data",
  "ajax.processResults",
  "ajax.transport"
]);
var NAME = /^[A-Za-z0-9][A-Za-z0-9.:_-]*$/;
function select2Error(code, message) {
  return Object.assign(new Error(message), { code });
}
function createFunctions() {
  const functions = /* @__PURE__ */ new Map();
  const listeners = /* @__PURE__ */ new Set();
  return {
    define(name, callback) {
      const key = typeof name === "string" ? name.trim() : "";
      if (!NAME.test(key)) {
        throw select2Error("invalid-function", 'A Select2 function name starts with a letter or digit and continues with letters, digits, ".", ":", "_" or "-".');
      }
      if (typeof callback !== "function") {
        throw select2Error("invalid-function", `The Select2 function "${key}" must be a function.`);
      }
      const current = functions.get(key);
      if (current === callback) {
        return;
      }
      if (current !== void 0) {
        throw select2Error("function-conflict", `The Select2 function "${key}" is already defined.`);
      }
      functions.set(key, callback);
      listeners.forEach((listener) => listener(key));
    },
    get: (name) => functions.get(name),
    onDefine(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}

// resources/js/legacy.js
function installLegacy(win, namespace, withAssistant) {
  const scan = (root) => withAssistant((assistant) => assistant.scan(root));
  namespace.Select2 = Object.freeze({
    init: () => scan(win.document),
    load: (element) => {
      const target = element && element.jquery ? element[0] : element;
      scan(target || win.document);
    }
  });
  win.addEventListener("pharaonic.select2.init", () => scan(win.document));
  win.addEventListener("pharaonic.select2.load", (event) => namespace.Select2.load(event.detail && event.detail.target));
}

// resources/js/model.js
function readModel(element) {
  for (const attribute of Array.from(element.attributes)) {
    if (attribute.name !== "wire:model" && !attribute.name.startsWith("wire:model.")) {
      continue;
    }
    const property = attribute.value.trim();
    if (property === "") {
      return null;
    }
    return { property, modifiers: attribute.name.split(".").slice(1) };
  }
  return null;
}

// resources/js/livewire.js
function modelBinding(element) {
  const model = readModel(element);
  return model === null ? null : { property: model.property, live: !model.modifiers.includes("defer") };
}

// resources/js/options.js
var enabled = (value) => value.toLowerCase() !== "false";
var DIALOG = '.modal, dialog, [role="dialog"]';
var NEAREST_DIALOG = /* @__PURE__ */ Symbol("nearest dialog");
var SHORTHANDS = {
  "data-tags": (options, value) => {
    options.tags = enabled(value);
  },
  "data-clear": (options, value) => {
    options.allowClear = enabled(value);
  },
  "data-search-off": (options, value) => {
    if (enabled(value)) {
      options.minimumResultsForSearch = -1;
    }
  },
  "data-parent": (options, value) => {
    if (value === "") {
      options.dropdownParent = NEAREST_DIALOG;
    } else if (enabled(value)) {
      options.dropdownParent = value;
    }
  },
  "data-template": (options, value) => {
    if (value !== "") {
      options.templateResult = value;
      options.templateSelection = value;
    }
  }
};
function withImage(state) {
  const element = state.element;
  const source = element && typeof element.getAttribute === "function" ? element.getAttribute("data-image") : null;
  if (!source) {
    return state.text;
  }
  const document = element.ownerDocument;
  const wrapper = document.createElement("span");
  const image = document.createElement("img");
  image.src = source;
  image.alt = "";
  image.className = "pharaonic-select2-image";
  Object.assign(image.style, { height: "1.25em", verticalAlign: "middle", marginInlineEnd: "0.4em" });
  wrapper.append(image, document.createTextNode(state.text));
  return wrapper;
}
var copy = (value) => value === void 0 ? {} : JSON.parse(JSON.stringify(value));
function walk(options, path) {
  const keys = path.split(".");
  const last = keys.pop();
  const parent = keys.reduce((carry, key) => carry !== null && typeof carry === "object" ? carry[key] : void 0, options);
  return parent !== null && typeof parent === "object" ? { parent, key: last } : null;
}
function buildOptions({ element, options, functions, jQuery }) {
  const result = {};
  for (const [attribute, apply] of Object.entries(SHORTHANDS)) {
    if (element.hasAttribute(attribute)) {
      apply(result, element.getAttribute(attribute).trim());
    }
  }
  Object.assign(result, copy(options));
  const missing = [];
  for (const path of FUNCTION_OPTIONS) {
    const slot = walk(result, path);
    if (slot === null || typeof slot.parent[slot.key] !== "string") {
      continue;
    }
    const name = slot.parent[slot.key].trim();
    const callback = functions.get(name);
    if (callback === void 0) {
      missing.push(name);
    } else {
      slot.parent[slot.key] = callback;
    }
  }
  if (result.dropdownParent === NEAREST_DIALOG) {
    const dialog = element.closest(DIALOG);
    if (dialog !== null) {
      result.dropdownParent = jQuery(dialog);
    } else {
      delete result.dropdownParent;
    }
  } else if (typeof result.dropdownParent === "string") {
    const parent = result.dropdownParent.trim() === "" ? jQuery() : jQuery(result.dropdownParent);
    if (parent.length > 0) {
      result.dropdownParent = parent.first();
    } else {
      delete result.dropdownParent;
    }
  }
  for (const key of ["templateResult", "templateSelection"]) {
    if (result[key] === void 0) {
      result[key] = withImage;
    }
  }
  if (result.allowClear && (result.placeholder === void 0 || result.placeholder === null)) {
    result.placeholder = "";
  }
  return { options: result, missing: [...new Set(missing)] };
}
function withoutShorthandOverrides(element, callback) {
  const hidden = [];
  if (element.hasAttribute("data-tags")) {
    hidden.push(["data-tags", element.getAttribute("data-tags")]);
    element.removeAttribute("data-tags");
  }
  try {
    return callback();
  } finally {
    hidden.forEach(([name, value]) => element.setAttribute(name, value));
  }
}

// resources/js/select2.js
var NAMESPACE = ".pharaonicSelect2";
function toWidget(value, multiple) {
  if (multiple) {
    return Array.isArray(value) ? value.map(String) : value === null || value === void 0 || value === "" ? [] : [String(value)];
  }
  return value === null || value === void 0 ? "" : String(value);
}
var same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
var hasWireChange = (element) => Array.from(element.attributes).some((attribute) => attribute.name === "wire:change" || attribute.name.startsWith("wire:change."));
var hasSelect2 = (jQuery) => typeof jQuery === "function" && typeof jQuery.fn === "object" && typeof jQuery.fn.select2 === "function";
function createSelect2({ window: window2, functions, modelBinding: modelBinding2, assistant }) {
  const records = /* @__PURE__ */ new WeakMap();
  const waiting = /* @__PURE__ */ new Map();
  const warned = /* @__PURE__ */ new Set();
  const remount = (elements) => {
    const runtime = assistant();
    elements.forEach((element) => {
      runtime.destroy(element);
      runtime.scan(element);
    });
  };
  const wait = (element, names) => {
    names.forEach((name) => {
      if (!waiting.has(name)) {
        waiting.set(name, /* @__PURE__ */ new Set());
      }
      waiting.get(name).add(element);
    });
    return () => names.forEach((name) => {
      var _a;
      return (_a = waiting.get(name)) == null ? void 0 : _a.delete(element);
    });
  };
  const release = (name) => {
    const elements = waiting.get(name);
    waiting.delete(name);
    if (elements && elements.size > 0) {
      remount([...elements]);
    }
  };
  functions.onDefine((name) => release(`function:${name}`));
  const loaded = () => window2.document.readyState === "complete";
  if (!loaded()) {
    window2.addEventListener("load", () => release("select2"), { once: true });
  }
  function create(element, options) {
    const jQuery = window2.jQuery;
    const $element = jQuery(element);
    withoutShorthandOverrides(element, () => $element.select2(options));
    const instance = $element.data("select2");
    if (element.closest("[wire\\:ignore]") === null && instance && instance._observer) {
      instance._observer.disconnect();
    }
    return { $element, instance };
  }
  function isIntact(widget) {
    const element = widget.$element[0];
    const container = widget.instance && widget.instance.$container ? widget.instance.$container[0] : null;
    return container !== null && container.isConnected && element.classList.contains("select2-hidden-accessible");
  }
  function teardown(widget) {
    if (widget.instance && widget.instance.$element) {
      widget.instance.destroy();
    }
  }
  function mount(context) {
    const { element, property, component } = context;
    if (!hasSelect2(window2.jQuery)) {
      if (!loaded()) {
        return wait(element, ["select2"]);
      }
      throw select2Error("select2-missing", "Select2 needs jQuery with the Select2 plugin on window.jQuery. Load both before the page finishes loading.");
    }
    const { options, missing } = buildOptions({ element, options: context.options, functions, jQuery: window2.jQuery });
    if (missing.length > 0) {
      missing.filter((name) => !warned.has(name)).forEach((name) => {
        warned.add(name);
        window2.console.warn(`Select2 function "${name}" is not defined yet. Its elements mount once Pharaonic.select2.define("${name}", ...) is called.`);
      });
      return wait(element, missing.map((name) => `function:${name}`));
    }
    const multiple = element.multiple;
    const tags = Boolean(options.tags);
    const binding = property !== null ? { property, live: true } : modelBinding2(element);
    let widget = create(element, options);
    const addMissing = (values) => {
      const present = new Set(Array.from(element.options, (option) => option.value));
      (Array.isArray(values) ? values : [values]).filter((value) => value !== "" && !present.has(value)).forEach((value) => {
        element.appendChild(new window2.Option(value, value, false, false));
      });
    };
    const apply = (value) => {
      const next = toWidget(value, multiple);
      if (tags) {
        addMissing(next);
      }
      widget.$element.val(next).trigger("change.select2");
    };
    const sync = () => {
      if (binding !== null) {
        apply(component.get(binding.property));
      }
    };
    const write = () => {
      const value = toWidget(widget.$element.val(), multiple);
      if (same(value, toWidget(component.get(binding.property), multiple))) {
        return null;
      }
      return component.set(binding.property, value, { live: binding.live });
    };
    let notifying = false;
    const notify = () => {
      if (!hasWireChange(element)) {
        return;
      }
      notifying = true;
      try {
        element.dispatchEvent(new window2.Event("change", { bubbles: true }));
      } finally {
        notifying = false;
      }
    };
    widget.$element.on(`change${NAMESPACE}`, () => {
      if (notifying) {
        return;
      }
      const written = binding === null ? Promise.resolve() : write();
      if (written === null) {
        return;
      }
      const failed = (error) => window2.console.error(`Select2 could not update "${binding.property}".`, error);
      if (binding !== null && !binding.live) {
        written.catch(failed);
        notify();
      } else {
        written.then(notify, failed);
      }
    });
    if (binding !== null) {
      sync();
      component.watch(binding.property, apply);
    }
    records.set(element, {
      refresh() {
        if (!isIntact(widget)) {
          teardown(widget);
          widget = create(element, options);
        }
        sync();
      }
    });
    return () => {
      records.delete(element);
      widget.$element.off(NAMESPACE);
      teardown(widget);
    };
  }
  return {
    mount,
    // Livewire changed an element outside wire:ignore: rebuild what the morph removed.
    update({ element }) {
      const record = records.get(element);
      if (record) {
        record.refresh();
      }
    }
  };
}

// resources/js/index.js
function install(win) {
  var _a, _b;
  const namespace = (_a = win.Pharaonic) != null ? _a : win.Pharaonic = {};
  if (namespace.select2) {
    return namespace.select2;
  }
  const functions = createFunctions();
  let assistant = null;
  const pending = [];
  const withAssistant = (callback) => {
    if (assistant) {
      callback(assistant);
    } else {
      pending.push(callback);
    }
  };
  const integration = createSelect2({ window: win, functions, modelBinding, assistant: () => assistant });
  const api2 = Object.freeze({
    define: functions.define
  });
  namespace.select2 = api2;
  installLegacy(win, namespace, withAssistant);
  const registerSelect2 = (runtime) => {
    assistant = runtime;
    runtime.register("select2", integration);
    pending.splice(0).forEach((callback) => callback(runtime));
  };
  if (namespace.assistant) {
    registerSelect2(namespace.assistant);
  } else {
    ((_b = win.PharaonicAssistantQueue) != null ? _b : win.PharaonicAssistantQueue = []).push(registerSelect2);
  }
  return api2;
}
var api = install(window);
var define = (name, callback) => api.define(name, callback);
export {
  define
};
