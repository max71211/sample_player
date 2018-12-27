<template>
  <div id="app" v-cloak>
    <div class="tool_block">
      <div class="tool_btn_wrapper">
        <span class="tool_btn" @click="playTrack(playingSampl-1)">
          <ion-icon name="skip-backward"></ion-icon>
        </span>
        <span class="tool_btn" @click="playTrack(playingSampl)">
          <ion-icon name="play" v-if="!play"></ion-icon>
          <ion-icon name="pause" v-else></ion-icon>
        </span>
        <span class="tool_btn" @click="playTrack(playingSampl+1)">
          <ion-icon name="skip-forward"></ion-icon>
        </span>
      </div>

      <div
        class="time_line_wrapper"
        ref="timeLineWrapper"
        @mousedown.stop="setTimeLine($event)"
        @mousemove="dragTimeLine($event)"
        @mouseleave="mouseUP"
        @mouseup="mouseUP"
      >
        <div class="time_line" :style="timeLineStyle"></div>
      </div>

      <div class="volume_wrapper">
        <ion-icon name="volume-mute"></ion-icon>
        <div
          class="voice_power_wrapper"
          ref="volumeWrapper"
          @mousedown.stop="setVolume($event)"
          @mousemove="dragVolume($event)"
          @mouseleave="mouseUP"
          @mouseup="mouseUP"
        >
          <div class="voice_power_line" :style="volumeStyle"></div>
        </div>
      </div>
    </div>
    <div class="search_block">
      <input type="text" placeholder="Search for artists or tracks" v-model="searchString">
    </div>

    <div class="samples_block">
      <div
        class="sample_item"
        v-bind:key="key"
        v-for="(sample, key) in traksArray"
        @click="playTrack(key)"
      >
        <div class="sample_item_title">Author: {{ sample.author }} Track: {{ sample.tack}}</div>
        <div class="status_block">
          <span v-if="key==playingSampl" class="timer_block">{{trackTimer}} / {{playerDuration}}</span>
          <ion-icon name="play" v-if="key==playingSampl && samplePlaying"></ion-icon>
          <ion-icon name="pause" v-else-if="key==playingSampl && !samplePlaying"></ion-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Howl } from "howler";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "app",
  data() {
    return {
      searchString: "",
      player: null,
      playerId: null,
      playerTimer: 0,
      timer: null,
      playerDuration: 0,
      play: false,
      samplePlaying: false,
      volume: 60,
      volumeActive: false,
      timeLine: 0,
      timeLineActive: false,
      mute: false,
      playingSampl: null,
      tracksLoaded: false
    };
  },
  computed: {
    ...mapGetters(["getTraks", "getTraksBySearchString"]),
    traksArray() {
      if (this.searchString.length < 1) {
        return this.getTraks;
      } else {
        return this.getTraksBySearchString(this.searchString);
      }
    },
    convertedVolume() {
      return parseFloat((this.volume * 0.01).toFixed(2));
    },
    volumeStyle() {
      return {
        width: this.volume + "%"
      };
    },
    timeLineStyle() {
      return {
        width: this.timeLine + "%"
      };
    },
    trackDuration() {
      return Math.round(this.player.duration()) || 0;
    },
    trackTimer() {
      return this.formatTime(this.playerTimer) || 0;
    }
  },
  methods: {
    ...mapActions(["loadSamples"]),
    playTrack(key) {
      key = key == null ? 0 : key;
      if (this.traksArray[key] == undefined) {
        key = key < 0 ? this.traksArray.length - 1 : key;
        key = key > this.traksArray.length - 1 ? 0 : key;
      }
      this.play = this.playingSampl == key ? !this.play : true;
      if (this.play) {
        let trackSrc =
          this.traksArray.length > 0 ? this.traksArray[key].src : "";

        if (this.playingSampl != key) {
          if (this.player != null) {
            clearInterval(this.timer);
            this.playerTimer = 0;
            this.timeLine = 0;
            this.player.stop();
            this.playerId = null;
          }

          this.player = new Howl({
            src: [trackSrc],
            format: ["mp3"],
            xhrWithCredentials: true,
            volume: this.convertedVolume,
            onload: () => {
              this.tracksLoaded = true;
              this.playerId = this.player.play();
            },
            onplay: () => {
              this.samplePlaying = true;
              let time = Math.round(this.player.duration());
              this.playerDuration = this.formatTime(time);
              this.startPlayerTimer();
              this.playingSampl = key;
            },
            onpause: () => {
              this.samplePlaying = false;
              clearInterval(this.timer);
            },
            onstop: () => {
              this.samplePlaying = false;
            }
          });
        } else {
          this.player.play();
        }
      } else {
        clearInterval(this.timer);
        if (this.player !== null) {
          this.player.pause();
        }
      }
    },
    seekTrack(position) {
      position = position < 0 ? 0 : position;
      position = position > this.trackDuration ? this.trackDuration : position;
      position = Math.round(position);
      clearInterval(this.timer);
      this.playerTimer = position;
      this.player.seek(position);
      this.startPlayerTimer();
    },
    getPr(n, m) {
      let pr = parseInt((100 * n) / m);
      return pr > 100 ? 100 : pr < 0 ? 0 : pr;
    },
    formatTime(secs) {
      let minutes = Math.floor(secs / 60) || 0;
      let seconds = secs - minutes * 60 || 0;
      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    },
    startPlayerTimer() {
      let duration = this.trackDuration;
      this.timer = setInterval(() => {
        if (this.playerTimer < duration) {
          this.timeLine = this.getPr(this.playerTimer, duration);
          this.playerTimer++;
        } else {
          clearInterval(this.timer);
          this.playTrack(this.playingSampl + 1);
        }
      }, 1000);
    },
    setVolume(e) {
      this.volumeActive = true;
      let n = e.offsetX;
      let m = this.$refs.volumeWrapper.clientWidth;
      this.volume = this.getPr(n, m);
    },
    dragVolume(e) {
      if (this.volumeActive) {
        let n = e.offsetX;
        let m = this.$refs.volumeWrapper.clientWidth;
        this.volumeActive = true;
        this.volume = this.getPr(n, m);
      }
    },
    setTimeLine(e) {
      if (this.playerTimer > 0) {
        this.timeLineActive = true;
        let n = e.offsetX;
        let m = this.$refs.timeLineWrapper.clientWidth;
        this.timeLine = this.getPr(n, m);
        let position = (this.trackDuration / 100) * this.timeLine;
        this.seekTrack(position);
      }
    },
    dragTimeLine(e) {
      if (this.timeLineActive) {
        let n = e.offsetX;
        let m = this.$refs.timeLineWrapper.clientWidth;
        this.volumeActive = true;
        this.timeLine = this.getPr(n, m);
        let position = (this.trackDuration / 100) * this.timeLine;
        this.seekTrack(position);
      }
    },
    mouseUP() {
      this.volumeActive = false;
      this.timeLineActive = false;
    }
  },
  watch: {
    volume() {
      this.$nextTick(() => {
        if (this.player !== null) {
          this.player.volume(this.convertedVolume);
        }
      });
    },
    searchString() {
      if (this.searchString.length > 0 && this.play) {
        clearInterval(this.timer);
        this.playingSampl = null;
        this.playerTimer = 0;
        this.timeLine = 0;
        this.player.stop();
        this.playerId = null;
      }
    }
  },
  beforeDestroy() {
    if (this.player !== null) {
      this.player.stop();
      this.player = null;
    }
  }
};
</script>

<style>
[v-cloack] {
  display: none;
}

* {
  padding: 0;
  margin: 0;
}

html {
  height: 100%;
}

body {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#app {
  width: 40%;
  margin: 0 auto;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 40px 20px;
  font-family: "ZCOOL XiaoWei", serif;
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

.tool_btn_wrapper {
  padding: 0 10px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  max-height: 10px;
}

.tool_btn {
  margin: 0 10px;
  cursor: pointer;
  color: gray;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
  transition: all 0.4s linear;
}

.tool_btn:hover {
  opacity: 0.8;
}

.time_line_wrapper {
  margin-left: 10px;
  flex: 8 0 auto;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  height: 8px;
  max-height: 8px;
  padding: 1px;
  cursor: pointer;
  border: 1px solid #b8b6b7;
}

.time_line {
  height: 8px;
  background: gray;
}

.volume_wrapper {
  margin-left: 10px;
  flex: 2 0 auto;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

.voice_power_wrapper {
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

.search_block input[type="text"] {
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
  font-family: "ZCOOL XiaoWei", serif;
}

.samples_block {
  margin-top: 30px;
  width: 100%;
  /* flex: 1 0 auto; */
  height: 400px;
  overflow: auto;
  border: 1px solid #b8b6b7;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.sample_item {
  width: 98%;
  height: 22px;
  margin: 4px 0 0 0;
  border: 1px solid #b8b6b7;
  background: #eee9eb;
  cursor: pointer;
  transition: all 0.4s linear;
  text-indent: 5px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  line-height: 22px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sample_item_title {
  max-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sample_item:last-of-type {
  margin-bottom: 4px;
}

.sample_item:hover {
  opacity: 0.8;
}

.status_block {
  width: 120px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}

.timer_block {
  min-width: 70px;
  padding: 0 3px 0 0;
  height: 15px;
  font-size: 10px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  background: #fdfdfd;
  border-radius: 5px;
  margin-right: 5px;
}

@media screen and (max-width: 960px) {
  #app {
    width: 70%;
  }
}

@media screen and (max-width: 414px) {
  #app {
    width: 90%;
  }

  .tool_block {
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100px;
  }

  .tool_btn_wrapper {
    border: 1px solid #b8b6b7;
    border-radius: 5px;
    padding: 10px;
  }

  .time_line_wrapper {
    margin-left: 0px;
    margin-top: 30px;
    flex: 1 0 auto;
    width: 100%;
  }

  .volume_wrapper {
    flex: 1 0 auto;
    margin-top: 20px;
    width: 60%;
  }
}
</style>
