const state = () => ({
  serverTime: null,
  toastHideDelay: 7000, // Время задержки, спустя которое всплывающиее уведомление закроется
  searchMin: 1, // Минимальное количество символов для фильтрации в поиске
  SERVICE_ACTIVATED: 'ACTIVATED',
  SERVICE_NOT_ACTIVATED: 'NOT_ACTIVATED',
  SERVICE_ACTIVATION_IN_PROGRESS: 'IN_PROGRESS'
})

const getters = {}

const mutations = {
  SET_serverTime: (state, time) => {
    const parseTime = new Date(time)
    state.serverTime = parseTime.getTime()
  }
}

const actions = {}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}