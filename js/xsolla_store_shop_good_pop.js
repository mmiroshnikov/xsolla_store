define([
  'xsolla_store_shop_good_pop',
], function (ShopGoodPopPop) {




  function ShopGoodPop(_good) {
    this._good = _good;
    this.popEl = this.getPopTemplate();
    this.popGood;
    if (this.popEl) {
      this.popGood = new ShopGood(this._good, this._good.dataItem, this.popEl)
    }
  }

  ShopGoodPop.prototype.getPopTemplate = function () {
    return $(this._good).find('.item_pop')[0];
  }


  return ShopGoodPop;

});