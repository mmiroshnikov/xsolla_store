define([
], function () {

  function GenericPopups() {

    this.popups = this.getPopups();

  }


  GenericPopups.prototype.getPopups = function () {
    var p = {};

    $(':attr(\'^data-xpop\')').each(function (i, oneTrigger) {
      var popData = oneTrigger.dataset.xpop;
      if (popData.split(',').length > 1) {
        var popName = popData.split(',')[1];
        var trigger = oneTrigger;
        p[popName + Object.keys(p).length] = {
          'name': popName,
          'trigger': trigger,
          '$pop': '',
          '$popB': '',
          '$popZ': '',
        }
      }

      Object.keys(p).forEach(function (onePopUniqName, i) {
        var onePopName = p[onePopUniqName]['name'];
        p[onePopUniqName]['$pop'] = $('[data-xpop=\'' + onePopName + '\']');
        p[onePopUniqName]['$popB'] = p[onePopUniqName]['$pop'].find('[data-xpop=\'b\']');
        p[onePopUniqName]['$popZ'] = p[onePopUniqName]['$pop'].find('[data-xpop=\'z\']');


        $(p[onePopUniqName]['trigger']).on({
          click: function (evt) {
            p[onePopUniqName]['$pop'].addClass('shown');
            setTimeout(function () {
              p[onePopUniqName]['$popB'].addClass('shown');
              p[onePopUniqName]['$popZ'].addClass('shown');
            },10)
          }
        })

        p[onePopUniqName]['$popZ'].on({
          click: function (evt) {
            p[onePopUniqName]['$popB'].removeClass('shown');
            p[onePopUniqName]['$popZ'].removeClass('shown');
            setTimeout(function () {
              p[onePopUniqName]['$pop'].removeClass('shown');
            },200)
          }
        })


      })
    })
    return p;
  }



  return GenericPopups;
});