<script lang="ts" setup>
let _keeploading: boolean = true
let _pauseFetch: boolean = false
let _myid: number = -1
function getURLParameter(sParam: string): string {
  let sPageURL: string = window.location.search.substring(1),
    sURLVariables: string[] = sPageURL.split('&'),
    sParameterName: string[],
    i: number
  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=')
    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? '' : decodeURIComponent(sParameterName[1])
    }
  }
  return ''
}
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/dist/css/bootstrap.css'
import paystack from 'vue3-paystack'
import { nanoid } from 'nanoid'
import { useI18n } from 'vue-i18n'
import { ref, reactive, inject, onMounted, onUnmounted } from 'vue'
import { StreamQrcodeBarcodeReader } from 'vue3-barcode-qrcode-reader'
import { paystackpublickey, prepaylimit, defaultpaystackid, getAssetsFile } from './config'
import {
  getUserPhoneNumber,
  observeUserPresence,
  getUserName,
  getUserAvatar,
  closeApp
} from 'ayoba-microapp-api'
const axios: any = inject('axios')
const snotify: any = inject('vue3-notify')
const { t } = useI18n()
const ayoba = reactive({
  presence: 0,
  avatar: '',
  msisdn: '',
  selfjid: '',
  mytoken: '',
  nickname: '',
  isagent: 0,
  mybalnum: 0,
  mybalance: '0.00'
})
const charger = reactive({
  chargerid: 10000,
  mac: '',
  tep: 0,
  pow: 0,
  stp: 0,
  act: 0,
  cbk: 0,
  beep: '00:00:00',
  prizz: [0, 0, 0, 0, 0, 0],
  imax: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  pi: [
    '0.01',
    '0.01',
    '0.01',
    '0.01',
    '0.01',
    '0.01',
    '0.01',
    '0.01',
    '0.01',
    '0.01',
    '0.01',
    '0.01'
  ],
  sw: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  se: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ua: ['', '', '', '', '', '', '', '', '', '', '', '']
})
const btntext = ref<string>('ChargeNOW')
const payfullname = ref<string>(localStorage.pfname)
const payamount = ref<number>(localStorage.preprepay ? Number(localStorage.preprepay) : prepaylimit)
const vcardnumber = ref<string>('')
const vcardtargetuser = ref<string>('')
const vcardbtn_text = ref<string>(t('vcardactivenow'))
const loads = ref<number>(1)
const portid = ref<number>(-1)
const contentId = ref<number>(0)
const hourid = ref<number>(parseInt(localStorage.horid, 10) || 0)
const loading = ref<boolean>(false)
const showhours = ref<boolean>(false)
const charge_invalid = ref<boolean>(true)
const momobtnclicked = ref<boolean>(false)
const vcardbtnclicked = ref<boolean>(false)
const thehours = reactive<string[]>(['10', '1', '2', '3', '4', '6', '8', '15'])
const st = reactive<string[]>([
  'Free',
  'SwitchON',
  'Charging',
  'Disabled',
  'StopDN',
  'Offline',
  'noID'
])
const decode = ref<any>(undefined)
const refCamera = ref<InstanceType<typeof StreamQrcodeBarcodeReader> | null>(null)

onMounted(() => {
  getUserName((username: string) => {
    ayoba.nickname = username
  })
  getUserAvatar((avatar: string) => {
    ayoba.avatar = avatar
  })
  observeUserPresence(async (online: number) => {
    ayoba.presence = online
    ayoba.msisdn = getUserPhoneNumber()
    ayoba.selfjid = getURLParameter('jid')
  })
  fetchData()
})
onUnmounted(() => {
  ayoba.mytoken = ''
  closeApp()
})
function reference(): string {
  return nanoid()
}
function channels(): string[] {
  return ['card', 'bank', 'ussd', 'mobile_money']
}
function qrscannow(): void {
  contentId.value = 2
  refCamera.value?.onCanPlay()
}
function dologout(): void {
  ayoba.mytoken = ''
  closeApp()
}
async function momopay(): Promise<any> {
  momobtnclicked.value = true
  let qryparams: string =
    'token=' +
    ayoba.mytoken +
    '&money=' +
    payamount.value +
    '&mobile=' +
    encodeURIComponent(ayoba.msisdn)
  let axresp: any = await axios.post('/momoprepay?tm=' + new Date().getTime(), qryparams)
  if (axresp.data.rc < 0) {
    snotify.error(axresp.data.rc + ':' + axresp.data.rm)
    setTimeout(() => {
      momobtnclicked.value = false
    }, 5000)
  } else {
    setTimeout(momocheckbalance, 5000)
  }
}
async function momocheckbalance(): Promise<any> {
  let qryparams: string = 'token=' + ayoba.mytoken + '&thisbalance=' + ayoba.mybalnum
  let axresp: any = await axios.post('/momocheckbalance?tm=' + new Date().getTime(), qryparams)
  if (axresp.data.rc == 1) {
    ayoba.mybalnum = axresp.data.balnum
    ayoba.mybalance = axresp.data.balance
  } else {
    setTimeout(momocheckbalance, 1000)
  }
}
async function paystacksuccess(response: any): Promise<any> {
  contentId.value = 0
  if (ayoba.mytoken) {
    let qryparams: string = 'token=' + ayoba.mytoken + '&ref=' + response.reference
    let axresp: any = await axios.post('/paystackcb?tm=' + new Date().getTime(), qryparams)
    if (axresp.status == 200 && axresp.data.rc == 1) {
      ayoba.mybalnum = axresp.data.balnum
      ayoba.mybalance = axresp.data.balance
    }
    loads.value = 2
    if (!_keeploading) {
      fetchData()
    }
    localStorage.setItem('preprepay', payamount.value.toString())
    localStorage.setItem('pfname', payfullname.value)
  }
}
function paystackcancel(): void {
  contentId.value = 0
}
async function fetchData(): Promise<any> {
  if (ayoba.mytoken) {
    let qryparams: string = 'token=' + ayoba.mytoken + '&loads=' + loads.value
    if (charger.mac) {
      qryparams = qryparams + '&mac=' + charger.mac
    } else {
      qryparams = qryparams + '&id=' + charger.chargerid
    }
    loading.value = true
    let axresp: any = await axios.post('/getonebk?tm=' + new Date().getTime(), qryparams)
    loading.value = false
    if (axresp && axresp.status >= 200) {
      loads.value++
      if (_pauseFetch == true) {
        if (charger.sw[portid.value] != axresp.data.sw[portid.value]) {
          _pauseFetch = false
        }
      } else {
        Object.keys(axresp.data).forEach((key: string) => {
          try {
            if (key == 'sw') {
              charger[key] = axresp.data[key]
            } else if (key == 'se') {
              charger[key] = axresp.data[key]
            } else if (key == 'pi') {
              charger[key] = axresp.data[key]
            } else if (key == 'imax') {
              charger[key] = axresp.data[key]
            } else if (key == 'ua') {
              charger[key] = axresp.data[key]
            } else if (key == 'prizz') {
              charger[key] = axresp.data[key]
            } else if (key == 'tep') {
              charger[key] = axresp.data[key]
            } else if (key == 'mac') {
              charger[key] = axresp.data[key]
            } else if (key == 'beep') {
              charger[key] = axresp.data[key]
            } else if (key == 'cbk') {
              charger[key] = axresp.data[key]
            } else if (key == 'pow') {
              charger[key] = axresp.data[key]
            } else if (key == 'stp') {
              charger[key] = axresp.data[key]
            } else if (key == 'act') {
              charger[key] = axresp.data[key]
            } else if (key == 'myid') {
              _myid = Number(axresp.data[key])
            }
          } catch (e) {
            console.log(key, axresp.data[key])
          }
        })
        if (portid.value > -1) {
          selectport(portid.value)
        }
      }
      if (loads.value < 100) {
        _keeploading = true
        setTimeout(fetchData, 1000)
      } else {
        _keeploading = false
      }
    }
  } else {
    if (ayoba.avatar && ayoba.nickname && ayoba.presence) {
      if (loads.value == 0 && portid.value == -1) {
        loads.value = 1
        snotify.success('SELECT Free Socket (GREEN) First.')
      }
      let qryparams: string =
        'phone=' +
        encodeURIComponent(ayoba.msisdn) +
        '&nick=' +
        encodeURIComponent(ayoba.nickname) +
        '&jid=' +
        encodeURIComponent(ayoba.selfjid) +
        '&online=' +
        ayoba.presence
      let axresp: any = await axios.post('/ayobalogin?tm=' + new Date().getTime(), qryparams)
      if (axresp && axresp.status == 200) {
        if (axresp.data.rc == 1) {
          ayoba.mytoken = axresp.data.token
          ayoba.mybalnum = axresp.data.balnum
          ayoba.mybalance = axresp.data.balance
          ayoba.isagent = axresp.data.isagent
        } else {
          ayoba.mytoken = ''
          snotify.error(axresp.data.rm)
        }
      } else {
        snotify.error('amazonaws LoginERROR')
      }
    }
    setTimeout(fetchData, 1000)
  }
}
function selectport(id: number): void {
  charge_invalid.value = true
  if (charger.sw[id] == 0) {
    btntext.value = t('DoCharge') + '(#' + (id + 1) + 'SOCKET)'
    charge_invalid.value = false
  } else if (charger.sw[id] == 1 || charger.sw[id] == 2) {
    let nowtime: number = new Date().getTime()
    let timeremind: number = charger.se[id] - nowtime
    if (timeremind < 0) {
      if (_myid == id) {
        btntext.value = t('StopNOW')
        charge_invalid.value = false
      } else {
        btntext.value = charger.ua[id] + ' ' + t('Charging')
      }
    } else {
      let timeused: number = timeremind / 1000
      let minutes: number = Math.round(timeused / 60)
      let seconds: number = Math.round(timeused % 60)
      let retime: string = minutes + 'm' + (seconds > 0 ? seconds + 's' : '')
      if (_myid == id) {
        if (minutes > 600) {
          btntext.value = t('IamCharging')
        } else {
          btntext.value = retime + ',' + t('StopNOW')
        }
        charge_invalid.value = false
      } else {
        if (minutes > 600) {
          btntext.value = charger.ua[id]
        } else {
          btntext.value = charger.ua[id] + '@' + retime + ''
        }
      }
    }
  } else if (charger.sw[id] == 3) {
    id = -1
    btntext.value = 'PortDisabled'
  } else if (charger.sw[id] == 4) {
    id = -1
    btntext.value = t('StopKeyDown')
  } else if (charger.sw[id] == 5) {
    if (_myid == id) {
      btntext.value = t('Clearme')
      charge_invalid.value = false
    } else {
      id = -1
      btntext.value = t('DeviceOffline')
    }
  } else {
    id = -1
    btntext.value = t('InvalidChargerID')
  }
  portid.value = id
}
function inputpays(): void {
  contentId.value = 1
}
function cancelpay(): void {
  contentId.value = 0
  vcardbtnclicked.value = false
}
function selectme(e: any): void {
  let id: number = parseInt(e.currentTarget.id, 10)
  selectport(id)
  loads.value = 3
  if (!_keeploading) {
    fetchData()
  }
  if (portid.value == -1) {
    snotify.success('SELECT Free Socket First.')
  }
}
function selecthour(): void {
  showhours.value = true
}
function closeme(): void {
  showhours.value = false
}
function selectfee(e: any): void {
  hourid.value = parseInt(e.currentTarget.id, 10)
  localStorage.horid = hourid.value
  showhours.value = false
}
async function activevcard(): Promise<any> {
  vcardbtnclicked.value = true
  if (Number(vcardnumber.value) + '' != vcardnumber.value) {
    vcardbtn_text.value = t('vcardactiveer1')
    setTimeout(() => {
      vcardbtnclicked.value = false
      vcardbtn_text.value = t('vcardactivenow')
    }, 5000)
  } else if (ayoba.isagent == 1 && vcardnumber.value.length != 4) {
    vcardbtn_text.value = t('vcardactiveer2')
    setTimeout(() => {
      vcardbtnclicked.value = false
      vcardbtn_text.value = t('vcardactivenow')
    }, 5000)
  } else if (ayoba.isagent == 0 && vcardnumber.value.length != 8) {
    vcardbtn_text.value = t('vcardactiveer3')
    setTimeout(() => {
      vcardbtnclicked.value = false
      vcardbtn_text.value = t('vcardactivenow')
    }, 5000)
  } else if (ayoba.isagent == 1 && vcardtargetuser.value.length < 4) {
    vcardbtn_text.value = t('vcardactiveer4')
    setTimeout(() => {
      vcardbtnclicked.value = false
      vcardbtn_text.value = t('vcardactivenow')
    }, 5000)
  } else if (
    ayoba.isagent == 1 &&
    (vcardtargetuser.value.indexOf('@') < 2 || vcardtargetuser.value.indexOf('.') < 4)
  ) {
    vcardbtn_text.value = t('vcardactiveer5')
    setTimeout(() => {
      vcardbtnclicked.value = false
      vcardbtn_text.value = t('vcardactivenow')
    }, 5000)
  } else {
    let doparams: string = 'token=' + ayoba.mytoken + '&cardid=' + vcardnumber.value
    let ret: any
    if (ayoba.isagent == 1) {
      doparams = doparams + '&to=' + encodeURIComponent(vcardtargetuser.value)
      ret = await axios.post('/vcardactive1?tm=' + new Date().getTime(), doparams)
    } else {
      ret = await axios.post('/vcardactive2?tm=' + new Date().getTime(), doparams)
    }
    if (ret && ret.status == 200) {
      if (ret.data.rc > 0) {
        contentId.value = 0
      } else {
        vcardbtn_text.value = ret.data.rm
      }
    } else {
      vcardbtn_text.value = 'unknown error'
    }
  }
}
async function dochargebk(): Promise<any> {
  charge_invalid.value = true
  _pauseFetch = true
  let doparams: string =
    'token=' +
    ayoba.mytoken +
    '&mac=' +
    charger.mac +
    '&portid=' +
    portid.value +
    '&hourid=' +
    hourid.value
  if (charger.sw[portid.value] == 0) {
    btntext.value = t('Starting')
    await axios.post('/dochargebk?tm=' + new Date().getTime(), doparams)
    setTimeout(() => {
      charge_invalid.value = false
      _pauseFetch = false
    }, 10000)
  } else if (_myid == portid.value) {
    btntext.value = t('Stoping') + '...'
    doparams = doparams + '&cmd=1'
    await axios.post('/userdocmd?tm=' + new Date().getTime(), doparams)
    setTimeout(() => {
      charge_invalid.value = false
      _pauseFetch = false
    }, 10000)
  }
  loads.value = 4
  if (!_keeploading) {
    fetchData()
  }
}
function onResult(data: any): void {
  if (data) {
    decode.value = data?.text
    let numid: number = Number(decode.value)
    if (decode.value?.length == 5 && '' + numid == decode.value) {
      charger.chargerid = numid
      charger.mac = ''
      loads.value = 5
      contentId.value = 0
      refCamera.value?.onReset()
      if (!_keeploading) {
        fetchData()
      }
    }
  }
}
</script>
<template>
  <div class="container-md">
    <StreamQrcodeBarcodeReader ref="refCamera" capture="shoot" show-on-stream @result="onResult" />

    <div v-if="contentId == 0">
      <ul class="nav nav-pills nav-fill h3 mt-1">
        <li class="nav-item text-start my-auto">
          <img :src="ayoba.avatar ? ayoba.avatar : getAssetsFile('logo.png')" class="avathead" />
          {{ ayoba.nickname ? ayoba.nickname : '(Ayoba User)' }}
        </li>
        <li class="nav-item text-end my-auto">
          {{ ayoba.mybalance }}
          <button type="button" class="btn btn-sm btn-outline-success" @click="inputpays">
            {{ $t('topup') }}
          </button>
        </li>
      </ul>
      <ul class="nav nav-pills nav-fill h3 mt-1 align-middle">
        <li class="nav-item text-start my-auto">
          <span v-if="charger.chargerid"
            >{{ $t('chargerID') }}&nbsp;<span>{{ charger.chargerid }}</span></span
          >
          <span v-else>&lt;ScanQR First&gt;</span>
        </li>
        <li class="nav-item text-end btn btn-sm my-auto" @click="qrscannow">
          <img :src="getAssetsFile('scan54.png')" class="avathead" />
        </li>
      </ul>
      <div class="text-center mt-1">
        <div class="d-inline-flex">
          <div class="bdright">
            <div class="pbox" :class="portid == 0 ? 'p1' : 'p0'" id="0" @click="selectme($event)">
              <div class="xn-ama w-ama">
                <div
                  class="xn-amb w-amb"
                  :class="portid == 0 ? 'd1 bg' + charger.sw[0] : 'd0 bg' + charger.sw[0]"
                >
                  <div class="fixed" :class="'fg' + charger.sw[0]">
                    {{ charger.chargerid ? '1' : '-' }}
                  </div>
                </div>
                <div class="tinyst">{{ $t(st[charger.sw[0]]) }}</div>
              </div>
            </div>
            <div class="pbox" :class="portid == 4 ? 'p1' : 'p0'" id="4" @click="selectme($event)">
              <div class="xn-ama w-ama">
                <div
                  class="xn-amb w-amb"
                  :class="portid == 4 ? 'd1 bg' + charger.sw[4] : 'd0 bg' + charger.sw[4]"
                >
                  <div class="fixed" :class="'fg' + charger.sw[4]">
                    {{ charger.chargerid ? '5' : '-' }}
                  </div>
                </div>
                <div class="tinyst">{{ $t(st[charger.sw[4]]) }}</div>
              </div>
            </div>
            <div class="pbox" :class="portid == 8 ? 'p1' : 'p0'" id="8" @click="selectme($event)">
              <div class="xn-ama w-ama">
                <div
                  class="xn-amb w-amb"
                  :class="portid == 8 ? 'd1 bg' + charger.sw[8] : 'd0 bg' + charger.sw[8]"
                >
                  <div class="fixed" :class="'fg' + charger.sw[8]">
                    {{ charger.chargerid ? '9' : '-' }}
                  </div>
                </div>
                <div class="tinyst">{{ $t(st[charger.sw[8]]) }}</div>
              </div>
            </div>
          </div>
          <div class="bdright">
            <div class="pbox" :class="portid == 1 ? 'p1' : 'p0'" id="1" @click="selectme($event)">
              <div class="xn-ama w-ama">
                <div
                  class="xn-amb w-amb"
                  :class="portid == 1 ? 'd1 bg' + charger.sw[1] : 'd0 bg' + charger.sw[1]"
                >
                  <div class="fixed" :class="'fg' + charger.sw[1]">
                    {{ charger.chargerid ? '2' : '-' }}
                  </div>
                </div>
                <div class="tinyst">{{ $t(st[charger.sw[1]]) }}</div>
              </div>
            </div>
            <div class="pbox" :class="portid == 5 ? 'p1' : 'p0'" id="5" @click="selectme($event)">
              <div class="xn-ama w-ama">
                <div
                  class="xn-amb w-amb"
                  :class="portid == 5 ? 'd1 bg' + charger.sw[5] : 'd0 bg' + charger.sw[5]"
                >
                  <div class="fixed" :class="'fg' + charger.sw[5]">
                    {{ charger.chargerid ? '6' : '-' }}
                  </div>
                </div>
                <div class="tinyst">{{ $t(st[charger.sw[5]]) }}</div>
              </div>
            </div>
            <div class="pbox" :class="portid == 9 ? 'p1' : 'p0'" id="9" @click="selectme($event)">
              <div class="xn-ama w-ama">
                <div
                  class="xn-amb w-amb"
                  :class="portid == 9 ? 'd1 bg' + charger.sw[9] : 'd0 bg' + charger.sw[9]"
                >
                  <div class="fixed" :class="'fg' + charger.sw[9]">
                    {{ charger.chargerid ? '10' : '-' }}
                  </div>
                </div>
                <div class="tinyst">{{ $t(st[charger.sw[9]]) }}</div>
              </div>
            </div>
          </div>
          <div class="bdright">
            <div class="pbox" :class="portid == 2 ? 'p1' : 'p0'" id="2" @click="selectme($event)">
              <div class="xn-ama w-ama">
                <div
                  class="xn-amb w-amb"
                  :class="portid == 2 ? 'd1 bg' + charger.sw[2] : 'd0 bg' + charger.sw[2]"
                >
                  <div class="fixed" :class="'fg' + charger.sw[2]">
                    {{ charger.chargerid ? '3' : '-' }}
                  </div>
                </div>
                <div class="tinyst">{{ $t(st[charger.sw[2]]) }}</div>
              </div>
            </div>
            <div class="pbox" :class="portid == 6 ? 'p1' : 'p0'" id="6" @click="selectme($event)">
              <div class="xn-ama w-ama">
                <div
                  class="xn-amb w-amb"
                  :class="portid == 6 ? 'd1 bg' + charger.sw[6] : 'd0 bg' + charger.sw[6]"
                >
                  <div class="fixed" :class="'fg' + charger.sw[6]">
                    {{ charger.chargerid ? '7' : '-' }}
                  </div>
                </div>
                <div class="tinyst">{{ $t(st[charger.sw[6]]) }}</div>
              </div>
            </div>
            <div class="pbox" :class="portid == 10 ? 'p1' : 'p0'" id="10" @click="selectme($event)">
              <div class="xn-ama w-ama">
                <div
                  class="xn-amb w-amb"
                  :class="portid == 10 ? 'd1 bg' + charger.sw[10] : 'd0 bg' + charger.sw[10]"
                >
                  <div class="fixed" :class="'fg' + charger.sw[10]">
                    {{ charger.chargerid ? '11' : '-' }}
                  </div>
                </div>
                <div class="tinyst">{{ $t(st[charger.sw[10]]) }}</div>
              </div>
            </div>
          </div>
          <div class="weui-flex__item">
            <div class="pbox" :class="portid == 3 ? 'p1' : 'p0'" id="3" @click="selectme($event)">
              <div class="xn-ama w-ama">
                <div
                  class="xn-amb w-amb"
                  :class="portid == 3 ? 'd1 bg' + charger.sw[3] : 'd0 bg' + charger.sw[3]"
                >
                  <div class="fixed" :class="'fg' + charger.sw[3]">
                    {{ charger.chargerid ? '4' : '-' }}
                  </div>
                </div>
                <div class="tinyst">{{ $t(st[charger.sw[3]]) }}</div>
              </div>
            </div>
            <div class="pbox" :class="portid == 7 ? 'p1' : 'p0'" id="7" @click="selectme($event)">
              <div class="xn-ama w-ama">
                <div
                  class="xn-amb w-amb"
                  :class="portid == 7 ? 'd1 bg' + charger.sw[7] : 'd0 bg' + charger.sw[7]"
                >
                  <div class="fixed" :class="'fg' + charger.sw[7]">
                    {{ charger.chargerid ? '8' : '-' }}
                  </div>
                </div>
                <div class="tinyst">{{ $t(st[charger.sw[7]]) }}</div>
              </div>
            </div>
            <div class="pbox" :class="portid == 11 ? 'p1' : 'p0'" id="11" @click="selectme($event)">
              <div class="xn-ama w-ama">
                <div
                  class="xn-amb w-amb"
                  :class="portid == 11 ? 'd1 bg' + charger.sw[11] : 'd0 bg' + charger.sw[11]"
                >
                  <div class="fixed" :class="'fg' + charger.sw[11]">
                    {{ charger.chargerid ? '12' : '-' }}
                  </div>
                </div>
                <div class="tinyst">{{ $t(st[charger.sw[11]]) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="btn btn-outline-info w-100 mt-3" @click="selecthour">
        {{ $t('ChargeTIME') }}: {{ thehours[hourid] }}{{ $t('hors') }}
      </button>
      <button
        class="btn btn-warning w-100 mt-3"
        @click="inputpays"
        v-if="ayoba.mytoken && ayoba.mybalnum < 10"
      >
        {{ $t('btn_prepay') }}
      </button>
      <button
        class="btn btn-success w-100 mt-3"
        @click="dochargebk"
        v-if="ayoba.mytoken && ayoba.mybalnum >= 10"
        :disabled="charge_invalid"
      >
        {{ btntext }}
      </button>
      <div class="mypicker pickw" v-if="showhours">
        <div>
          <div class="mypanel fs1">{{ $t('bkchargehours') }} :</div>
          <div class="li2 fs2 mt-4">
            <div class="pbo2" :class="hourid == 0 ? 'f0' : 'f1'" id="0" @click="selectfee">
              10{{ $t('hors') }}
            </div>
            <div class="pbo2" :class="hourid == 1 ? 'f0' : 'f1'" id="1" @click="selectfee">
              1 {{ $t('hors') }}
            </div>
            <div class="pbo2" :class="hourid == 2 ? 'f0' : 'f1'" id="2" @click="selectfee">
              2 {{ $t('hors') }}
            </div>
            <div class="pbo2" :class="hourid == 3 ? 'f0' : 'f1'" id="3" @click="selectfee">
              3 {{ $t('hors') }}
            </div>
          </div>
          <div class="li2 fs2 mt-4 mb-4">
            <div class="pbo2" :class="hourid == 4 ? 'f0' : 'f1'" id="4" @click="selectfee">
              4 {{ $t('hors') }}
            </div>
            <div class="pbo2" :class="hourid == 5 ? 'f0' : 'f1'" id="5" @click="selectfee">
              6 {{ $t('hors') }}
            </div>
            <div class="pbo2" :class="hourid == 6 ? 'f0' : 'f1'" id="6" @click="selectfee">
              8 {{ $t('hors') }}
            </div>
            <div class="pbo2" :class="hourid == 7 ? 'f0' : 'f1'" id="7" @click="selectfee">
              15{{ $t('hors') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="contentId == 1">
      <ul class="nav nav-pills nav-fill mt-1">
        <li class="nav-item text-start">
          <img :src="ayoba.avatar ? ayoba.avatar : getAssetsFile('logo.png')" class="avathead" />
          {{ ayoba.nickname ? ayoba.nickname : '(Ayoba User)' }}
        </li>
        <li class="nav-item text-end">
          <button class="btn btn-sm btn-outline-warning" @click="dologout">
            {{ $t('logout') }}
          </button>
        </li>
      </ul>
      <ul class="nav nav-pills nav-fill mb-4 mt-4" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="active btn btn-warning w-75"
            id="paystack-tab"
            data-bs-toggle="tab"
            data-bs-target="#paystack"
            rol="tab"
            aria-controls="paystack"
            aria-selected="true"
            href="#paystack"
          >
            {{ $t('tabpaystack') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="btn btn-success w-75"
            id="momo-tab"
            data-bs-toggle="tab"
            data-bs-target="#momo"
            type="button"
            rol="tab"
            aria-controls="momo"
            aria-selected="false"
            href="#momo"
          >
            {{ $t('tabmomo') }}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="btn btn-info w-75"
            id="vcard-tab"
            data-bs-toggle="tab"
            data-bs-target="#vcard"
            type="button"
            rol="tab"
            aria-controls="vcard"
            aria-selected="false"
            href="#vcard"
          >
            {{ $t('tabvcard') }}
          </button>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div
          id="paystack"
          role="tabpanel"
          aria-labelledby="paystack-tab"
          class="tab-pane fade show active xnpanel mt-3 pt-4 pb-3"
        >
          <div class="text-end">
            <button
              type="button"
              class="btn btn-close"
              style="margin-top: -12px; margin-right: -12px"
              aria-label="Close"
              @click="cancelpay"
            ></button>
          </div>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              v-model="payfullname"
              id="paystackfullname"
              required
              maxlength="32"
              placeholder=""
            />
            <label for="paystackfullname">{{ $t('payfullname') }}</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              v-model="payamount"
              id="paystackmoney"
              required
              maxlength="32"
              placeholder=""
            />
            <label for="paystackmoney">{{ $t('paymoneys') }}</label>
          </div>
          <paystack
            buttonClass="btn btn-warning w-100"
            :buttonText="$t('btn_prepay')"
            :publicKey="paystackpublickey"
            :amount="payamount * 100"
            :email="defaultpaystackid"
            :reference="reference()"
            :channels="channels()"
            :onSuccess="paystacksuccess"
            :onCanel="paystackcancel"
            currency="GHS"
          >
          </paystack>
          <div class="mt-4 mb-3">
            <img :src="getAssetsFile('paystack-gh.png')" class="w-100" />
          </div>
        </div>
        <div
          id="momo"
          role="tabpanel"
          aria-labelledby="momo-tab"
          class="tab-pane fade show xnpanel mt-3 pt-4 pb-3"
        >
          <div class="text-end">
            <button
              type="button"
              class="btn btn-close"
              style="margin-top: -12px; margin-right: -12px"
              aria-label="Close"
              @click="cancelpay"
            ></button>
          </div>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              v-model="ayoba.msisdn"
              id="momoisdn"
              required
              maxlength="32"
              placeholder=""
            />
            <label for="momoisdn">{{ $t('mobilenumber') }}</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              v-model="payamount"
              id="momomount"
              required
              maxlength="32"
              placeholder=""
            />
            <label for="momomount">{{ $t('paymoneys') }}</label>
          </div>
          <button class="btn btn-success mb-3 w-100" @click="momopay" :disabled="momobtnclicked">
            {{ $t('lbmomopay') }}
          </button>
          <div class="mb-3">
            <img :src="getAssetsFile('paystack-gh.png')" class="w-100" />
          </div>
        </div>
        <div
          id="vcard"
          role="tabpanel"
          aria-labelledby="vcard-tab"
          class="tab-pane fade show xnpanel mt-3 pt-4 pb-3"
        >
          <div class="text-end">
            <button
              type="button"
              class="btn btn-close"
              style="margin-top: -12px; margin-right: -12px"
              aria-label="Close"
              @click="cancelpay"
            ></button>
          </div>
          <div class="form-floating mb-3" v-if="ayoba.isagent == 1">
            <input
              type="text"
              class="form-control"
              v-model="vcardtargetuser"
              id="vcarduid"
              required
              maxlength="32"
              placeholder=""
            />
            <label for="vcarduid">{{ $t('activetarget') }}</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              v-model="vcardnumber"
              id="vcardcode"
              required
              maxlength="32"
              placeholder=""
            />
            <label for="vcardcode">{{ $t('activecode') }}</label>
          </div>
          <button class="btn btn-info mb-3 w-100" @click="activevcard" :disabled="vcardbtnclicked">
            {{ vcardbtn_text }}
          </button>
          <div class="mb-3">
            <img :src="getAssetsFile('paystack-gh.png')" class="w-100" />
          </div>
        </div>
      </div>
    </div>

    <vue3-notify />
    <div v-if="loads == 0" class="mask opacity" @touchmove.prevent>&nbsp;</div>
    <div v-if="showhours" class="mask opacity" @click="closeme">&nbsp;</div>

    <div v-if="contentId == 2">&nbsp;</div>
  </div>
</template>

<style scoped>
.avathead {
  width: 36px;
  height: 36px;
}
.bdright {
  border-right: 1px solid #ddd;
}
.p1 {
  background-color: #9f9;
}
.p0 {
  background-color: unset;
}
.d1 {
  box-shadow: 1px 1px 1px rgba(51, 51, 51, 0.1);
}
.d0 {
  box-shadow: 8px 8px 8px rgba(51, 51, 51, 0.5);
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
  text-shadow: 4px 4px 8px rgba(51, 51, 51, 0.2);
}
.nonet {
  color: rgba(102, 102, 102, 0.5);
  text-shadow: 4px 4px 8px rgba(51, 51, 51, 0.2);
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
  padding: 0.5rem;
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
.lnk {
  color: rgba(0, 102, 0, 0.5);
}
.offlin {
  background-color: #d3d3d3;
  filter: Alpha(Opacity=60);
  opacity: 0.6;
  color: #666;
}
.xnpanel {
  padding-left: 4vw;
  padding-right: 4vw;
  border-radius: 15px;
  border: 1px solid #b3b3b3;
  box-shadow: 10px 20px 10px rgba(0, 0, 0, 0.8);
  z-index: 1000;
}
.xnshadow {
  box-shadow: 10px 10px 20px rgba(51, 51, 51, 0.4);
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
.pbox {
  padding: 2vw;
  border-bottom: 1px solid #ddd;
}
@media only screen and (orientation: portrait) {
  .w-ama {
    width: 19vw;
    height: 19vw;
  }
  .pickw {
    width: 100vw;
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
    margin-top: 5vw;
    font-size: 2vw;
    color: #bbb;
  }
}
.opacity {
  background-color: rgba(255, 255, 255, 0.8);
}
.mypicker {
  position: absolute;
  top: 0;
  z-index: 1000;
  background-color: rgba(153, 153, 153, 0.9);
}
@media (prefers-color-scheme: dark) {
  .opacity {
    background-color: rgba(0, 0, 0, 0.8);
  }
  .mypicker {
    position: absolute;
    top: 0;
    z-index: 1000;
    background-color: rgba(102, 102, 102, 0.9);
  }
}
@media only screen and (orientation: landscape) {
  .w-ama {
    width: 80px;
    height: 80px;
  }
  .pickw {
    width: 500px;
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
    margin-top: 14px;
    font-size: 0.5rem;
    color: #bbb;
  }
}
</style>
