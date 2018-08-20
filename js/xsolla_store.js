
var debug = debug || true; //вывод всяких сообщений в консоль


requirejs.config({
  baseUrl: 'http://xsolla.maiik.ru/xsolla_store/js/'
});

define([
  'xsolla_store_shop'
], function (Shop) {

   function Xsolla (mainSettings) {
     this._mainSettings = this.mergeSettings(mainSettings);
    this.callbacks = this._mainSettings['callbacks'];
    this.callbacksArr = [
      [this.setPreloader, 'hide']
    ];
    this.preloader = this.setPreloader();
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
    this.loadFromPs();
    // this.theme = 'xxx_theme_light';
    this.theme = this.load('theme') || this._shopSettings['theme'] || null;
    this.applyTheme();
    this.addListeners();
    // $(':attr(\'^data-q-cats\')')[0].innerHTML = thiss.getCats(this._shopSettings['shopData'], 'html');
    // $(':attr(\'^data-q-grids-textarea\')')[0].value = JSON.stringify(this._shopSettings['defaultGrids']);
  }





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
      setTimeout(function () {
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
      this.callbacksArr.forEach(function (item, i) {
        if (typeof item === "object") {
          item[0](thiss, item[1] || null, item[2] || null, item[3] || null)
        } else {
          item[0](thiss)
        }
      })

    }
  }



  Xsolla.prototype.mergeSettings = function (newMainSettings) {


    // newMainSettings = _.merge(mainSettings_default, newMainSettings);

    newMainSettings['shopSettings'] = _.merge(mainSettings_default['shopSettings'], newMainSettings['shopSettings']);
    if (newMainSettings['cartSettings']) {
      newMainSettings['cartSettings'] = _.merge(mainSettings_default['cartSettings'], newMainSettings['cartSettings']);
    } else {
      newMainSettings['cartSettings'] = null;
    }


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




  Xsolla.prototype.loadFromPs = function (storeCreatedCallback) {
    var thiss = this;
    //Запрос за итемами
    // this.getVirtualItems(storeCreatedCallback);
    this.getVirtualItems();
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
        if (debug) console.log(val);

        thiss.project_id = $('[data-q-form=\'project_id_value\']')[0].value;
        thiss.getVirtualItems(null, thiss.showSets, thiss.project_id, val);
        //Подмена Сеток
      })

    } catch (e) {}
  }



  Xsolla.prototype.getVirtualItems = function (callbackF, callbackP1, callbackP2) {
    access_data = this._shopSettings['paystation']['access_data'];
    thiss = this;

    //Если статичная дата
    if (thiss._shopSettings.staticData) {
      thiss._shopSettings['shopData'] = thiss._shopSettings.staticData['groups'];
      if (typeof callbackF === 'function') {
        callbackF(thiss, callbackP1, callbackP2);
      }
      // document.querySelector('.prettyprint').innerHTML = JSON.stringify(data['groups'][0]['virtual_items']);
      thiss.createShop(thiss._shopSettings);

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
        thiss.createShop(thiss._shopSettings);


        thiss.afterLoadCallbacks();

      },
      error: function () {
        alert('The project is not configured properly. Make sure the server integration is turned off.');
      }
    });
  }





  Xsolla.prototype.createShop = function (shopSettings) {
    if (typeof shop !== 'object') {
      this.shop = new Shop(this, shopSettings); //TODO: разобраться с передачей коллбека
    }
    this.callbacks['callbackAfterStore'] && this.callbacks['callbackAfterStore']();
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
      catsHTML += '<li>' + item + '</li>\n'
    })
    if (mode === 'html') return catsHTML;
  }

  return Xsolla;
});


