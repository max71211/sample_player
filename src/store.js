import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    traks: [
      {
        author: "Adele",
        tack: "SkayFall",
        src:
          "https://dl.dropboxusercontent.com/s/llehpkjhlj9161a/creationcookie%20-%20Adele%20-%20SKYFALL%20Official%20Lyrics%20Video.mp3?dl=0"
      },
      {
        author: "Grace Davies",
        tack: "Hello - Adele",
        src:
          "https://dl.dropboxusercontent.com/s/llehpkjhlj9161a/creationcookie%20-%20Adele%20-%20SKYFALL%20Official%20Lyrics%20Video.mp3?dl=0"
      },
      {
        author: "Adele",
        tack: "Set Fire To The Rane",
        src:
          "https://dl.dropboxusercontent.com/s/77vk0xbjgy9obgq/hagiwhat%20-%20Adele%20-%20Set%20fire%20to%20the%20rain%20remix.mp3?dl=0"
      },
      {
        author: "Marvin Jenser",
        tack: "Take Me To Church",
        src:
          "https://dl.dropboxusercontent.com/s/00es8cmbqipac6p/Marvin%20Jensen%20-%20Hozier%20-%20Take%20Me%20To%20Church.mp3.mp3?dl=0"
      },
      {
        author: "Eageanbluefish",
        tack: "This Is The Mans World",
        src:
          "https://dl.dropboxusercontent.com/s/quryhrfq93r0ngm/eageanbluefish%20-%20This%20is%20the%20man%27s%20world-live.mp3?dl=0"
      },
      {
        author: "L'actualité d'Indila",
        tack: "Love Story",
        src:
          "https://dl.dropboxusercontent.com/s/a7o2r8ks0sg5dc7/L%27actualit%C3%A9%20d%27Indila%20-%20Indila%20-%20Love%20Story%20%28L%27%C3%89quipe%20de%20nuit%20_%20Radio%20Scoop%29.mp3?dl=0"
      }
    ]
  },
  getters: {
    getTraks(state) {
      return state.traks;
    },
    getTraksBySearchString: state => searchString => {
      searchString = searchString.toLowerCase();
      return state.traks.filter(
        item =>
          item.author.toLowerCase().match(searchString) ||
          item.tack.toLowerCase().match(searchString)
      );
    }
  }
});

export default store;
