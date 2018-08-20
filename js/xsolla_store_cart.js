define([
  'xsolla_store_shop',
  'xsolla_store_shop_renderedgood',
  'widget.min',
], function (Shop, RenderedGood, XPayStationWidget) {





  function Cart(parentShop) {
    //* Cart Basics */
    this._shop = parentShop;
    this._xsolla = this._shop._xsolla;
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
    this.afterChangeCallback = this._xsolla['callbacks']['cartAfterChange'] || false;
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

    this.afterChangeCallback && this.afterChangeCallback();
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

    // this._shop._shopSettings.paystation.access_data.settings['shipping_enabled'] = needShipping;
    return needShipping;
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
    this.afterChangeCallback && this.afterChangeCallback(this);
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

    this._shop._shopSettings.paystation['access_data']['settings']['shipping_enabled'] = this.getShipping();
    var access_data_cart = this._shop._shopSettings.paystation['access_data'];



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
      // window.widgetInstance = XPayStationWidget;
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
      var newEl = new RenderedGood(this, this.inCart[i], this.$template);
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





  return Cart;

});