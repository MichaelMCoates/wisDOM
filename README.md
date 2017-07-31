# wisDOM

wisDOM is a lightweight JavaScript library that simplifies DOM traversal, DOM manipulation, event handling, and HTTP requests. It is inspired by jQuery, but redesigned to be more user-friendly, semantic, and readable. wisDOM allows users to:
* Select individual DOM elements or groups of DOM elements
* Access children and parents of DOM elements
* Create, edit, and delete DOM elements
* Store and fire off functions once the DOM is fully loaded
* Fire off HTTP requests

## Installing

To use wisDOM, simply download this library, copy it into your project, and import the `wisDOM.js` file using a script tag in the head of your root html file. Make sure it points to the correct path!


```html
<head>
  <script type="text/javascript" src="wisDOM.js"></script>
</head>
```

## API Documentation

[The Core Function: `$wis`](#the-core-function-wis)  

[Traversing the DOM](#traversing-the-dom)  
  * [`findDescendants`](#finddescendants)  
  * [`findChildren`](#findchildren)  
  * [`findParent`](#findparent)

[Manipulating the DOM](#manipulating-the-dom)  
[Attribute/HTML/Class Setters and Getters](#attributehtmlclass-setters-and-getters)  
  * [`getFirstInnerHTML`](#getfirstinnerhtml)  
  * [`deleteInnerHTML`](#deleteinnerhtml)  
  * [`setInnerHTML`](#setinnerhtml)  
  * [`getFirstAttr`](#getfirstattr)  
  * [`addAttr`](#addattr)  
  * [`removeAttr`](#removeattr)  
  * [`addAttrs`](#addattrs)  
  * [`addClass`](#addclass)  
  * [`removeClass`](#removeclass)  
[Full DOM Manipulators](#full-dom-manipulators)  
  * [`appendHTML`](#appendhtml)  
  * [`appendString`](#appendstring)  
  * [`appendNodes`](#appendnodes)  
  * [`removeFromDOM`](#removefromdom)  

[Adding and Removing Event Listeners](#adding-and-removing-event-listeners)  
  * [`on`](#on)  
  * [`keydown`](#keydown)  
  * [`off`](#off)  

[Making AJAX Requests: `$wis.ajax`](#making-ajax-requests-wisajax)  

[Helper Functions](#helper)  
* [`each`](#each)  
* [`first`](#first)  
* [`$wis.extend`](#wisextend)  


## The Core Function: $wis

Users of the wisDOM library will always begin with the core function: `$wis`. The `$wis` function is set as a global variable, so it can be called from anywhere in the project. It can be used in a variety of ways, depending on the input it is given:

#### 1. DOM Selection
Most users of wisDOM will start by selecting an element or elements from the DOM with CSS selectors. Users can select by element type, class name, or id, by passing a string to the `$wis` function. This returns a `DOMNodeCollection` object, which contains an array of `HTMLElement`s selected from the DOM. A `DOMNodeCollection` has access to a number of useful methods, which will be described later.

```javascript
// Element Type
var $wisInputTypeElements = $wis("input");

// Class Name
var $wisNavBarClassElements = $wis(".nav-bar");

// ID
var $wisMainIDElements = $wis("#main");
```

#### 2. DOMNodeCollection Creation
A user can also pass an `HTMLElement` to the `$wis` function. wisDOM will take the `HTMLElement`, and create a `DOMNodeCollection` object with it, which gives those elements access to `DOMNodeCollection` functions.

```javascript
var newDiv = document.createElement("div");
var wisWrappedNewDiv = $wis(newDiv);
```

#### 3. Function Queueing
A user can also pass a function to the `$wis` function. If the document hasn't loaded yet, it will store that function in a queue to be executed once the document has fully loaded. This is typically used to wrap other `$wis` functions, to ensure that they have DOM elements to act upon.

```javascript
$wis(function() {
  alert("The Document is Loaded!");
  var $wisSelection = $wis(".selectorToRunAfterDocumentIsLoaded");
});
```


## Traversing the DOM

When a user makes a selection with `$wis`, that function returns a `DOMNodeCollection`. They can now use the following functions to traverse the DOM from that selection. These functions are typically used to set up DOM manipulations.

#### `findDescendants`

Accepts a selector as an argument. Returns a `DOMNodeCollection` object that contains all of the descendant elements of every `HTMLElement` in the original `DOMNodeCollection` that match the selector passed in. Equivalent to jQuery's `find('selector')` function.

```javascript
$wisSelection.findDescendants('.active');
// Returns all of the descendants of the $wisSelection DOMNodeCollection object with the class 'active'.
```

#### `findChildren`

Returns a `DOMNodeCollection` object that contains all of the direct children elements of every `HTMLElement` in the original `DOMNodeCollection`. Equivalent to jQuery's `children()` function. Does not return descendants.

```javascript
$wisSelection.findChildren();
// Returns all of the direct children of the $wisSelection DOMNodeCollection object.
```

#### `findParent`

Returns a `DOMNodeCollection` object that contains all of the direct parents of every `HTMLElement` in the original `DOMNodeCollection`. Equivalent to jQuery's `parent()` function. Does not return further ancestors.

```javascript
$wisSelection.findParent();
// Returns all of the direct parents of the $wisSelection DOMNodeCollection object.
```


## Manipulating the DOM

When a user makes a selection with `$wis`, or passes an `HTMLElement` to `$wis`, that function returns a `DOMNodeCollection`. The user can now use the following functions to manipulate the DOM from that object.

### Attribute/HTML/Class Setters and Getters

#### `getFirstInnerHTML`

Returns the `innerHTML` of the first element in the `DOMNodeCollection`. Equivalent to jQuery's `html()` function.

#### `deleteInnerHTML`

Deletes the `innerHTML` of each element in the `DOMNodeCollection`. Equivalent to jQuery's `html('')` function.

#### `setInnerHTML`

Takes a string argument. Sets the `innerHTML` of each element in the `DOMNodeCollection` to the string argument. Equivalent to jQuery's `html('string')` function.

```javascript
$wisSelection.setInnerHTML('Bananas');
// Changes the innerHTML of all elements in the $wisSelection DOMNodeCollection to the string 'Bananas'.
```

#### `getFirstAttr`

Takes an attribute argument in the form of a string. Returns the value of that attribute for the first element in the `DOMNodeCollection`. Equivalent to jQuery's `attr('attribute')` function.

```javascript
$wisSelection.getFirstAttr('color');
// Returns the value of the 'color' attribute for the first element in the $wisSelection DOMNodeCollection.
```

#### `addAttr`

Takes an attribute argument and a value argument in the form of strings. Adds the attribute, and the value provided, to all elements in the `DOMNodeCollection`. Equivalent to jQuery's `attr('attribute', 'value')` function.

```javascript
$wisSelection.addAttr('color', 'blue');
// Adds the 'color' attribute with the value of 'blue' to each element in the $wisSelection DOMNodeCollection.
```

#### `removeAttr`

Takes an attribute argument in the form of a string. Removes that attribute from all elements in the `DOMNodeCollection`. Equivalent to jQuery's `attr('attribute', null)` function.

```javascript
$wisSelection.removeAttr('color');
// Removes the 'color' attribute from all elements in the $wisSelection DOMNodeCollection.
```

#### `addAttrs`

Takes multiple attributes and values, in the form of an object, with attributes as keys and values as their corresponding values values. Adds the attributes, and the values provided, to all elements in the `DOMNodeCollection`. Equivalent to jQuery's `attr(attributeObject)` function.

```javascript
var attributeObject = {
  'color': 'blue',
  'active': true,
}

$wisSelection.addAttrs(attributeObject);
// Adds the 'color' attribute with the value of 'blue', and the 'active' attribute with the value of true, to each element in the $wisSelection DOMNodeCollection.
```

#### `addClass`

Takes a class argument in the form of a string. Adds the class to all elements in the `DOMNodeCollection`.

```javascript
$wisSelection.addClass('active');
// Adds the 'active' class to each element in the $wisSelection DOMNodeCollection.
```

#### `removeClass`

Takes a class argument in the form of a string. Removes the class from all elements in the `DOMNodeCollection`.


```javascript
$wisSelection.removeClass('active');
// Removes the 'active' class from all elements in the $wisSelection DOMNodeCollection.
```

### Full DOM Manipulators

#### `appendHTML`

Takes an `HTMLElement` as an argument. Appends the `HTMLElement` argument to each element in the `DOMNodeCollection`. Equivalent to jQuery's `append(HTMLElement)` function.

```javascript
var newDiv = document.createElement("div");
$wisSelection.appendHTML(newDiv);
// Appends the newDiv HTMLElement to all elements in the $wisSelection DOMNodeCollection.
```
#### `appendString`

Takes a string as an argument. Appends the string argument to each element in the `DOMNodeCollection`. Equivalent to jQuery's `append('string')` function.

```javascript
$wisSelection.appendString('String To Append');
// Appends the 'String To Append' to all elements in the $wisSelection DOMNodeCollection.
```

#### `appendNodes`

Takes a `DOMNodeCollection` as an argument. Appends the `DOMNodeCollection` argument to each element in the original `DOMNodeCollection` that `appendNodes` is called on.

```javascript
$wisSelection.appendNodes($otherWisSelection);
// Appends the $otherWisSelection DOMNodeCollection to all elements in the $wisSelection DOMNodeCollection.
```

#### `removeFromDOM`

Removes each element in the `DOMNodeCollection` from the DOM completely. Equivalent to jQuery's `remove()` function.


## Adding and Removing Event Listeners

When a user makes a selection with `$wis`, or passes an `HTMLElement` to `$wis`, that function returns a `DOMNodeCollection`. The user can now use the following functions add and remove event listeners from the elements contained within the `DOMNodeCollection`.


#### `on`

Takes an event, as a string argument, and a callback, as a function argument. Adds an event listener for the event given to each element in the `DOMNodeCollection`. Calls the callback given when the event occurs with any of the elements in the `DOMNodeCollection`.

```javascript
$wisSelection.on("click", function() {
  alert("The element has been clicked!");
});
// Adds a "click" event listener to each element in the $otherWisSelection DOMNodeCollection. Fires the function when any of the elements has been clicked.
```

#### `keydown`

Takes a callback, in the form of a function argument. Adds a `keydown` event listener to each element in the `DOMNodeCollection`. Calls the callback given when the a key is pressed with any of the elements in the `DOMNodeCollection`.


#### `off`

Takes an event in the form of a string argument. Removes the event listener for that event from each element in the `DOMNodeCollection`.


## Making AJAX Requests: `$wis.ajax`

Performs an asynchronous HTTP request. Returns a `Promise` object for easy function chaining. Takes an object as an argument with the following attributes as keys:
* `method`: The HTTP method to use for the request. Takes a string argument. Defaults to `'GET'` if not specified.
* `url`: The URL to which the request is sent. Takes a string argument. Required.
* `data`: Data to be sent to the server. Takes an object. Optional.
* `contentType`: Content Type of the HTTP request. Takes a string. Defaults to `'application/x-www-form-urlencoded; charset=UTF-8'` if not specified.
* `success`: The callback called if the request succeeds. Takes a function. Optional.
* `error`: The callback called if the request fails. Takes a function. Optional.

```javascript
$wis.ajax({
  method: "POST",
  url: "/comments",
  data: {
    comment: {
      user: 1,
      body: "Comment Body"
    }
  },
  success(response) {
    console.log(response);
  },
  error(response) {
    console.log(response);
  }
});
```


## Helper Functions

The following are helper functions that wisDOM provides

#### `each`

Takes a callback in the form of a function argument. Calls the callback function for each element in the `DomNodeCollection`.

#### `first`

Returns the first element in the array of `HTMLElements` contained by the `DOMNodeCollection`

#### `$wis.extend`

Takes multiple objects as individual arguments. Merges all key-value pairs from all latter objects into the first object.

```javascript
var object1 = {
  'color': 'blue',
  'active': 'false',
  'text': 'Gibberish',
  'body': 'More stuff'
};

var object2 = {
  'body': 'Object 2 Body',
  'color': 'Object 2 Color'
};

var object3 = {
  'color': 'Object 3 Color'
};


$wis.extend(object1, object2, object3);
// Merges the key-value pairs of object2 and object3 into object1 and returns object1. This function would return the following object:
// { 'color': 'Object 3 Color',
// 'active': 'false',
// 'text': 'Gibberish',
// 'body': 'Object 2 Body' }
```
