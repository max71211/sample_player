<template>
  <div id="app">
    <div class="tool_block">
      <span class="tool_btn">
        <ion-icon name="skip-backward"></ion-icon>
      </span>
      <span class="tool_btn" @click="play=!play">
        <ion-icon name="play" v-if="!play"></ion-icon>
        <ion-icon name="pause" v-else></ion-icon>
      </span>
      <span class="tool_btn">
        <ion-icon name="skip-forward"></ion-icon>
      </span>

      <div class="time_line_wrapper" ref="timeLineWrapper" @mousedown="setTimeLine($event)" @mouseover="mouseOverTimeLine($event)">
        <div class="time_line" :style="timeLineStyle"></div>
      </div>

      <div class="volume_wrapper">
        <ion-icon name="volume-mute"></ion-icon>
        <div class="voice_power_wrapper" ref="volumeWrapper" @mousedown="setVolume($event)" @blure="volumeActive=false" @mouseover="mouseOverVolume($event)">
          <div class="voice_power_line" :style="volumeStyle"></div>
        </div>
      </div>
    </div>
    <div class="search_block">
      <input type="text" placeholder="Search for artists or tracks" v-model="searchString" @change="findSample">
    </div>
    <div class="samples_block"></div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      searchString: '',
      play: false,
      volume:  80,
      volumeActive: false,
      timeLine: 0,
      timeLineActive: false,
      mute: false
    }
  },
  computed: {
    volumeStyle () {
      return {
        width: this.volume+'%'
      }
    },
    timeLineStyle () {
      return {
        width: this.timeLine+'%'
      }
    }
  },
  methods: {
    getPr (n, m) {
      return parseInt(100*n/m)
    },
    findSample () {

    },
		setVolume (e) {
      let n = e.offsetX
      let m = this.$refs.volumeWrapper.clientWidth
      this.volumeActive = true
      this.volume= this.getPr(n,m)
    },
    setTimeLine (e) {
      let n = e.offsetX
      let m = this.$refs.timeLineWrapper.clientWidth
      this.timeLine = this.getPr(n,m)
    },
    mouseOverVolume (e) {
      let n = e.offsetX
      let m = this.$refs.volumeWrapper.clientWidth
      this.volumeActive = true
      this.volume= this.getPr(n,m)
    },
    mouseOverTimeLine (e) {

    }
  }
}
</script>

<style>

* {
  padding: 0;
  margin: 0;
}

html{
  height: 100%;
}

body{
  display: flex;
  flex-direction: column;
  height: 100%;
}

#app {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 40px 20px;
  font-family: 'Indie Flower', cursive;
}

  .tool_block {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 30px;
  }

  .tool_btn {
    margin-left: 10px;
    padding: 5px;
    cursor: pointer;
    color: gray;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    transition: all .4s linear;
  }

  .tool_btn:hover {
    opacity: .8;
  }

  .btn_active.tool_btn {
    color: #2b7dff;
  }

  .time_line_wrapper {
    margin-left: 20px;
    flex: 10 0 auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    height: 8px;
    padding: 1px;
    cursor: pointer;
    border: 1px solid #b8b6b7;

  }

  .time_line {
    height: 8px;
    background: gray;
    cursor: pointer;
  }

  .volume_wrapper {
    margin-left: 10px;
    flex: 1 1 auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
  }

  .voice_power_wrapper {
    margin-left: 0px;
    flex: 10 0 auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    height: 8px;
    padding: 1px;
    cursor: pointer;
    border: 1px solid #b8b6b7;
  }

  .voice_power_line {
    height: 8px;
    background: gray;
    cursor: pointer;
  }

  .search_block {
    margin-top: 20px;
    width: 100%;
    height: 30px;
  }

  .search_block input[type=text] {
    width: 100%;
    height: 25px;
    background-color: #ffffff;
    text-indent: 10px;
    align-self: center;
    border: 1px solid #b8b6b7;
    border-radius: 5px;
    outline: none;
    outline-offset: 0;
    font-size: 1.1em;
    margin-bottom: 10px;
    margin-top: 10px;
    font-family: 'Indie Flower', cursive;
  }

  .samples_block {
    margin-top: 30px;
    width: 100%;
    flex: 1 0 auto;
    border: 1px solid #b8b6b7;
    border-radius: 5px;
  }
</style>
