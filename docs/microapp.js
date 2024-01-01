var Ayoba = getAyoba();
 
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
  let sPageURL = window.location.search.substring(1),
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
  document.getElementById('test0').innerText = presence;
  document.getElementById('test1').innerText = Ayoba.getMsisdn();
  document.getElementById('test2').innerText = getURLParameter('jid');
  document.getElementById('test3').innerText = Ayoba.getCountry();
  document.getElementById('test4').innerText = Ayoba.getLanguage();
};
function onNicknameChanged(nickname) {
  document.getElementById('test5').innerText = nickname;
};
function onAvatarChanged(avatar) {
  document.getElementById('test6').src = avatar;
  document.getElementById('test9').innerText = avatar;
};
function onLocationChanged(lat, lon) {
  document.getElementById('test7').innerText = lat;
  document.getElementById('test8').innerText = lon;
};