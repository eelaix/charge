var Ayoba = getAyoba();
var aobj = {};
 
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
  aobj.ayoba_avatar = JSON.stringify(avatar);
};
function onLocationChanged(lat, lon) {
  aobj.ayoba_lat = lat;
  aobj.ayoba_lng = lon;
};