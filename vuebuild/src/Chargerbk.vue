<template>
<div>
    <div v-if="loads==0" class="mask opacity" @touchmove.prevent>&nbsp;</div>
    <div v-if="disphours" class="mask opacity" @click="closeme">&nbsp;</div>
    <b-container fluid="xs">
      <div class="boxw devbox1">
        <div class="cheader li1" :class="loading?'hasnet':'nonet'">
          <div>
            <span v-if="!mynickname">{{'ChargerID:'|trans}}</span>&nbsp;#{{chargerid}}
          </div>
          <div v-if="contentId==0">
            <span class="text-right" v-if="mytoken"><b-button class="btn btn-sm mybtn" variant="outline-success" @click="inputpays">{{'topup'|trans}}</b-button>&nbsp;{{mybalance}}&nbsp;</span>
          </div>
          <div v-else>
            <span class="text-right" v-if="mytoken"><b-button class="btn btn-sm mybtn" variant="outline-warning" @click="dologout">{{'logout'|trans}}</b-button>&nbsp;</span>
          </div>
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
          <b-button block class="mainbtn mt-3" variant="info" :to="{path:'/login',query:{backid:chargerid}}" v-if="!mytoken">{{'btn_login'|trans}}</b-button>
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

        </template>
      </div>
    </b-container>
</div>
</template>
<script>
  export default {
    name: 'chargerbk',
    components: {
    },
    mounted() {
    },
    computed: {
    },
    data() {
      return {
        loads: 0,
        disphours: false,
        keeploading: true,
        mac: undefined,
        chargerid: this.$route.params.id,
        portid: -1,
        noclick: true,
        norefresh: false,
        vcardbtnclicked:false,
        step: 0,
        btntext: 'ChargeNOW',
        myid: -1,
        isagent:0,
        mytoken: '',
        mynickname: '',
        mybalance: '0.00',
        mybalnum: 0,
        contentId: 0,
        hourid: parseInt(localStorage.horid)||0,
        charging: 0,
        loading: false,
        prid: 2,
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
      async fetchData() {
        let lotoken = localStorage.getItem('token');
        let qryparams = 'token=' + lotoken + '&loads=' + this.loads;
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
      },
      selectport(id) {
        let txt = '';
        let neverclick = true;
        if (this.sw[id] == 0) {
          txt = this.$t('message.DoCharge')+'(#' + (id + 1) + ')';
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
      async authen() {
        let lotoken = localStorage.getItem('token');
        if (lotoken) {
          let loginparam = 'token=' + lotoken + '&tm=' + new Date().getTime();
          let loginresult = await this.axios.post('/chargeauth?tm=' + new Date().getTime(), loginparam);
          if (loginresult && loginresult.status == 200) {
            let nickname = localStorage.getItem('nickname');
            this.mytoken = lotoken;
            this.mynickname = nickname;
            this.mybalnum = loginresult.data.balnum;
            this.mybalance = loginresult.data.balance;
            this.isagent = loginresult.data.isagent;
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('nickname');
          }
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
      async dochargebk() {
        this.noclick = true;
        this.norefresh = true;
        let lotoken = localStorage.getItem('token');
        let doparams = 'token=' + lotoken + '&mac=' + this.mac + '&portid=' + this.portid + '&hourid=' + this.hourid;
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
<style>
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
  @media only screen and (orientation: portrait) {
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
      background-image: url(/images/socket.png);
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
      background-image: url(/images/socket.png);
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
  
  .devbox1 {
    margin: 0 auto;
  }
  .pay {
    width: 100%;
    margin-top: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: 1.6rem;
    color: blue;
  }
  .hasnet {
    color: rgba(0, 255, 0, 0.6);
    text-shadow: 4px 4px 8px rgba(51, 51, 51, .2);
  }
  .nonet {
    color: rgba(102, 102, 102, 0.5);
    text-shadow: 4px 4px 8px rgba(51, 51, 51, .2);
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .mypicker {
    position: absolute;
    top: 0;
    z-index: 11;
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
</style>
