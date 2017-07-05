const DomNodeCollection = require("./dom_node_collection.js");

const callbacks = [];
let docReady = false;

// Core function

window.$l = (arg) => {
  switch (typeof(arg)) {
    case "function":
      return processCallback(arg);
    case "string":
      return selectFromDocument(arg);
    case "object":
      return wrapHTMLElement(arg);
  }
};

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

// Merge

$l.extend = (firstObject, ...nextObjects) => {
  nextObjects.forEach( (object) => {
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        firstObject[key] = object[key];
      }
    }
  });

  return firstObject;
};

// AJAX request

$l.ajax = (options) => {
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

// AJAX helper

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

// DocumentReady

document.addEventListener('DOMContentLoaded', () => {
  docReady = true;
  callbacks.forEach( (callback) => { callback(); });
});
