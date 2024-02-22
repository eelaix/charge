<script lang="ts" setup>
let _keeploading:boolean = true;
let _myid:number = -1;
function getURLParameter(sParam:string):string {
  let sPageURL:string = window.location.search.substring(1),
      sURLVariables:string[] = sPageURL.split('&'),
      sParameterName:string[],
      i:number;
  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? '' : decodeURIComponent(sParameterName[1]);
    }
  }
  return '';
};
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import paystack from 'vue3-paystack';
import { nanoid } from 'nanoid';
import { useI18n } from 'vue-i18n';
import { paystackpublickey,prepaylimit,defaultpaystackid,getAssetsFile } from './config';
import { getUserPhoneNumber,observeUserPresence,getUserName,getUserAvatar,closeApp } from 'ayoba-microapp-api';
import { ref, reactive, inject, onMounted, onUnmounted } from 'vue';
import { StreamQrcodeBarcodeReader } from 'vue3-barcode-qrcode-reader';
const axios:any = inject('axios');
const snotify:(any) = inject("vue3-notify");
const { t } = useI18n();
const ayoba = reactive({
  presence:0,
  avatar:'',
  msisdn:'',
  selfjid:'',
  mytoken:'',
  nickname:'',
  isagent:0,
  mybalnum:0,
  mybalance:'0.00'
});
const payfullname = ref<string>(localStorage.pfname);
const payamount = ref<number>(localStorage.preprepay?Number(localStorage.preprepay):prepaylimit);
const mac = ref<string>('');
const btntext = ref<string>('ChargeNOW');
const loads = ref<number>(1);
const portid = ref<number>(-1);
const contentId = ref<number>(0);
const chargerid = ref<number>(10000);
const vcardtargetuser = ref<string>('');
const vcardnumber = ref<string>('');
const vcardbtn_text = ref<string>(t('vcardactivenow'));
const hourid = ref<number>(parseInt(localStorage.horid,10)||0);
const noclick = ref<boolean>(true);
const loading = ref<boolean>(false);
const norefresh = ref<boolean>(false);
const disphours = ref<boolean>(false);
const momobtnclicked = ref<boolean>(false);
const vcardbtnclicked = ref<boolean>(false);
const thehours = reactive<string[]>(['10', '1', '2', '3', '4', '6', '8', '15']);
const st = reactive<string[]>(['Free', 'SwitchON', 'Charging', 'Disabled', 'StopDN', 'Offline', 'noID']);
const sw = reactive<number[]>([0, 1, 2, 3, 4, 5, 0, 0, 0, 0, 0, 0]);
const se = reactive<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
const ua = reactive<string[]>(['', '', '', '', '', '', '', '', '', '', '', '']);

onMounted(() => {
  getUserName((username:string) => { ayoba.nickname = username; });
  getUserAvatar((avatar:string) => { ayoba.avatar = avatar; });
  observeUserPresence(async (online:number) => {
    ayoba.presence = online;
    ayoba.msisdn = getUserPhoneNumber();
    ayoba.selfjid = getURLParameter('jid');
  });
  fetchData();
});
onUnmounted(() => {
  ayoba.mytoken = '';
  closeApp();
});
function reference():string {
  return nanoid();
};
function channels():string[] {
  return ["card", "bank", "ussd", "mobile_money"];
};
function qrscannow():void {
  contentId.value = 2;
};
function dologout():void {
  ayoba.mytoken = '';
  closeApp();
}
async function momopay():Promise<any> {
  momobtnclicked.value = true;
  let qryparams:string = 'token=' + ayoba.mytoken + '&money=' + payamount.value + '&mobile=' + encodeURIComponent(ayoba.msisdn);
  let axresp:any = await axios.post('/momoprepay?tm=' + new Date().getTime(), qryparams); 
  if (axresp.data.rc<0) {
    snotify.error(axresp.data.rc+':'+axresp.data.rm);
    setTimeout(() => {
      momobtnclicked.value = false;
    }, 5000);
  } else {
    setTimeout(momocheckbalance, 5000);
  }
}
async function momocheckbalance():Promise<any> {
  let qryparams:string = 'token=' + ayoba.mytoken + '&thisbalance=' + ayoba.mybalnum;
  let axresp:any = await axios.post('/momocheckbalance?tm=' + new Date().getTime(), qryparams);
  if (axresp.data.rc==1) {
    ayoba.mybalnum = axresp.data.balnum;
    ayoba.mybalance = axresp.data.balance;
  } else {
    setTimeout(momocheckbalance, 1000);
  }
}
async function paystacksuccess(response:any):Promise<any> {
  contentId.value = 0;
  if ( ayoba.mytoken ) {
    let qryparams:string = 'token=' + ayoba.mytoken + '&ref=' + response.reference;
    let axresp:any = await axios.post('/paystackcb?tm=' + new Date().getTime(), qryparams);
    if (axresp.status==200 && axresp.data.rc==1) {
      ayoba.mybalnum = axresp.data.balnum;
      ayoba.mybalance = axresp.data.balance;
    }
    loads.value = 1;
    if (!_keeploading) {
      fetchData();
    }
    localStorage.setItem('preprepay', payamount.value.toString());
    localStorage.setItem('pfname', payfullname.value);
  }
}
function paystackcancel():void {
  contentId.value = 0;
}
async function fetchData():Promise<any> {
  if ( ayoba.mytoken ) {
    let qryparams:string = 'token=' + ayoba.mytoken + '&loads=' + loads.value;
    if (mac.value) {
      qryparams = qryparams + '&mac=' + mac.value;
    } else {
      qryparams = qryparams + '&id=' + chargerid.value;
    }
    loading.value = true;
    let axresp:any = await axios.post('/getonebk?tm=' + new Date().getTime(), qryparams);
    loading.value = false;
    if (axresp && axresp.status >= 200) {
      if ( loads.value==0 && portid.value==-1) {
        snotify.success('SELECT Free Socket (GREEN) First.');
      }
      loads.value++;
      if ( norefresh.value ==  false ){
        Object.keys(axresp.data).forEach((key:string) => {
          // this[key] = axresp.data[key];
          console.log(key+'='+axresp.data[key]);
        });
        if (portid.value>-1) {
          selectport(portid.value);
        }
      } else {
        if (sw[portid.value]!=axresp.data.sw[portid.value]) {
          norefresh.value = false;
        }
      }
      if (loads.value < 100) {
        _keeploading = true;
        setTimeout(fetchData, 1000);
      } else {
        _keeploading = false;
      }
    }
  } else {
    if ( ayoba.avatar && ayoba.nickname && ayoba.presence ) {
      if (loads.value==0) loads.value = 1;
      let qryparams:string = 'phone='+encodeURIComponent(ayoba.msisdn)+'&nick='+encodeURIComponent(ayoba.nickname)+'&jid='+encodeURIComponent(ayoba.selfjid)+'&online='+ayoba.presence;
      let axresp:any = await axios.post('/ayobalogin?tm=' + new Date().getTime(), qryparams);
      if (axresp && axresp.status == 200) {
        if (axresp.data.rc==1) {
          ayoba.mytoken = axresp.data.token;
          ayoba.mybalnum = axresp.data.balnum;
          ayoba.mybalance = axresp.data.balance;
          ayoba.isagent = axresp.data.isagent;
        } else {
          ayoba.mytoken = '';
          snotify.error(axresp.data.rm);
        }
      } else {
        snotify.error('amazonaws LoginERROR');
      }
    }
    setTimeout(fetchData, 1000);
  }
}
function selectport(id:number):void {
  noclick.value = true;
  if (sw[id] == 0) {
    btntext.value = t('DoCharge')+'(#' + (id + 1) + 'SOCKET)';
    noclick.value = false;
  } else if (sw[id] == 1 || sw[id] == 2) {
    let nowtime:number = new Date().getTime();
    let timeremind:number = se[id] - nowtime;
    if (timeremind < 0) {
      if (_myid == id) {
        btntext.value = t('StopNOW');
        noclick.value = false;
      } else {
        btntext.value = ua[id] + ' ' + t('Charging');
      }
    } else {
      let timeused:number = timeremind / 1000;
      let minutes:number = Math.round(timeused/60);
      let seconds:number = Math.round(timeused%60);
      let retime:string = minutes + 'm' + (seconds > 0 ? seconds + 's' : '');
      if (_myid == id) {
        if (minutes > 600) {
          btntext.value = t('IamCharging');
        } else {
          btntext.value = retime + ',' + t('StopNOW');
        }
        noclick.value = false;
      } else {
        if (minutes > 600) {
          btntext.value = ua[id];
        } else {
          btntext.value = ua[id] + '@' + retime + '';
        }
      }
    }
  } else if (sw[id] == 3) {
    id = -1;
    btntext.value = 'PortDisabled';
  } else if (sw[id] == 4) {
    id = -1;
    btntext.value = t('StopKeyDown');
  } else if (sw[id] == 5) {
    if (_myid == id) {
      btntext.value = t('Clearme');
      noclick.value = false;
    } else {
      id = -1;
      btntext.value = t('DeviceOffline');
    }
  } else {
    id = -1;
    btntext.value = t('InvalidChargerID');
  }
  portid.value = id;
}
function inputpays():void {
  contentId.value = 1;
}
function cancelpay():void {
  contentId.value = 0;
  vcardbtnclicked.value = false;
}
function selectme(e:any):void {
  let id:number = parseInt(e.currentTarget.id, 10);
  selectport(id);
  loads.value = 1;
  if (!_keeploading) {
    fetchData();
  }
  if (portid.value==-1) {
    snotify.success('SELECT Free Socket First.');
  }
}
function showhours():void {
  disphours.value = true;
}
function closeme():void {
  disphours.value = false;
}
function selectfee(e:any):void {
  hourid.value = parseInt(e.currentTarget.id, 10);
  localStorage.horid = hourid.value;
  disphours.value = false;
}
async function activevcard():Promise<any> {
  vcardbtnclicked.value = true;
  if ( Number(vcardnumber.value)+'' != vcardnumber.value ) {
    vcardbtn_text.value = t('vcardactiveer1');
    setTimeout(() => { vcardbtnclicked.value = false; vcardbtn_text.value = t('vcardactivenow'); }, 5000);
  }
  else if ( ayoba.isagent==1 && vcardnumber.value.length!=4 ) {
    vcardbtn_text.value = t('vcardactiveer2');
    setTimeout(() => { vcardbtnclicked.value = false; vcardbtn_text.value = t('vcardactivenow'); }, 5000);
  }
  else if ( ayoba.isagent==0 && vcardnumber.value.length!=8 ) {
    vcardbtn_text.value = t('vcardactiveer3');
    setTimeout(() => { vcardbtnclicked.value = false; vcardbtn_text.value = t('vcardactivenow'); }, 5000);
  }
  else if ( ayoba.isagent==1 && vcardtargetuser.value.length<4 ) {
    vcardbtn_text.value = t('vcardactiveer4');
    setTimeout(() => { vcardbtnclicked.value = false; vcardbtn_text.value = t('vcardactivenow'); }, 5000);
  }
  else if ( ayoba.isagent==1 && (vcardtargetuser.value.indexOf('@')<2||vcardtargetuser.value.indexOf('.')<4) ) {
    vcardbtn_text.value = t('vcardactiveer5');
    setTimeout(() => { vcardbtnclicked.value = false; vcardbtn_text.value = t('vcardactivenow'); }, 5000);
  }
  else {
    let doparams:string = 'token=' + ayoba.mytoken + '&cardid=' + vcardnumber.value;
    let ret:any;
    if ( ayoba.isagent==1 ) {
      doparams = doparams + '&to=' + encodeURIComponent(vcardtargetuser.value);
      ret = await axios.post('/vcardactive1?tm=' + new Date().getTime(), doparams);
    } else {
      ret = await axios.post('/vcardactive2?tm=' + new Date().getTime(), doparams);
    }
    if (ret && ret.status == 200) {
      if ( ret.data.rc>0 ) {
        contentId.value = 0;
      } else {
        vcardbtn_text.value = ret.data.rm;
      }
    } else {
      vcardbtn_text.value = 'unknown error';
    }
  }
}
async function dochargebk():Promise<any> {
  noclick.value = true;
  norefresh.value = true;
  let doparams:string = 'token=' + ayoba.mytoken + '&mac=' + mac.value + '&portid=' + portid.value + '&hourid=' + hourid.value;
  if ( sw[portid.value] == 0 ) {
    btntext.value = t('Starting');
    await axios.post('/dochargebk?tm=' + new Date().getTime(), doparams);
    setTimeout(() => { noclick.value = false; norefresh.value = false; }, 10000);
  } else if (_myid == portid.value){
    btntext.value = t('Stoping') + '...';
    doparams = doparams + '&cmd=1';
    await axios.post('/userdocmd?tm=' + new Date().getTime(), doparams);
    setTimeout(() => { noclick.value = false; norefresh.value = false; }, 10000);
  }
  loads.value = 1;
  if (!_keeploading) {
    fetchData();
  }
}
const decode = ref<any>(undefined)
const isLoading = ref<boolean>(false)
function onResult(data:any): void {
  console.log('onResult',data);
  if (data) {
    decode.value = data?.text;
    let numid:number = Number(decode.value);
    if ( decode.value?.length==5 && (''+numid)==decode.value ) {
      chargerid.value = numid;
      contentId.value = 0;
    }
  }
}
function onLoading(loading: boolean) {
  console.log('scan onloading:'+loading);
  isLoading.value = loading
}
function onLoaded() {
  console.log('scan onLoaded');
  // refCamera.value?.onCanPlay()
}
const refCamera = ref<InstanceType<typeof StreamQrcodeBarcodeReader> | null>(null)
function handleOnCanPlay() {
  console.log('scan handleOnCanPlay');
  refCamera.value?.onCanPlay()
}
function handleOnReset() {
  console.log('scan onReset');
  refCamera.value?.onReset()
}
function handleFacemode() {
  console.log('scan onChangeFacemode');
  refCamera.value?.onChangeFacemode()
}
function handleOnCanStop() {
  console.log('scan onCanStop');
  refCamera.value?.onCanStop()
}
</script>
<template>
<div class="container-md">

  <vue3-notify />
  <div v-if="loads==0" class="mask opacity" @touchmove.prevent>&nbsp;</div>
  <div v-if="disphours" class="mask opacity" @click="closeme">&nbsp;</div>

  <div v-if="contentId==0">
    <div class="d-inline-flex h3 mt-1">
      <div class="col my-auto">
        {{ayoba.nickname}}
      </div>
      <div class="col my-auto">
        {{ayoba.mybalance}}
      </div>
      <div class="col">
        <button type="button" class="btn btn-sm btn-outline-success" @click="inputpays">
        {{$t('topup')}}
        </button>
      </div>
    </div>
    <div class="d-inline-flex h3 mt-1" :class="loading?'text-danger':'text-secondary'">
      <div class="col my-auto">
        <span v-if="chargerid">chargerID:&nbsp;<span>{{chargerid}}</span></span>
        <span v-else>&lt;ScanQR First&gt;</span>
      </div>
      <div class="col">&nbsp;
      </div>
      <div class="col">
        <img :src="ayoba.avatar" class="avathead img-thumbnail"/>
        <button class="btn" @click="qrscannow">
          <img :src="getAssetsFile('scan54.png')" class="wscan img-thumbnail"/>
        </button>
      </div>
    </div>
<!--    <div class="d-block text-success mt-1" v-if="chargerid>0 && portid==-1">
        SELECT Free Socket (GREEN) First.
    </div -->
        <div class="text-center mt-1">
          <div class="d-inline-flex">
            <div class="bdright">
              <div class="pbox" :class="portid==0?'p1':'p0'" id="0" @click="selectme($event)">
                <div class="xn-ama w-ama">
                  <div class="xn-amb w-amb" :class="portid==0?'d1 bg'+sw[0]:'d0 bg'+sw[0]">
                    <div class="fixed" :class="'fg'+sw[0]">{{chargerid?'1':'-'}}</div>
                  </div>
                  <div class="tinyst">{{$t(st[sw[0]])}}</div>
                </div>
              </div>
              <div class="pbox" :class="portid==4?'p1':'p0'" id="4" @click="selectme($event)">
                <div class="xn-ama w-ama">
                  <div class="xn-amb w-amb" :class="portid==4?'d1 bg'+sw[4]:'d0 bg'+sw[4]">
                    <div class="fixed" :class="'fg'+sw[4]">{{chargerid?'5':'-'}}</div>
                  </div>
                  <div class="tinyst">{{$t(st[sw[4]])}}</div>
                </div>
              </div>
              <div class="pbox" :class="portid==8?'p1':'p0'" id="8" @click="selectme($event)">
                <div class="xn-ama w-ama">
                  <div class="xn-amb w-amb" :class="portid==8?'d1 bg'+sw[8]:'d0 bg'+sw[8]">
                    <div class="fixed" :class="'fg'+sw[8]">{{chargerid?'9':'-'}}</div>
                  </div>
                  <div class="tinyst">{{$t(st[sw[8]])}}</div>
                </div>
              </div>
            </div>
            <div class="bdright">
              <div class="pbox" :class="portid==1?'p1':'p0'" id="1" @click="selectme($event)">
                <div class="xn-ama w-ama">
                  <div class="xn-amb w-amb" :class="portid==1?'d1 bg'+sw[1]:'d0 bg'+sw[1]">
                    <div class="fixed" :class="'fg'+sw[1]">{{chargerid?'2':'-'}}</div>
                  </div>
                  <div class="tinyst">{{$t(st[sw[1]])}}</div>
                </div>
              </div>
              <div class="pbox" :class="portid==5?'p1':'p0'" id="5" @click="selectme($event)">
                <div class="xn-ama w-ama">
                  <div class="xn-amb w-amb" :class="portid==5?'d1 bg'+sw[5]:'d0 bg'+sw[5]">
                    <div class="fixed" :class="'fg'+sw[5]">{{chargerid?'6':'-'}}</div>
                  </div>
                  <div class="tinyst">{{$t(st[sw[5]])}}</div>
                </div>
              </div>
              <div class="pbox" :class="portid==9?'p1':'p0'" id="9" @click="selectme($event)">
                <div class="xn-ama w-ama">
                  <div class="xn-amb w-amb" :class="portid==9?'d1 bg'+sw[9]:'d0 bg'+sw[9]">
                    <div class="fixed" :class="'fg'+sw[9]">{{chargerid?'10':'-'}}</div>
                  </div>
                  <div class="tinyst">{{$t(st[sw[9]])}}</div>
                </div>
              </div>
            </div>
            <div class="bdright">
              <div class="pbox" :class="portid==2?'p1':'p0'" id="2" @click="selectme($event)">
                <div class="xn-ama w-ama">
                  <div class="xn-amb w-amb" :class="portid==2?'d1 bg'+sw[2]:'d0 bg'+sw[2]">
                    <div class="fixed" :class="'fg'+sw[2]">{{chargerid?'3':'-'}}</div>
                  </div>
                  <div class="tinyst">{{$t(st[sw[2]])}}</div>
                </div>
              </div>
              <div class="pbox" :class="portid==6?'p1':'p0'" id="6" @click="selectme($event)">
                <div class="xn-ama w-ama">
                  <div class="xn-amb w-amb" :class="portid==6?'d1 bg'+sw[6]:'d0 bg'+sw[6]">
                    <div class="fixed" :class="'fg'+sw[6]">{{chargerid?'7':'-'}}</div>
                  </div>
                  <div class="tinyst">{{$t(st[sw[6]])}}</div>
                </div>
              </div>
              <div class="pbox" :class="portid==10?'p1':'p0'" id="10" @click="selectme($event)">
                <div class="xn-ama w-ama">
                  <div class="xn-amb w-amb" :class="portid==10?'d1 bg'+sw[10]:'d0 bg'+sw[10]">
                    <div class="fixed" :class="'fg'+sw[10]">{{chargerid?'11':'-'}}</div>
                  </div>
                  <div class="tinyst">{{$t(st[sw[10]])}}</div>
                </div>
              </div>
            </div>
            <div class="weui-flex__item">
              <div class="pbox" :class="portid==3?'p1':'p0'" id="3" @click="selectme($event)">
                <div class="xn-ama w-ama">
                  <div class="xn-amb w-amb" :class="portid==3?'d1 bg'+sw[3]:'d0 bg'+sw[3]">
                    <div class="fixed" :class="'fg'+sw[3]">{{chargerid?'4':'-'}}</div>
                  </div>
                  <div class="tinyst">{{$t(st[sw[3]])}}</div>
                </div>
              </div>
              <div class="pbox" :class="portid==7?'p1':'p0'" id="7" @click="selectme($event)">
                <div class="xn-ama w-ama">
                  <div class="xn-amb w-amb" :class="portid==7?'d1 bg'+sw[7]:'d0 bg'+sw[7]">
                    <div class="fixed" :class="'fg'+sw[7]">{{chargerid?'8':'-'}}</div>
                  </div>
                  <div class="tinyst">{{$t(st[sw[7]])}}</div>
                </div>
              </div>
              <div class="pbox" :class="portid==11?'p1':'p0'" id="11" @click="selectme($event)">
                <div class="xn-ama w-ama">
                  <div class="xn-amb w-amb" :class="portid==11?'d1 bg'+sw[11]:'d0 bg'+sw[11]">
                    <div class="fixed" :class="'fg'+sw[11]">{{chargerid?'12':'-'}}</div>
                  </div>
                  <div class="tinyst">{{$t(st[sw[11]])}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="mt-3 btn btn-outline-info w-100" @click="showhours">{{$t('ChargeTIME')}}: {{thehours[hourid]}}{{$t('hors')}}</button>
        <button class="mt-3 btn-primary w-100" @click="inputpays" v-if="ayoba.mytoken && ayoba.mybalnum<10">{{$t('btn_prepay')}}</button>
        <button class="mt-3 btn-success w-100" @click="dochargebk" v-if="ayoba.mytoken && ayoba.mybalnum>=10" :disabled="noclick">{{btntext}}</button>
        <div class="mypicker pickw" v-if="disphours">
          <div class="weui-media-box">
            <div class="mypanel fs1">
              {{$t('bkchargehours')}} : 
            </div>
            <div class="li2 fs2 mt-4">
              <div class="pbo2" :class="hourid==0?'f0':'f1'" id="0" @click="selectfee">10{{$t('hors')}}</div>
              <div class="pbo2" :class="hourid==1?'f0':'f1'" id="1" @click="selectfee">1 {{$t('hors')}}</div>
              <div class="pbo2" :class="hourid==2?'f0':'f1'" id="2" @click="selectfee">2 {{$t('hors')}}</div>
              <div class="pbo2" :class="hourid==3?'f0':'f1'" id="3" @click="selectfee">3 {{$t('hors')}}</div>
            </div>
            <div class="li2 fs2 mt-4 mb-4">
              <div class="pbo2" :class="hourid==4?'f0':'f1'" id="4" @click="selectfee">4 {{$t('hors')}}</div>
              <div class="pbo2" :class="hourid==5?'f0':'f1'" id="5" @click="selectfee">6 {{$t('hors')}}</div>
              <div class="pbo2" :class="hourid==6?'f0':'f1'" id="6" @click="selectfee">8 {{$t('hors')}}</div>
              <div class="pbo2" :class="hourid==7?'f0':'f1'" id="7" @click="selectfee">15{{$t('hors')}}</div>
            </div>
          </div>
        </div>
  </div>

  <div v-if="contentId==1">
    
    <div class="d-inline-flex h3 mt-1">
      <div class="col">
        <img :src="ayoba.avatar" class="avathead"/>
      </div>
      <div class="col my-auto">
        {{ayoba.nickname}}
      </div>
      <div class="col my-auto">
        <button class="btn btn-sm btn-outline-warning" @click="dologout">{{$t('logout')}}</button>
      </div>
    </div>
    <ul class="nav nav-pills nav-fill mb-4 mt-4" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active"
          id="paystack-tab"
          data-bs-toggle="tab"
          data-bs-target="#paystack"
          type="button"
          rol="tab"
          aria-controls="paystack"
          aria-selected="true"
          href="#paystack">{{$t('tabpaystack')}}</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link"
          id="momo-tab"
          data-bs-toggle="tab"
          data-bs-target="#momo"
          type="button"
          rol="tab"
          aria-controls="momo"
          aria-selected="false"
          href="#momo">{{$t('tabmomo')}}</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link"
          id="vcard-tab"
          data-bs-toggle="tab"
          data-bs-target="#vcard"
          type="button"
          rol="tab"
          aria-controls="vcard"
          aria-selected="false"
          href="#vcard">{{$t('tabvcard')}}</button>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div id="paystack"
        role="tabpanel" 
        aria-labelledby="paystack-tab"
        class="tab-pane fade show active xnpanel mt-3 pt-4 pb-3">
        <div class="text-end">
          <button type="button"
            class="btn btn-close"
            style="margin-top:-12px;margin-right:-12px;"
            aria-label="Close" @click="cancelpay"></button>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" v-model="payfullname" id="paystackfullname" required maxlength="32" placeholder=""></input>
          <label for="paystackfullname">{{$t('payfullname')}}</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" v-model="payamount" id="paystackmoney" required maxlength="32" placeholder=""></input>
          <label for="paystackmoney">{{$t('paymoneys')}}</label>
        </div>
        <paystack buttonClass="btn btn-primary w-100"
          :buttonText = "$t('btn_prepay')"
          :publicKey="paystackpublickey"
          :amount="payamount*100"
          :email="defaultpaystackid"
          :reference="reference()"
          :channels="channels()"
          :onSuccess="paystacksuccess"
          :onCanel="paystackcancel"
          currency="GHS"
          >
        </paystack>
        <div class="mt-4 mb-3">
          <img :src="getAssetsFile('paystack-gh.png')" class="w-100"/>
        </div>
      </div>
      <div id="momo"
        role="tabpanel"
        aria-labelledby="momo-tab"
        class="tab-pane fade show xnpanel mt-3 pt-4 pb-3">
        <div class="text-end">
          <button type="button"
            class="btn btn-close"
            style="margin-top:-12px;margin-right:-12px;"
            aria-label="Close" @click="cancelpay"></button>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" v-model="ayoba.msisdn" id="momoisdn" required maxlength="32" placeholder=""></input>
          <label for="momoisdn">{{$t('mobilenumber')}}</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" v-model="payamount" id="momomount" required maxlength="32" placeholder=""></input>
          <label for="momomount">{{$t('paymoneys')}}</label>
        </div>
        <button class="btn btn-success mb-3 w-100" @click="momopay" :disabled="momobtnclicked">
          {{$t('lbmomopay')}}
        </button>
        <div class="mb-3">
          <img :src="getAssetsFile('paystack-gh.png')" class="w-100"/>
        </div>
      </div>
      <div id="vcard"
        role="tabpanel"
        aria-labelledby="vcard-tab"
        class="tab-pane fade show xnpanel mt-3 pt-4 pb-3">
        <div class="text-end">
          <button type="button"
            class="btn btn-close"
            style="margin-top:-12px;margin-right:-12px;"
            aria-label="Close" @click="cancelpay"></button>
        </div>
        <div class="form-floating mb-3" v-if="ayoba.isagent==1">
          <input type="text" class="form-control" v-model="vcardtargetuser" id="vcarduid" required maxlength="32" placeholder=""></input>
          <label for="vcarduid">{{$t('activetarget')}}</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" v-model="vcardnumber" id="vcardcode" required maxlength="32" placeholder=""></input>
          <label for="vcardcode">{{$t('activecode')}}</label>
        </div>
        <button class="btn btn-info mb-3 w-100" @click="activevcard" :disabled="vcardbtnclicked">
          {{vcardbtn_text}}
        </button>
        <div class="mb-3">
          <img :src="getAssetsFile('paystack-gh.png')" class="w-100"/>
        </div>
      </div>
    </div>
  </div>

  <div v-if="contentId==2">
  <div class="flex justify-center items-center mt-10">
    <template v-if="isLoading">
      <button class="bg-yellow-300 px-6 py-1 rounded-md me-4" @click="handleFacemode">
          Facemode
      </button>
      <button class="bg-red-300 px-6 py-1 rounded-md" @click="handleOnCanStop">Stop</button>
    </template>
    <template v-else>
      <button class="bg-green-300 px-6 py-1 rounded-md" @click="handleOnCanPlay">Stream</button>
      <button v-if="decode" class="bg-blue-300 px-6 py-1 rounded-md" @click="handleOnReset">
        Reset
      </button>
    </template>
  </div>
  <div class="flex flex-col items-center justify-center mt-6">
  </div>
    <pre>QRreturn:{{ decode }}</pre>
    <div class="phone mt-6">
      <div class="notch-container">
        <div class="notch"></div>
      </div>
      <div class="content">
        <template v-if="!isLoading">
          <h1 class="text-xl mb-2">Reader Barcode & QRCode</h1>
          <h2 class="text-base text-red-500 capitalize mb-4">mode: shoot</h2>
        </template>
        <StreamQrcodeBarcodeReader
          ref="refCamera"
          capture="shoot"
          show-on-stream
          @loaded="onLoaded"
          @onloading="onLoading"
          @result="onResult"
        />
      </div>
    </div>
  </div>

</div>
</template>

<style scoped>
  .avathead {
    width:36px;
    height:36px;
  }
  .acenter {
    text-align: center;
  }
  .bdright {
    border-right: 1px solid #ddd;
  }
  .li1 {
    display: flex;
    justify-content: space-between;
  }
  .p1 {
    background-color: #9f9;
  }
  .p0 {
    background-color: unset;
  }
 .d1 {
    box-shadow: 1px 1px 1px rgba(51, 51, 51, .1);
  }
  .d0 {
    box-shadow: 8px 8px 8px rgba(51, 51, 51, .5);
  }
  .xn-ama {
    margin: 0 auto;
    border-radius: 100%;
    position: relative;
  }
  .xn-amb {
    margin: 0 auto;
    position: relative;
  }
  .bg0 {
    background: rgba(0, 255, 0, 0.9);
  }
  .bg1 {
    background: rgba(255, 255, 0, 0.3);
  }
  .bg2 {
    background: rgba(255, 255, 0, 0.9);
  }
  .bg3 {
    background: rgba(153, 153, 153, 0.1);
  }
  .bg4 {
    background: rgba(255, 0, 0, 0.2);
  }
  .bg5 {
    background: rgba(128, 0, 0, 0.1);
  }
  .fg0 {
    color: rgba(255, 255, 255, 0.6);
  }
  .fg1 {
    color: rgba(0, 0, 0, 0.2);
  }
  .fg2 {
    color: rgba(0, 0, 0, 0.2);
  }
  .fg3 {
    color: rgba(0, 0, 0, 0.1);
  }
  .fg4 {
    color: rgba(0, 0, 0, 0.1);
  }
  .fg5 {
    color: rgba(128, 128, 128, 0.1);
  }
  .mainbtn {
    width:90%;
    margin:0 auto;
    line-height: 4rem;
    font-size: 2rem;
  }  
  .devbox1 {
    margin: 0 auto;
  }
  .mopay {
    width: 100%;
    margin-top: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: 1.6rem;
  }
  .pay {
    width: 100%;
    margin-top: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: 1.6rem;
    color: green;
  }
  .cardpay {
    width: 100%;
    margin-top: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: 1.6rem;
  }
  .hasnet {
    color: rgba(0, 255, 0, 0.6);
    text-shadow: 4px 4px 8px rgba(51, 51, 51, .2);
  }
  .nonet {
    color: rgba(102, 102, 102, 0.5);
    text-shadow: 4px 4px 8px rgba(51, 51, 51, .2);
  }
  .wscan {
    width:36px;
    height:36px;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
  }
  .mypanel {
    border-bottom: 1px solid red;
    line-height: 2.1em;
  }
  .pbo2 {
    padding: 1rem;
    border-radius: 40%;
    border: 2rpx dotted #aaa;
    text-align: center;
  }
  .f0 {
    background: rgba(0, 204, 0, 0.4);
  }
  .f1 {
    background: rgba(0, 0, 0, 0.1);
  }
  .fs1 {
    font-size: 1rem;
  }
  .fs2 {
    font-size: 1.6rem;
  }
  .li2 {
    display: flex;
    justify-content: space-between;
  }
  .lnk{color:rgba(0,102,0,0.5);}
  .offlin {background-color:#D3D3D3;filter:Alpha(Opacity=60);opacity:0.6;color:#666}
  .xnpanel {
    padding-left:4vw;
    padding-right:4vw;
    border-radius: 15px;
    border: 1px solid #B3B3B3;
    box-shadow: 10px 20px 10px rgba(0, 0, 0, .8);
    z-index: 1000;
  }
  .xnshadow {
    box-shadow: 10px 10px 20px rgba(51, 51, 51, .4);
  }
  .fullmask {
    position: fixed;
    height: 100%;
    width: 100%;
    z-index: 9994;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .midline {
    text-decoration: line-through;
  }
  a.disabled {
    pointer-events: none;
    color: rgba(51, 51, 51, 0.3);
  }
  .grecaptcha-badge {
      display: none; 
  }
  .cheader {
    margin-top: 10px;
    margin-left: 10px;
    line-height: 4rem;
    font-size: 1.6rem;
    margin-right: 1rem;
    vertical-align:middle;
  }
  .chead2 {
    margin-left: 10px;
    color:green;
    line-height: 4rem;
    font-size: 1.6rem;
  }
  .mybtn {}
  .pbox {
    padding: 16px;
    border-bottom: 1px solid #ddd;
  }
  @media only screen and (orientation: portrait) {
    .cheader {
      margin-top: 10px;
      margin-left: 10px;
      line-height: 10vw;
      font-size: 6vw;
      margin-right: 2vw;
      vertical-align:middle;
    }
    .mybtn {
      line-height: 5vw;
      font-size: 4vw;
    }
    .chead2 {
      color:green;
      line-height: 10vw;
      font-size: 5vw;
    }
    .w-ama {
      width: 19vw;
      height: 19vw;
    }
    .pickw {
      width:100vw;
    }
    .w-amb {
      width: 13vw;
      height: 13vw;
      top: 3vw;
    }
    .fixed {
      background-image: url(socket.png);
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      font-size: 9vw;
    }
    .tinyst {
      margin-top:5vw;
      font-size: 2vw;
      color: #bbb;
    }
    .mainbtn {
        width:90%;
        margin:0 auto;
        line-height: 12vw;
        font-size: 6vw;
    }
  }
  .opacity {background-color: rgba(255,255,255,0.8);}
  .mypicker{position: absolute;top:0;z-index:1000;background-color:rgba(153,153,153,0.9)}
  @media (prefers-color-scheme: dark) {
    .opacity {background-color: rgba(0,0,0,0.8);}
    .mypicker{position: absolute;top:0;z-index:1000;background-color:rgba(102,102,102,0.9);}
  }
  @media only screen and (orientation: landscape) {
    .w-ama {
      width: 80px;
      height: 80px;
    }
    .pickw {
      width:500px;
    }
    .w-amb {
      width: 60px;
      height: 60px;
      top: 10px;
    }
    .fixed {
      background-image: url(socket.png);
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      font-size: 40px;
    }
    .tinyst {
      margin-top:14px;
      font-size: 0.5rem;
      color: #bbb;
    }
  }
</style>
