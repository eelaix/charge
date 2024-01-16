<template>
<qrcode-stream v-if="contentId==2"
  :camera="camera"
  :torch="torchActive"
  @decode="onDecode"
  @init="onInit"
>
<div v-show="paused" class="scan-confirmation">
  <img src="images/checkmark.svg" alt="" width="128" />
</div>
<div v-show="TORCH_IS_SUPPORTED" class="scan_tool_flash" @click="openFlash">
  <img :src="torchActive?'images/torchflash551.png':'images/torchflash550.png'" alt="" width="55" />
</div>
</qrcode-stream>
<div v-else>
    <div v-if="loads==0" class="mask opacity" @touchmove.prevent>&nbsp;</div>
    <div v-if="disphours" class="mask opacity" @click="closeme">&nbsp;</div>
    <b-container fluid="xs">
      <div class="xn-errmsg" v-if="errormsg">
          {{errormsg}}
      </div>
      <div class="boxw devbox1">
        <div class="cheader li1">
          <div>
            <img :src="ayoba_avatar" class="avathead"/>&nbsp;<span>{{ayoba_nickname}}</span>
          </div>
          <div v-if="contentId==0">
            {{mybalance}}&nbsp;<span class="text-right"><b-button class="btn btn-sm mybtn" variant="outline-success" @click="inputpays">{{'topup'|trans}}</b-button></span>
          </div>
          <div v-else>
            <span class="text-right"><b-button class="btn btn-sm mybtn" variant="outline-warning" @click="dologout">{{'logout'|trans}}</b-button>&nbsp;</span>
          </div>
        </div>
        <div class="cheader li1" :class="loading?'hasnet':'nonet'" v-if="contentId==0">
          <div v-if="chargerid">
            chargerID:&nbsp;<span>{{chargerid}}</span>
          </div>
          <div v-else>
            &lt;ScanQR First&gt;
          </div>
          <span class="text-right">
            <b-button class="btn btn-sm mybtn" variant="outline-info" @click="qrscannow">
              <img src="images/scan54.png" class="wscan"/>
            </b-button>
          </span>
        </div>
        <div class="chead2" v-if="chargerid>0 && portid==-1">
          TAP Free Socket (GREEN) First.
        </div>
        <template v-if="contentId==0">
          <div class="weui-panel">
            <div class="weui-flex acenter">
              <div class="bdright">
                <div class="pbox" :class="portid==0?'p1':'p0'" id="0" @click="selectme($event)">
                  <div class="xn-ama w-ama">
                    <div class="xn-amb w-amb" :class="portid==0?'d1 bg'+sw[0]:'d0 bg'+sw[0]">
                      <div class="fixed" :class="'fg'+sw[0]">{{chargerid?'1':'-'}}</div>
                    </div>
                    <div class="tinyst">{{st[sw[0]]|trans}}</div>
                  </div>
                </div>
                <div class="pbox" :class="portid==4?'p1':'p0'" id="4" @click="selectme($event)">
                  <div class="xn-ama w-ama">
                    <div class="xn-amb w-amb" :class="portid==4?'d1 bg'+sw[4]:'d0 bg'+sw[4]">
                      <div class="fixed" :class="'fg'+sw[4]">{{chargerid?'5':'-'}}</div>
                    </div>
                    <div class="tinyst">{{st[sw[4]]|trans}}</div>
                  </div>
                </div>
                <div class="pbox" :class="portid==8?'p1':'p0'" id="8" @click="selectme($event)">
                  <div class="xn-ama w-ama">
                    <div class="xn-amb w-amb" :class="portid==8?'d1 bg'+sw[8]:'d0 bg'+sw[8]">
                      <div class="fixed" :class="'fg'+sw[8]">{{chargerid?'9':'-'}}</div>
                    </div>
                    <div class="tinyst">{{st[sw[8]]|trans}}</div>
                  </div>
                </div>
              </div>
              <div class="bdright">
                <div class="pbox" :class="portid==1?'p1':'p0'" id="1" @click="selectme($event)">
                  <div class="xn-ama w-ama">
                    <div class="xn-amb w-amb" :class="portid==1?'d1 bg'+sw[1]:'d0 bg'+sw[1]">
                      <div class="fixed" :class="'fg'+sw[1]">{{chargerid?'2':'-'}}</div>
                    </div>
                    <div class="tinyst">{{st[sw[1]]|trans}}</div>
                  </div>
                </div>
                <div class="pbox" :class="portid==5?'p1':'p0'" id="5" @click="selectme($event)">
                  <div class="xn-ama w-ama">
                    <div class="xn-amb w-amb" :class="portid==5?'d1 bg'+sw[5]:'d0 bg'+sw[5]">
                      <div class="fixed" :class="'fg'+sw[5]">{{chargerid?'6':'-'}}</div>
                    </div>
                    <div class="tinyst">{{st[sw[5]]|trans}}</div>
                  </div>
                </div>
                <div class="pbox" :class="portid==9?'p1':'p0'" id="9" @click="selectme($event)">
                  <div class="xn-ama w-ama">
                    <div class="xn-amb w-amb" :class="portid==9?'d1 bg'+sw[9]:'d0 bg'+sw[9]">
                      <div class="fixed" :class="'fg'+sw[9]">{{chargerid?'10':'-'}}</div>
                    </div>
                    <div class="tinyst">{{st[sw[9]]|trans}}</div>
                  </div>
                </div>
              </div>
              <div class="bdright">
                <div class="pbox" :class="portid==2?'p1':'p0'" id="2" @click="selectme($event)">
                  <div class="xn-ama w-ama">
                    <div class="xn-amb w-amb" :class="portid==2?'d1 bg'+sw[2]:'d0 bg'+sw[2]">
                      <div class="fixed" :class="'fg'+sw[2]">{{chargerid?'3':'-'}}</div>
                    </div>
                    <div class="tinyst">{{st[sw[2]]|trans}}</div>
                  </div>
                </div>
                <div class="pbox" :class="portid==6?'p1':'p0'" id="6" @click="selectme($event)">
                  <div class="xn-ama w-ama">
                    <div class="xn-amb w-amb" :class="portid==6?'d1 bg'+sw[6]:'d0 bg'+sw[6]">
                      <div class="fixed" :class="'fg'+sw[6]">{{chargerid?'7':'-'}}</div>
                    </div>
                    <div class="tinyst">{{st[sw[6]]|trans}}</div>
                  </div>
                </div>
                <div class="pbox" :class="portid==10?'p1':'p0'" id="10" @click="selectme($event)">
                  <div class="xn-ama w-ama">
                    <div class="xn-amb w-amb" :class="portid==10?'d1 bg'+sw[10]:'d0 bg'+sw[10]">
                      <div class="fixed" :class="'fg'+sw[10]">{{chargerid?'11':'-'}}</div>
                    </div>
                    <div class="tinyst">{{st[sw[10]]|trans}}</div>
                  </div>
                </div>
              </div>
              <div class="weui-flex__item">
                <div class="pbox" :class="portid==3?'p1':'p0'" id="3" @click="selectme($event)">
                  <div class="xn-ama w-ama">
                    <div class="xn-amb w-amb" :class="portid==3?'d1 bg'+sw[3]:'d0 bg'+sw[3]">
                      <div class="fixed" :class="'fg'+sw[3]">{{chargerid?'4':'-'}}</div>
                    </div>
                    <div class="tinyst">{{st[sw[3]]|trans}}</div>
                  </div>
                </div>
                <div class="pbox" :class="portid==7?'p1':'p0'" id="7" @click="selectme($event)">
                  <div class="xn-ama w-ama">
                    <div class="xn-amb w-amb" :class="portid==7?'d1 bg'+sw[7]:'d0 bg'+sw[7]">
                      <div class="fixed" :class="'fg'+sw[7]">{{chargerid?'8':'-'}}</div>
                    </div>
                    <div class="tinyst">{{st[sw[7]]|trans}}</div>
                  </div>
                </div>
                <div class="pbox" :class="portid==11?'p1':'p0'" id="11" @click="selectme($event)">
                  <div class="xn-ama w-ama">
                    <div class="xn-amb w-amb" :class="portid==11?'d1 bg'+sw[11]:'d0 bg'+sw[11]">
                      <div class="fixed" :class="'fg'+sw[11]">{{chargerid?'12':'-'}}</div>
                    </div>
                    <div class="tinyst">{{st[sw[11]]|trans}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <b-button block class="mainbtn mt-3" variant="outline-info" @click="showhours">{{'ChargeTIME'|trans}}: {{thehours[hourid]}}{{'hors'|trans}}</b-button>
          <b-button block class="mainbtn mt-3" variant="primary" @click="inputpays" v-if="mytoken && mybalnum<10">{{'btn_prepay'|trans}}</b-button>
          <b-button block class="mainbtn mt-3" variant="success" @click="dochargebk" v-if="mytoken && mybalnum>=10" :disabled="noclick">{{btntext}}</b-button>
          <div class="mypicker pickw" v-if="disphours">
            <div class="weui-media-box">
              <div class="mypanel fs1">
                {{$t('message.bkchargehours')}} : 
              </div>
              <div class="li2 fs2 mt-4">
                <div class="pbo2" :class="hourid==0?'f0':'f1'" id="0" @click="selectfee">10{{'hors'|trans}}</div>
                <div class="pbo2" :class="hourid==1?'f0':'f1'" id="1" @click="selectfee">1 {{'hors'|trans}}</div>
                <div class="pbo2" :class="hourid==2?'f0':'f1'" id="2" @click="selectfee">2 {{'hors'|trans}}</div>
                <div class="pbo2" :class="hourid==3?'f0':'f1'" id="3" @click="selectfee">3 {{'hors'|trans}}</div>
              </div>
              <div class="li2 fs2 mt-4 mb-4">
                <div class="pbo2" :class="hourid==4?'f0':'f1'" id="4" @click="selectfee">4 {{'hors'|trans}}</div>
                <div class="pbo2" :class="hourid==5?'f0':'f1'" id="5" @click="selectfee">6 {{'hors'|trans}}</div>
                <div class="pbo2" :class="hourid==6?'f0':'f1'" id="6" @click="selectfee">8 {{'hors'|trans}}</div>
                <div class="pbo2" :class="hourid==7?'f0':'f1'" id="7" @click="selectfee">15{{'hors'|trans}}</div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="contentId==1">
          <b-tabs content-class="mb-4" end>
              <b-tab :title="$t('message.tabpaystack')" active>
                <div class="weui-panel xnpanel mt-3 pt-4 pb-3">
                  <div block class="text-right" style="margin-top:-10px">
                  <b-icon block icon="x-circle" font-scale="1.5" variant="danger" @click="cancelpay"></b-icon>
                  </div>
                  <b-form-group style="margin-top:-20px;">
                    <p>{{'payfullname'|trans}}</p>
                    <b-form-input size="lg" type="text" v-model="payfullname" :placeholder="$t('message.hpayfullname')"
                      required maxlength="32"></b-form-input>
                  </b-form-group>
                  <b-form-group>
                    <p class="mt-2">{{'paymoneys'|trans}}</p>
                    <b-form-input size="lg" type="text" v-model="payamount" required maxlength="8"></b-form-input>
                  </b-form-group>
                  <paystack class="pay" :amount="payamount*100" :email="payemail" :paystackkey="paystackpubkey"
                    :reference="reference" :callback="paystackcallback" :close="paystackclose" :embed="false" :channels="channels" currency="GHS">
                    {{'btn_prepay'|trans}}
                  </paystack>
                  <div class="mt-4 mb-3">
                    <img src="images/paystack-gh.png" class="w-100"/>
                  </div>
                </div>
              </b-tab>
              <b-tab :title="$t('message.tabmomo')">
                <div class="weui-panel xnpanel mt-3 pt-4 pb-3">
                  <div block class="text-right" style="margin-top:-10px">
                  <b-icon block icon="x-circle" font-scale="1.5" variant="danger" @click="cancelpay"></b-icon>
                  </div>
                  <b-form-group style="margin-top:-20px;">
                    <p>{{'mobilenumber'|trans}}</p>
                    <b-form-input size="lg" type="text" v-model="mobilenumber" required maxlength="32"></b-form-input>
                  </b-form-group>
                  <b-form-group>
                    <p class="mt-2">{{'paymoneys'|trans}}</p>
                    <b-form-input size="lg" type="text" v-model="payamount" required maxlength="4"></b-form-input>
                  </b-form-group>
                  <b-button class="mopay" variant="success" @click="momopay" :disabled="momobtnclicked">
                    {{'lbmomopay'|trans}}
                  </b-button>
                  <div class="mt-4 mb-3">
                    <img src="images/paystack-gh.png" class="w-100"/>
                  </div>
                </div>
              </b-tab>
              <b-tab :title="$t('message.tabvcard')">
                <div class="weui-panel xnpanel mt-3 pt-4 pb-3">
                  <div block class="text-right" style="margin-top:-10px">
                  <b-icon block icon="x-circle" font-scale="1.5" variant="danger" @click="cancelpay"></b-icon>
                  </div>
                  <b-form-group style="margin-top:-20px;" v-if="isagent==1">
                    <p>{{'activetarget'|trans}}</p>
                    <b-form-input size="lg" type="text" v-model="vcardtargetuser" required maxlength="32"></b-form-input>
                  </b-form-group>
                  <b-form-group>
                    <p class="mt-2">{{'activecode'|trans}}</p>
                    <b-form-input size="lg" type="text" v-model="vcardnumber" required maxlength="8"></b-form-input>
                  </b-form-group>
                  <b-button class="cardpay" variant="info" @click="activevcard" :disabled="vcardbtnclicked">
                    {{vcardbtn_text}}
                  </b-button>
                  <div class="mt-4 mb-3">
                    <img src="images/paystack-gh.png" class="w-100"/>
                  </div>
                </div>
              </b-tab>
          </b-tabs>
        </template>
      </div>
    </b-container>
</div>
</template>
<script>
  const getURLParameter = function(sParam) {
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
  import paystack from 'vue-paystack';
  import { nanoid } from 'nanoid';
  import { QrcodeStream } from 'vue-qrcode-reader';
  import { paystackpublickey,prepaylimit,defaultpaystackid } from '@/config';
  import { getUserPhoneNumber,observeUserPresence,getUserName,getUserAvatar,closeApp } from 'ayoba-microapp-api';
  export default {
    name: 'chargerbk',
    components: {
      paystack,
      QrcodeStream
    },
    mounted() {
      getUserName((username) => { this.ayoba_nickname = username; });
      getUserAvatar((avatar) => { this.ayoba_avatar = avatar; });
      observeUserPresence(async (online) => {
        this.ayoba_presence = online;
        this.ayoba_msisdn = getUserPhoneNumber();
        this.ayoba_selfjid = getURLParameter('jid');
        this.mobilenumber = this.ayoba_msisdn;
      });
      this.fetchData();
    },
    computed: {
      reference() {
        return nanoid();
      },
      channels() {
        return ["card", "bank", "ussd", "mobile_money"];
      }
    },
    data() {
      return {
        paystackpubkey: paystackpublickey,
        payfullname: localStorage.pfname,
        payemail: defaultpaystackid,
        payamount: localStorage.preprepay?localStorage.preprepay:prepaylimit,
        loads: 0,
        disphours: false,
        keeploading: true,
        mac: undefined,
        chargerid: 0,
        portid: -1,
        noclick: true,
        norefresh: false,
        vcardbtnclicked:false,
        momobtnclicked:false,
        step: 0,
        btntext: 'ChargeNOW',
        myid: -1,
        isagent:0,
        vcardtargetuser:'',
        vcardnumber:'',
        vcardbtn_text: this.$t('message.vcardactivenow'),
        mytoken: '',
        mybalance: '0.00',
        mybalnum: 0,
        contentId: 0,
        hourid: parseInt(localStorage.horid)||0,
        charging: 0,
        loading: false,
        prid: 2,
        ayoba_presence:'',
        ayoba_nickname:'',
        ayoba_avatar:'',
        ayoba_msisdn:'',
        mobilenumber:'',
        ayoba_selfjid:'',
        errormsg:'',
        paused:false,
        TORCH_IS_SUPPORTED:false,
        camera:'off',//"auto", "rear", "front", "off"
        torchActive:false, //电筒
        prizz: ['-', '-', '-', '-', '-', '-'],
        priz6: [0, 30, '8:00', '22:00'],
        thehours: ['10', '1', '2', '3', '4', '6', '8', '15'],
        st: ['Free', 'SwitchON', 'Charging', 'Disabled', 'StopDN', 'Offline', 'noID'],
        sw: [0, 1, 2, 3, 4, 5, 0, 0, 0, 0, 0, 0],
        se: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        pi: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ua: ['', '', '', '', '', '', '', '', '', '', '', '']
      }
    },
    methods: {
      async timeout(ms) {
        return new Promise((resolve) => {
          window.setTimeout(resolve, ms);
        });
      },
      async onDecode(result) {
        let theid = result;
        let numid = Number(theid);
        if ( theid.length==5 && (''+numid)==theid ) {
          this.paused = true;
          await this.timeout(500);
          this.chargerid = numid;
          this.camera = 'off';
          this.contentId = 0;
        }
      },
      async onInit(promise){
        try{
          const { capabilities } = await promise;
          this.TORCH_IS_SUPPORTED = !!capabilities.torch;
        }catch(e){
          this.errormsg = e.toString();
        }
      },
      openFlash(){
        if ( this.torchActive ) this.torchActive = false;
        else this.torchActive = true;
      },
      qrscannow(){
        this.paused = false;
        this.contentId = 2;
        this.camera = 'rear';
      },
      dologout(){
        this.mytoken = '';
        closeApp();
      },
      async momopay(){
        this.momobtnclicked = true;
        let qryparams = 'token=' + this.mytoken + '&money=' + this.payamount + '&mobile=' + this.mobilenumber;
        let axresp = await this.axios.post('/momoprepay?tm=' + new Date().getTime(), qryparams);
        if (axresp.data.rc<0) {
          this.errormsg = axresp.data.rc+':'+axresp.data.rm;
          setTimeout(() => {
            this.momobtnclicked = false;
            this.errormsg = '';
          }, 5000);
        } else {
          setTimeout(this.momocheckbalance, 5000);
        }
      },
      async momocheckbalance(){
        let qryparams = 'token=' + this.mytoken + '&thisbalance=' + this.mybalnum;
        let axresp = await this.axios.post('/momocheckbalance?tm=' + new Date().getTime(), qryparams);
        if (axresp.data.rc==1) {
          this.mybalnum = axresp.data.balnum;
          this.mybalance = axresp.data.balance;
        } else {
          setTimeout(this.momocheckbalance, 1000);
        }
      },
      async paystackcallback(response) {
        this.contentId = 0;
        if ( this.mytoken ) {
          let qryparams = 'token=' + this.mytoken + '&ref=' + response.reference;
          let axresp = await this.axios.post('/paystackcb?tm=' + new Date().getTime(), qryparams);
          if (axresp.status==200 && axresp.data.rc==1) {
            this.mybalnum = axresp.data.balnum;
            this.mybalance = axresp.data.balance;
          }
          this.loads = 1;
          if (!this.keeploading) {
            this.fetchData();
          }
          localStorage.setItem('preprepay', this.payamount);
          localStorage.setItem('pemail', this.payemail);
          localStorage.setItem('pfname', this.payfullname);
        }
      },
      paystackclose() {
        this.contentId = 0;
      },
      async fetchData() {
        if ( this.mytoken ) {
          let qryparams = 'token=' + this.mytoken + '&loads=' + this.loads;
          if (this.mac) {
            qryparams = qryparams + '&mac=' + this.mac;
          } else {
            qryparams = qryparams + '&id=' + this.chargerid;
          }
          this.loading = true;
          let result = await this.axios.post('/getonebk?tm=' + new Date().getTime(), qryparams);
          this.loading = false;
          if (result && result.status >= 200) {
            this.loads++;
            if ( this.norefresh ==  false ){
              Object.keys(result.data).forEach((key) => {
                this[key] = result.data[key];
              });
              if (this.portid>-1) {
                this.selectport(this.portid);
              }
            } else {
              if (this.sw[this.portid]!=result.data.sw[this.portid]) {
                this.norefresh = false;
              }
            }
            if (this.loads < 100) {
              this.keeploading = true;
              setTimeout(this.fetchData, 1000);
            } else {
              this.keeploading = false;
            }
          }
        } else {
          if ( this.ayoba_avatar && this.ayoba_nickname && this.ayoba_presence ) {
            if (this.loads==0) this.loads = 1;
            let qryparams = 'phone='+this.ayoba_msisdn+'&nick='+this.ayoba_nickname+'&jid='+this.ayoba_selfjid+'&online='+this.ayoba_presence;
            let axresp = await this.axios.post('/ayobalogin?tm=' + new Date().getTime(), qryparams);
            if (axresp && axresp.status == 200) {
              if (axresp.data.rc==1) {
                this.mytoken = axresp.data.token;
                this.mybalnum = axresp.data.balnum;
                this.mybalance = axresp.data.balance;
                this.isagent = axresp.data.isagent;
              } else {
                this.mytoken = '';
                this.errormsg = axresp.data.rm;
              }
            } else {
              this.errormsg = 'amazonaws LoginERROR';
            }
          }
          setTimeout(this.fetchData, 1000);
        }
      },
      selectport(id) {
        let txt = '';
        let neverclick = true;
        if (this.sw[id] == 0) {
          txt = this.$t('message.DoCharge')+'(#' + (id + 1) + 'SOCKET)';
          neverclick = false;
        } else if (this.sw[id] == 1 || this.sw[id] == 2) {
          let nowtime = new Date().getTime();
          let timeremind = this.se[id] - nowtime;
          if (timeremind < 0) {
            if (this.myid == id) {
              txt = this.$t('message.StopNOW');
              neverclick = false;
            } else {
              txt = this.ua[id] + ' ' + this.$t('message.Charging');
            }
          } else {
            let timeused = timeremind / 1000;
            let minutes = parseInt(timeused / 60);
            let seconds = parseInt(timeused % 60);
            let retime = minutes + 'm' + (seconds > 0 ? seconds + 's' : '');
            if (this.myid == id) {
              if (minutes > 600) {
                txt = this.$t('message.IamCharging');
              } else {
                txt = retime + ',' + this.$t('message.StopNOW');
              }
              neverclick = false;
            } else {
              if (minutes > 600) {
                txt = this.ua[id];
              } else {
                txt = this.ua[id] + '@' + retime + '';
              }
            }
          }
        } else if (this.sw[id] == 3) {
          id = -1;
          txt = 'PortDisabled';
        } else if (this.sw[id] == 4) {
          id = -1;
          txt = this.$t('message.StopKeyDown');
        } else if (this.sw[id] == 5) {
          if (this.myid == id) {
            txt = this.$t('message.Clearme');
            neverclick = false;
          } else {
            id = -1;
            txt = this.$t('message.DeviceOffline');
          }
        } else {
          id = -1;
          txt = this.$t('message.InvalidChargerID');
        }
        this.portid = id;
        this.btntext = txt;
        this.noclick = neverclick;
      },
      inputpays() {
        this.contentId = 1;
      },
      cancelpay() {
        this.contentId = 0;
        this.vcardbtnclicked = false;
      },
      selectme(e) {
        let id = parseInt(e.currentTarget.id);
        this.selectport(id);
        this.loads = 1;
        if (!this.keeploading) {
          this.fetchData();
        }
      },
      async showhours() {
        this.disphours = true;
      },
      async closeme() {
        this.disphours = false;
      },
      selectfee(e) {
        this.hourid = parseInt(e.currentTarget.id);
        localStorage.horid = this.hourid;
        this.disphours = false;
      },
      async activevcard() {
        this.vcardbtnclicked = true;
        if ( Number(this.vcardnumber)+'' != this.vcardnumber ) {
          this.vcardbtn_text = this.$t('message.vcardactiveer1');
          setTimeout(() => { this.vcardbtnclicked = false; this.vcardbtn_text = this.$t('message.vcardactivenow'); }, 5000);
        }
        else if ( this.isagent==1 && this.vcardnumber.length!=4 ) {
          this.vcardbtn_text = this.$t('message.vcardactiveer2');
          setTimeout(() => { this.vcardbtnclicked = false; this.vcardbtn_text = this.$t('message.vcardactivenow'); }, 5000);
        }
        else if ( this.isagent==0 && this.vcardnumber.length!=8 ) {
          this.vcardbtn_text = this.$t('message.vcardactiveer3');
          setTimeout(() => { this.vcardbtnclicked = false; this.vcardbtn_text = this.$t('message.vcardactivenow'); }, 5000);
        }
        else if ( this.isagent==1 && this.vcardtargetuser.length<4 ) {
          this.vcardbtn_text = this.$t('message.vcardactiveer4');
          setTimeout(() => { this.vcardbtnclicked = false; this.vcardbtn_text = this.$t('message.vcardactivenow'); }, 5000);
        }
        else if ( this.isagent==1 && (this.vcardtargetuser.indexOf('@')<2||this.vcardtargetuser.indexOf('.')<4) ) {
          this.vcardbtn_text = this.$t('message.vcardactiveer5');
          setTimeout(() => { this.vcardbtnclicked = false; this.vcardbtn_text = this.$t('message.vcardactivenow'); }, 5000);
        }
        else {
          let doparams = 'token=' + this.mytoken + '&cardid=' + this.vcardnumber;
          let ret;
          if ( this.isagent==1 ) {
            doparams = doparams + '&to=' + this.vcardtargetuser;
            ret = await this.axios.post('/vcardactive1?tm=' + new Date().getTime(), doparams);
          } else {
            ret = await this.axios.post('/vcardactive2?tm=' + new Date().getTime(), doparams);
          }
          if (ret && ret.status == 200) {
            if ( ret.data.rc>0 ) {
              this.contentId = 0;
            } else {
              this.vcardbtn_text = ret.data.rm;
            }
          } else {
            this.vcardbtn_text = 'unknown error';
          }
        }
      },
      async dochargebk() {
        this.noclick = true;
        this.norefresh = true;
        let doparams = 'token=' + this.mytoken + '&mac=' + this.mac + '&portid=' + this.portid + '&hourid=' + this.hourid;
        if ( this.sw[this.portid] == 0 ) {
          this.btntext = this.$t('message.Starting');
          await this.axios.post('/dochargebk?tm=' + new Date().getTime(), doparams);
          setTimeout(() => { this.noclick = false; this.norefresh = false; }, 10000);
        } else if (this.myid == this.portid){
          this.btntext = this.$t('message.Stoping') + '...';
          doparams = doparams + '&cmd=1';
          await this.axios.post('/userdocmd?tm=' + new Date().getTime(), doparams);
          setTimeout(() => { this.noclick = false; this.norefresh = false; }, 10000);
        }
        this.loads = 1;
        if (!this.keeploading) {
          this.fetchData();
        }
      },
    }
  }
</script>
<style scoped>
  .scan-confirmation {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
  }
  .scan_tool_flash {
    position: absolute;
    right: 10px;
    bottom: 10px;
    display: flex;
    flex-flow: row nowrap;
  }
  .xn-errmsg {
    background: rgba(0, 0, 0, 1);
    color: rgba(255, 0, 0, 1);
    margin: 0 auto;
    width: 100%;
  }
  .avathead {
    width:36px;
    height:36px;
  }
  .weui-panel {
    position: relative;
    overflow: hidden;
  }
  .weui-panel:first-child {
    margin-top: 0;
  }
  .weui-flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
  }
  .{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
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
  .weui-media-box {
    border: 1px solid #777;
    padding-bottom: 60rpx;
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
    line-height: 4rem;
    font-size: 1.6rem;
    margin-right: 1rem;
    vertical-align:middle;
  }
  .chead2 {
    color:green;
    line-height: 4rem;
    font-size: 1.6rem;
  }
  .mybtn {}
  @media only screen and (orientation: portrait) {
    .boxw {width:100%;}
    .cheader {
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
    .pbox {
      padding: 3vw;
      border-bottom: 1px solid #ddd;
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
    .boxw {
      width: 500px;
    }
    .pbox {
      padding: 20px;
      border-bottom: 1px solid #ddd;
    }
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
