import axios from '@/boot/axios';
//import { app } from '@/main';
import { userFullName, errorMessage, infoMessage, } from '@/utils';

const apiRouter = {
  programs: 'program/',
  ugn: null,
  partners: 'partner/?filter=requests',
  curators: 'user/?filter=curator',
  rops: 'user/?filter=rop',
  semester: null,
  variable: 'variable/',
  managers: 'user/?filter=project-manager'
}

const state = () => ({
  learning_src: null,
  kernel_src: null,
  notifications_src: null,

  cache: null,

  programs: null,
  ugn: null,

  managers: null,

  partners: null,

  curators: null,
  rops: null,

  semester: null,
  semesterActual: null,

  variables: null,
  simpleUsers: null,
  zp_notif_text: null
})

const getters = {
  isLocalhost: () => (location.protocol === 'http:' && (location.port === '8080' || location.port === '8081')),
  // appReady - Boolean - данные загружены (позже оптимизировать с localstorage)
  appReady: state => !!state.learning_src
                    && (!!state.programs)
                    && (!!state.ugn)
                    && (!!state.rops)
                    && (!!state.semester),
  // getProgram - Function - найти программу по id.
  getProgram: state => id => state.programs.find(program => program.id === id),
  // programsFilter - Function - фильтрация списка програм названию, uid и названию УГН
  programsFilter: (state, getters, rootState) => (search, programs=null) => {
    let resultPrograms
    if (programs) {
      resultPrograms = programs.map(program => {
        return {
          ...program,
          ugn: state.ugn.find(ugnItem => ugnItem.pk === program.ugn)
        }
      })
    } else {
      resultPrograms = state.programs
    }
    
    if (search && search.length > rootState.app.searchMin) {
      const needle = search.toLowerCase()
      resultPrograms = resultPrograms.filter(program => 
        program.uid.toLowerCase().indexOf(needle) > -1 ||
        program.name.toLowerCase().indexOf(needle) > -1 ||
        program.ugn && program.ugn.name.toLowerCase().indexOf(needle) > -1
      )
    }
    
    return resultPrograms
  },
  allPrograms: (state) => {
    return state.api.programs
  },
  // getRop - Function - найти 1 ропа по id или email.
  getRop: state => search => ({
    ...state.rops.find(user => user.id === search || user.email === search),
    role: 'RROP'
  }),
  // ropsFilter - Function - фильтрация списка ропов по всем полям, по названиям его програм и по УГН этих програм
  ropsFilter: (state, getters, rootState) => (search, ignore) => {
    if (search && search.length > rootState.app.searchMin) {
      const needle = search.toLowerCase()
      return state.rops.filter(user => {
        if (ignore && ignore.length && ignore.indexOf(user.id) > -1) return false
        for (const key of ['email', 'first_name', 'last_name', 'middle_name']) {
          if (user[key] && (typeof user[key] === 'string') && user[key].toLowerCase().indexOf(needle) > -1) return true
        }
        return user.programs && user.programs.some(program =>
          program.name.toLowerCase().indexOf(needle) > -1 ||
          program.uid.toLowerCase().indexOf(needle) > -1 ||
          program.ugn && program.ugn.name.toLowerCase().indexOf(needle) > -1
        )
      })
    } else {
      return state.rops.filter(user => {
        if (ignore && ignore.length && ignore.indexOf(user.id) > -1) return false
        else return true
      })
    }
  },

  // getCurator - Function - найти 1 ропа по id или email
  getCurator: state => search => {
    return state.curators.find(user =>
      user.id === search ||
      user.email === search)
  },
  getSimpleUser: state => search => {    
    return state.simpleUsers.find(user =>
      user.id === search)
  },
  // relatedCurators - Array - фильтрация списка кураторов которые принимают участие
  relatedCurators: state => state.curators.filter(curator => !!(curator.related_projects_count > 0)) || [],
  // curatorsFilter - Function - фильтрация списка кураторгов по всем полям
  curatorsFilter: (state, getters, rootState) => (search, related) => {
    if (search && search.length > rootState.app.searchMin) {
      const needle = search.toLowerCase()
      return state.curators.filter(user => {
        if (related === true && user.related_projects_count > 0) return false
        for (let key in user) {
          if (user[key] && (typeof user[key] === 'string') && user[key].toLowerCase().indexOf(needle) > -1) return true
        }
      })
    } else {
      if (related === true) return state.curators.filter(user => !!(user.related_projects_count > 0))
      else return state.curators
    }
  },
  simpleUsersFilter: (state, getters, rootState) => (search) => {
    if (search && search.length > rootState.app.searchMin) {
      const needle = search.toLowerCase()
      return state.simpleUsers.filter(user => {        
        for (let key in user) {
          if (user[key] && (typeof user[key] === 'string') && user[key].toLowerCase().indexOf(needle) > -1) return true
        }
      })
    } else {
      return state.simpleUsers
    }
  },
  canBeCuratorFilter: (state, getters, rootState) => (search) => {
    if (search && search.length > rootState.app.searchMin) {
      const needle = search.toLowerCase()
      return state.simpleUsers.filter(user => {
        if (user.sam_login == null || user.sam_login ==='') return false
        for (let key in user) {
          if (user[key] && (typeof user[key] === 'string') && user[key].toLowerCase().indexOf(needle) > -1) return true
        }
      })
    } else {
      return state.simpleUsers.filter(user => {
        if (user.sam_login != null && user.sam_login !=='') return true
      })
    }
  },

  // getVariable - Function - найти 1 переменную среды по id
  getVariable: state => id => state.variables.find(variable => variable.id === id),


  // getSemester - Function - найти 1 семестр по id
  getSemester: state => id => state.semester.find(semester => semester.id === id),
  semesterActual: state => state.semester.find(semester => semester.is_actual),
  // semesterGroupByYear - Object - группировка семестров в объект
  semesterGroupByYear: state => state.semester.reduce((res, curr) => {
    (res[curr['year']] = res[curr['year']] || []).push(curr)
    return res
  }, {}),
  notOutdatedSemester: (state, getters) => {
    const currentDate = new Date(getters.semesterActual.start_date)
    return state.semester.reduce((res, semester) => {
      if (semester.is_actual ||  new Date(semester.start_date) > currentDate) {
        res.push({
          ...semester,
          // id: semester.id,
          label: semester.year + ' ' + semester.period
        })
      }
      return res
    }, [])
   },


  // getPartner - Function - найти 1 го партнера по id.
  getPartner: state => id => state.partners.find(partner => partner.id === id),
  // partnersFilter - Function - фильтрация списка партнеров по названию
  partnersFilter: (state, getters, rootState) => search => {
    if (search && search.length > rootState.app.searchMin) {
      const needle = search.toLowerCase()
      return state.partners.filter(partner => partner.name.toLowerCase().indexOf(needle) > -1)
    } else return state.partners
  },

  // getPartner - Function - найти 1 го менеджера\заказчика по id
  getManager: state => id => state.managers.find(manager => manager.id === id),
  // managersFilter - Function - фильтрация списка менеджеров\заказчиков по имени
  managersFilter: (state, getters, rootState) => search => {
    if (search && search.length > rootState.app.searchMin) {
      const needle = search.toLowerCase()
      return state.managers.filter(manager => manager.name.toLowerCase().indexOf(needle) > -1)
    } else return state.managers
  }
}


const mutations = {
  CLEAR_STORAGE: () => {
    localStorage.removeItem('data_semester')
    localStorage.removeItem('data_variable')
    localStorage.removeItem('data_ugn')
    localStorage.removeItem('data_rops')
    localStorage.removeItem('data_programs')
    localStorage.removeItem('cache')
  },
  SET_default: (state, lkp) => {
    state.learning_src = lkp.learning_src
    state.notifications_src = lkp.notifications_src
    state.kernel_src = lkp.kernel_src
  },
  SET_ugn: (state, ugn) => {
    if (ugn && ugn.length === 0) console.error('Список УГН пуст, length = 0')
    state.ugn = ugn
  },
  SET_programs: (state, programs) => {
    programs = programs.map(program => {
      return {
        ...program,
        ugn: state.ugn.find(ugnItem => ugnItem.pk === program.ugn)
      }
    })
    if (programs && programs.length === 0) console.error('Список программ пуст, length = 0')
    state.programs = programs
  },
  SET_rops: (state, rops) => {
    rops = rops.map(rop => {
      return {
        ...rop,
        programs: state.programs.filter(program => program.heads.some(head => head === rop.id))
      }
    })
    rops = rops.filter(rop => rop.programs.length)
    if (rops && rops.length === 0) console.error('Список РОПов пуст, length = 0')
    state.rops = rops
  },
  SET_curators: (state, curators) => {
    if (curators && curators.length === 0) console.error('Список кураторов пуст, length = 0')
    state.curators = curators
  },
  SET_semester: (state, semester) => {
    semester = semester.map(item => {
      return {
        ...item,
        value: item.year.substr(0, 4) + (item.period === 'Осенний' ? '-0' : '-1')
      }
    })
    if (semester && semester.length === 0) console.error('Список семестров пуст, length = 0')
    state.semester = semester
  },
  SET_variable: (state, data) => {
    state.variables = data
  },
  SET_partners: (state, data) => {
    state.partners = data
  },
  SET_managers: (state, data) => {
    state.managers = data
  },
  ADD_curator: (state, newCurators) => {
    state.curators = state.curators.concat(newCurators)
    state.simpleUsers = state.simpleUsers.filter(currentSimple => !newCurators.some(currentCurator => currentSimple.id == currentCurator.id))    
  },
  DEL_curator: (state, delCurators) => {
    state.simpleUsers = state.simpleUsers.concat(delCurators)
    state.curators = state.curators.filter(currentCurator => !delCurators.some(currentDelCurator => currentCurator.id == currentDelCurator.id))
  },
  SET_simpleUsers: (state, simpleUsers) =>{
    state.simpleUsers = simpleUsers
  }
  
}

const actions = {
  SET_default: async ({ commit, getters }) => {
    if (getters.isLocalhost) {
      const frontDev = {
        kernel_src: localStorage.getItem('kernel_src') ? localStorage.getItem('kernel_src') : '/ptraining/',
        learning_src: localStorage.getItem('learning_src') ? localStorage.getItem('learning_src') : '/learning/',
        notifications_src: localStorage.getItem('notifications_src') ? localStorage.getItem('notifications_src') : '/notifications/'
        // kernel_src: 'https://partner.urfu.ru/ptraining/',
        // learning_src: 'https://partner.urfu.ru/learning/'
        // kernel_src: 'http://localhost:3000/ptraining/',
        // learning_src: 'http://localhost:3000/learning/'
      }
      commit('SET_default', frontDev)
      window.lkp = frontDev
    } else {
      if (window.lkp && window.lkp.learning_src) {
        commit('SET_default', window.lkp)
      }
    }
  },

  FETCH_api: ({ state, commit }, { key }) => {
    try {
      // Загрузка данных
      const updateData = async () => {
        const url = apiRouter[key] ? apiRouter[key] : key + '/'
        const response = await axios.get(state.learning_src + url)

        // const tmpCache = JSON.parse(localStorage.getItem('cache')) || {}
        // tmpCache[key] = response.headers.date
        // localStorage.setItem('cache', JSON.stringify(tmpCache))
        // localStorage.setItem(`data_${ key }`, JSON.stringify(response.data))
        commit(`SET_${ key }`, response.data)
        return response.data
      }
      return updateData()
      // force = true
      // if (force) return updateData()
      // else {
      //   if (state[key] && state[key].length) {
      //     return state[key]
      //   }
      //   const localData = JSON.parse(localStorage.getItem(`data_${ key }`))
      //   if (localData && localData.length) {
      //     const tmpCache = JSON.parse(localStorage.getItem('cache')) || {}
      //     if (tmpCache[key]) {
      //       const cacheTime = new Date(tmpCache[key])
      //       const appTime =  new Date(rootState.app.serverTime)
      //       if (appTime.getTime() - cacheTime.getTime() > (1000 * 60 * 60 * 0.5)) { // Если информация устарела на более чем 30 минут
      //         return updateData()
      //       } else {
      //         commit(`SET_${ key }`, localData)
      //         return localData
      //       }
      //     } else {
      //       return updateData()
      //     }
      //   } else {
      //     return updateData()
      //   }
      // }
    } catch (err) {
      console.error(err)
      commit(`SET_${ key }`, [])
      return []
    }
  },

  FETCH_simpleUsers: async ({ state, commit }) => {
    try {      
      const { data } = await axios.get(state.learning_src + 'user/?filter=simple')
      commit('SET_simpleUsers', data)
    } catch (err) {
      console.error(err)
      commit('SET_simpleUsers', [])
    }
  },  
  INVOKE_curator: async({ state, commit, getters }, params) => {
    try {
      const { data } = await axios.post(state.learning_src + 'curators/invoke/', params)
      let suceed_curators = []
      for (let user_id in data){
        let title = ''
        const simpleUser = getters.getSimpleUser(Number(user_id))
        if (data[user_id]){
          suceed_curators.push(simpleUser)
          title = `${userFullName(simpleUser)} добавлен в список кураторов`
        } else title = `Не удалось включить в список кураторов сотрудника ${userFullName(simpleUser)}`
        
        if (data[user_id]) {
          infoMessage(title);
        } else {
          errorMessage(title);
        }
      }
      commit('ADD_curator', suceed_curators)
    } catch (err){      
      console.error(err)
      commit('ADD_curator', [])
    }
  },
  REVOKE_curator: async({ state, commit, getters }, params) =>{
    try {
      const { data } = await axios.post(state.learning_src + 'curators/revoke/', params)
      let del_curators = []      
      for (let user_id in data) {
        let title = ''
        const curator = getters.getCurator(Number(user_id))
        if (data[user_id]){
          del_curators.push(curator)          
          title = `${ userFullName(curator) } удален из списка кураторов`
        } else title = `Не удалось удалить из списка кураторов сотрудника ${ userFullName(curator) }`
        
        if (data[user_id]) {
          infoMessage(title);
        } else {
          errorMessage(title);
        }
      }
      commit('DEL_curator', del_curators)
    } catch (err) {
      commit('DEL_curator', [])
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
