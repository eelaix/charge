


// aws apigateway get-rest-apis --query "items[?name=='a'].id" --output text
export const BASE = 'https://4zc80xpom4.execute-api.ap-east-1.amazonaws.com/a';

//=============================================================================

export const APPVERSION = '1.0.5';
export const twodaymills = 172800000;
export const prepaylimit = 100;
export const ChargerSTATS = ['readyfree','readygunin','readywaiting','readycharging','readybadgnd','stopdown','offline'];

if (typeof(Date.prototype.format) === "undefined") {
  Date.prototype.format = function(fmt) {
    var o = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'h+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substring(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' +
        o[k]).substring(('' + o[k]).length)));
    return fmt;
  };
}
if (typeof(Array.prototype.contains) === "undefined") {
    Array.prototype.contains = function (obj) {
        let i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    };
}
if (typeof(Array.prototype.removeone) === "undefined") {
    Array.prototype.removeone = function (val) {
        let index = -1;
        for (let i = 0; i < this.length; i++) {
            if (this[i] == val) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            this.splice(index, 1);
        }
        return index;
    };
}
