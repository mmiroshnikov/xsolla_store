// VARIABLES
// data-good-template — шаблон товара
// data-good-grid_template — optional шаблон грида, по-умолчанию берется родитель шаблона товара
// data-good-grid_header — optional заголовок грида




// //Load m-utils
// (function () {
//   var s = document.createElement('script');
//   s.type = 'text/javascript';
//   s.async = false;
//   s.src = 'http://xsolla.maiik.ru/xsolla_cart/m-utils.js';
//   var head = document.getElementsByTagName('head')[0];
//   head.appendChild(s);
// })();



var debug = debug || true; //вывод всяких сообщений в консоль







Xsolla.prototype.setPreloader = function (thiss, doo) {
  var $prel = $('[data-shop=\'preloader\']');
  if (!$prel.length) return;

  if (!doo) {
    $prel.removeClass('hidden');
    $prel.addClass('shown');
    $('[data-shop=\'body\']').addClass('hidden');
    return $prel[0];
  }
  if (doo === 'hide') {
    $prel.removeClass('shown');
    setTimeout(function(){
      $prel.addClass('hidden');
      $('[data-shop=\'body\']').removeClass('hidden');
    })
    var $prel = $('[data-shop=\'preloader\']');
  }
  return $prel[0];
}




Xsolla.prototype.afterLoadCallbacks = function (addNewFunc) {
  var thiss = this;
  if (addNewFunc) {
    //TODO: метот добавления функций
  } else {
    this.callbacks.forEach(function (item, i) {
      if (typeof item === "object") {
        item[0](thiss, item[1] || null, item[2] || null, item[3] || null)
      } else {
        item[0](thiss)
      }
    })

  }

}




function Xsolla(mainSettings, callbackFunc) {
  this.callbacks = [[this.setPreloader, 'hide']];
  this.preloader = this.setPreloader();
  this._mainSettings = this.mergeSettings(mainSettings);
  this._shopSettings = this._mainSettings['shopSettings'];
  this._cartSettings = this._mainSettings['cartSettings'];


  // this._shopSettings._cartSettings.paystation.access_data.settings.project_id = this.load('project_id');


  this.shop;

  this.access_data = this._shopSettings.paystation.access_data; //TODO: разобраться с аксесс датой
  this.access_data.settings.project_id = this.load('project_id') || this._shopSettings.paystation.access_data.settings['project_id'];



  this.project_id = this.access_data.settings.project_id;


  this._shopSettings.paystation.access_data = this.access_data;


  this.showSets();

  // this.shop = shop;
  this.loadFromPs(callbackFunc);
  // this.theme = 'xxx_theme_light';
  this.theme = this.load('theme') || this._shopSettings['theme'] || null;
  this.applyTheme();
  this.addListeners();

  // $(':attr(\'^data-q-cats\')')[0].innerHTML = thiss.getCats(this._shopSettings['shopData'], 'html');
  // $(':attr(\'^data-q-grids-textarea\')')[0].value = JSON.stringify(this._shopSettings['defaultGrids']);
}

//





Xsolla.prototype.mergeSettings = function (newMainSettings) {


  // newMainSettings = _.merge(mainSettings_default, newMainSettings);

  newMainSettings['shopSettings'] = _.merge(mainSettings_default['shopSettings'], newMainSettings['shopSettings']);
  if (newMainSettings['cartSettings']) {
    newMainSettings['cartSettings'] = _.merge(mainSettings_default['cartSettings'], newMainSettings['cartSettings']);
  } else {
    newMainSettings['cartSettings'] = null;
  }

  // // if (this._cartSettings) {
  // //   this._cartSettings = _.extend(mainSettings_default['cartSettings'], _cartSettings);
  // // } else {
  // //   return mainSettings;
  // // }

  // //TODO: переделать мердж, все плохо

  // mainSettings_default['shopSettings'].noDynamicStoreftont = newMainSettings['shopSettings'].noDynamicStoreftont || false;

  // if (newMainSettings['cartSettings']) {
  //   newMainSettings['cartSettings'].cartElements = mainSettings_default['cartSettings'].cartElements;
  //   newMainSettings['cartSettings'].psInit = mainSettings_default['cartSettings'].psInit;
  //   newMainSettings['cartSettings'].cartWrapper = newMainSettings['cartSettings'].cartWrapper || mainSettings_default['cartSettings'].cartWrapper;
  //   newMainSettings['cartSettings'].cartCheckoutBut = newMainSettings['cartSettings'].cartCheckoutBut || mainSettings_default['cartSettings'].cartCheckoutBut;
  // }


  // if (newMainSettings['shopSettings'].paystation && newMainSettings['shopSettings'].paystation['access_data']) {
  //   mainSettings_default['cartSettings'].paystation['access_data'] = newMainSettings['shopSettings'].paystation['access_data'];
  // }
  // if (newMainSettings['shopSettings'].paystation && !newMainSettings['shopSettings'].paystation['lightbox']) {
  //   newMainSettings['shopSettings'].paystation['lightbox'] = mainSettings_default['cartSettings'].paystation['lightbox'];
  // }
  // if (newMainSettings['shopSettings'].paystation && newMainSettings['shopSettings'].paystation['access_data']) {
  //   mainSettings_default['cartSettings'].paystation['access_data'] =
  //     _.extend(mainSettings_default['cartSettings'].paystation['access_data'], newMainSettings['shopSettings'].paystation['access_data']);
  //     // _.extend(shopSettings._cartSettings.paystation['access_data'], mainSettings_default._cartSettings.paystation['access_data']);
  // }

  // // if (newMainSettings['shopSettings'] && newMainSettings['shopSettings']['paystation']) {
  // //   mainSettings_default['shopSettings'].paystation =
  // //   _.extend(mainSettings_default['shopSettings'].paystation, newMainSettings['shopSettings'].paystation); //TODO: разобраться с мерджем данных
  // // } else {
  // //   newMainSettings['shopSettings']['paystation'] = mainSettings_default['shopSettings']['paystation'];
  // // }



  // if (newMainSettings['shopSettings'] && newMainSettings['shopSettings'].defaultGrids) {
  //   mainSettings_default['shopSettings'].defaultGrids =
  //     _.extend(mainSettings_default['shopSettings'].defaultGrids, newMainSettings['shopSettings'].defaultGrids); //TODO: разобраться с мерджем данных
  //   mainSettings_default['shopSettings'] =
  //     _.extend(mainSettings_default['shopSettings'], newMainSettings['shopSettings']); //TODO: разобраться с мерджем данных
  // } else {
  //   newMainSettings['shopSettings'] = mainSettings_default['shopSettings'];
  // }

  // if (newMainSettings['shopSettings'].customAttrs) {
  //   mainSettings_default['shopSettings'].customAttrs = newMainSettings['shopSettings'].customAttrs;
  // }

  // // if (shopSettings) {
  //   // mainSettings_default.shopSettings = shopSettings;
  // // }
  // newMainSettings = _.extend(mainSettings_default, newMainSettings);



  return newMainSettings;
}








Xsolla.prototype.load = function (what) {

  var newShopSettings = localStorage.getItem('shopSettings');

  if (!newShopSettings) return false;
  var newShopSettings = JSON.parse(newShopSettings);
  // this._shopSettings = shopSettings;
  if (what === 'project_id') {
    var pr_id = newShopSettings['paystation']['access_data']['settings']['project_id'];
    return pr_id.length ? Number(pr_id) : false;
  }
  if (what === 'defaultGrids') {
    var grids = newShopSettings['defaultGrids'];
    return grids.length ? grids : false;
  }
  if (what === 'theme') {
    var theme = newShopSettings['theme'];
    return theme.length ? theme : false;
  }
  return newShopSettings;
}



Xsolla.prototype.save = function () {
  localStorage.setItem('shopSettings', JSON.stringify(this._mainSettings))
}





Xsolla.prototype.reloadPage = function () {
  location.reload();
}




Xsolla.prototype.applyTheme = function () {
  var classes = document.querySelector('body').classList;
  var classToRemove;
  var thiss = this;
  classes.forEach(function (cls) {
    if (cls.indexOf('xxx_theme_') >= 0) {
      classToRemove = cls;
    }
  });
  $('*').removeClass(classToRemove);
    if (thiss.theme) {
      if (debug) console.log(thiss.theme);
      $('*').addClass(thiss.theme);
  }
}




Xsolla.prototype.loadFromPs = function (callbackFunc) {
  var thiss = this;
  //Запрос за итемами
  this.getVirtualItems(callbackFunc);
}








Xsolla.prototype.showSets = function (newproject, newGrids) {
  var thiss = this;
  if (newproject && newGrids) {
    this.project_id = newproject;
    this.mainSettings.shopSettings['defaultGrids'] = newGrids;
    this.save();
    this.reloadPage();
  } else {

    this.project_id = this.load('project_id') || this._shopSettings['paystation']['access_data']['settings']['project_id']; //Phoenix 22877  prod

    // this._shopSettings['defaultGrids'] =
    //   [
    //     {
    //       'where': '#grid_mainpacks_new',
    //       'typeName': 'group',
    //       'typeValue': 'Mainpacks',
    //       'title': 'Phoenix Point Packs'
    //     },
    //     {
    //       'where': '#grid_addons',
    //       'typeName': 'group',
    //       'typeValue': 'Addons',
    //       'title': 'Phoenix Point Addons'
    //     }
    //   ];

    // thiss.project_id = 22887; //22887 Atari

    if (!this._shopSettings['noDynamicStoreftont'] && !this._shopSettings.defaultGrids) {
      this._shopSettings['defaultGrids'] = 'all';
    }

    // thiss.shopSettings['defaultGrids'] =
    //   [
    //     {
    //       'where': '#grid_mainpacks_new',
    //       'typeName': 'group',
    //       'typeValue': 'Hats',
    //       'title': 'Speakerhats'
    //     },
    //     {
    //       'where': '#grid_addons',
    //       'typeName': 'group',
    //       'typeValue': 'Bundles',
    //       'title': 'Bundles'
    //     }
    //   ];

    if (this.load('theme')) {
      this.theme = this.load('theme');
    }
    if (this.load('project_id')) {
      this.project_id = this.load('project_id');
    }
    if (this.load('defaultGrids')) {
      this._shopSettings['defaultGrids'] = this.load('defaultGrids');
    }

    if (this._shopSettings) {
      this._shopSettings.paystation.access_data.settings.project_id = thiss.project_id;
    }
    // this.save();
  }

}









Xsolla.prototype.addListeners = function () {
  try {
    var thiss = this;
    //REMOVE LISTENERS
    $(':attr(\'^data-q-form\')').find('input:submit').each(function (i, item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
      })
    });

    //LOCALSTORAGE
    $(':attr(\'^data-q-localstorage\')').click(function () {
      localStorage.clear();
      location.reload();
    })

    //SWITCH THEME
    $data_q_form_theme = $(':attr(\'^data-q-form-theme\')');
    $data_q_form_theme.find('input:radio').each(function (i, oneRadio) {
      if (oneRadio.value === thiss.theme) {
        oneRadio.checked = true;
      }
      oneRadio.addEventListener('change', function (e) {
        if (!oneRadio.checked) return;
        if (oneRadio.value === '') return;
        thiss.theme = oneRadio.value;
        thiss._shopSettings['theme'] = thiss.theme; //TODO: сделать в одном месте
        thiss.applyTheme();
        thiss.save();
      });
    });


    // var formTheme = $(':attr(\'^data-q-form-theme\')');
    // formTheme.find('input:submit')[0].addEventListener('click', function (e) {
    //   // $('#data-q-form-theme_dark')[0].checked = true;
    //   var vals = formTheme.find(':attr(\'^data-q-form-theme-radio\')');
    //   var newTheme = 'xxx_theme_'
    //   vals.each(function (i, oneRadio) {
    //     if (oneRadio.checked === true) {
    //       newTheme += oneRadio.dataset.qFormThemeRadio;
    //     }
    //   })
    //   thiss.theme = newTheme;
    //   thiss.shopSettings.theme = newTheme; //Разобраться с двойной записью
    //   thiss.applyTheme();
    //   thiss.save();
    // })


    //SWITCH PROJECT
    $('[data-q-form=\'project_id_value\']')[0].value = this.project_id;

    //PROJECT RADIOS
    $data_q_form_project = $(':attr(\'^data-q-form-project\')');


    $data_q_form_project.find('input:radio').each(function (i, oneRadio) {
      if (Number(oneRadio.value) === Number(thiss.project_id)) {
        oneRadio.checked = true;
      }
      oneRadio.addEventListener('change', function (e) {
        if (!oneRadio.checked) return;
        if (oneRadio.value === 'custom') return;
        $('[data-q-form=\'project_id_value\']')[0].value = oneRadio.value;
      });
    })

    $data_q_form_project.find('input:submit')[0].addEventListener('click', function (e) {
      var new_project_id = $('[data-q-form=\'project_id_value\']')[0].value;
      if (new_project_id.length < 2 || new_project_id.length > 8) {
        // document.querySelector('#jsn').innerHTML = '<span style=\'color: red\'>project id is invalid</span>'
        console.log('project id is invalid');
        return;
      }
      thiss.project_id = new_project_id;
      thiss.access_data['settings']['project_id'] = new_project_id;
      thiss.getVirtualItems(null, thiss.showSets, thiss.project_id, 'all');
    });

    //SWITCH GRIDS
    $(':attr(\'^data-q-grids-textarea\')')[0].value = JSON.stringify(this._shopSettings['defaultGrids']);
    $(':attr(\'^data-q-form-grids\')').find('input:submit')[0].addEventListener('click', function (e) {


      var val = $(':attr(\'^data-q-grids-textarea\')')[0].value;
      val = val.replace(/(\r\n|\n|\r)/gm, "");
      val = val.replace(/\s/g, '');
      val = val.replace(/'/g, '"');
      val = JSON.parse('{"grids":' + val + '}');
      val = val['grids'];
      if (debug)  console.log(val);

      thiss.project_id = $('[data-q-form=\'project_id_value\']')[0].value;
      thiss.getVirtualItems(null, thiss.showSets, thiss.project_id, val);
      //Подмена Сеток
    })

  } catch (e) {}
}



Xsolla.prototype.getVirtualItems = function (callbackFunc, callbackF, callbackP1, callbackP2) {
  access_data = this._shopSettings['paystation']['access_data'];
  thiss = this;

  //Если статичная дата
  if (thiss._shopSettings.staticData) {
    thiss._shopSettings['shopData'] = thiss._shopSettings.staticData['groups'];
    if (typeof callbackF === 'function') {
      callbackF(thiss, callbackP1, callbackP2);
    }
    // document.querySelector('.prettyprint').innerHTML = JSON.stringify(data['groups'][0]['virtual_items']);
    thiss.createShop(thiss._shopSettings, callbackFunc);

    return;
  }

  //Если загружаемая дата
  $.ajax({
    url: 'https://secure.xsolla.com/paystation2/api/virtualitems/',
    data: {
        access_data: JSON.stringify(access_data)
    },
    method: 'post',
    dataType: 'json',
    beforeSend: function () {

    },
    success: function (newdata) {
      if (debug) console.log(newdata);
      thiss._shopSettings['shopData'] = newdata['groups'];




      // document.querySelector('#jsn').innerText = JSON.stringify(data['groups'][0]['virtual_items']);
      // callbackF && callbackF(thiss, callbackP1, callbackP2);
      if (typeof callbackF === 'function') {
          callbackF(thiss, callbackP1, callbackP2);
      }
      // document.querySelector('.prettyprint').innerHTML = JSON.stringify(data['groups'][0]['virtual_items']);
      thiss.createShop(thiss._shopSettings, callbackFunc);


      thiss.afterLoadCallbacks();

    },
    error: function () {
      alert('The project is not configured properly. Make sure the server integration is turned off.');
    }
  });
}





Xsolla.prototype.createShop = function(shopSettings, callbackFunc) {
  if (typeof shop !== 'object') {
    this.shop = new Shop(shopSettings, this); //TODO: разобраться с передачей коллбека
  }
  callbackFunc && callbackFunc();
  // this.shop._settings._cartSettings.paystation.access_data = this.access_data;
}



Xsolla.prototype.getCats = function (data, mode) {
  var shopCats = {};
  this._shopSettings.shopData.forEach(function (grp) {
    var groupName = grp['name'];
    var groupId = grp['id'];
    shopCats[groupName] = Object.keys(grp['virtual_items']);
  }.bind(this));

  if (!mode) return shopCats;

  var catsHTML = ''
  Object.keys(shopCats).forEach(function (item) {
    catsHTML += '<li>' + item +  '</li>\n'
  })
  if (mode === 'html') return catsHTML;
}









/*******************************************************/
/* Shop
 * Shop принимает settings
 *
 * если noDynamicStoreftont=true
 * собирает кнопки с экрана по дата атрибуту
 * проставляет статичным товарам цены по дата атрибуту
 * создает Cart
 *
 * Cart
 * принимает настройки PS и другие
 * создает массив для PS
 * удаляет, добавляет, меняет объекты
 *
 * RenderedGoood
 * Объект в корзине
 * Листнеры на клики, меняет дом своего элемента
/*******************************************************/






function Shop(settings, _parent) {
  this._parent = _parent || false;
  this._settings = this._parent._mainSettings;
  this._shopSettings = this._settings['shopSettings'];
  this._cartSettings = this._settings['cartSettings'] || null;
  this.currency; //Будет перезаписана в buildData ['$', 0];
  this._data = this.buildData(this._shopSettings['shopData']);
  this.buttons = [];
  this.groups = [];

  if (this._settings['cartSettings']) this.cart = this.cart || new Cart(this);

  if (this._shopSettings['noDynamicStoreftont']) { //Simple Plain Shop with cart
    this.collectButtons();
    this.addStaticPrices();
  } else { //Shop-shop
    this.groups = this.getGroups();
    this.gridsArray = {};
    if (this._shopSettings['defaultGrids'] === 'all' || !this._shopSettings['defaultGrids']) { //Все категории
      this.groups.forEach(function (group) {
        this.createGrid(group);
      }.bind(this));
    } else { //Только те, что подходят под критерии
      var butNotArray = [];
      this._shopSettings['defaultGrids'].forEach(function (oneGridInfo, i) {

        if (oneGridInfo['groupId'] === 'all') {

          this.groups.forEach(function (group) {
            this.createGrid(group, butNotArray);
          }.bind(this));

        } else {

          this.gridsArray[oneGridInfo['groupId']] = new ShopGrid(this, oneGridInfo);
          butNotArray.push(oneGridInfo['groupId'])
        }

      }.bind(this));
    }
  }

  this.paystInit();

}



Shop.prototype.paystInit = function () {
  var psInit = this._shopSettings['psInit'];
  psInit();
}




Shop.prototype.createGrid = function (grp, butNotArray) {
  var groupId = grp['id'];
  if (butNotArray && butNotArray.indexOf(groupId) >= 0) return;
  var groupName = grp['name'];
  var oneGridInfo = {};
  oneGridInfo['groupId'] = groupId;

  this.gridsArray.push(new ShopGrid(this, oneGridInfo));
}


// Shop.prototype.getGridTemplate = function () {
//   return $('[data-good=\'template\']')[0].parentElement;
// }



Shop.prototype.getGroups = function () { //DELETE
  var shopGroups = [];
  this._shopSettings.shopData.forEach(function (grp) {
    var groupName = grp['name'];
    var groupId = grp['id'];
    shopGroups.push({'id': groupId, 'name': groupName});
  });
  return shopGroups;
}





Shop.prototype.getCurrency = function () {
  var allCurrencies = {
    "USD": {
      "symbol": "$",
      "name": "US Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "USD",
      "name_plural": "US dollars"
    },
    "CAD": {
      "symbol": "CA$",
      "name": "Canadian Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "CAD",
      "name_plural": "Canadian dollars"
    },
    "EUR": {
      "symbol": "€",
      "name": "Euro",
      "symbol_native": "€",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "EUR",
      "name_plural": "euros"
    },
    "AED": {
      "symbol": "AED",
      "name": "United Arab Emirates Dirham",
      "symbol_native": "د.إ.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "AED",
      "name_plural": "UAE dirhams"
    },
    "AFN": {
      "symbol": "Af",
      "name": "Afghan Afghani",
      "symbol_native": "؋",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "AFN",
      "name_plural": "Afghan Afghanis"
    },
    "ALL": {
      "symbol": "ALL",
      "name": "Albanian Lek",
      "symbol_native": "Lek",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "ALL",
      "name_plural": "Albanian lekë"
    },
    "AMD": {
      "symbol": "AMD",
      "name": "Armenian Dram",
      "symbol_native": "դր.",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "AMD",
      "name_plural": "Armenian drams"
    },
    "ARS": {
      "symbol": "AR$",
      "name": "Argentine Peso",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ARS",
      "name_plural": "Argentine pesos"
    },
    "AUD": {
      "symbol": "AU$",
      "name": "Australian Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "AUD",
      "name_plural": "Australian dollars"
    },
    "AZN": {
      "symbol": "man.",
      "name": "Azerbaijani Manat",
      "symbol_native": "ман.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "AZN",
      "name_plural": "Azerbaijani manats"
    },
    "BAM": {
      "symbol": "KM",
      "name": "Bosnia-Herzegovina Convertible Mark",
      "symbol_native": "KM",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BAM",
      "name_plural": "Bosnia-Herzegovina convertible marks"
    },
    "BDT": {
      "symbol": "Tk",
      "name": "Bangladeshi Taka",
      "symbol_native": "৳",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BDT",
      "name_plural": "Bangladeshi takas"
    },
    "BGN": {
      "symbol": "BGN",
      "name": "Bulgarian Lev",
      "symbol_native": "лв.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BGN",
      "name_plural": "Bulgarian leva"
    },
    "BHD": {
      "symbol": "BD",
      "name": "Bahraini Dinar",
      "symbol_native": "د.ب.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "BHD",
      "name_plural": "Bahraini dinars"
    },
    "BIF": {
      "symbol": "FBu",
      "name": "Burundian Franc",
      "symbol_native": "FBu",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "BIF",
      "name_plural": "Burundian francs"
    },
    "BND": {
      "symbol": "BN$",
      "name": "Brunei Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BND",
      "name_plural": "Brunei dollars"
    },
    "BOB": {
      "symbol": "Bs",
      "name": "Bolivian Boliviano",
      "symbol_native": "Bs",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BOB",
      "name_plural": "Bolivian bolivianos"
    },
    "BRL": {
      "symbol": "R$",
      "name": "Brazilian Real",
      "symbol_native": "R$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BRL",
      "name_plural": "Brazilian reals"
    },
    "BWP": {
      "symbol": "BWP",
      "name": "Botswanan Pula",
      "symbol_native": "P",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BWP",
      "name_plural": "Botswanan pulas"
    },
    "BYR": {
      "symbol": "BYR",
      "name": "Belarusian Ruble",
      "symbol_native": "BYR",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "BYR",
      "name_plural": "Belarusian rubles"
    },
    "BZD": {
      "symbol": "BZ$",
      "name": "Belize Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BZD",
      "name_plural": "Belize dollars"
    },
    "CDF": {
      "symbol": "CDF",
      "name": "Congolese Franc",
      "symbol_native": "FrCD",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "CDF",
      "name_plural": "Congolese francs"
    },
    "CHF": {
      "symbol": "CHF",
      "name": "Swiss Franc",
      "symbol_native": "CHF",
      "decimal_digits": 2,
      "rounding": 0.05,
      "code": "CHF",
      "name_plural": "Swiss francs"
    },
    "CLP": {
      "symbol": "CL$",
      "name": "Chilean Peso",
      "symbol_native": "$",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "CLP",
      "name_plural": "Chilean pesos"
    },
    "CNY": {
      "symbol": "CN¥",
      "name": "Chinese Yuan",
      "symbol_native": "CN¥",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "CNY",
      "name_plural": "Chinese yuan"
    },
    "COP": {
      "symbol": "CO$",
      "name": "Colombian Peso",
      "symbol_native": "$",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "COP",
      "name_plural": "Colombian pesos"
    },
    "CRC": {
      "symbol": "₡",
      "name": "Costa Rican Colón",
      "symbol_native": "₡",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "CRC",
      "name_plural": "Costa Rican colóns"
    },
    "CVE": {
      "symbol": "CV$",
      "name": "Cape Verdean Escudo",
      "symbol_native": "CV$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "CVE",
      "name_plural": "Cape Verdean escudos"
    },
    "CZK": {
      "symbol": "Kč",
      "name": "Czech Republic Koruna",
      "symbol_native": "Kč",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "CZK",
      "name_plural": "Czech Republic korunas"
    },
    "DJF": {
      "symbol": "Fdj",
      "name": "Djiboutian Franc",
      "symbol_native": "Fdj",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "DJF",
      "name_plural": "Djiboutian francs"
    },
    "DKK": {
      "symbol": "Dkr",
      "name": "Danish Krone",
      "symbol_native": "kr",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "DKK",
      "name_plural": "Danish kroner"
    },
    "DOP": {
      "symbol": "RD$",
      "name": "Dominican Peso",
      "symbol_native": "RD$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "DOP",
      "name_plural": "Dominican pesos"
    },
    "DZD": {
      "symbol": "DA",
      "name": "Algerian Dinar",
      "symbol_native": "د.ج.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "DZD",
      "name_plural": "Algerian dinars"
    },
    "EEK": {
      "symbol": "Ekr",
      "name": "Estonian Kroon",
      "symbol_native": "kr",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "EEK",
      "name_plural": "Estonian kroons"
    },
    "EGP": {
      "symbol": "EGP",
      "name": "Egyptian Pound",
      "symbol_native": "ج.م.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "EGP",
      "name_plural": "Egyptian pounds"
    },
    "ERN": {
      "symbol": "Nfk",
      "name": "Eritrean Nakfa",
      "symbol_native": "Nfk",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ERN",
      "name_plural": "Eritrean nakfas"
    },
    "ETB": {
      "symbol": "Br",
      "name": "Ethiopian Birr",
      "symbol_native": "Br",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ETB",
      "name_plural": "Ethiopian birrs"
    },
    "GBP": {
      "symbol": "£",
      "name": "British Pound Sterling",
      "symbol_native": "£",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "GBP",
      "name_plural": "British pounds sterling"
    },
    "GEL": {
      "symbol": "GEL",
      "name": "Georgian Lari",
      "symbol_native": "GEL",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "GEL",
      "name_plural": "Georgian laris"
    },
    "GHS": {
      "symbol": "GH₵",
      "name": "Ghanaian Cedi",
      "symbol_native": "GH₵",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "GHS",
      "name_plural": "Ghanaian cedis"
    },
    "GNF": {
      "symbol": "FG",
      "name": "Guinean Franc",
      "symbol_native": "FG",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "GNF",
      "name_plural": "Guinean francs"
    },
    "GTQ": {
      "symbol": "GTQ",
      "name": "Guatemalan Quetzal",
      "symbol_native": "Q",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "GTQ",
      "name_plural": "Guatemalan quetzals"
    },
    "HKD": {
      "symbol": "HK$",
      "name": "Hong Kong Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "HKD",
      "name_plural": "Hong Kong dollars"
    },
    "HNL": {
      "symbol": "HNL",
      "name": "Honduran Lempira",
      "symbol_native": "L",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "HNL",
      "name_plural": "Honduran lempiras"
    },
    "HRK": {
      "symbol": "kn",
      "name": "Croatian Kuna",
      "symbol_native": "kn",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "HRK",
      "name_plural": "Croatian kunas"
    },
    "HUF": {
      "symbol": "Ft",
      "name": "Hungarian Forint",
      "symbol_native": "Ft",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "HUF",
      "name_plural": "Hungarian forints"
    },
    "IDR": {
      "symbol": "Rp",
      "name": "Indonesian Rupiah",
      "symbol_native": "Rp",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "IDR",
      "name_plural": "Indonesian rupiahs"
    },
    "ILS": {
      "symbol": "₪",
      "name": "Israeli New Sheqel",
      "symbol_native": "₪",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ILS",
      "name_plural": "Israeli new sheqels"
    },
    "INR": {
      "symbol": "Rs",
      "name": "Indian Rupee",
      "symbol_native": "টকা",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "INR",
      "name_plural": "Indian rupees"
    },
    "IQD": {
      "symbol": "IQD",
      "name": "Iraqi Dinar",
      "symbol_native": "د.ع.‏",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "IQD",
      "name_plural": "Iraqi dinars"
    },
    "IRR": {
      "symbol": "IRR",
      "name": "Iranian Rial",
      "symbol_native": "﷼",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "IRR",
      "name_plural": "Iranian rials"
    },
    "ISK": {
      "symbol": "Ikr",
      "name": "Icelandic Króna",
      "symbol_native": "kr",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "ISK",
      "name_plural": "Icelandic krónur"
    },
    "JMD": {
      "symbol": "J$",
      "name": "Jamaican Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "JMD",
      "name_plural": "Jamaican dollars"
    },
    "JOD": {
      "symbol": "JD",
      "name": "Jordanian Dinar",
      "symbol_native": "د.أ.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "JOD",
      "name_plural": "Jordanian dinars"
    },
    "JPY": {
      "symbol": "¥",
      "name": "Japanese Yen",
      "symbol_native": "￥",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "JPY",
      "name_plural": "Japanese yen"
    },
    "KES": {
      "symbol": "Ksh",
      "name": "Kenyan Shilling",
      "symbol_native": "Ksh",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "KES",
      "name_plural": "Kenyan shillings"
    },
    "KHR": {
      "symbol": "KHR",
      "name": "Cambodian Riel",
      "symbol_native": "៛",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "KHR",
      "name_plural": "Cambodian riels"
    },
    "KMF": {
      "symbol": "CF",
      "name": "Comorian Franc",
      "symbol_native": "FC",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "KMF",
      "name_plural": "Comorian francs"
    },
    "KRW": {
      "symbol": "₩",
      "name": "South Korean Won",
      "symbol_native": "₩",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "KRW",
      "name_plural": "South Korean won"
    },
    "KWD": {
      "symbol": "KD",
      "name": "Kuwaiti Dinar",
      "symbol_native": "د.ك.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "KWD",
      "name_plural": "Kuwaiti dinars"
    },
    "KZT": {
      "symbol": "KZT",
      "name": "Kazakhstani Tenge",
      "symbol_native": "тңг.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "KZT",
      "name_plural": "Kazakhstani tenges"
    },
    "LBP": {
      "symbol": "LB£",
      "name": "Lebanese Pound",
      "symbol_native": "ل.ل.‏",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "LBP",
      "name_plural": "Lebanese pounds"
    },
    "LKR": {
      "symbol": "SLRs",
      "name": "Sri Lankan Rupee",
      "symbol_native": "SL Re",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "LKR",
      "name_plural": "Sri Lankan rupees"
    },
    "LTL": {
      "symbol": "Lt",
      "name": "Lithuanian Litas",
      "symbol_native": "Lt",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "LTL",
      "name_plural": "Lithuanian litai"
    },
    "LVL": {
      "symbol": "Ls",
      "name": "Latvian Lats",
      "symbol_native": "Ls",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "LVL",
      "name_plural": "Latvian lati"
    },
    "LYD": {
      "symbol": "LD",
      "name": "Libyan Dinar",
      "symbol_native": "د.ل.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "LYD",
      "name_plural": "Libyan dinars"
    },
    "MAD": {
      "symbol": "MAD",
      "name": "Moroccan Dirham",
      "symbol_native": "د.م.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MAD",
      "name_plural": "Moroccan dirhams"
    },
    "MDL": {
      "symbol": "MDL",
      "name": "Moldovan Leu",
      "symbol_native": "MDL",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MDL",
      "name_plural": "Moldovan lei"
    },
    "MGA": {
      "symbol": "MGA",
      "name": "Malagasy Ariary",
      "symbol_native": "MGA",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "MGA",
      "name_plural": "Malagasy Ariaries"
    },
    "MKD": {
      "symbol": "MKD",
      "name": "Macedonian Denar",
      "symbol_native": "MKD",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MKD",
      "name_plural": "Macedonian denari"
    },
    "MMK": {
      "symbol": "MMK",
      "name": "Myanma Kyat",
      "symbol_native": "K",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "MMK",
      "name_plural": "Myanma kyats"
    },
    "MOP": {
      "symbol": "MOP$",
      "name": "Macanese Pataca",
      "symbol_native": "MOP$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MOP",
      "name_plural": "Macanese patacas"
    },
    "MUR": {
      "symbol": "MURs",
      "name": "Mauritian Rupee",
      "symbol_native": "MURs",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "MUR",
      "name_plural": "Mauritian rupees"
    },
    "MXN": {
      "symbol": "MX$",
      "name": "Mexican Peso",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MXN",
      "name_plural": "Mexican pesos"
    },
    "MYR": {
      "symbol": "RM",
      "name": "Malaysian Ringgit",
      "symbol_native": "RM",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MYR",
      "name_plural": "Malaysian ringgits"
    },
    "MZN": {
      "symbol": "MTn",
      "name": "Mozambican Metical",
      "symbol_native": "MTn",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MZN",
      "name_plural": "Mozambican meticals"
    },
    "NAD": {
      "symbol": "N$",
      "name": "Namibian Dollar",
      "symbol_native": "N$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NAD",
      "name_plural": "Namibian dollars"
    },
    "NGN": {
      "symbol": "₦",
      "name": "Nigerian Naira",
      "symbol_native": "₦",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NGN",
      "name_plural": "Nigerian nairas"
    },
    "NIO": {
      "symbol": "C$",
      "name": "Nicaraguan Córdoba",
      "symbol_native": "C$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NIO",
      "name_plural": "Nicaraguan córdobas"
    },
    "NOK": {
      "symbol": "NOK",
      "name": "Norwegian Krone",
      "symbol_native": "kr",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NOK",
      "name_plural": "Norwegian kroner"
    },
    "NPR": {
      "symbol": "NPRs",
      "name": "Nepalese Rupee",
      "symbol_native": "नेरू",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NPR",
      "name_plural": "Nepalese rupees"
    },
    "NZD": {
      "symbol": "NZ$",
      "name": "New Zealand Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NZD",
      "name_plural": "New Zealand dollars"
    },
    "OMR": {
      "symbol": "OMR",
      "name": "Omani Rial",
      "symbol_native": "ر.ع.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "OMR",
      "name_plural": "Omani rials"
    },
    "PAB": {
      "symbol": "B/.",
      "name": "Panamanian Balboa",
      "symbol_native": "B/.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "PAB",
      "name_plural": "Panamanian balboas"
    },
    "PEN": {
      "symbol": "S/.",
      "name": "Peruvian Nuevo Sol",
      "symbol_native": "S/.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "PEN",
      "name_plural": "Peruvian nuevos soles"
    },
    "PHP": {
      "symbol": "₱",
      "name": "Philippine Peso",
      "symbol_native": "₱",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "PHP",
      "name_plural": "Philippine pesos"
    },
    "PKR": {
      "symbol": "PKRs",
      "name": "Pakistani Rupee",
      "symbol_native": "₨",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "PKR",
      "name_plural": "Pakistani rupees"
    },
    "PLN": {
      "symbol": "zł",
      "name": "Polish Zloty",
      "symbol_native": "zł",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "PLN",
      "name_plural": "Polish zlotys"
    },
    "PYG": {
      "symbol": "₲",
      "name": "Paraguayan Guarani",
      "symbol_native": "₲",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "PYG",
      "name_plural": "Paraguayan guaranis"
    },
    "QAR": {
      "symbol": "QR",
      "name": "Qatari Rial",
      "symbol_native": "ر.ق.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "QAR",
      "name_plural": "Qatari rials"
    },
    "RON": {
      "symbol": "RON",
      "name": "Romanian Leu",
      "symbol_native": "RON",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "RON",
      "name_plural": "Romanian lei"
    },
    "RSD": {
      "symbol": "din.",
      "name": "Serbian Dinar",
      "symbol_native": "дин.",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "RSD",
      "name_plural": "Serbian dinars"
    },
    "RUB": {
      "symbol": "₽",
      "name": "Russian Ruble",
      "symbol_native": "руб.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "RUB",
      "name_plural": "Russian rubles"
    },
    "RWF": {
      "symbol": "RWF",
      "name": "Rwandan Franc",
      "symbol_native": "FR",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "RWF",
      "name_plural": "Rwandan francs"
    },
    "SAR": {
      "symbol": "SR",
      "name": "Saudi Riyal",
      "symbol_native": "ر.س.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "SAR",
      "name_plural": "Saudi riyals"
    },
    "SDG": {
      "symbol": "SDG",
      "name": "Sudanese Pound",
      "symbol_native": "SDG",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "SDG",
      "name_plural": "Sudanese pounds"
    },
    "SEK": {
      "symbol": "Skr",
      "name": "Swedish Krona",
      "symbol_native": "kr",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "SEK",
      "name_plural": "Swedish kronor"
    },
    "SGD": {
      "symbol": "S$",
      "name": "Singapore Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "SGD",
      "name_plural": "Singapore dollars"
    },
    "SOS": {
      "symbol": "Ssh",
      "name": "Somali Shilling",
      "symbol_native": "Ssh",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "SOS",
      "name_plural": "Somali shillings"
    },
    "SYP": {
      "symbol": "SY£",
      "name": "Syrian Pound",
      "symbol_native": "ل.س.‏",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "SYP",
      "name_plural": "Syrian pounds"
    },
    "THB": {
      "symbol": "฿",
      "name": "Thai Baht",
      "symbol_native": "฿",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "THB",
      "name_plural": "Thai baht"
    },
    "TND": {
      "symbol": "DT",
      "name": "Tunisian Dinar",
      "symbol_native": "د.ت.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "TND",
      "name_plural": "Tunisian dinars"
    },
    "TOP": {
      "symbol": "T$",
      "name": "Tongan Paʻanga",
      "symbol_native": "T$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "TOP",
      "name_plural": "Tongan paʻanga"
    },
    "TRY": {
      "symbol": "TL",
      "name": "Turkish Lira",
      "symbol_native": "TL",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "TRY",
      "name_plural": "Turkish Lira"
    },
    "TTD": {
      "symbol": "TT$",
      "name": "Trinidad and Tobago Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "TTD",
      "name_plural": "Trinidad and Tobago dollars"
    },
    "TWD": {
      "symbol": "NT$",
      "name": "New Taiwan Dollar",
      "symbol_native": "NT$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "TWD",
      "name_plural": "New Taiwan dollars"
    },
    "TZS": {
      "symbol": "TSh",
      "name": "Tanzanian Shilling",
      "symbol_native": "TSh",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "TZS",
      "name_plural": "Tanzanian shillings"
    },
    "UAH": {
      "symbol": "₴",
      "name": "Ukrainian Hryvnia",
      "symbol_native": "₴",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "UAH",
      "name_plural": "Ukrainian hryvnias"
    },
    "UGX": {
      "symbol": "USh",
      "name": "Ugandan Shilling",
      "symbol_native": "USh",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "UGX",
      "name_plural": "Ugandan shillings"
    },
    "UYU": {
      "symbol": "$U",
      "name": "Uruguayan Peso",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "UYU",
      "name_plural": "Uruguayan pesos"
    },
    "UZS": {
      "symbol": "UZS",
      "name": "Uzbekistan Som",
      "symbol_native": "UZS",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "UZS",
      "name_plural": "Uzbekistan som"
    },
    "VEF": {
      "symbol": "Bs.F.",
      "name": "Venezuelan Bolívar",
      "symbol_native": "Bs.F.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "VEF",
      "name_plural": "Venezuelan bolívars"
    },
    "VND": {
      "symbol": "₫",
      "name": "Vietnamese Dong",
      "symbol_native": "₫",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "VND",
      "name_plural": "Vietnamese dong"
    },
    "XAF": {
      "symbol": "FCFA",
      "name": "CFA Franc BEAC",
      "symbol_native": "FCFA",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "XAF",
      "name_plural": "CFA francs BEAC"
    },
    "XOF": {
      "symbol": "CFA",
      "name": "CFA Franc BCEAO",
      "symbol_native": "CFA",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "XOF",
      "name_plural": "CFA francs BCEAO"
    },
    "YER": {
      "symbol": "YR",
      "name": "Yemeni Rial",
      "symbol_native": "ر.ي.‏",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "YER",
      "name_plural": "Yemeni rials"
    },
    "ZAR": {
      "symbol": "R",
      "name": "South African Rand",
      "symbol_native": "R",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ZAR",
      "name_plural": "South African rand"
    },
    "ZMK": {
      "symbol": "ZK",
      "name": "Zambian Kwacha",
      "symbol_native": "ZK",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "ZMK",
      "name_plural": "Zambian kwachas"
    }
  }; //TODO: сделать XHR или типа того
  return allCurrencies[this.currency[0]].symbol;
}

Shop.prototype.formatCurrency = function (cur) {
  return [cur, 0]; //TODO: подключить модуль валют с разделителями и т. п.
  //0 — валюта перед числом, 1 – валюта после числа
}


Shop.prototype.formattedPrice = function (price) {

  price = Math.round(price * 100) / 100;
  price = price.toString();
  var priceCheck = price.split('.');
  if (priceCheck && priceCheck.length === 2 && priceCheck[1].length === 1) {
    price = price + '0'; //добавляет 0, чтобы было $49.50, а не $49.5
  }

  //Чтобы ставить минус перед знаком валюты
  price = price.toString();
  var minuss = '';
  if (price.indexOf('-') === 0) {
    minuss = '&minus;';
    price = price.substring(1);
  }


  var delimeter = '.'; //TODO: сделать правильный локальный разделитель

  delimeter = '<span class=\'xsolla_price_delimeter\'>' + delimeter + '</span>';
  var priceSpans = price.split('.');
  if (priceSpans.length === 2) {
    var priceSpans0 = '<span class=\'xsolla_price_integer\'>' + priceSpans[0] + '</span>';
    var priceSpans1 = '<span class=\'xsolla_price_decimal\'>' + priceSpans[1] + '</span>';
    price = priceSpans0 + delimeter + priceSpans1;
  } else {
    price = '<span class=\'xsolla_price_integer\'>' + priceSpans[0] + '</span>';
  }

  var formatted;
  if (this.currency[1] === 0) { //0 — валюта перед числом, 1 – валюта после числа
    formatted = '<span class=\'xsolla_price_currency\'>' + this.getCurrency() + '</span>' + price;
  } else {
    formatted = price + '&thinsp;' + this.getCurrency();
  }
  formatted = minuss + formatted;
  return formatted;
}




Shop.prototype.buildData = function (data) {
  var jsonAllGoods = {};
  var thiss = this;
  data.forEach(function (grp) {
    var groupName = grp['name'];
    var groupId = grp['id'];
    var groupItems = grp['virtual_items'];
    groupItems.forEach(function(item) {
      if (!this.currency) this.currency = this.formatCurrency(item.currency);

      if (jsonAllGoods[item.sku]) {
        jsonAllGoods[item.sku]['group'].push(groupName);
        jsonAllGoods[item.sku]['groupId'].push(groupId);
      } else {
        jsonAllGoods[item.sku] = item;
        jsonAllGoods[item.sku]['group'] = [groupName];
        jsonAllGoods[item.sku]['groupId'] = [groupId];
      }
    }, thiss);
  });

  try {
    Object.keys(thiss._settings['customAttrs']).forEach(function (skuu) {
      Object.keys(thiss._settings['customAttrs'][skuu]).forEach(function(element) {
        jsonAllGoods[skuu][element] = thiss._settings['customAttrs'][skuu][element];
      });
    });
  } catch (e) { }
  return jsonAllGoods;
}






Shop.prototype.getIndexes = function (typeName, typeVal) {
  var arr = [];
  Object.keys(this._data).forEach(function (sku, i) {
    var add = false;
    if (!typeName && !typeVal) add = true; //TODO: default grids
    var item = this._data[sku];
    var typeValItem = item[typeName]
    if (typeValItem === typeVal || (typeof typeValItem === 'Object' && typeValItem.indexOf(typeVal) > -1)) {
      add = true;
    };
    if (typeof typeValItem === 'object') {
      if (typeValItem.indexOf(typeVal) >= 0) add = true;
    };
    if (add) arr.push(sku);
  }.bind(this));
  arr = _.compact(arr);
  return arr;
}





// function ShopGrid(parentShop, typeName, typeVal) {
function ShopGrid(parentShop, grp) {
  this._shop = parentShop;
  this._group = grp;
  this.typeName = 'groupId' || null;
  this.typeVal = this._group['groupId'] || null;
  this.typeHeader = this.getHeader();
  this.gridTemplate = this.getGridTemplate();
  // this.template = this.getShopGoodTemplate();
  // this.gridTemplate = this.getTemplate();

  this._dataArr = this._shop.getIndexes(this.typeName, this.typeVal);
  this.renderedGoods = {};
  this.element = this.renderGrid();
  this.renderShopGoods(this.element);
  this.addHeaderName();
}



ShopGrid.prototype.getHeader = function () {
  var name;
  if (this._group['header']) {
    return this._group['header'];
  }
  if (this.typeName === 'groupId') { //Translate group name by id
    this._shop._shopSettings.shopData.forEach(function (grp) {
      if (grp['id'] === this.typeVal) {
        name = grp['name'];
      }
    }.bind(this));
  }
  return name || this.typeVal;
}


ShopGrid.prototype.addHeaderName = function () {
  try {
    $(this.element).find('[data-shop-grid=\'header\']')[0].innerHTML = this.typeHeader;
  } catch (e) {}
}


ShopGrid.prototype.makeGrid = function () {
  var newGrid = this.gridTemplate.cloneNode(true);
  // newGrid.id = this.gridTemplate.id;
  newGrid.classList.remove('hidden');
  return newGrid;
}

ShopGrid.prototype.renderGrid = function () {
  var newGrid = this.makeGrid();
  this.gridTemplate.parentElement.appendChild(newGrid);
  return newGrid;
}


ShopGrid.prototype.getShopGoodTemplate = function (type, val) {

  // // var where;
  // // var whereTemplate;
  // if (type && val) {
  //   var templateName = this._settings._shopSettings.gridDesign[val];
  //   if (templateName) {
  //     template = $('[data-good-template=\'' + templateName + '\']')[0];
  //   }
  // }
  // if (!template) {
  //   //Дефолтный
  //   template = $('[data-good-template=\'' + 'default' + '\']')[0];
  // }
  // if (!template) {
  //   //Первый попавшийся
  //   template = $(':attr(\'^data-good-template\')')[0];
  // }
  // return template;
}




ShopGrid.prototype.getGridTemplate = function () {
  var tmpl;
  if (!this._group['template'] || this._group['template'] === 'default') {
    tmpl = $('[data-good=\'' + 'default' + '\']')[0].parentElement; //Нахождит дефолтный
  } else {
    // var templateName = this._shop._settings.shopSettings.gridDesign[type];
    var templateName = this._group['template'];

    tmpl = $('[data-good=\'' + templateName + '\']').closest('[data-shop-grid=\'template\']')[0] ||
           $('[data-good=\'' + templateName + '\']')[0].parentElement;
  }

  return tmpl;
}





ShopGrid.prototype.renderShopGoods = function () {
  this._dataArr.forEach(function (sku) {
    var dataItem = this._shop._data[sku];
    var newGood = new ShopGood(this, dataItem)
    newGood.container.appendChild(newGood.element);
    // this.where.appendChild(newGood.element);
    this.renderedGoods[sku] = newGood;
  }.bind(this))
}







function ShopGood(_grid, dataItem) {
  this._grid = _grid;
  this._shop = _grid._shop;
  this.dataItem = dataItem;
  this.sku = this.dataItem['sku'];
  this.container;
  this.template = this.getTemplate();
  this.element = this.renderShopGood();
  this._onClick = this._onClick.bind(this);
  this.isFavorite = this.getFavorite();
  // this._onHoverOn = this._onHoverOn.bind(this);
  // this._onHoverOff = this._onHoverOff.bind(this);
}



ShopGood.prototype.getTemplate = function () {
  this.container = $(this._grid.element).find('[data-good=\'template\']')[0].parentElement;
  return $(this._grid.element).find('[data-good=\'template\']')[0];
}



ShopGood.prototype.getFavorite = function () {
  return this._shop._data[this.sku]['is_favorite'] ? true : false;
}


ShopGood.prototype.renderShopGood = function () {
  var thiss = this;
  var newEl = this.template.cloneNode(true);
  newEl.dataset.idd = this.dataItem.sku;
  newEl.classList.remove('hidden', 'template');
  newEl.dataset.good = null;
  newEl.dataset.goodTemplate = null;
  newEl.dataset.template = null;

  try {
    if ($(newEl).find('[data-good=\'image_url\']')[0]) {
      $(newEl).find('[data-good=\'image_url\']')[0].style.backgroundImage = 'url(' + this.dataItem['image_url'] + ')';
    }
  } catch (e) { }
  if (this.dataItem.image_url_custom) {
    $(newEl).find('[data-good=\'image_url\']')[0].style.backgroundImage = 'url(' + this.dataItem.image_url_custom + ')';
    // $(newEl).hover(
    //   function () {
      //     $(this).find('[data-kart-good=\'image_url\']').css('background-image', 'url(' + thiss.dataItem.image_url_custom_hover + ')')
      //   },
      //   function () {
        //     $(this).find('[data-kart-good=\'image_url\']').css('background-image', 'url(' + thiss.dataItem.image_url_custom + ')')
        //   },
        // );
      }

      var thiss = this;
      var dataItems = $(newEl).find(':attrStrict(\'data-good\')');
      dataItems.each(function (i, oneItem) {
        var contentType = oneItem.dataset.good;

        switch (contentType) {
          // case 'name':
          //   oneItem.innerHTML = thiss.dataItem['name'];
          //   break;

          // case 'description':
          //   oneItem.innerHTML = thiss.dataItem['description'];
          //   break;

          case 'amount':
            oneItem.innerHTML = thiss._shop.formattedPrice(thiss.dataItem['amount']);
            break;

          case 'image_url':
            $(oneItem).css({ 'background-image': 'url(' + thiss.dataItem['image_url'] + ')' });
            break;

          case 'image_url_custom':
            if (thiss.dataItem['image_url_custom']) {
              $(oneItem).css({ 'background-image': 'url(' + thiss.dataItem['image_url_custom'] + ')' });
            } else {
              $(oneItem).css({ 'background-image': 'url(' + thiss.dataItem['image_url'] + ')' });
            }
            break;

          default:
            if (thiss.dataItem[contentType]) {
              oneItem.innerHTML = thiss.dataItem[contentType];
            }
            break;
        }

      })


  // $(newEl).find('[data-good=\'name\']')[0].innerHTML = this.dataItem['name'];
  // $(newEl).find('[data-good=\'desc\']')[0].innerHTML = this.dataItem['description'];
  // $(newEl).find('[data-good=\'amount\']')[0].innerHTML = this._shop.formattedPrice(this.dataItem['amount']);

  if (this.isFavorite) {
    $(newEl).find('[data-good=\'is_favorite\']').removeClass('x_off');
    $(newEl).find('[data-good=\'is_favorite\']').addClass('x_on');
  } else {
    $(newEl).find('[data-good=\'is_favorite\']').addClass('x_off');
    $(newEl).find('[data-good=\'is_favorite\']').removeClass('x_on');
  }

  //TODO: сделать методы добавления удаления из закладок


  // newEl.addEventListener('mouseover', function (evt) {
  //   evt.preventDefault();
  //   if (typeof this.onHoverOn === 'function') {
  //     this.onHoverOn();
  //   }
  // }.bind(this));
  // newEl.addEventListener('mouseout', function (evt) {
  //   evt.preventDefault();
  //   if (typeof this.onHoverOff === 'function') {
  //     this.onHoverOff();
  //   }
  // }.bind(this));
  this.onClick = this._onClick;
  var thiss = this;

  // Add to Cart
  $(newEl).find(':attr(\'^data-kart-add\')').each(function (i, el) {
    el.addEventListener('click', function (evt) {
      var trgt = evt.target;

      if (($(trgt).attr('data-kart-add')) || $(trgt.parentElement).attr('data-kart-add')) {
        evt.preventDefault();
        if (typeof thiss.onClick === 'function') {
          thiss.onClick(trgt);
        }
      }

    });
  })

  //Buy intsantly
  $(newEl).find(':attr(\'^data-kart-buy\')').each(function (i, el) {
    this.addEventListener('click', function (evt) {
      // var trgt = evt.target;
      // if (($(trgt).attr('data-kart-buy')) || $(trgt.parentElement).attr('data-kart-buy')) {
        evt.preventDefault();
        thiss._shop.checkoutItem(thiss.sku);
      // }
    });
  })


  return newEl;
}


Shop.prototype.checkoutItem = function (itemToSell) {

  // if (!itemToSell || !this.q) return; //если пустая корзина


  var access_data = this._shopSettings.paystation['access_data'];
  // this.getShipping(); //Нужен ли шиппинг

  try {
    access_data['user']['attributes']['promo'] = this.offvalue;
  } catch (e) { }
  // access_data.
  //  var sku = $(this).data('sku');
  if (!this['_shopSettings']['paystation']['access_data']['purchase']) {
    this['_shopSettings']['paystation']['access_data']['purchase'] = {};
    this['_shopSettings']['paystation']['access_data']['purchase']['virtual_items'] = {};
  }

  if (itemToSell) { //если чекаутим один товар
    this['_shopSettings']['paystation']['access_data']['purchase']['virtual_items']['items'] = [{'sku': itemToSell, 'amount': 1}];
  } else {
    return;
  }


  // access_data_cart.project_id = this._cartSettings.paystation['access_data']['settings']['project_id'];

  // var widgetInstance = XPayStationWidget.create(options1);


  var options = {
    'access_data': access_data,
    'lightbox': this._shopSettings.paystation.lightbox,
    'ui': this._shopSettings.paystation.ui
  };
  var thiss = this;
  setTimeout(function () { //Чтобы скролл окна убрать
    // thiss.debugCart(); //TODO убрать
    if (debug) console.log('options = ', options);
    if (debug) console.log('optionsTXT = ', JSON.stringify(options));
    XPayStationWidget.init(options);
    XPayStationWidget.open();
  }, 50);
}




ShopGood.prototype._onClick = function (trgt) {
  // var addBut = $(this.element).find(':attr(\'^data-kart-add\')');
  // if (trgt === addBut[0] || trgt.parentElebuildDatament === addBut[0]) {
  (this._grid._shop.cart) && this._grid._shop.cart.update(this.dataItem['sku'], '+');
  // }
  // if (trgt.classList.contains('k_q_but_minus') || trgt.parentElement.classList.contains('k_q_but_minus')) {
  //   this._shop.cart.update(this.dataItem['sku'], this.q - 1)
  // }
  // if (trgt.classList.contains('k_delete') || trgt.parentElement.classList.contains('k_delete')) {
  //   this._shop.cart.update(this.dataItem['sku'], 0)
  // }
}



Shop.prototype.addButtonsClicks = function (thisShop) {
  // this.addButtonsArr.each(function (i, obj) {

  //   obj.addEventListener('click', function (evt) {
  //     evt.stopPropagation();
  //     var el = obj;
  //     var plusOrMinus = '+';

  //     var sku = el.dataset.kartAdd; //TODO: сделать, чтобы датасет брался из настроек
  //     if (sku.split(',').length) {

  //     }

  //     thisShop.cart.update(sku, plusOrMinus);

  //   })
  // });
}






Shop.prototype.updateButtons = function (sku) {
  for (var i = 0; i < this.buttons.length; i++) {
    var but = this.buttons[i];
    but.upDateStatus();
  }
}






Shop.prototype.collectButtons = function () {
  //TODO: destroy previous
  var thiss = this;
  var $butsArr = $(':attr(\'^data-kart-update\')');
  $butsArr.each(function (i, element) {
    var newButton = new ShopStaticButton(element, thiss);
    thiss.buttons.push(newButton);
    newButton.upDateStatus();
    newButton.onClick = newButton._onClick;
    newButton.onHoverOn = newButton._onHoverOn;
    newButton.addListeners();
  });
}


Shop.prototype.addStaticPrices = function () {
  var thiss = this;
  var $pricesArr = $(':attr(\'^data-good-data\')');
  $pricesArr.each(function (i, element) {
    element.dataset.currency = thiss.currency[0];
    var sku = element.dataset['goodSku'];
    var typ = element.dataset['goodData'];

    if (window['addStaticPrices_callback']) {
      addStaticPrices_callback(element, thiss._data[sku], thiss.currency[0]); //если есть коллбек, то запустить его
    }

    //TODO: сделать логику oldprice и для ООП кнопок
    if (typ === 'image_url' || typ === 'image_url_custom') {
      //TODO: сделать картинки чтобы тоже
    } else if (typ === 'amount') {
      element.innerHTML = thiss.formattedPrice(thiss._data[sku]['amount']);
    } else if (typ === 'oldprice') {
      var oldpriCur = typ + thiss.currency[0];
      element.innerHTML = thiss.formattedPrice(thiss._data[sku][oldpriCur]);
    } else if (
      typ === 'name' ||
      typ === 'description' ||
      typ === 'long_description' ||
      typ === 'currency' ||
      typ === 'offer_label' ||
      typ === 'quantity_limit' ||
      typ === 'advertisement_type'
    ) {
      element.innerHTML = thiss._data[sku][typ];
    }
  });
}








function ShopStaticButton(domEl, parentShop) {
  this._shop = parentShop;
  this._cart = parentShop.cart;
  this.element = domEl;
  this.sku = domEl.dataset.kartUpdate.split(',')[0] || domEl.dataset.shopKartUpdate;
  this.do = domEl.dataset.kartUpdate.split(',')[1] || 'toggle'; // +, -, null
  this.already = this._cart.checkIfInCart(this.sku);
  this._onClick = this._onClick.bind(this);
  // this._onHoverOn = this._onHoverOn.bind(this);
  // this._onHoverOff = this._onHoverOff.bind(this);
  this.upDateStatus();
}




ShopStaticButton.prototype.upDateStatus = function () {
  this.already = this._shop.cart.checkIfInCart(this.sku);
  if (this.already) { //Default Action
    // this.element.classList.add('already');
    $('[data-kart-update=\'' + this.sku  + ',+\']').addClass('already');
    $('[data-kart-update=\'' + this.sku  + ',-\']').addClass('already');
    $('[data-kart-update=\'' + this.sku  + '\']').addClass('already');

  } else {
    // this.element.classList.remove('already');
    $('[data-kart-update=\'' + this.sku  + ',+\']').removeClass('already');
    $('[data-kart-update=\'' + this.sku  + ',-\']').removeClass('already');
    $('[data-kart-update=\'' + this.sku  + '\']').removeClass('already');

  }
  // if (typeof this._shop.cart.cartAddAnimation === 'function') {
  //   this._shop.cart.cartAddAnimation(this.element, this.already);
  // }
}





ShopStaticButton.prototype.onClick = null;
ShopStaticButton.prototype.onHoverOn = null;
// ShopButton.prototype.onHoverOff = null;







ShopStaticButton.prototype._onClick = function (trgt) {
  if (debug) console.log(this.sku);
  // var plusOrMinus = '+';


  // //TODO: сделать нормальный метод добавления удаления
  // if (this.already && this.element.classList.contains('button_buy--cart')) {
  //   plusOrMinus = '-';
  // }
  // if (this.already && this.element.classList.contains('bt_checkout')) {
  //   plusOrMinus = undefined; //TODO: разобраться с кнопками
  // }

  // // if (this.already && this.element.classList.contains('ix_bt_crtdelicon')) {
  // if (this.already && $(this.element).attr('data-kart-delete')) {
  //   console.log('ix_bt_crtdelicon = ');
  //   plusOrMinus = undefined; //TODO: разобраться с кнопками
  // }


  this._cart.update(this.sku, this.do)


  //Показываем ли корзину
  // var cartOpenClass = this._shop._settings['cartSettings']['cartOpenClass'];
  // // if (trgt.classList.contains(cartOpenClass) || trgt.parentElement.classList.contains(cartOpenClass)) {
  // if ($(cartOpenClass).find($(trgt)).length || $(cartOpenClass).find(trgt.childNodes[0]).length) {
  //   this._shop.cart.openCartAnimation();
  // }

  // this._shop.cart.update(this.sku, plusOrMinus);
  this._cart.afterChange();
  this.upDateStatus();
};





ShopStaticButton.prototype._onHoverOn = function () {
  if (debug) console.log(this.sku);
};






ShopStaticButton.prototype.addListeners = function () {
  var thiss = this;
  this['element'].addEventListener('click', function (evt) {
    evt.preventDefault();
    var trgt = evt.target;
    if (typeof thiss.onClick === 'function') {
      thiss.onClick(trgt);
    }


  });
  // this['element'].addEventListener('mouseover', function (evt) {
  //   evt.preventDefault();
  //   if (typeof thiss.onClick === 'function') {
  //     thiss.onHoverOn();
  //   }
  // }, true);
}


ShopStaticButton.prototype.removeListeners = function () {
  this['element'].removeEventListener('click', this['element']._onClick);
  this['element'].removeEventListener('mouseover', this['element']._onHoverOn);
  // this['element'].removeEventListener('mouseout', this['element']._onClick);
}

























function Cart(parentShop) {
  //* Cart Basics */
  this._shop = parentShop;
  this._cartSettings = this._shop._cartSettings;

  this.offvalue = false;
  this.paystation = this._cartSettings['paystation'] || {};
  this.renderedGoods = [];
  this.q = 0;
  this.total = 0;
  this.discount = 0;
  this.inCart = []; //передается в ПС
  //* Cart Custom Interactions */
  this.cartAddDiscount = this._cartSettings['cartAddDiscount'] || false;
  this.cartAddAnimation = this._cartSettings['cartAddAnimation'] || false;
  this.ixCartShow = this._cartSettings['cartShowAnim'] || false;
  this.ixCartHide = this._cartSettings['cartHideAnim'] || false;
  this.afterChangeCallback = this._cartSettings['afterChange'] || false;
  //* Cart Elements */
  this.$cartIcon = $(this._cartSettings.cartElements['cartIcon']) || false;
  this.$cartAddGlow = $(this._cartSettings.cartElements['cartAddGlow']);
  this.$cartCounter = $(this._cartSettings.cartElements['cartCounter']) || false;
  this.cartWrapper = $(this._cartSettings.cartElements['cartWrapper'])[0];
  this.cartUL = $(this.cartWrapper).find(this._cartSettings.cartElements['cartUL'])[0];
  this.$cartTot = $(this._cartSettings.cartElements['cartTotal']);
  this.$cartСlr = $(this._cartSettings.cartElements['cartClear']);
  this.$checkoutBut = $(this._cartSettings.cartElements['cartCheckoutBut']);
  this.$template = $(this.cartWrapper).find(this._cartSettings.cartElements['cartItemTemplate'])[0];
  this.$cartDiscountPrice = $(this.cartWrapper).find(this._cartSettings.cartElements['cartDiscountPrice']);
  //* Cart Misc */
  this.dataLoad();


  this.addListeners();
  this.addCheckOutClick();

  // this.addClearClick();
  // this.showCartClick();
  // this.cartOpeners();
  // this.cartClosers();

  this.afterChange();
  this.calculateTotal();
}





Cart.prototype.getShipping = function () {
  var needShipping = false;

  var skusIncart = this.data2skus(this.inCart)

  skusIncart.forEach(function(element, i){
    if (this._shop._data[element].shipping_enabled) {
      needShipping = true;
    }
  }.bind(this));

  this._shop._shopSettings.paystation.access_data.settings['shipping_enabled'] = needShipping;
}





Cart.prototype.cartOpeners = function () {
  var openButtons = $(this._cartSettings.cartElements['cartOpenClass']);
  var thiss = this;
  $.each(openButtons, function (i, item) {
    item.addEventListener('click', function (evt) {
      this.openCartAnimation();
    }.bind(this), true);
  }.bind(this));
}


Cart.prototype.openCartAnimation = function () {
  var ix_cartShow = this.ixCartShow || ixResetStates;
  if (typeof ix_cartShow !== 'object') return;
  var kb = this.cartWrapper.querySelector('.kb');
  var kz = this.cartWrapper.querySelector('.kz');

  this.cartWrapper.classList.add('shown');
  // this.cartWrapper.style.transform = '';
  ix.run(ixResetStates, kb);
  ix.run(ixResetStates, kz);
  if (this._cartSettings.cartOpenAnimation) this._cartSettings.cartOpenAnimation();
}

Cart.prototype.cartClosers = function () {
  var closeButtons = $(this._cartSettings.cartElements['cartCloseClass']);
  var thiss = this;
  $.each(closeButtons, function (i, item) {
    item.addEventListener('click', function (evt) {
      this.closeCartAnimation();
    }.bind(this), true);
  }.bind(this));
  if (this._cartSettings.cartCloseAnimation) this._cartSettings.cartCloseAnimation();
}


Cart.prototype.closeCartAnimation = function () {
  var ix_cartHide = this.ixCartHide || {
    'stepsA': [{
      'transition': 'transform 200 ease 0',
      'x': '0px',
      'y': '20px',
      'z': '0px',
      'opacity': 0,
    }],
    'stepsB': []
  }
  var ix_cartHide2 = {
    'stepsA': [{
      'opacity': 0,
      'transition': 'opacity 200 ease 0'
    }],
    'stepsB': []
  }

  if (typeof ix_cartHide === 'object') { //Чтобы запретить анимацию на проекте
    ix.run(ix_cartHide, this.cartWrapper.querySelector('.kb'));
    ix.run(ix_cartHide2, this.cartWrapper.querySelector('.kz'));
    setTimeout(function () {
      this.cartWrapper.classList.remove('shown');
    }.bind(this), 200);
  }
  if (this._cartSettings.cartCloseAnimation) this._cartSettings.cartCloseAnimation();
}




Cart.prototype.afterChange = function () {
  if (this.afterChangeCallback) this.afterChangeCallback(this);
}



Cart.prototype.checkIfInCart = function (sku) {
  var foundIndex = this.data2skus(this.inCart).indexOf(sku);
  return foundIndex < 0? false : true;
}




Cart.prototype.addListeners = function () {
  var thiss = this;
  var $buts = $(':attr(\'^data-kart\')');

  $buts.each(function (i, oneBut) {
      // if ($(oneBut).attr('data-kart-add')) {
      //   thiss.update($(oneBut).attr('data-kart-add'), '+')
      //   thiss.afterChange();
      //   if ($(oneBut).attr('data-kart-open')) {
      //     thiss.openCartAnimation();
      //   }
      // }

      // if ($(oneBut).attr('data-kart-remove')) {
      //   thiss.update($(oneBut).attr('data-kart-remove'), '-');
      //   thiss.afterChange();
      // }

      if ($(oneBut).attr('data-kart') === 'open') {
        // if (!$(oneBut).attr('data-kart-update')) {
          oneBut.addEventListener('click', function () {
            thiss.openCartAnimation();
          });
        // }
      }

      if ($(oneBut).attr('data-kart') === 'close') {
        oneBut.addEventListener('click', function (evt) {
          thiss.closeCartAnimation();
        }.bind(this), true);
      }

      if ($(oneBut).attr('data-kart') === 'clear') {
        oneBut.addEventListener('click', function () {
          thiss.clearCart();
        }.bind(thiss));
      }

    }.bind(this));
}






Cart.prototype.addCheckOutClick = function () {
  this.$checkoutBut[0].addEventListener('click', function () {
    this.checkoutCartItems();
    this.closeCartAnimation();
  }.bind(this));
}


Cart.prototype.checkoutCartItems = function (itemToSell) {

  // if (!itemToSell || !this.q) return; //если пустая корзина


  var access_data_cart = this._shop._shopSettings.paystation['access_data'];
  this.getShipping(); //Нужен ли шиппинг

  try {
    access_data_cart['user']['attributes']['promo'] = this.offvalue;
  } catch (e) { }
  // access_data_cart.
  //  var sku = $(this).data('sku');
  if (!this._shop._shopSettings.paystation['access_data']['purchase']) {
    this._shop._shopSettings.paystation['access_data']['purchase'] = {};
    this._shop._shopSettings.paystation['access_data']['purchase']['virtual_items'] = {};
  }

  if (itemToSell) { //если чекаутим один товар
    this._shop._shopSettings.paystation['access_data']['purchase']['virtual_items']['items'] = [{'sku': itemToSell, 'amount': 1}];
  } else {
    this._shop._shopSettings.paystation['access_data']['purchase']['virtual_items']['items'] = this.inCart;
  }


  // access_data_cart.project_id = this._cartSettings.paystation['access_data']['settings']['project_id'];

  // var widgetInstance = XPayStationWidget.create(options1);


  var options = {
    'access_data': access_data_cart,
    'lightbox': this._shop._shopSettings.paystation.lightbox,
    'ui': this._shop._shopSettings.paystation.ui
  };
  var thiss = this;
  setTimeout(function () { //Чтобы скролл окна убрать
    thiss.debugCart(); //TODO убрать
    if (debug) console.log('options = ', options);
    if (debug) console.log('optionsTXT = ', JSON.stringify(options));
    XPayStationWidget.init(options);
    XPayStationWidget.open();
  }, 50);
}





Cart.prototype.addClearClick = function () {
  var thiss = this;
  this.$cartСlr.each(function (i, oneClr) {
    oneClr.addEventListener('click', function () {
      thiss.clearCart();
    }.bind(thiss));
  })
}






Cart.prototype.showCartClick = function () {
  var thiss = this;
  this.$cartIcon.each(function (i, oneIcon) {
    oneIcon.addEventListener('click', function () {
      thiss.afterChange();
    });
  })
}






Cart.prototype.calculateTotal = function () {
  var tot = [];
  var amnt = [];
  for (var i = 0; i < this.inCart.length; i++) {
    var el = this.inCart[i];
    tot.push(parseFloat(this._shop._data[el['sku']]['amount'], 10) * el['amount']);
    amnt.push(el['amount']);
  }
  tot = tot.reduce(function(sum, current) {
    return sum + current;
  }, 0);
  this.q = amnt.reduce(function(sum, current) {
    return sum + current;
  }, 0);

  this.total = tot;
  this.addDiscount(); //Посчитать скидку, если есть формула скидки
  this.total = tot + this.discount; //тотал со скидкой, скидка уже отрицательная
  if (this.cartAddDiscount) {
    this.$cartDiscountPrice.html(this._shop.formattedPrice(this.discount));
  };
  this.iconCount();

  var tot = this.total;
  var thiss = this;
  this.$cartTot.each(function (i, oneTot) {
    oneTot.innerHTML = thiss._shop.formattedPrice(tot);
   })


  this.dataSave();
  this._shop.updateButtons();
  this.afterChange();
}






Cart.prototype.clearCart = function () {
  for (var i = 0; i < this.renderedGoods.length; i++) {
    var oneGood = this.renderedGoods[i];
    oneGood.destroy();
  }
  this.renderedGoods.length = 0;
  this.inCart.length = 0;
  this.calculateTotal();
  this.iconCount();
}






Cart.prototype.iconCount = function () { //TODO: нормально найти элементы

  var q = this.q;
  var thiss = this;

  this.$cartCounter.html(q);

  var cartIconBehavior = this._cartSettings['indicatorShown'];
  switch (cartIconBehavior) {
    case 'auto':
      if (!this.q) {
        this.$cartIcon.removeClass('shown');
      } else {
        this.$cartIcon.addClass('shown');
      }
      break;
    case 'shown':
      this.$cartIcon.addClass('shown');
      break;
  }

  var cartBodyBehavior = this._cartSettings['cartShown'];
  switch (cartBodyBehavior) {
    case 'auto':
      if (!this.q) {
        this.cartWrapper.classList.remove('shown');
      } else {
        this.cartWrapper.classList.add('shown');
      }
      break;
    case 'shown':
      this.cartWrapper.classList.add('shown');
      break;
    case 'default':
      // this.cartWrapper.classList.add('shown');
      break;
  }

  if (!q) {
    this.$checkoutBut[0].classList.add('disabled');
  } else {
    this.$checkoutBut[0].classList.remove('disabled');
  }

}






Cart.prototype.debugCart = function () {
  for (var i = 0; i < this.inCart.length; i++) {
    if (debug) console.log(this.inCart[i]);
  }
}






Cart.prototype.update = function (sku, newAmount) {
  //this.q++; //общее кол-во товаров в корзине

  var ind = this.data2skus(this.inCart).indexOf(sku);
  var changedDataItem = this.inCart[ind];

  if (newAmount === 'toggle' || !(typeof newAmount)) {
    if (this.checkIfInCart(sku)) {
      newAmount = '-';
    } else {
      newAmount = '+';
    }
  }
  if (newAmount === '+') {
    if (ind < 0) {
      newAmount = 1;
    } else {
      newAmount = changedDataItem['amount'] + 1;
    }
  }
  if (newAmount === '-') {
    if (ind < 0) {
      newAmount = 0;
    } else {
      newAmount = changedDataItem['amount'] - 1;
    }
  }

  var quanityChanged = false;
  if (this.inCart.length) {
    //если уже есть и надо проверить
    for (var i = 0; i < this.inCart.length; i++) {
      var dataItemOne = this.inCart[i];
      //If there's already a hat of this type
      if (dataItemOne['sku'] === sku) {
        if (newAmount) {
          dataItemOne['amount'] = newAmount;
          this.changeAmountHtml(sku, newAmount);
        } else {
          this.changeAmountHtml(sku, 0);
          delete this.inCart[i];
        }
        quanityChanged = true;
      }
      this.inCart = _.compact(this.inCart);
    }
  } else {
    for (var i = 0; i < this.renderedGoods.length; i++) {
      this.changeAmountHtml(this.renderedGoods[i]['dataItem']['sku'], 0)
      if (debug) console.log('deleted');
    }
  }
  if (!quanityChanged) {
    this.inCart.push({ 'sku': sku, 'amount': 1 })
    this.drawOneGood(sku, 1);
  }
  this.iconCount();
  this.calculateTotal();
  this.addGlow();
}


Cart.prototype.addGlow = function () {
  // try {
    var effect_1 = (window['ix_addGlow_1']) ? ix_addGlow_1 : {
      'stepsA': [{
        'opacity': 0.7,
        'scale': 3,
        'transition': 'transform 300ms ease 0ms, opacity 300ms ease 0ms',
      }]
    };
    var effect_0 = (window['ix_addGlow_0']) ? ix_addGlow_0 : {
      'stepsA': [{
        'opacity': 0,
        'scale': 0.1,
        'transition': 'transform 50ms ease 0ms, opacity 50ms ease 0ms',
      }]
    };
    var qGlow = this.$cartAddGlow[0];
    ix.run(effect_1, qGlow);
    setTimeout(function () {
      ix.run(effect_0, qGlow);
    }, 200);
  // } catch (e) { }
}



Cart.prototype.dataLoad = function () {
  var projectId = this._shop._shopSettings.paystation.access_data.settings.project_id;
  this.inCart = localStorage.getItem('xsolla_cart' + projectId);
  this.inCart = JSON.parse(this.inCart);
  if (this.inCart === null) {
    this.inCart = [];
  }
  this.data2render();
  // this.update();
}






Cart.prototype.dataSave = function () {
  var projectId = this._shop._shopSettings.paystation.access_data.settings.project_id;
  if (debug) console.log('projectId = ', projectId);
  localStorage.setItem('xsolla_cart' + projectId, JSON.stringify(this.inCart))
}






Cart.prototype.data2skus = function (dataArr) {
  var dataSkus = false;
  if (dataArr) {
    dataSkus = []; //Collect all skus from data

    for (var u = 0; u < dataArr.length; u++) {
      var oneSku = dataArr[u]['sku'];
      dataSkus.push(oneSku);
    }
  }
  return dataSkus;
}






Cart.prototype.render2data = function () {
  var dataFromRender;
  if (this.renderedGoods && this.renderedGoods.length) {
    dataFromRender = [];
    for (var i = 0; i < this.renderedGoods.length; i++) {
      var el = this.renderedGoods[i];
      dataFromRender.push(el.dataItem);
    }
  }
  return dataFromRender;
}

Cart.prototype.data2render = function () { //TODO: delete
  if (!this.inCart.length) return;
  for (i = 0; i < this.inCart.length; i++) {
    var newEl = new CartGood(this, this.inCart[i], this.$template);
    this.renderedGoods.push(newEl)
    this.appearOneGood(newEl);
  }
}





Cart.prototype.drawAll = function () {
  for (var i = 0; i < this.renderedGoods.length; i++) {
    var newEl = this.renderedGoods[i];
    this.appearOneGood(newEl);
  }
}






Cart.prototype.drawOneGood = function (sku, amount) {
  var newEl = new RenderedGood(this, {'sku': sku, 'amount': amount}, this.$template);
  this.renderedGoods.push(newEl);
  this.appearOneGood(newEl);
}



Cart.prototype.appearOneGood = function (newEl) {
  newEl.updateControls();
  newEl.element.style.opacity = 0;
  newEl.element.classList.remove('hidden');
  this.cartUL.appendChild(newEl.element);
  var initialHeight = newEl.element.clientHeight;
  ixKItemAppear.stepsA[0].height = initialHeight; //TODO: скопировать переменную
  newEl.element.style.height = 0;
  ix.run(ixKItemAppear, newEl.element);
}

Cart.prototype.disAppearOneGood = function (newEl) {
  // newEl.element.style.height = 100;
  $(newEl['element']).css('pointer-events', 'none');
  ix.run(ixKItemDisAppear, newEl.element);
  var thisEl = newEl.element;
  setTimeout(function () {
    thisEl.parentElement.removeChild(thisEl);
  }, 100);
}



Cart.prototype.changeAmountHtml = function (goodSku, newAmount) {
  var numb = this.data2skus(this.inCart).indexOf(goodSku);
  if (numb < 0) { return };
  if (newAmount) {
    this.renderedGoods[numb]['q'] = newAmount;
    this.renderedGoods[numb].updateQ();
  } else {
    this.deleteElement(this.renderedGoods[numb]);
  }
}








Cart.prototype.deleteElement = function (renderedGood) {
  var indToDel = this.renderedGoods.indexOf(renderedGood);
  if (indToDel < 0) return;
  delete this.renderedGoods[indToDel];
  this.renderedGoods = _.compact(this.renderedGoods);
  renderedGood.destroy();
}






Cart.prototype.removeGood = function (renderedGood) {
  this.q--;
  var skuToDelete = renderedGood.good['sku'];
  var changed = false;
  for (var u = 0; u < this.inCart.length; u++) {
    var oneSku = this.inCart[u];
    if (oneSku['sku'] === skuToDelete && !changed) { //Find sku in cart
      oneSku['amount']--;
      changed = true;
      renderedGood.q--;
      renderedGood.element = renderedGood.renderGood();
    }
  }
}






Cart.prototype.addDiscount = function () {
  if (!this.cartAddDiscount) {
    return;
  }
  var discountCallback = this.cartAddDiscount(this);
  this.discount = discountCallback[0];
  this.offvalue = discountCallback[1];
  //Прописать полученную скидку в поле скидка
  if (this.cartAddDiscount) {
    this.$cartDiscountPrice.html(this._shop.formattedPrice(this.discount));
  };
}







///*********************************///
///*********************************///
///*********************************///
///*********************************///
///*********************************///
///*********************************///








function RenderedGood(parentCart, dataItem, template) {
  this._cart = parentCart;
  this._shop = parentCart._shop;
  this.template = template;
  this.dataItem = dataItem; // {'sku': 'sku', 'amount', 1}
  this.sku = this.dataItem['sku'];
  this.q = this.dataItem['amount'];
  this.image_url = this._shop._data[this.sku]['image_url'];
  this.name = this._shop._data[this.sku]['name'];
  this.desc = this._shop._data[this.sku]['description'];
  this.price = this._shop._data[this.sku]['amount'];
  this.element = this.renderGood();
  this._onClick = this._onClick.bind(this);
  this._onHoverOn = this._onHoverOn.bind(this);
  this._onHoverOff = this._onHoverOff.bind(this);
  this.updateControls();
}





RenderedGood.prototype.renderGood = function () {
  var newEl = this.template.cloneNode(true);
  newEl.classList.remove('hidden');
  newEl.dataset.template = 'false';

  try {
    $(newEl).find('[data-kart-good=\'image_url\']')[0].style.backgroundImage = 'url(\'' + this.image_url + '\')';
  } catch (e) { }
  try {
    $(newEl).find('[data-kart-good=\'name\']')[0].innerHTML = this.name;
  } catch (e) { }
  try {
    $(newEl).find('[data-kart-good=\'desc\']')[0].innerHTML = this.desc;
  } catch (e) { }
  try {
    $(newEl).find('[data-kart-good=\'amount\']')[0].innerHTML = this._shop.formattedPrice(this.price * this.q);
  } catch (e) { }
  try {
    $(newEl).find('[data-kart-good=\'q_q\']')[0].innerHTML = this['q'];
  } catch (e) { }

  this.onClick = this._onClick;
  this.onHoverOn = this._onHoverOn;
  this.onHoverOff = this._onHoverOff;

  newEl.addEventListener('mouseover', function (evt) {
    evt.preventDefault();
    if (typeof this.onHoverOn === 'function') {
      this.onHoverOn();
    }
  }.bind(this));
  newEl.addEventListener('mouseout', function (evt) {
    evt.preventDefault();
    if (typeof this.onHoverOff === 'function') {
      this.onHoverOff();
    }
  }.bind(this));
  newEl.addEventListener('click', function (evt) {
    var trgt = evt.target;
    evt.preventDefault();
    if (typeof this.onClick === 'function') {
      this.onClick(trgt);
    }
  }.bind(this));

  return newEl;
}









RenderedGood.prototype._onHoverOn = function () {
  if (isMobile) return;
  if ($(this.element).parent().find('[data-kart-good=\'q_plus\']')) {
    //Vertical controls
    ix.run(ixKPlus, $(this.element).find('[data-kart-good=\'q_plus\']')[0]); //TODO: если нужна анимация плюсов и минусов
    ix.run(ixKMinus, $(this.element).find('[data-kart-good=\'q_minus\']').parent()[0]);

    //Horizontal
    // var buttons = this.element.querySelectorAll('.k_q_but');
    // collectionDo(buttons, function (el) {
    //   ix.run(ixKshowControls, el);
    // });
  }
}






RenderedGood.prototype._onHoverOff = function () {
  if (isMobile) return;
  if (!this.element.classList.contains('item_active')) {

    // Vertical
    var buttonsPlus = $(this.element).find('[data-kart-good=\'q_plus\']');
    collectionDo(buttonsPlus, function (el) {
      ix.run(ixKPlusMinusOff, el);
    });

    var buttonsMinus = $(this.element).find('[data-kart-good=\'q_minus\']').parent();
    collectionDo(buttonsMinus, function (el) {
      ix.run(ixKPlusMinusOff, el);
    });

    //Horizontal
    // var buttons = this.element.querySelectorAll('.k_q_but');
    // collectionDo(buttons, function (el) {
    //   ix.run(ixHideControls, el);
    // });
  }
}







RenderedGood.prototype._onClick = function (trgt) {
  if ($(trgt).attr('data-kart-good') === 'q_plus' || $(trgt).parent().attr('data-kart-good') === 'q_plus') {
    this._cart.update(this.dataItem['sku'], this.q + 1)
  }
  if ($(trgt).attr('data-kart-good') === 'q_minus' || $(trgt).parent().attr('data-kart-good') === 'q_minus') {
    this._cart.update(this.dataItem['sku'], this.q - 1)
  }
  if ($(trgt).attr('data-kart-good') === 'delete' || $(trgt.parentElement).attr('data-kart-good') === 'delete') {
    this._cart.update(this.dataItem['sku'], 0)
  }
}





RenderedGood.prototype.destroy = function () {
  this['element'].removeEventListener('click', this['element']._onClick);
  this['element'].removeEventListener('mouseover', this['element']._onClick);
  this['element'].removeEventListener('mouseout', this['element']._onClick);
  this._cart.disAppearOneGood(this);
}






RenderedGood.prototype.updateControls = function () {
  //Change Minus to Delete
  if (this.q > 1) {
    $(this['element']).find('[data-kart-good=\'delete\']').addClass('disabled');
    $(this['element']).find('[data-kart-good=\'q_minus\']').removeClass('disabled');
  } else {
    $(this['element']).find('[data-kart-good=\'delete\']').removeClass('disabled');
    $(this['element']).find('[data-kart-good=\'q_minus\']').addClass('disabled');
  }
}






RenderedGood.prototype.updateQ = function () {
  $(this['element']).find('[data-kart-good=\'q_q\']')[0].textContent = this['q'];
  $(this['element']).find('[data-kart-good=\'amount\']')[0].innerHTML = this._shop.formattedPrice(this.price * this.q);
  this.updateControls();
  var ix_qChange_1 = ix_qChange_1 || {
    'stepsA': [{
      'opacity': 1,
      'scale': 1.2,
      'transition': 'transform 100ms ease 0ms, opacity 200ms ease 0ms',
    }]
  };
  var ix_qChange_0 = ix_qChange_0 || {
    'stepsA': [{
      'opacity': 0.3,
      'scale': 1,
      'transition': 'transform 100ms ease 0ms, opacity 200ms ease 0ms',
    }]
  };
  try {
    var qGlow = $(this.element).find(':attr(\'^data-kart-num_glow\')')[0];
    qGlow.classList.remove('hidden');
    ix.run(ix_qChange_1, qGlow);
    setTimeout(function () {
      ix.run(ix_qChange_0, qGlow);
      setTimeout(function () {
        qGlow.classList.add('hidden');
      }, 100);
    }, 100);
  } catch (e) { }

}


