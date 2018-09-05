define([
  'xsolla_store_shop_good_pop',
], function (ShopGoodPop) {




  function ShopGood(_grid, dataItem, template) {
    this._grid = _grid;
    this._shop = _grid._shop;
    this._xsolla = _grid._shop._xsolla;
    this.dataItem = dataItem;
    this.sku = this.dataItem['sku'];
    this.container;
    this.template = template || this.getTemplate();
    this.element = this.renderShopGood();
    this._onClick = this._onClick.bind(this);
    this.isFavorite = this.getFavorite();
    this.pop = this._shop._shopSettings['shopPop'] ? new ShopGoodPop(this) : null;
    // this._onHoverOn = this._onHoverOn.bind(this);
    // this._onHoverOff = this._onHoverOff.bind(this);
  }

  ShopGood.prototype.createPop = function () {


  }



  ShopGood.prototype.getTemplate = function () {
    this.container = $(this._grid.element).find(':attr(\'^data-good-template\')')[0].parentElement;
    return $(this._grid.element).find(':attr(\'^data-good-template\')')[0];
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
        $(newEl).find('[data-good=\'image_url\']')[0].style.backgroundImage = 'url(' + thiss.dataItem['image_url'] + ')';
      }
    } catch (e) { }

    if ($(newEl).find('[data-good=\'image_url_custom\']').length && thiss.dataItem['image_url_custom']) {
      $(newEl).find('[data-good=\'image_url_custom\']')[0].style.backgroundImage = 'url(' + thiss.dataItem['image_url_custom'] + ')';
    }

    if ($(newEl).find('[data-good=\'image_url_custom\']').length && !thiss.dataItem['image_url_custom']) {
      $(newEl).find('[data-good=\'image_url_custom\']')[0].style.backgroundImage = 'url(' + thiss.dataItem['image_url'] + ')';
    }

    if ($(newEl).find('[data-good=\'youtube\']').length && thiss.dataItem['youtube']) {
      var you = $(newEl).find('[data-good=\'youtube\']')[0];
      // var iframe = document.createElement("iframe");
      // you.setAttribute("src", "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1&border=0&wmode=opaque&enablejsapi=1");
      you.setAttribute("src", thiss.dataItem['youtube']);
    }


    // if ($(newEl).find('[data-good=\'image_url_custom\']').length) {
    //   try {
    //     $(newEl).find('[data-good=\'image_url_custom\']')[0].style.backgroundImage = 'url(' + thiss.dataItem.image_url_custom + ')';
    //   } catch (e) { }
      // $(newEl).hover(
      //   function () {
      //     $(this).find('[data-kart-good=\'image_url\']').css('background-image', 'url(' + thiss.dataItem.image_url_custom_hover + ')')
      //   },
      //   function () {
      //     $(this).find('[data-kart-good=\'image_url\']').css('background-image', 'url(' + thiss.dataItem.image_url_custom + ')')
      //   },
      // );
    // } else {
    //   try {
    //     $(newEl).find('[data-good=\'image_url_custom\']')[0].style.backgroundImage = 'url(' + thiss.dataItem['image_url'] + ')';
    //   } catch (e) { }
    // }

    $(newEl).find('[data-good=\'name\']')[0].innerHTML = this.dataItem['name'];
    $(newEl).find('[data-good=\'desc\']')[0].innerHTML = this.dataItem['description'];
    $(newEl).find('[data-good=\'amount\']')[0].innerHTML = this._shop.formattedPrice(this.dataItem['amount']);

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




  return ShopGood;

});