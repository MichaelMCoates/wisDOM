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
      arg = $wis(arg);
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
