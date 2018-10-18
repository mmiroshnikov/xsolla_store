define([
  'xsolla_store_shop',
], function () {


    function CartGood(parentCart, dataItem, template) {
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





    CartGood.prototype.renderGood = function () {
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






    var ix = ix || Webflow.require('ix');

    var ixKshowControls = {
      'stepsA': [{
        'opacity': 1,
        'transition': 'opacity 200ms ease 0ms',
      }]
    };

    var ixHideControls = {
      'stepsA': [{
        'opacity': 0,
        'transition': 'opacity 200ms ease 0ms',
      }]
    };

    var ixKPlus = ixKPlus || {
      'stepsA': [{
        'opacity': 1,
        'transition': 'transform 200ms ease 0ms, opacity 200ms ease 0ms',
        'scaleX': 1,
        'scaleY': 1,
        'scaleZ': 1,
        'y': '-26px',
      }]
    };

    var ixKMinus = ixKMinus || {
      'stepsA': [{
        'opacity': 1,
        'transition': 'transform 200ms ease 0ms, opacity 200ms ease 0ms',
        'scaleX': 1,
        'scaleY': 1,
        'scaleZ': 1,
        'y': '26px',
      }]
    };

    var ixKPlusMinusOff = ixKPlusMinusOff || {
      'stepsA': [{
        'opacity': 0,
        'transition': 'transform 200ms ease 0ms, opacity 200ms ease 0ms',
        'scaleX': 1,
        'scaleY': 1,
        'scaleZ': 1,
        'y': '0px',
      }]
    };


    var ixKItemAppear = ixKItemAppear || {
      'stepsA': [{
        'opacity': 1,
        'transition': 'transform 100ms ease 0ms, opacity 100ms ease 0ms',
        'height': '100px'
      }]
    };



    var ixKItemDisAppear = ixKItemDisAppear || {
      'stepsA': [{
        'opacity': 0,
        'transition': 'transform 100ms ease 0ms, opacity 100ms ease 0ms',
        'height': '0px'
      }]
    };




    CartGood.prototype._onHoverOn = function () {
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






    CartGood.prototype._onHoverOff = function () {
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







    CartGood.prototype._onClick = function (trgt) {
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





    CartGood.prototype.destroy = function () {
      this['element'].removeEventListener('click', this['element']._onClick);
      this['element'].removeEventListener('mouseover', this['element']._onClick);
      this['element'].removeEventListener('mouseout', this['element']._onClick);
      this._cart.disAppearOneGood(this);
    }






    CartGood.prototype.updateControls = function () {
      //Change Minus to Delete
      if (this.q > 1) {
        $(this['element']).find('[data-kart-good=\'delete\']').addClass('disabled');
        $(this['element']).find('[data-kart-good=\'q_minus\']').removeClass('disabled');
      } else {
        $(this['element']).find('[data-kart-good=\'delete\']').removeClass('disabled');
        $(this['element']).find('[data-kart-good=\'q_minus\']').addClass('disabled');
      }
    }






    CartGood.prototype.updateQ = function () {
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


  return CartGood;

  });