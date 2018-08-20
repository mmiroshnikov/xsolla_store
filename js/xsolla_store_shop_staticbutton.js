define([
  'xsolla_store_shop',
], function () {







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




  return ShopStaticButton;

});