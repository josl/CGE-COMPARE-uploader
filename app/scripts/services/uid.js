'use strict';

/**
 * @ngdoc service
 * @name cgeUploaderApp.UID
 * @description
 * # UID
 * Service in the cgeUploaderApp.
 */
angular.module('cgeUploaderApp')
.service('UID', function () {
  // AngularJS will instantiate a singleton by calling "new" on this function
  // Unique ID for the upload
  var _newUID = function () {
    var myDate = new Date(),
        wDay = myDate.getDay() + 1,
        mDay = myDate.getDate(),
        year = myDate.getFullYear(),
        month = myDate.getMonth() + 1,
        hours = myDate.getHours(),
        mins = myDate.getMinutes(),
        millisecs = myDate.getMilliseconds(),
        randNum = (Math.floor(Math.random()*1000000))+1,
        today = wDay + '_' + mDay + '_' + month + '_' + year + '_' + hours +
                mins + '_' + millisecs + '_',
        dirName = today + randNum;

        return dirName;
  };

  this.UID = _newUID();

  this.updateUID = function (){
    return _newUID();
  };
});
