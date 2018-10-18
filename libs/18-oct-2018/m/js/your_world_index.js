




//Эти идут
var shopSettings_YW =
  {
    'callbacks': {
      'cartAfterChange': typeof showCartNoti !== 'undefined' ? showCartNoti : null, //Callback when something changed in the cart
      'storeCreatedCallback': '',
      // 'callbackAfterStore': getCookie,
    },
    // 'cartSettings': {
    //   'indicatorShown': false, //auto
    //   'cartShown': false, //auto
    //   // 'cartAddAnimation': typeof cartAddAnimation !== 'undefined' ? cartAddAnimation : null,
    //   // 'cartAddDiscount': typeof cartAddDiscount !== 'undefined' ? cartAddDiscount : null,
    //   'currency': ['$', 0],
    // },
    'shopSettings': {
      'shopPop': 'swiper', //simple | swiper
      'paystation': {
        'access_data': {
          'user': {
            'attributes': {
              // 'promo': false,
            }
          },
          'settings': {
            'project_id': 24644,
            // 'shipping_enabled': true
            'ui': {
              'size': 'medium',
              // 'theme': 'dark'
            },
          },
        },
      },
      // 'theme': 'xxx_theme_yw',
      'defaultGrids':
        [
//          {
//            'header': 'Popular Worlds',
//            'groupId': 7718,
//            'template': 'template_slider',
//            'callback': 'createSwiper',
//          },
          {
            'groupId': 7718, //'popular'
            'template': 'template1',
            // 'title': 'Popular Worlds'
            //'callback': 'createPopSwiper',
          },
          // {
          //   'groupId': 6717, //'popular'
          //   'template': 'default',
          //   'header': 'All Other Worlds',
          //   // 'callback': 'createPopSwiper',
          // }
      ],
    },
    //'customAttrs': yw_custom_attributes, //Custom Pictures and shipping
    'noDynamicStoreftont': false,

    // 'defaultGrids': [
    //   {
    //     'where': '#grid_mainpacks_new',
    //     'typeName': 'group',
    //     'typeValue': 'Mainpacks',
    //     'title': 'Phoenix Point Packs',
    //   },
    //   {
    //     'where': '#grid_addons',
    //     'typeName': 'group',
    //     'typeValue': 'Addons',
    //     'title': 'Phoenix Point Addons',
    //   },
    // ]
};




