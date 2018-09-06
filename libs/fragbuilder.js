define([
], function () {

  function FragBuilder(jsonObj) {
    this.el =  this.generateFragment(jsonObj)
  }

  FragBuilder.prototype.applyStyles = function (element, style_object) {
    for (var prop in style_object) {
      element.style[prop] = style_object[prop];
    }
  };

  FragBuilder.prototype.generateFragment = function (obj) {
    var tree = document.createDocumentFragment();
    var thiss = this;
    for (var part in obj) {
      var el = document.createElement(part);
      if ('children' in obj[part]) {
        el.appendChild(thiss.generateFragment(obj[part].children));
        delete obj[part].children;
      }
      if ('style' in obj[part]) {
        thiss.applyStyles(el, obj[part].style);
        delete obj[part].style;
      }
      if ('text' in obj[part]) {
        el.appendChild(document.createTextNode(obj[part].text));
        delete obj[part].text;
      }
      for (var attr in obj[part]) {
        el.setAttribute(attr, obj[part][attr]);
      }
      tree.appendChild(el);
    }
    return tree;
  }

  return FragBuilder;

});