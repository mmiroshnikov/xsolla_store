define([
  'xsolla_store_shop_good',
  'swiper',
  'fragbuilder'
], function (ShopGood, Swiper, FragBuilder) {

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
    this.popSwiper;
    this._dataArr = this._shop.getIndexes(this.typeName, this.typeVal);
    this.element = this.renderGrid();
    this.goodPopups = null;
    this.renderedGoods = this.renderShopGoods(this.element);;
    this.addHeaderName();
    // this.dowSomethingWithPopups();
    if (typeof this[this._group['callback']] === 'function') {
      this[this._group['callback']]()
    };
  }


  ShopGrid.prototype.createSwiper = function () {

    // this._shop._settings.callbacks['callbackAfterStore'] && this._shop._settings.callbacks['callbackAfterStore']();
      var toDeleteW = $('#swiper_featured').find('.swiper-wrapper.hidden');
      toDeleteW[0].parentElement.removeChild(toDeleteW[0]);

      var toDeleteS = $('#swiper_featured').find('.swiper-slide.hidden');
      toDeleteS[0].parentElement.removeChild(toDeleteS[0]);


      var mySwiper = new Swiper('#swiper_featured', {
        // slidesPerView: 'auto',
        // spaceBetween: 0,
        // initialSlide: 1,
        // setWrapperSize: true,
        navigation: {
          nextEl: '.swiper-button-next-m',
          prevEl: '.swiper-button-prev-m',
        },
        noSwipingClass: 'swiper-button_prev-next',
        pagination: {
          el: '.swiper-pagination',
        },
        // direction: 'horizontal',
        // loop: true, //no loop in controlled mode
        // centeredSlides: true
      });

  }

  ShopGrid.prototype.createPopSwiper = function () {
    // if (this._shop._shopSettings.shopPop !== 'swiper' || !this.goodPopups) return;



    //Create Swiper Cont————————————————————————
    var swiperCont = [
      {
        'div': {
          'class': 'item_xy',
          'id': 'xsolla_store_pops',
          'children': [{
            'div': {
              'class': 'item_pop shown',
              'children': [{
                  'div': {
                      'class': 'item_pop_z popup_close',
                      'text': ''
                  }
                },
                {
                  'div': {
                      'class': 'item_pop_x popup_close',
                      'text': 'close'
                  }
                },
                {
                  'div': {
                    'class': 'swiper-container swiper-container--pop',
                    'id': 'xsolla_store_pops_swiper',
                    'children': [{
                      'div': {
                        'class': 'swiper-wrapper',
                        //'style': {
                        // 'color': 'green'
                        //},
                        //'text': 'Hello World!',
                      }
                    },
                    {
                      'div': {
                        'class': 'swiper-button_prev-next swiper-button_prev-next--pop swiper-button-next-m',
                        'text': 'chevron_right',
                        'style': {
                          'outline': 'none'
                        }
                      }
                    },
                    {
                      'div': {
                        'class': 'swiper-button_prev-next swiper-button_prev-next--pop swiper-button-prev-m',
                        'text': 'chevron_left',
                        'style': {
                          'outline': 'none'
                        }
                      }
                    },
                    {
                      'div': {
                        'class': 'swiper-pagination swiper-pagination-bullets',
                      }
                    }
                    ]
                },
              }]
            }
          }
          ]
        }
      }
    ];
    var newSwiperCont = new FragBuilder(swiperCont);
    newSwiperCont = newSwiperCont.el['children'][0];
    document.body.appendChild(newSwiperCont);




    //Create Slides————————————————————————

    var slides = this.goodPopups;
    Object.keys(slides).forEach(function (popName, i) {
      var swiperSlide = [
        {
          'div': {
            'class': 'swiper-slide popup_close',
            'id': 'xsolla_store_pops',
            'children': [{
              'div': {
                'class': 'item_xy shown',
                'children': [{
                  'div': {
                    'class': 'item_c',
                    'style': {
                      // 'width': '100%'
                    },
                    'children': [{
                      'div': {
                        'class': 'item_pop_b'
                      }
                    }]
                  }
                }]
              }

            }]
          }
        }




      ];
      var newSwiperSlide = new FragBuilder(swiperSlide);
      newSwiperSlide = newSwiperSlide.el['children'][0];

      newSwiperCont.querySelector('.swiper-wrapper').appendChild(newSwiperSlide);
      var oneSlide = slides[popName];
      $(oneSlide.el.querySelector('.item_container'))[0].dataset.idd = oneSlide._good.sku;
      $(oneSlide.el.querySelector('.item_container')).detach().appendTo(newSwiperSlide.querySelector('.item_pop_b'));

    })



    //Create Swiper————————————————————————
    //Clean css
    $(newSwiperCont).css({
      'opacity': 0,
      'pointer-events': 'none',
      'display':'flex'
    });
    this.popSwiper = new Swiper('#xsolla_store_pops_swiper', {
      pagination: {
        el: '.swiper-pagination'
      },
      navigation: {
        nextEl: '.swiper-button-next-m',
        prevEl: '.swiper-button-prev-m',
      },
      noSwipingClass: 'swiper-button_prev-next',
      slidesPerView: 1,
      setWrapperSize: true,
      // spaceBetween: 0,
      // initialSlide: 1,
      // direction: 'horizontal',
      // loop: true, //no loop in controlled mode
      // centeredSlides: true
    });
    //Clean css
    $(newSwiperCont).css({
      'opacity': '',
      'pointer-events': '',
      'display':''
    });



    //CLICKS————————————————————————


    var thiss = this;
    var closePop = function () {
      $(newSwiperCont).find('.item_pop_z').removeClass('shown');
        $(newSwiperCont).find('.item_pop_b').removeClass('shown');
        setTimeout(function () {
          newSwiperCont.classList.remove('shown');
        },200)
        // $('html, body').animate({scrollTop: scrolltoY }, scrollToSpeed);
    }
    //CLOSE
    $('.popup_close').on({
      click: function (evt) {
        closePop();
      }
    })
    //OTHER CLICKS

  }

  ShopGrid.prototype.showPopup = function (slideToNumber) {

    var newSwiperCont = $('#xsolla_store_pops')[0];


    newSwiperCont.classList.add('shown');
    setTimeout(function () {
      $(newSwiperCont).find('.item_pop_z').addClass('shown');
      $(newSwiperCont).find('.item_pop_b').addClass('shown');
    },20)
    this.popSwiper.slideTo(slideToNumber, 0); //, speed, runCallbacks
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
      tmpl = $('[data-good-template=\'' + 'default' + '\']')[0].parentElement; //Нахождит дефолтный
    } else {
      // var templateName = this._shop._settings.shopSettings.gridDesign[type];
      var templateName = this._group['template'];

      tmpl = $('[data-good-template=\'' + templateName + '\']').closest('[data-shop-grid=\'template\']')[0] ||
        $('[data-good-template=\'' + templateName + '\']')[0].parentElement;
    }
    tmpl.classList.add('hidden');
    return tmpl;
  }





  ShopGrid.prototype.renderShopGoods = function () {

    var allGoods = {};

    this._dataArr.forEach(function (sku, i) {
      var dataItem = this._shop._data[sku];
      var newGood = new ShopGood(this, dataItem, null, i)
      newGood.container.appendChild(newGood.element);
      if (newGood.pop) {
        if (!this.goodPopups) this.goodPopups = {};
        this.goodPopups[sku] = newGood.pop;
      }
      // this.where.appendChild(newGood.element);
      allGoods[sku] = newGood;
    }.bind(this))
    return allGoods;
  }

  return ShopGrid;

});