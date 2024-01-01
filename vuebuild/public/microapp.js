var Ayoba = getAyoba();
var aobj = {ayoba_presence:0,ayoba_msisdn:'-',ayoba_selfjid:'-',ayoba_countrycode:'-',ayoba_language:'-',ayoba_nickname:'-',ayoba_avatar:'logo.png'};
 
/**
* Determine the mobile operating system and returns the
* proper javascript interface
*/
function getAyoba() {
   var userAgent = navigator.userAgent || navigator.vendor || window.opera;
   // Windows Phone must come first because its UA also contains "Android"
   if (/windows phone/i.test(userAgent)) {
       return null;
   }
   if (/android/i.test(userAgent)) {
       return Android;
   }
   // iOS detection from: http://stackoverflow.com/a/9039885/177710
   if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
       return null; // todo
   }
   return "unknown";
};
function getURLParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;
  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
  return false;
};
function onPresenceChanged(presence) {
  aobj.ayoba_presence = presence;
  aobj.ayoba_msisdn = Ayoba.getMsisdn();
  aobj.ayoba_selfjid = getURLParameter('jid');
  aobj.ayoba_countrycode = Ayoba.getCountry();
  aobj.ayoba_language = Ayoba.getLanguage();
};
function onNicknameChanged(nickname) {
  aobj.ayoba_nickname = nickname;
};
function onAvatarChanged(avatar) {
  aobj.ayoba_avatar = avatar;
};
