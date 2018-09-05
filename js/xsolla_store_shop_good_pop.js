define([
], function () {




  function ShopGoodPop(_good) {
    this._good = _good;
    this.el = this.getPopTemplate();
    this.popGood;
    if (this.el) {
      this.popGood = new ShopGood(this._good, this._good.dataItem, this.el)
    }
  }

  ShopGoodPop.prototype.getPopTemplate = function () {
    return $(this._good.element).find('.item_pop')[0];
  }


  return ShopGoodPop;

});