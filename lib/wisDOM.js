/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DomNodeCollection = __webpack_require__(1);

const callbacks = [];
let docReady = false;

// Core function

window.$wis = (arg) => {
  switch (typeof(arg)) {
    case "function":
      return processCallback(arg);
    case "string":
      return selectFromDocument(arg);
    case "object":
      return wrapHTMLElement(arg);
  }
};

// Merge function

$wis.extend = (firstObject, ...nextObjects) => {
  nextObjects.forEach( (object) => {
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        firstObject[key] = object[key];
      }
    }
  });

  return firstObject;
};

// AJAX request function

$wis.ajax = (options) => {
  return new Promise( (resolve, reject) => {

    const xhr = new XMLHttpRequest();

    const ajaxDefaults = {
      method: 'GET',
      url: '',
      data: {},
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      success: () => {},
      error: () => {},
    };

    const newOptions = $l.extend(ajaxDefaults, options);
    newOptions.method = newOptions.method.toUpperCase();

    if (newOptions.method === 'GET') {
      newOptions.url = appendDataToURL(newOptions.url, newOptions.data);
    }

    xhr.open(newOptions.method, newOptions.url);

    xhr.onload = function() {
      if (xhr.status === 200) {
        newOptions.success(JSON.parse(xhr.response));
        resolve(JSON.parse(xhr.response));
      } else {
        newOptions.error(JSON.parse(xhr.response));
        reject(JSON.parse(xhr.response));
      }
    };

    xhr.onerror = function() {
      newOptions.error(JSON.parse(xhr.response));
      reject(JSON.parse(xhr.response));
    };

    xhr.send(JSON.stringify(newOptions.data));
  });
};

// DocumentReady Callback Dispatcher

document.addEventListener('DOMContentLoaded', () => {
  docReady = true;
  callbacks.forEach( (callback) => { callback(); });
});

// Core function helpers

processCallback = (callback) => {
  if (docReady) {
    callback();
  } else {
    callbacks.push(callback);
  }
};

function selectFromDocument(selector) {
  let nodesArray = Array.from(document.querySelectorAll(selector));
  return new DomNodeCollection(nodesArray);
}

function wrapHTMLElement(htmlEl) {
  if (htmlEl instanceof HTMLElement) {
    let htmlElementArray = [htmlEl];
    return new DomNodeCollection(htmlElementArray);
  }
}

// AJAX function helper

function appendDataToURL(url, data) {
  let queryString = "?";

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      queryString += key + "=" + data[key] + "&";
    }
  }

  queryString = queryString.substring(0, queryString.length - 1);
  return url + queryString;
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DomNodeCollection {
  constructor(htmlElementArray) {
    this.htmlElementArray = htmlElementArray;
  }

// Attribute Setters/Getters

  removeAttr(attribute) {
    this.attr(attribute, null);
  }

  addAttr(attribute, string) {
    this.attr(attribute, string);
  }

  addAttrs(attrObject) {
    this.attr(attrObject);
  }

  getFirstAttr(attribute) {
    this.attr(attribute);
  }

  deleteInnerHTML() {
    this.html('');
  }

  setInnerHTML(string) {
    this.html(string);
  }

  getFirstInnerHTML() {
    this.html();
  }

  addClass(className) {
    this.each((node) => { node.classList.add(className); });
  }

  removeClass(className) {
    this.each((node) => { node.classList.remove(className); });
  }

// DOM Manipulators

  appendHTML(htmlElement) {
    this.append(htmlElement);
  }

  appendString(string) {
    this.append(string);
  }

  appendNodes(domNodeCollection) {
    this.append(domNodeCollection);
  }

  removeFromDOM() {
    this.each((node) => { node.parentNode.removeChild(node); });
    this.htmlElementArray = [];
  }

// Finders/Traversers

  findDescendants(selector) {
    let descendants = [];

    this.each((node) => {
      let nodeDescendants = node.querySelectorAll(selector);
      descendants = descendants.concat(Array.from(nodeDescendants));
    });

    return new DomNodeCollection(descendants);
  }

  findChildren() {
    let childArray = [];

    this.each((node) => {
      let nodeChildren = node.children;
      childArray = childArray.concat(Array.from(nodeChildren));
    });

    return new DomNodeCollection(childArray);
  }

  findParent() {
    const parentArray = [];

    this.each((node) => {
      let nodeParent = node.parentNode;
      if (!nodeParent.pushed) {
        nodeParent.pushed = true;
        parentArray.push(nodeParent);
      }
    });

    parentArray.forEach((nodeParent) => { nodeParent.pushed = false; });
    return new DomNodeCollection(parentArray);
  }

// Event Listeners

  keydown(callback) {
    this.on('keydown', callback);
  }

  on(eventType, callback) {
    const eventStore = `wisDOM-eventStore-${eventType}`;

    this.each((node) => {
      node.addEventListener(eventType, callback);

      if (node[eventStore] === undefined) {
        node[eventStore] = [];
      }

      node[eventStore].push(callback);
    });
  }

  off(eventType) {
    const eventStore = `wisDOM-eventStore-${eventType}`;
    this.each((node) => {

      if (node[eventStore]) {
        node[eventStore].forEach((callback) => {
          node.removeEventListener(eventType, callback);
        });

        node[eventStore] = [];
      }
    });
  }


// HELPERS


// Attribute Helpers

  html(arg) {
    if (typeof(arg) === "string") {
      this.each((node) => { node.innerHTML = arg; });

    } else {
      return this.htmlElementArray[0].innerHTML;
    }
  }

  attr(attribute, value) {
    if (typeof(value) === "string") {
      this.each((node) => { node.setAttribute(attribute, value); });

    } else if (value === null) {
      // If the value passed in is null, this removes the attribute (like removeAttr)
      this.each((node) => { node.removeAttribute(attribute); });

    } else if ((!!attribute) && (attribute.constructor === Object)) {
      // If the argument passed in is a POJO, this sets the keys and values as objects
      for (let key in attribute) {
        if (attribute.hasOwnProperty(key)) {
          // This makes sure you don't use inherited properties
          this.attr(key, attribute[key]);
        }
      }

    } else if (value === undefined) {
      return this.htmlElementArray[0].getAttribute(attribute);
    }
  }

// DOM Manipulator Helpers

  append(arg) {
    if (arg instanceof HTMLElement) {
      arg = $l(arg);
    }

    if (typeof(arg) === "string") {
      this.each((node) => { node.innerHTML += arg; });

    } else if (arg instanceof DomNodeCollection) {
      this.each((node) => {
        arg.each((argNode) => {
          node.appendChild(argNode.cloneNode(true));
        });
      });
    }
  }

// DNC Helpers

  each(callback) {
    this.htmlElementArray.forEach(callback);
  }

  first() {
    return this.htmlElementArray[0];
  }
}

module.exports = DomNodeCollection;


/***/ })
/******/ ]);
//# sourceMappingURL=wisDOM.js.map