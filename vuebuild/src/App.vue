<template>
  <div id="h5app">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    components: {
    },
    data() {
      return {};
    },
    methods: {}
  }
</script>
<style>
  .lnk{color:rgba(0,102,0,0.5);}
  .offlin {background-color:#D3D3D3;filter:Alpha(Opacity=60);opacity:0.6;color:#666}
  .mainbtn {
    line-height: 4rem;
    font-size: 2rem;
  }
  .loginmsg {
    margin: 1rem;
    color: red;
    font-size: 1.2rem;
  }
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
  }
  .chead2 {
    line-height: 4rem;
    font-size: 1.6rem;
  }
  .mybtn {}
  @media only screen and (orientation: portrait) {
    .cheader {
      line-height: 10vw;
      font-size: 6vw;
      margin-right: 2vw;
    }
    .mybtn {
      line-height: 5vw;
      font-size: 4vw;
    }
    .chead2 {
      line-height: 10vw;
      font-size: 5vw;
    }
  }
  .opacity {background-color: rgba(255,255,255,0.8);}
  .mypicker{background-color:rgba(153,153,153,0.9)}
  @media (prefers-color-scheme: dark) {
    .opacity {background-color: rgba(0,0,0,0.8);}
    .mypicker{background-color:rgba(102,102,102,0.9);}
  }
</style>
