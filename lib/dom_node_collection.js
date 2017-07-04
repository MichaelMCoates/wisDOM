class DomNodeCollection {
  constructor(htmlElementArray) {
    this.htmlElementArray = htmlElementArray;
  }

  each(callback) {
    this.htmlElementArray.forEach(callback);
  }

  html(arg) {
    if (typeof(arg) === "string") {
      this.each( (node) => { node.innerHTML = arg; });
    } else {
      return this.htmlElementArray[0].innerHTML;
    }
  }

  empty() {
    this.html('');
  }

  append(arg) {
    if (arg instanceof HTMLElement) {
      arg = $l(arg);
    }

    if (typeof(arg) === "string") {
      this.each( (node) => { node.innerHTML += arg; });
    } else if (arg instanceof DomNodeCollection) {
      this.each( (node) => {
        arg.each( (argNode) => {
          node.appendChild(argNode.cloneNode(true));
        });
      });
    }
  }

  attr(attribute, value) {
    if (typeof(value) === "string") {
      this.each( (node) => { node.setAttribute(attribute, value); });
    } else if (value === null) {
      // if the value passed in is null, remove the attribute (like removeAttr)
      this.each( (node) => { node.removeAttribute(attribute); });
    } else if ((!!attribute) && (attribute.constructor === Object)) {
      // If the argument passed in is a POJO, set the keys and values as objects
      for (let key in attribute) {
        if (attribute.hasOwnProperty(key)) {
          // Makes sure you don't use inherited properties
          this.attr(key, attribute[key]);
        }
      }
    } else if (value === undefined) {
      return this.htmlElementArray[0].getAttribute(attribute);
    }
  }

  removeAttr(attribute) {
    this.attr(attribute, null);
  }

  addClass(className) {
    this.each( (node) => { node.classList.add(className); });
  }

  removeClass(className) {
    this.each( (node) => { node.classList.remove(className); });
  }

  children() {
    let childArray = [];

    this.each( (node) => {
      let nodeChildren = node.children;
      childArray = childArray.concat(Array.from(nodeChildren));
    });

    return new DomNodeCollection(childArray);
  }

  parent() {
    const parentArray = [];

    this.each( (node) => {
      let nodeParent = node.parentNode;

      if (!nodeParent.pushed) {
        nodeParent.pushed = true;
        parentArray.push(nodeParent);
      }
    });

    parentArray.forEach( (nodeParent) => { nodeParent.pushed = false; });
    return new DomNodeCollection(parentArray);
  }

  find(selector) {
    let descendants = [];

    this.each( (node) => {
      let nodeDescendants = node.querySelectorAll(selector);
      descendants = descendants.concat(Array.from(nodeDescendants));
    });

    return new DomNodeCollection(descendants);
  }


  remove() {
    this.each( (node) => { node.parentNode.removeChild(node); });
    this.htmlElementArray = [];
  }

  on(eventType, callback) {
    const eventStore = `wisDOM-eventStore-${eventType}`;

    this.each( (node) => {
      node.addEventListener(eventType, callback);

      if (node[eventStore] === "undefined") {
        node[eventStore] = [];
      }

      node[eventStore].push(callback);
    });
  }

  off(eventType) {
    const eventStore = `wisDOM-eventStore-${eventType}`;
    this.each( (node) => {
      if (node[eventStore]) {
        node[eventStore].forEach( (callback) => {
          node.removeEventListener(eventType, callback);
        });

        node[eventStore] = [];
      }
    });
  }
}




module.exports = DomNodeCollection;
