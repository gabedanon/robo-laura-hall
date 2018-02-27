import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    voices: null,
    synth: window.speechSynthesis
  },
  mutations: {
    SET_VOICES (state, payload) {
      state.voices = payload
    }
  },
  actions: {
    setVoices ({commit, state}, payload) {
      state.synth.onvoiceschanged = () => {
        const voices = state.synth.getVoices()
        commit('SET_VOICES', voices)
      }
    }
  },
  getters: {
    roboLauraHallVoice: (state) => {
      if (state.voices) {
        return state.voices.find(voice => {
          return voice.name === 'Google US English'
        })
      }
    }
  }
})
