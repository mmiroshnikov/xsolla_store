define([
//   'xsolla_store_shop_good'
// ], function (ShopGood) {
], function () {


  function ShopGoodPop(_good, ShopGood) {
    this._good = _good;
    this.el = this.getPopTemplate();
    this.popGood;
    if (this.el) {
      // this.popGood = new ShopGood(this._good, this._good.dataItem, this.el)
      this.addListenets();
    }
  }

  ShopGoodPop.prototype.getPopTemplate = function () {
    return $(this._good.element).find('.item_pop')[0];
  }

  ShopGoodPop.prototype.addListenets = function () {
    var thiss = this;

    //CLOSE
    $(this.el).find('.item_pop_z').on({
      click: function (evt) {
        $(thiss.el).find('.item_pop_z').removeClass('shown');
        $(thiss.el).find('.item_pop_b').removeClass('shown');
        setTimeout(function () {
          thiss.el.classList.remove('shown');
        },200)
        // $('html, body').animate({scrollTop: scrolltoY }, scrollToSpeed);
      }

      //OTHER CLICKS

  })
  }


  return ShopGoodPop;
});