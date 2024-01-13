


// aws apigateway get-rest-apis --query "items[?name=='a'].id" --output text
export const BASE = 'https://hbz68qhuab.execute-api.eu-west-3.amazonaws.com/a';

// @see https://paystack.com/docs/guides/accept_payments_on_your_vue_app
export const paystackpublickey = 'pk_test_ffffffffffffffffffffffffffffffffffffffff';

export const defaultpaystackid = 'info@eddivolt.one';

export const momoPrimaryKey = '232f2ffcb81b4b0ebe4e12c991f8ff96';
export const momoSecondaryKey = '6f942fa081f549df96d191bfbec4e95d';

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
