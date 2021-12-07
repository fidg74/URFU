import axios from '@/boot/axios';

const state = () => ({
  id: null,
  current: null,
  programs: null,
  isCurator: false,
  isPartner: false,
  isPlAdmin: false,
  isZP: false,
  isRop: false,
  isStaff: false,
  mainRole: null,
  canCreate: false,
  serviceStatus: ''
})

const getters = {
  hasUser: state => state.current && Object.keys(state.current).length > 0
}

const mutations = {
  SET_user: (state, user) => {
    state.id = user.id;
    state.current = user;

    state.canCreate = user.groups.indexOf('partner.new-request') > -1;
    let mainRole = 'common';
    if (user.groups.indexOf('curator') > -1) {
      state.isCurator = true;
      state.isStaff = true;
      mainRole = 'curator';
    }
    if (user.groups.indexOf('partner') > -1) {
      state.isPartner = true;
      mainRole = 'partner';
    }
    if (user.groups.indexOf('partner.pl-admin') > -1) {
      state.isPlAdmin = true;
      mainRole = 'partner';
    }
    if (user.groups.indexOf('zp') > -1) {
      state.isZP = true;
      state.isStaff = true;
      mainRole = 'zp';
    }
    if (user.groups.indexOf('rop') > -1) {
      state.isRop = true;
      state.isStaff = true;
      mainRole = 'rop';
    }
    if (user.org.type == 'staff') {
      state.isStaff = true;
    }
    state.mainRole = mainRole;
    state.serviceStatus = user.service_status
  },
  SET_programs: (state, programs) => {
    state.programs = programs;
  }
}

const actions = {
  FETCH_user: async ({ commit, rootState }) => {
    try {
      const response = await axios.get(`${ rootState.api.learning_src }user/current`)

      const lastUser = localStorage.getItem('userID')
      if (!lastUser || lastUser != response.data.id) {
        commit('api/CLEAR_STORAGE', null, { root: true })
        //localStorage.clear()
      }
      localStorage.setItem('userID', response.data.id)

      if (response.headers && response.headers.date) {
        commit('app/SET_serverTime', response.headers.date, { root: true })
      }
      commit('SET_user', response.data)
      return response.data
    } catch (err) {
      console.error(err)
    }
  },
  
  // расширяем пользователя с более полным programs
  setProgram: ({ state, commit, rootState, rootGetters }) => {
    if (rootState.api.programs && rootState.api.programs.length) {
      const userPrograms = state.current.programs.map(program => rootGetters['api/getProgram'](program.id))
      commit('SET_programs', userPrograms)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
