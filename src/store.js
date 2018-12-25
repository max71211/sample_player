import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		traks: []
	},
	actions: {
		loadSamples ({ commit }) {
			commit('SET_TRACKS')
		}
	},
	mutations: {
		SET_TRACKS ({state}) {
			state.traks = []
		}
	},
	getters: {
		getTraks (state) {
			return state.traks	
		}
	}
})

export default store