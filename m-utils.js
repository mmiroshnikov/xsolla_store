
// 15 mar 2018 — добавлена функция m__scrollTo() используется в сайтбилдере






jQuery.expr.pseudos.attr = $.expr.createPseudo(function (arg) {
  var regexp = new RegExp(arg);
  return function(elem) {
    for(var i = 0; i < elem.attributes.length; i++) {
      var attr = elem.attributes[i];
      if(regexp.test(attr.name)) {
        return true;
      }
    }
    return false;
  };
});



jQuery.expr.pseudos.attrStrict = $.expr.createPseudo(function (arg) {
  var regexp = new RegExp();
  return function(elem) {
    for(var i = 0; i < elem.attributes.length; i++) {
      var attr = elem.attributes[i];
      if(arg === attr.name) {
        return true;
      }
    }
    return false;
  };
});






var ix = ix || Webflow.require('ix');

/* iX */

var ixShowOpacity = {'stepsA': [{'opacity': 0}, {'opacity': 1, 'transition': 'opacity 200ms ease 0ms'}], 'stepsB': []};
var ixHideOpacity = { 'stepsA': [{ 'opacity': 1 }, { 'opacity': 0, 'transition': 'opacity 200ms ease 0ms' }], 'stepsB': [] };
var ixHideOpacityLong = {'stepsA': [{'opacity': 1}, {'opacity': 0, 'transition': 'opacity 800ms ease 0ms'}], 'stepsB': []};
var ixHideOpacityFast = { 'stepsA': [{ 'opacity': 1 }, { 'opacity': 0, 'transition': 'opacity 20ms ease 0ms' }], 'stepsB': [] };


var ixResetStates = { //TODO: полный ресет и кастомную функцию ix.fire
  'stepsA': [{
    'opacity': 1,
    'transition': 'transform 200ms ease 0ms, opacity 200ms ease 0ms',
    'scaleX': 1,
    'scaleY': 1,
    'scaleZ': 1,
    'x': '0px',
    'y': '0px',
    'z': '0px'
  }]
};


//phoenix point
var ixResetXY = { //TODO: полный ресет и кастомную функцию ix.fire
  'stepsA': [{
    'transition': 'transform 200ms ease 0ms',
    'scaleX': 1,
    'scaleY': 1,
    'scaleZ': 1,
    'x': '0px',
    'y': '0px',
    'z': '0px'
  }]
};


var ixItemHover = {
  'stepsA': [{
    'opacity': 0.59,
    'transition': 'transform 200ms ease 0ms, opacity 200ms ease 0ms',
    'scaleX': 0.9,
    'scaleY': 0.9,
    'scaleZ': 1
  }]
};

var ixItemHoverOff = {
  'stepsA': [{
    'opacity': 1,
    'transition': 'transform 200ms ease 0ms, opacity 200ms ease 0ms',
    'scaleX': 1,
    'scaleY': 1,
    'scaleZ': 1
  }]
};

var ixItemApp = {
  'stepsA': [{
    'opacity': 1,
    'transition': 'transform 250ms ease 0ms, opacity 250ms ease 0ms',
    'x': '0px',
    'y': '0px',
    'z': '0px'
  }],
  'stepsB': []
};

var ixItemDiss = {
  'stepsA': [{
    'opacity': 0,
    'transition': 'transform 100ms ease 0ms, opacity 100ms ease 0ms',
    'x': '0px',
    'y': '20px',
    'z': '0px'
  }],
  'stepsB': []
};

var ixGoodShow = {
  'stepsA': [{
    'opacity': 1,
    'transition': 'transform 100ms ease 0ms, opacity 200ms ease 0ms',
    'x': '0px',
    'y': '0px',
    'z': '0px'
  }]
};

var ixGoodHide = {
  'stepsA': [{
    'opacity': 0,
    'transition': 'transform 100ms ease 0ms, opacity 200ms ease 0ms',
    'x': '60px',
    'y': '0px',
    'z': '0px'
  }]
};




/**
 * Applies function to elements found by selector
 * @param {string} selectorName selector (class name or id) i. e. '.name'
 * @param {Function} what to do with collection
 */
function collectionDo(selectorName, doThis) {
  var arr;
  if (typeof (selectorName) === 'object') {
    arr = Array.prototype.slice.call(selectorName);
  }
  if (typeof (selectorName) === 'string') {
    arr = Array.prototype.slice.call(document.querySelectorAll(selectorName));
  }
  arr.forEach(function(el) {
    doThis(el);
  })
}


/**
 * Rounds the number
 * @param {number} num number to round
 * @param {boolean=} yes true = round anyway
 */
function roundOrNot(num, yes) {
  if (num >= 100 || yes) {
    return Number(Math.round(num)) || 0;
  } else {
    return Number(Math.round((num) * 100) / 100) || 0;
  }
}



function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}




//**************** RIPPLE *****************//
// var addRippleEffect = function (e) {
//   var target = e.target;
//   if (target.parentNode.classList.contains('clck')) {
//     target = target.parentNode;
//   }
//   if (target.parentNode.parentNode.classList.contains('clck')) {
//     target = target.parentNode.parentNode;
//   }
//   // if (target.parentNode.parentNode.parentNode.classList.contains('clck')) {
//   //   target = target.parentNode.parentNode.parentNode;
//   // }
//   if (!target.classList.contains('clck')) return false;

//   var rect = target.getBoundingClientRect();
//   var ripple = target.querySelector('.ripple');
//   if (!ripple) {
//     ripple = document.createElement('span');
//     ripple.className = 'ripple';
//     ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
//     target.appendChild(ripple);
//   }
//   ripple.classList.remove('show');
//   var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
//   var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
//   ripple.style.top = top + 'px';
//   ripple.style.left = left + 'px';
//   ripple.classList.add('show');
//   return false;
// }
// document.addEventListener('click', addRippleEffect, false);







// var target = window; // this can be any scrollable element
// var last_y = 0;
// target.addEventListener('touchmove', function(e){
//     var scrolly = target.pageYOffset || target.scrollTop || 0;
//     var direction = e.changedTouches[0].pageY > last_y ? 1 : -1;
//     if(direction>0 && scrolly===0){
//         e.preventDefault();
//     }
//     last_y = e.changedTouches[0].pageY;
// });







/* MOBILE */

var windowW = window.innerWidth;
var windowH = window.innerHeight;
var isMobile = false;
function defMobile() {
  if ((windowW <= 430 && windowH <= 800) || (windowW <= 800 && windowH <= 430)) {
    return true;
  } else {
    return false;
  }
}

(function () {
  isMobile = defMobile();
  $( window ).resize(function() {
    isMobile = defMobile();
  });
})();









/** SCROLL TO COMPONENT */
// data-m-scrollto = .classname, 400
function addScrollTo() {
  $(':attr(\'^data-m-scrollto\')').each(function (i, item) {
    $(item).on({
      click: function (evt) {
        var trgt = evt.target;
        while (!trgt.dataset.mScrollto) {
          trgt = trgt.parentElement;
        }
        var scrollToWhere = trgt.dataset.mScrollto;
        if (!scrollToWhere) scrollToWhere = evt.target.parentElement.dataset.mScrollto;
        if (!scrollToWhere) scrollToWhere = evt.target.parentElement.parentElement.dataset.mScrollto; //TODO: сделать скроллту правильно
        var scrollToEl;
        var scrollToSpeed;
        if (scrollToWhere.split(',').length > 1) {
          scrollToEl = scrollToWhere.split(',')[0];
          scrollToSpeed = scrollToWhere.split(',')[1] || 200;
        } else {
          scrollToEl = scrollToWhere;
          scrollToSpeed = 200;
        }
        // var firstVisibleEl;
        var scrolltoY = $(scrollToEl).not('.hidden').offset().top;
        // ScrollToEl.each(function (i, el) {
        //   if (el.style.display) {
        //     firstVisibleEl = el;
        //     return false;
        //   }
        // })

        $('html, body').animate({scrollTop: scrolltoY }, scrollToSpeed);
      }
  })
  });
}


function m__scrollTo(el, scrollToSpeed) {
  var $scrollToEl;
  if (typeof el === 'object') {
    $scrollToEl = $(el).not('.hidden');
  }
  if (typeof el === 'string') {
    $scrollToEl = $(el);
  }
  scrollToSpeed = scrollToSpeed || 200;


  var scrolltoY = $scrollToEl.offset().top;
  // ScrollToEl.each(function (i, el) {
  //   if (el.style.display) {
  //     firstVisibleEl = el;
  //     return false;
  //   }
  // })

  $('html, body').animate({scrollTop: scrolltoY }, scrollToSpeed);
}







function m__applyTheme(newTheme, themeClassName, only, except) {
  if (!newTheme) retuen;
  themeClassName = themeClassName || 'xxx_theme_';
  var classes = document.querySelector('body').classList;
  if (themeClassName) {
    var classToRemove;
    classes.forEach(function (cls) {
      if (cls.indexOf(themeClassName) >= 0) {
        classToRemove = cls;
      }
    })
    $('*').removeClass(classToRemove);
  }

  if (only) {
    $('*').filter(only).not(except).addClass(newTheme);
  }
  if (!only) {
    $('*').not(except).addClass(newTheme);
  }
}



// $.fn.hasAttr = function(name) {
//   return this.attr(name) !== undefined;
// };



/* Convert color to rgb */

function hexToRGB(hex, alpha){ //Todo: OLD
  hex = hex.toUpperCase();
  var h = "0123456789ABCDEF";
  var r = h.indexOf(hex[1])*16+h.indexOf(hex[2]);
  var g = h.indexOf(hex[3])*16+h.indexOf(hex[4]);
  var b = h.indexOf(hex[5])*16+h.indexOf(hex[6]);
  if(alpha) return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  else return "rgb("+r+", "+g+", "+b+")";
}






/* Convert color to rgb */
/* Accepts an array [hex, alpha] or 2 vars */
function m__hexToRGB(hex, alpha) { //Todo: OLD

  if (typeof hex === 'object' && hex.length === 2) {
    hex = hex[0];
    alpha = hex[1];
  }

  hex = hex.toUpperCase();
  var h = "0123456789ABCDEF";
  var r = h.indexOf(hex[1])*16+h.indexOf(hex[2]);
  var g = h.indexOf(hex[3])*16+h.indexOf(hex[4]);
  var b = h.indexOf(hex[5])*16+h.indexOf(hex[6]);
  if(alpha) return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  else return "rgb("+r+", "+g+", "+b+")";
}



//Function to convert rgb color to hex format and alpha
//Returns array
// https://jsfiddle.net/maiik/xwhbLdsk/23/
function m__rgbToHexAlpha(rgba) {
  var hex = rgba.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  var ret = [];
  if (hex && hex.length === 4) {
    ret[0] = "#" +
      ("0" + parseInt(hex[1], 10).toString(16)).slice(-2) +
      ("0" + parseInt(hex[2], 10).toString(16)).slice(-2) +
      ("0" + parseInt(hex[3], 10).toString(16)).slice(-2);
    ret[1] = rgba.replace(/^.*,(.+)\)/, '$1');
  } else {
    ret = [rgba, 1];
  }
  return ret
}

