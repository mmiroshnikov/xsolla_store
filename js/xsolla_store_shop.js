/* global _*/
// 'use strict';



define([
  'xsolla_store_cart',
  'xsolla_store_shop_grid',
  'xsolla_store_shop_staticbutton',
  'widget.min',
], function (Cart, ShopGrid, ShopStaticButton, XPayStationWidget) {



  function Shop(_xsolla, settings) {
    this._xsolla = _xsolla || false;
    this._settings = this._xsolla._mainSettings;
    this._shopSettings = this._settings['shopSettings'];
    this._cartSettings = this._settings['cartSettings'] || null;
    this.currency; //Будет перезаписана в buildData ['$', 0];
    this._data = this.buildData(this._shopSettings['shopData']);
    this.buttons = [];
    this.groups = [];

    if (this._settings['cartSettings']) this.cart = this.cart || new Cart(this);

    if (this._shopSettings['noDynamicStoreftont']) { //Simple Plain Shop with cart
      this.collectButtons();
      this.addStaticPrices();
    } else { //Shop-shop
      this.groups = this.getGroups();
      this.gridsArray = {};
      if (this._shopSettings['defaultGrids'] === 'all' || !this._shopSettings['defaultGrids']) { //Все категории
        this.groups.forEach(function (group) {
          this.createGrid(group);
        }.bind(this));
      } else { //Только те, что подходят под критерии
        var butNotArray = [];
        this._shopSettings['defaultGrids'].forEach(function (oneGridInfo, i) {

          if (oneGridInfo['groupId'] === 'all') {

            this.groups.forEach(function (group) {
              this.createGrid(group, butNotArray);
            }.bind(this));

          } else {

            this.gridsArray[oneGridInfo['groupId']] = new ShopGrid(this, oneGridInfo);
            butNotArray.push(oneGridInfo['groupId'])
          }

        }.bind(this));
      }
    }

    this.paystInit();

  }



  Shop.prototype.paystInit = function () {
    // var psInit = this._shopSettings['psInit'];
    // psInit();
    return;
  }




  Shop.prototype.createGrid = function (grp, butNotArray) {
    var groupId = grp['id'];
    if (butNotArray && butNotArray.indexOf(groupId) >= 0) return;
    var groupName = grp['name'];
    var oneGridInfo = {};
    oneGridInfo['groupId'] = groupId;
    this.gridsArray[oneGridInfo['groupId']] = new ShopGrid(this, oneGridInfo);
  }


  // Shop.prototype.getGridTemplate = function () {
  //   return $('[data-good=\'template\']')[0].parentElement;
  // }



  Shop.prototype.getGroups = function () { //DELETE
    var shopGroups = [];
    this._shopSettings.shopData.forEach(function (grp) {
      var groupName = grp['name'];
      var groupId = grp['id'];
      shopGroups.push({ 'id': groupId, 'name': groupName });
    });
    return shopGroups;
  }





  Shop.prototype.getCurrency = function () {
    var allCurrencies = {
      "USD": {
        "symbol": "$",
        "name": "US Dollar",
        "symbol_native": "$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "USD",
        "name_plural": "US dollars"
      },
      "CAD": {
        "symbol": "CA$",
        "name": "Canadian Dollar",
        "symbol_native": "$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "CAD",
        "name_plural": "Canadian dollars"
      },
      "EUR": {
        "symbol": "€",
        "name": "Euro",
        "symbol_native": "€",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "EUR",
        "name_plural": "euros"
      },
      "AED": {
        "symbol": "AED",
        "name": "United Arab Emirates Dirham",
        "symbol_native": "د.إ.‏",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "AED",
        "name_plural": "UAE dirhams"
      },
      "AFN": {
        "symbol": "Af",
        "name": "Afghan Afghani",
        "symbol_native": "؋",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "AFN",
        "name_plural": "Afghan Afghanis"
      },
      "ALL": {
        "symbol": "ALL",
        "name": "Albanian Lek",
        "symbol_native": "Lek",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "ALL",
        "name_plural": "Albanian lekë"
      },
      "AMD": {
        "symbol": "AMD",
        "name": "Armenian Dram",
        "symbol_native": "դր.",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "AMD",
        "name_plural": "Armenian drams"
      },
      "ARS": {
        "symbol": "AR$",
        "name": "Argentine Peso",
        "symbol_native": "$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "ARS",
        "name_plural": "Argentine pesos"
      },
      "AUD": {
        "symbol": "AU$",
        "name": "Australian Dollar",
        "symbol_native": "$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "AUD",
        "name_plural": "Australian dollars"
      },
      "AZN": {
        "symbol": "man.",
        "name": "Azerbaijani Manat",
        "symbol_native": "ман.",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "AZN",
        "name_plural": "Azerbaijani manats"
      },
      "BAM": {
        "symbol": "KM",
        "name": "Bosnia-Herzegovina Convertible Mark",
        "symbol_native": "KM",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "BAM",
        "name_plural": "Bosnia-Herzegovina convertible marks"
      },
      "BDT": {
        "symbol": "Tk",
        "name": "Bangladeshi Taka",
        "symbol_native": "৳",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "BDT",
        "name_plural": "Bangladeshi takas"
      },
      "BGN": {
        "symbol": "BGN",
        "name": "Bulgarian Lev",
        "symbol_native": "лв.",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "BGN",
        "name_plural": "Bulgarian leva"
      },
      "BHD": {
        "symbol": "BD",
        "name": "Bahraini Dinar",
        "symbol_native": "د.ب.‏",
        "decimal_digits": 3,
        "rounding": 0,
        "code": "BHD",
        "name_plural": "Bahraini dinars"
      },
      "BIF": {
        "symbol": "FBu",
        "name": "Burundian Franc",
        "symbol_native": "FBu",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "BIF",
        "name_plural": "Burundian francs"
      },
      "BND": {
        "symbol": "BN$",
        "name": "Brunei Dollar",
        "symbol_native": "$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "BND",
        "name_plural": "Brunei dollars"
      },
      "BOB": {
        "symbol": "Bs",
        "name": "Bolivian Boliviano",
        "symbol_native": "Bs",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "BOB",
        "name_plural": "Bolivian bolivianos"
      },
      "BRL": {
        "symbol": "R$",
        "name": "Brazilian Real",
        "symbol_native": "R$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "BRL",
        "name_plural": "Brazilian reals"
      },
      "BWP": {
        "symbol": "BWP",
        "name": "Botswanan Pula",
        "symbol_native": "P",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "BWP",
        "name_plural": "Botswanan pulas"
      },
      "BYR": {
        "symbol": "BYR",
        "name": "Belarusian Ruble",
        "symbol_native": "BYR",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "BYR",
        "name_plural": "Belarusian rubles"
      },
      "BZD": {
        "symbol": "BZ$",
        "name": "Belize Dollar",
        "symbol_native": "$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "BZD",
        "name_plural": "Belize dollars"
      },
      "CDF": {
        "symbol": "CDF",
        "name": "Congolese Franc",
        "symbol_native": "FrCD",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "CDF",
        "name_plural": "Congolese francs"
      },
      "CHF": {
        "symbol": "CHF",
        "name": "Swiss Franc",
        "symbol_native": "CHF",
        "decimal_digits": 2,
        "rounding": 0.05,
        "code": "CHF",
        "name_plural": "Swiss francs"
      },
      "CLP": {
        "symbol": "CL$",
        "name": "Chilean Peso",
        "symbol_native": "$",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "CLP",
        "name_plural": "Chilean pesos"
      },
      "CNY": {
        "symbol": "CN¥",
        "name": "Chinese Yuan",
        "symbol_native": "CN¥",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "CNY",
        "name_plural": "Chinese yuan"
      },
      "COP": {
        "symbol": "CO$",
        "name": "Colombian Peso",
        "symbol_native": "$",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "COP",
        "name_plural": "Colombian pesos"
      },
      "CRC": {
        "symbol": "₡",
        "name": "Costa Rican Colón",
        "symbol_native": "₡",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "CRC",
        "name_plural": "Costa Rican colóns"
      },
      "CVE": {
        "symbol": "CV$",
        "name": "Cape Verdean Escudo",
        "symbol_native": "CV$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "CVE",
        "name_plural": "Cape Verdean escudos"
      },
      "CZK": {
        "symbol": "Kč",
        "name": "Czech Republic Koruna",
        "symbol_native": "Kč",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "CZK",
        "name_plural": "Czech Republic korunas"
      },
      "DJF": {
        "symbol": "Fdj",
        "name": "Djiboutian Franc",
        "symbol_native": "Fdj",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "DJF",
        "name_plural": "Djiboutian francs"
      },
      "DKK": {
        "symbol": "Dkr",
        "name": "Danish Krone",
        "symbol_native": "kr",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "DKK",
        "name_plural": "Danish kroner"
      },
      "DOP": {
        "symbol": "RD$",
        "name": "Dominican Peso",
        "symbol_native": "RD$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "DOP",
        "name_plural": "Dominican pesos"
      },
      "DZD": {
        "symbol": "DA",
        "name": "Algerian Dinar",
        "symbol_native": "د.ج.‏",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "DZD",
        "name_plural": "Algerian dinars"
      },
      "EEK": {
        "symbol": "Ekr",
        "name": "Estonian Kroon",
        "symbol_native": "kr",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "EEK",
        "name_plural": "Estonian kroons"
      },
      "EGP": {
        "symbol": "EGP",
        "name": "Egyptian Pound",
        "symbol_native": "ج.م.‏",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "EGP",
        "name_plural": "Egyptian pounds"
      },
      "ERN": {
        "symbol": "Nfk",
        "name": "Eritrean Nakfa",
        "symbol_native": "Nfk",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "ERN",
        "name_plural": "Eritrean nakfas"
      },
      "ETB": {
        "symbol": "Br",
        "name": "Ethiopian Birr",
        "symbol_native": "Br",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "ETB",
        "name_plural": "Ethiopian birrs"
      },
      "GBP": {
        "symbol": "£",
        "name": "British Pound Sterling",
        "symbol_native": "£",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "GBP",
        "name_plural": "British pounds sterling"
      },
      "GEL": {
        "symbol": "GEL",
        "name": "Georgian Lari",
        "symbol_native": "GEL",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "GEL",
        "name_plural": "Georgian laris"
      },
      "GHS": {
        "symbol": "GH₵",
        "name": "Ghanaian Cedi",
        "symbol_native": "GH₵",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "GHS",
        "name_plural": "Ghanaian cedis"
      },
      "GNF": {
        "symbol": "FG",
        "name": "Guinean Franc",
        "symbol_native": "FG",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "GNF",
        "name_plural": "Guinean francs"
      },
      "GTQ": {
        "symbol": "GTQ",
        "name": "Guatemalan Quetzal",
        "symbol_native": "Q",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "GTQ",
        "name_plural": "Guatemalan quetzals"
      },
      "HKD": {
        "symbol": "HK$",
        "name": "Hong Kong Dollar",
        "symbol_native": "$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "HKD",
        "name_plural": "Hong Kong dollars"
      },
      "HNL": {
        "symbol": "HNL",
        "name": "Honduran Lempira",
        "symbol_native": "L",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "HNL",
        "name_plural": "Honduran lempiras"
      },
      "HRK": {
        "symbol": "kn",
        "name": "Croatian Kuna",
        "symbol_native": "kn",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "HRK",
        "name_plural": "Croatian kunas"
      },
      "HUF": {
        "symbol": "Ft",
        "name": "Hungarian Forint",
        "symbol_native": "Ft",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "HUF",
        "name_plural": "Hungarian forints"
      },
      "IDR": {
        "symbol": "Rp",
        "name": "Indonesian Rupiah",
        "symbol_native": "Rp",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "IDR",
        "name_plural": "Indonesian rupiahs"
      },
      "ILS": {
        "symbol": "₪",
        "name": "Israeli New Sheqel",
        "symbol_native": "₪",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "ILS",
        "name_plural": "Israeli new sheqels"
      },
      "INR": {
        "symbol": "Rs",
        "name": "Indian Rupee",
        "symbol_native": "টকা",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "INR",
        "name_plural": "Indian rupees"
      },
      "IQD": {
        "symbol": "IQD",
        "name": "Iraqi Dinar",
        "symbol_native": "د.ع.‏",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "IQD",
        "name_plural": "Iraqi dinars"
      },
      "IRR": {
        "symbol": "IRR",
        "name": "Iranian Rial",
        "symbol_native": "﷼",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "IRR",
        "name_plural": "Iranian rials"
      },
      "ISK": {
        "symbol": "Ikr",
        "name": "Icelandic Króna",
        "symbol_native": "kr",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "ISK",
        "name_plural": "Icelandic krónur"
      },
      "JMD": {
        "symbol": "J$",
        "name": "Jamaican Dollar",
        "symbol_native": "$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "JMD",
        "name_plural": "Jamaican dollars"
      },
      "JOD": {
        "symbol": "JD",
        "name": "Jordanian Dinar",
        "symbol_native": "د.أ.‏",
        "decimal_digits": 3,
        "rounding": 0,
        "code": "JOD",
        "name_plural": "Jordanian dinars"
      },
      "JPY": {
        "symbol": "¥",
        "name": "Japanese Yen",
        "symbol_native": "￥",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "JPY",
        "name_plural": "Japanese yen"
      },
      "KES": {
        "symbol": "Ksh",
        "name": "Kenyan Shilling",
        "symbol_native": "Ksh",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "KES",
        "name_plural": "Kenyan shillings"
      },
      "KHR": {
        "symbol": "KHR",
        "name": "Cambodian Riel",
        "symbol_native": "៛",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "KHR",
        "name_plural": "Cambodian riels"
      },
      "KMF": {
        "symbol": "CF",
        "name": "Comorian Franc",
        "symbol_native": "FC",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "KMF",
        "name_plural": "Comorian francs"
      },
      "KRW": {
        "symbol": "₩",
        "name": "South Korean Won",
        "symbol_native": "₩",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "KRW",
        "name_plural": "South Korean won"
      },
      "KWD": {
        "symbol": "KD",
        "name": "Kuwaiti Dinar",
        "symbol_native": "د.ك.‏",
        "decimal_digits": 3,
        "rounding": 0,
        "code": "KWD",
        "name_plural": "Kuwaiti dinars"
      },
      "KZT": {
        "symbol": "KZT",
        "name": "Kazakhstani Tenge",
        "symbol_native": "тңг.",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "KZT",
        "name_plural": "Kazakhstani tenges"
      },
      "LBP": {
        "symbol": "LB£",
        "name": "Lebanese Pound",
        "symbol_native": "ل.ل.‏",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "LBP",
        "name_plural": "Lebanese pounds"
      },
      "LKR": {
        "symbol": "SLRs",
        "name": "Sri Lankan Rupee",
        "symbol_native": "SL Re",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "LKR",
        "name_plural": "Sri Lankan rupees"
      },
      "LTL": {
        "symbol": "Lt",
        "name": "Lithuanian Litas",
        "symbol_native": "Lt",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "LTL",
        "name_plural": "Lithuanian litai"
      },
      "LVL": {
        "symbol": "Ls",
        "name": "Latvian Lats",
        "symbol_native": "Ls",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "LVL",
        "name_plural": "Latvian lati"
      },
      "LYD": {
        "symbol": "LD",
        "name": "Libyan Dinar",
        "symbol_native": "د.ل.‏",
        "decimal_digits": 3,
        "rounding": 0,
        "code": "LYD",
        "name_plural": "Libyan dinars"
      },
      "MAD": {
        "symbol": "MAD",
        "name": "Moroccan Dirham",
        "symbol_native": "د.م.‏",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "MAD",
        "name_plural": "Moroccan dirhams"
      },
      "MDL": {
        "symbol": "MDL",
        "name": "Moldovan Leu",
        "symbol_native": "MDL",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "MDL",
        "name_plural": "Moldovan lei"
      },
      "MGA": {
        "symbol": "MGA",
        "name": "Malagasy Ariary",
        "symbol_native": "MGA",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "MGA",
        "name_plural": "Malagasy Ariaries"
      },
      "MKD": {
        "symbol": "MKD",
        "name": "Macedonian Denar",
        "symbol_native": "MKD",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "MKD",
        "name_plural": "Macedonian denari"
      },
      "MMK": {
        "symbol": "MMK",
        "name": "Myanma Kyat",
        "symbol_native": "K",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "MMK",
        "name_plural": "Myanma kyats"
      },
      "MOP": {
        "symbol": "MOP$",
        "name": "Macanese Pataca",
        "symbol_native": "MOP$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "MOP",
        "name_plural": "Macanese patacas"
      },
      "MUR": {
        "symbol": "MURs",
        "name": "Mauritian Rupee",
        "symbol_native": "MURs",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "MUR",
        "name_plural": "Mauritian rupees"
      },
      "MXN": {
        "symbol": "MX$",
        "name": "Mexican Peso",
        "symbol_native": "$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "MXN",
        "name_plural": "Mexican pesos"
      },
      "MYR": {
        "symbol": "RM",
        "name": "Malaysian Ringgit",
        "symbol_native": "RM",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "MYR",
        "name_plural": "Malaysian ringgits"
      },
      "MZN": {
        "symbol": "MTn",
        "name": "Mozambican Metical",
        "symbol_native": "MTn",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "MZN",
        "name_plural": "Mozambican meticals"
      },
      "NAD": {
        "symbol": "N$",
        "name": "Namibian Dollar",
        "symbol_native": "N$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "NAD",
        "name_plural": "Namibian dollars"
      },
      "NGN": {
        "symbol": "₦",
        "name": "Nigerian Naira",
        "symbol_native": "₦",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "NGN",
        "name_plural": "Nigerian nairas"
      },
      "NIO": {
        "symbol": "C$",
        "name": "Nicaraguan Córdoba",
        "symbol_native": "C$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "NIO",
        "name_plural": "Nicaraguan córdobas"
      },
      "NOK": {
        "symbol": "NOK",
        "name": "Norwegian Krone",
        "symbol_native": "kr",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "NOK",
        "name_plural": "Norwegian kroner"
      },
      "NPR": {
        "symbol": "NPRs",
        "name": "Nepalese Rupee",
        "symbol_native": "नेरू",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "NPR",
        "name_plural": "Nepalese rupees"
      },
      "NZD": {
        "symbol": "NZ$",
        "name": "New Zealand Dollar",
        "symbol_native": "$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "NZD",
        "name_plural": "New Zealand dollars"
      },
      "OMR": {
        "symbol": "OMR",
        "name": "Omani Rial",
        "symbol_native": "ر.ع.‏",
        "decimal_digits": 3,
        "rounding": 0,
        "code": "OMR",
        "name_plural": "Omani rials"
      },
      "PAB": {
        "symbol": "B/.",
        "name": "Panamanian Balboa",
        "symbol_native": "B/.",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "PAB",
        "name_plural": "Panamanian balboas"
      },
      "PEN": {
        "symbol": "S/.",
        "name": "Peruvian Nuevo Sol",
        "symbol_native": "S/.",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "PEN",
        "name_plural": "Peruvian nuevos soles"
      },
      "PHP": {
        "symbol": "₱",
        "name": "Philippine Peso",
        "symbol_native": "₱",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "PHP",
        "name_plural": "Philippine pesos"
      },
      "PKR": {
        "symbol": "PKRs",
        "name": "Pakistani Rupee",
        "symbol_native": "₨",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "PKR",
        "name_plural": "Pakistani rupees"
      },
      "PLN": {
        "symbol": "zł",
        "name": "Polish Zloty",
        "symbol_native": "zł",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "PLN",
        "name_plural": "Polish zlotys"
      },
      "PYG": {
        "symbol": "₲",
        "name": "Paraguayan Guarani",
        "symbol_native": "₲",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "PYG",
        "name_plural": "Paraguayan guaranis"
      },
      "QAR": {
        "symbol": "QR",
        "name": "Qatari Rial",
        "symbol_native": "ر.ق.‏",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "QAR",
        "name_plural": "Qatari rials"
      },
      "RON": {
        "symbol": "RON",
        "name": "Romanian Leu",
        "symbol_native": "RON",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "RON",
        "name_plural": "Romanian lei"
      },
      "RSD": {
        "symbol": "din.",
        "name": "Serbian Dinar",
        "symbol_native": "дин.",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "RSD",
        "name_plural": "Serbian dinars"
      },
      "RUB": {
        "symbol": "₽",
        "name": "Russian Ruble",
        "symbol_native": "руб.",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "RUB",
        "name_plural": "Russian rubles"
      },
      "RWF": {
        "symbol": "RWF",
        "name": "Rwandan Franc",
        "symbol_native": "FR",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "RWF",
        "name_plural": "Rwandan francs"
      },
      "SAR": {
        "symbol": "SR",
        "name": "Saudi Riyal",
        "symbol_native": "ر.س.‏",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "SAR",
        "name_plural": "Saudi riyals"
      },
      "SDG": {
        "symbol": "SDG",
        "name": "Sudanese Pound",
        "symbol_native": "SDG",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "SDG",
        "name_plural": "Sudanese pounds"
      },
      "SEK": {
        "symbol": "Skr",
        "name": "Swedish Krona",
        "symbol_native": "kr",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "SEK",
        "name_plural": "Swedish kronor"
      },
      "SGD": {
        "symbol": "S$",
        "name": "Singapore Dollar",
        "symbol_native": "$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "SGD",
        "name_plural": "Singapore dollars"
      },
      "SOS": {
        "symbol": "Ssh",
        "name": "Somali Shilling",
        "symbol_native": "Ssh",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "SOS",
        "name_plural": "Somali shillings"
      },
      "SYP": {
        "symbol": "SY£",
        "name": "Syrian Pound",
        "symbol_native": "ل.س.‏",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "SYP",
        "name_plural": "Syrian pounds"
      },
      "THB": {
        "symbol": "฿",
        "name": "Thai Baht",
        "symbol_native": "฿",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "THB",
        "name_plural": "Thai baht"
      },
      "TND": {
        "symbol": "DT",
        "name": "Tunisian Dinar",
        "symbol_native": "د.ت.‏",
        "decimal_digits": 3,
        "rounding": 0,
        "code": "TND",
        "name_plural": "Tunisian dinars"
      },
      "TOP": {
        "symbol": "T$",
        "name": "Tongan Paʻanga",
        "symbol_native": "T$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "TOP",
        "name_plural": "Tongan paʻanga"
      },
      "TRY": {
        "symbol": "TL",
        "name": "Turkish Lira",
        "symbol_native": "TL",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "TRY",
        "name_plural": "Turkish Lira"
      },
      "TTD": {
        "symbol": "TT$",
        "name": "Trinidad and Tobago Dollar",
        "symbol_native": "$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "TTD",
        "name_plural": "Trinidad and Tobago dollars"
      },
      "TWD": {
        "symbol": "NT$",
        "name": "New Taiwan Dollar",
        "symbol_native": "NT$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "TWD",
        "name_plural": "New Taiwan dollars"
      },
      "TZS": {
        "symbol": "TSh",
        "name": "Tanzanian Shilling",
        "symbol_native": "TSh",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "TZS",
        "name_plural": "Tanzanian shillings"
      },
      "UAH": {
        "symbol": "₴",
        "name": "Ukrainian Hryvnia",
        "symbol_native": "₴",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "UAH",
        "name_plural": "Ukrainian hryvnias"
      },
      "UGX": {
        "symbol": "USh",
        "name": "Ugandan Shilling",
        "symbol_native": "USh",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "UGX",
        "name_plural": "Ugandan shillings"
      },
      "UYU": {
        "symbol": "$U",
        "name": "Uruguayan Peso",
        "symbol_native": "$",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "UYU",
        "name_plural": "Uruguayan pesos"
      },
      "UZS": {
        "symbol": "UZS",
        "name": "Uzbekistan Som",
        "symbol_native": "UZS",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "UZS",
        "name_plural": "Uzbekistan som"
      },
      "VEF": {
        "symbol": "Bs.F.",
        "name": "Venezuelan Bolívar",
        "symbol_native": "Bs.F.",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "VEF",
        "name_plural": "Venezuelan bolívars"
      },
      "VND": {
        "symbol": "₫",
        "name": "Vietnamese Dong",
        "symbol_native": "₫",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "VND",
        "name_plural": "Vietnamese dong"
      },
      "XAF": {
        "symbol": "FCFA",
        "name": "CFA Franc BEAC",
        "symbol_native": "FCFA",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "XAF",
        "name_plural": "CFA francs BEAC"
      },
      "XOF": {
        "symbol": "CFA",
        "name": "CFA Franc BCEAO",
        "symbol_native": "CFA",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "XOF",
        "name_plural": "CFA francs BCEAO"
      },
      "YER": {
        "symbol": "YR",
        "name": "Yemeni Rial",
        "symbol_native": "ر.ي.‏",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "YER",
        "name_plural": "Yemeni rials"
      },
      "ZAR": {
        "symbol": "R",
        "name": "South African Rand",
        "symbol_native": "R",
        "decimal_digits": 2,
        "rounding": 0,
        "code": "ZAR",
        "name_plural": "South African rand"
      },
      "ZMK": {
        "symbol": "ZK",
        "name": "Zambian Kwacha",
        "symbol_native": "ZK",
        "decimal_digits": 0,
        "rounding": 0,
        "code": "ZMK",
        "name_plural": "Zambian kwachas"
      }
    }; //TODO: сделать XHR или типа того
    return allCurrencies[this.currency[0]].symbol;
  }

  Shop.prototype.formatCurrency = function (cur) {
    return [cur, 0]; //TODO: подключить модуль валют с разделителями и т. п.
    //0 — валюта перед числом, 1 – валюта после числа
  }


  Shop.prototype.formattedPrice = function (price) {

    price = Math.round(price * 100) / 100;
    price = price.toString();
    var priceCheck = price.split('.');
    if (priceCheck && priceCheck.length === 2 && priceCheck[1].length === 1) {
      price = price + '0'; //добавляет 0, чтобы было $49.50, а не $49.5
    }

    //Чтобы ставить минус перед знаком валюты
    price = price.toString();
    var minuss = '';
    if (price.indexOf('-') === 0) {
      minuss = '&minus;';
      price = price.substring(1);
    }


    var delimeter = '.'; //TODO: сделать правильный локальный разделитель

    delimeter = '<span class=\'xsolla_price_delimeter\'>' + delimeter + '</span>';
    var priceSpans = price.split('.');
    if (priceSpans.length === 2) {
      var priceSpans0 = '<span class=\'xsolla_price_integer\'>' + priceSpans[0] + '</span>';
      var priceSpans1 = '<span class=\'xsolla_price_decimal\'>' + priceSpans[1] + '</span>';
      price = priceSpans0 + delimeter + priceSpans1;
    } else {
      price = '<span class=\'xsolla_price_integer\'>' + priceSpans[0] + '</span>';
    }

    var formatted;
    if (this.currency[1] === 0) { //0 — валюта перед числом, 1 – валюта после числа
      formatted = '<span class=\'xsolla_price_currency\'>' + this.getCurrency() + '</span>' + price;
    } else {
      formatted = price + '&thinsp;' + this.getCurrency();
    }
    formatted = minuss + formatted;
    return formatted;
  }




  Shop.prototype.buildData = function (data) {
    var jsonAllGoods = {};
    var thiss = this;
    data.forEach(function (grp) {
      var groupName = grp['name'];
      var groupId = grp['id'];
      var groupItems = grp['virtual_items'];
      groupItems.forEach(function (item) {
        if (!this.currency) this.currency = this.formatCurrency(item.currency);

        if (jsonAllGoods[item.sku]) {
          jsonAllGoods[item.sku]['group'].push(groupName);
          jsonAllGoods[item.sku]['groupId'].push(groupId);
        } else {
          jsonAllGoods[item.sku] = item;
          jsonAllGoods[item.sku]['group'] = [groupName];
          jsonAllGoods[item.sku]['groupId'] = [groupId];
        }
      }, thiss);
    });

    try {
      Object.keys(thiss._settings['customAttrs']).forEach(function (skuu) {
        Object.keys(thiss._settings['customAttrs'][skuu]).forEach(function (element) {
          jsonAllGoods[skuu][element] = thiss._settings['customAttrs'][skuu][element];
        });
      });
    } catch (e) { }
    return jsonAllGoods;
  }




  Shop.prototype.getIndexes = function (typeName, typeVal) {
    var arr = [];
    Object.keys(this._data).forEach(function (sku, i) {
      var add = false;
      if (!typeName && !typeVal) add = true; //TODO: default grids
      var item = this._data[sku];
      var typeValItem = item[typeName]
      if (typeValItem === typeVal || (typeof typeValItem === 'Object' && typeValItem.indexOf(typeVal) > -1)) {
        add = true;
      };
      if (typeof typeValItem === 'object') {
        if (typeValItem.indexOf(typeVal) >= 0) add = true;
      };
      if (add) arr.push(sku);
    }.bind(this));
    arr = _.compact(arr);
    return arr;
  }



  Shop.prototype.checkoutItem = function (itemToSell) {

    // if (!itemToSell || !this.q) return; //если пустая корзина


    var access_data = this._shopSettings.paystation['access_data'];
    // this.getShipping(); //Нужен ли шиппинг

    try {
      access_data['user']['attributes']['promo'] = this.offvalue;
    } catch (e) { }
    // access_data.
    //  var sku = $(this).data('sku');
    if (!this['_shopSettings']['paystation']['access_data']['purchase']) {
      this['_shopSettings']['paystation']['access_data']['purchase'] = {};
      this['_shopSettings']['paystation']['access_data']['purchase']['virtual_items'] = {};
    }

    if (itemToSell) { //если чекаутим один товар
      this['_shopSettings']['paystation']['access_data']['purchase']['virtual_items']['items'] = [{'sku': itemToSell, 'amount': 1}];
    } else {
      return;
    }


    // access_data_cart.project_id = this._cartSettings.paystation['access_data']['settings']['project_id'];

    // var widgetInstance = XPayStationWidget.create(options1);


    var options = {
      'access_data': access_data,
      'lightbox': this._shopSettings.paystation.lightbox,
      'ui': this._shopSettings.paystation.ui
    };
    var thiss = this;
    setTimeout(function () { //Чтобы скролл окна убрать
      // thiss.debugCart(); //TODO убрать
      if (debug) console.log('options = ', options);
      if (debug) console.log('optionsTXT = ', JSON.stringify(options));
      XPayStationWidget.init(options);
      XPayStationWidget.open();
      window.XPayStationWidget = XPayStationWidget;
    }, 50);
  }



  Shop.prototype.addButtonsClicks = function (thisShop) {
    // this.addButtonsArr.each(function (i, obj) {

    //   obj.addEventListener('click', function (evt) {
    //     evt.stopPropagation();
    //     var el = obj;
    //     var plusOrMinus = '+';

    //     var sku = el.dataset.kartAdd; //TODO: сделать, чтобы датасет брался из настроек
    //     if (sku.split(',').length) {

    //     }

    //     thisShop.cart.update(sku, plusOrMinus);

    //   })
    // });
  }






  Shop.prototype.updateButtons = function (sku) {
    for (var i = 0; i < this.buttons.length; i++) {
      var but = this.buttons[i];
      but.upDateStatus();
    }
  }





  Shop.prototype.collectButtons = function () {
    //TODO: destroy previous
    var thiss = this;
    var $butsArr = $(':attr(\'^data-kart-update\')');
    $butsArr.each(function (i, element) {
      var newButton = new ShopStaticButton(element, thiss);
      thiss.buttons.push(newButton);
      newButton.upDateStatus();
      newButton.onClick = newButton._onClick;
      newButton.onHoverOn = newButton._onHoverOn;
      newButton.addListeners();
    });
  }


  Shop.prototype.addStaticPrices = function () {
    var thiss = this;
    var $pricesArr = $(':attr(\'^data-good-data\')');
    $pricesArr.each(function (i, element) {
      element.dataset.currency = thiss.currency[0];
      var sku = element.dataset['goodSku'];
      var typ = element.dataset['goodData'];

      if (window['addStaticPrices_callback']) {
        addStaticPrices_callback(element, thiss._data[sku], thiss.currency[0]); //если есть коллбек, то запустить его
      }

      //TODO: сделать логику oldprice и для ООП кнопок

      if (typ === 'image_url' || typ === 'image_url_custom') {
        //TODO: сделать картинки чтобы тоже
      } else if (typ === 'amount') {
        element.innerHTML = thiss.formattedPrice(thiss._data[sku]['amount']);
      } else if (typ === 'oldprice') {
        var oldpriCur = typ + thiss.currency[0];
        element.innerHTML = thiss.formattedPrice(thiss._data[sku][oldpriCur]);
      } else if (
        typ === 'name' ||
        typ === 'description' ||
        typ === 'long_description' ||
        typ === 'currency' ||
        typ === 'offer_label' ||
        typ === 'quantity_limit' ||
        typ === 'advertisement_type'
      ) {
        element.innerHTML = thiss._data[sku][typ];
      }
    });
  }



  return Shop;
})
