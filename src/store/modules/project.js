import { app } from '@/main';
import axios from '@/boot/axios';
import format from 'date-fns/format';
import { userFullName, infoMessage, } from '@/utils';

const state = () => ({
  project: null,
  messages: [],
  comments: [],
  history: [],
  currentMoment: null,
  currentProgram: null,
})


const getters = {
  mainProgram: state => {
    if (state.project.programs){
      return state.project.programs.find(program => program.is_main)
    }else return null
  },
  MROP: (state, getters) => getters.mainProgram ? getters.mainProgram.roles.find(role => role.role === 'RROP') : null,
  MCUR: (state, getters) => getters.mainProgram ? getters.mainProgram.roles.find(role => role.role === 'MCUR') : null,
  ropListActive: (state, getters, rootState, rootGetters) => {
    return state.project.programs.reduce((res, program) => {
      const rop = program.roles.find(role => role.role === 'RROP')
      if (rop && rop.id) res.push(rootGetters['api/getRop'](rop.user.id))
      return res
    }, [])
  },
  meIsRCUR: (state, getters, rootState) => state.project.programs.some(program => program.roles.some(role => role.role === 'RCUR' && role.user.id === rootState.user.id)),
  meIsMCUR: (state, getters, rootState) => state.project.programs.some(program => program.roles.some(role => role.role === 'MCUR' && role.user.id === rootState.user.id)),
  meIsRROP: (state, getters, rootState) => state.project.programs ? state.project.programs.some(program => program.roles.some(role => role.role === 'RROP' && role.user.id === rootState.user.id)) : false,
  meIsMROP: (state, getters, rootState) => getters.MROP && (getters.MROP.user.id === rootState.user.id),
  iHaveUniRole: (state, getters) => getters.meIsRCUR || getters.meIsMCUR || getters.meIsRROP || getters.meIsMROP,
  meIsPartner: (state, getters, rootState) => state.project.manager && state.project.manager.id === rootState.user.id,
  meIsPartnerIsURFU: (state, getters, rootState) => (state.project.manager && state.project.manager.id === rootState.user.id && state.project.partner.default),
  myProgram: (state, getters, rootState) => state.project ? state.project.programs ? state.project.programs.find(program => program.roles.some(role => role.user.id === rootState.user.id)) : false : false,
  currentProgramIsMain: (state, getters, rootState) => state.project ? state.project.programs.find(program => state.currentProgram.id === program.id && program.roles.some(role => role.user.id === rootState.user.id)) || false : false,
  getProgramByOriginalId: state => id => state.project.programs.find(program => program.program.id === id),
  isMulti: state => state.project.programs.filter(program => program.roles.length).length > 1,
  allProgramsApproved: (state, getters) => state.project.programs.filter(program => program.roles.length).every(program => {
    if (getters.MROP && getters.MROP.user.id && getters.MCUR && getters.MCUR.user.id && getters.MROP.user.id === getters.MCUR.user.id) {
      return (['PPS3', 'PPS4'].indexOf(program.status) > -1)
    } else {
      return program.status === 'PPS4'
    }
  }),
  approveMessages: state => {
    const messages = []
    if (state.project.send_message && state.project.send_message.user_text) {
      messages.push(state.project.send_message)
    }
    state.project.programs.forEach(program => {
      if (program.send_message && program.send_message.user_text)
      // program.send_message.program = program
      messages.push(program.send_message)
    })
    return messages
  },
  RPNOMessages: state => state.messages.filter(msg => msg.type === 'RPNO'),
  
  participationRequests: state => state.project.participation_requests ? state.project.participation_requests.filter(request => request.status === null) : [],
  myLastParticipationRequest: (state, getters) => !getters.meIsMROP && state.project.participation_requests && state.project.participation_requests.length > 0 ? state.project.participation_requests[0] : null,
  myLastRequestIsDeclined: (state, getters) => getters.myLastParticipationRequest && getters.myLastParticipationRequest.status === false,
  isWaitingForParticipationResponse: (state, getters) => getters.myLastParticipationRequest && getters.myLastParticipationRequest.status === null,
  
  iHaveOfferTeacherChange: (state, getters, rootState) => state.project.current_main_role_offer && state.project.current_main_role_offer.recipient.id === rootState.user.id,
  canComment: (state, getters) => state.project.request_status === 'PSPT' && getters.meIsPartner ||
    ((state.project.request_status === 'PSST' || state.project.request_status === 'PSUN') && getters.iHaveUniRole),
  myActiveOffers: (state, getters, rootState) => state.project.offers ? state.project.offers.filter(offer => offer.status === 'active' && (offer.user && offer.user.id === rootState.user.id)) : [],
  iHaveActiveParticipationInvite: (state, getters) => getters.myActiveOffers && getters.myActiveOffers.some(offer => offer.type === 'participation_invite'),
  canEditCommon: (state, getters) => (getters.meIsPartner && state.project.request_status === 'PSPT') || 
    (['PSST', 'PSUN'].indexOf(state.project.request_status) > -1 && (getters.meIsMROP || getters.meIsMCUR)),
}

const mutations = {
  ADD_message: (state, params) => {
    state.messages.unshift(params)
  },
  SET_projectValue: (state, payload) => {
    Object.assign(state.project, payload)
  },
  ADD_curator: (state, data) => {
    let [ params, curator ] = data
    const program = state.project.programs.find(program => program.program.id === params.program)
    program.roles.push({
      role: program.is_main ? 'MCUR' : 'RCUR',
      user: curator
    })
  },
  ADD_rop: (state, { isNew, isMain, program, user }) => {
    if (isMain) {
      state.project.isWaitingForMainTeacherChange = false
      state.project.programs.forEach(programItem => {
        programItem.is_main = (programItem.id === program.id) ? true : false
      })
    } else {
      state.project.isInvited = false
    }
    if (isNew) {
      state.project.programs.push({
        program: program,
        is_main: isMain,
        status: isMain ? 'PPS3' : 'PPS1',
        roles: [{
          role: 'RROP',
          user
        }]
      })
    } else {
      const programCurrent = state.project.programs.find(programItem => programItem.id === program.id)
      programCurrent.roles.push({
        role: 'RROP',
        user
      })
    }
  },
  REMOVE_rop: (state, { programId }) => {
  // REMOVE_rop: (state, { programId, userId }) => {
    const programIndex = state.project.programs.findIndex(program => program.id === programId)
    // const program = state.project.programs.find(program => program.id === programId)
    // const roleIndex = program.roles.findIndex(role => role.user.id === userId)
    // program.roles.splice(roleIndex, 1)
    state.project.programs.splice(programIndex, 1)
  },
  SET_approveProgram: (state, { id, approve, role }) => {
    const program = state.project.programs.find(program => program.id === id)
    if (program.is_main) {
      program.status = approve ? 'PPS4' : 'PPS3'
    } else {
      if (approve) {
        if (role.meIsMCUR) program.status = 'PPS4'
        else if (role.meIsRROP && !role.meIsMROP) program.status = 'PPS3'
        else if (role.meIsRCUR) program.status = 'PPS2'
      } else {
        program.status = 'PPS1'
      }
    }
  },
  SET_currentProgram: (state, id) => {
    state.currentProgram = state.project.programs.find(program => program.id === id)
  },
  SET_currentMoment: (state, id) => {
    state.currentMoment = state.history.find(moment => moment.id === id)
  },
  SET_rawProject: (state, project) => {
    if (project && project.programs && project.programs.length) {
      project.programs.map(program => program.roles.sort(a => a.role !== 'RROP' ? 0 : (a.role === 'RROP' ? -1 : 1)))
      project.programs = project.programs.sort((a, b) => a.is_main === b.is_main ? 0 : (a.is_main ? -1 : 1))
    }
    state.project = project
  },
  SET_shortProject: (state, project) => {    
    state.project = project
  },
  SET_messages: (state, messages) => {
    messages.sort((a, b) => new Date(b.date) - new Date(a.date))
    state.messages = messages
  },
  SET_comments: (state, comments) => {
    state.comments = comments
  },
  SET_history: (state, history) => {
    state.history = history
  },
  ADD_comment: (state, data) => {
    state.comments.push(data)
  }
}


const actions = {
  forceROPAssign: async ({ rootState }, { id, params }) => {
    try {
      const { data } = await axios.post(`${ rootState.api.learning_src }request/${ id }/force_assign/`, params)

      return data
    } catch (err) {
      console.error(err)
    }
  },
  inviteRop: async ({ rootState, dispatch }, { id, params }) => {
    try {
      const { data } = await axios.post(`${ rootState.api.learning_src }request/${ id }/invite/`, params)
      infoMessage('Приглашение отправлено');
      dispatch('FETCH_project', { id })
      dispatch('FETCH_messages', { id })
      return data
    } catch (err) {
      console.error(err)
    }
  },
  answerInviteRop: async ({ rootState, dispatch }, { id, accept, params }) => {
    try {      
      const { data } = await axios.post(`${ rootState.api.learning_src }request/${ id }/${ accept ? 'teacher/' : 'cancel/' }`, params)      
       if (!accept) {
        infoMessage('Вы отказались от проекта');
      }
      dispatch('FETCH_project', { id })
      dispatch('FETCH_messages', { id })

      return data
    } catch (err) {
      console.error(err)
    }
  },
  participationResponse: async ({ rootState }, { id, accept, participant, params }) => {
    try {
      const { data } = await axios.post(`${ rootState.api.learning_src }request/${ id }/participation/`, params)
      
      if (accept) {
        app.$bvModal.msgBoxOk(`${userFullName(participant)} стал дополнительным руководителем образовательной программы в заявке`, {
          title: 'Участие подтверждено',
          hideHeaderClose: false,
          size: 'lg',
          centered: true
        })
      } else {
        infoMessage('Отклонен');
      }

      return data;
    } catch (err) {
      console.error(err)
    }
  },
  acceptProject: async ({ rootState }, { id }) => {
    try {
      const { data } = await axios.post(`${ rootState.api.learning_src }request/${ id }/accept/`)

      infoMessage('Вы успешно запустили проект');

      return data
    } catch (err) {
      console.error(err)
    }
  },
  assignCurator: async ({ rootState }, { id, params }) => {
    try {
      const { data } = await axios.post(`${ rootState.api.learning_src }request/${ id }/curator`, params)

      infoMessage('Куратор успешно добавлен');

      return data
    } catch (err) {
      console.error(err)
    }
  },
  changeCurator: async ({ rootState, dispatch }, { id, params }) => {
    try {
      const { data } = await axios.post(`${ rootState.api.learning_src }passport/${ id }/curator/`, params)

      infoMessage('Куратор успешно назначен');
      dispatch('FETCH_project', { id, project: data.project })
      dispatch('FETCH_messages', { id })

      return data.project
    } catch (err) {
      console.error(err)
    }
  },
  changeMrop: async ({ rootState, dispatch }, { projectId, params }) => {
    try {
      const { data } = await axios.post(`${ rootState.api.learning_src }change_rop/${ projectId }`, params)
      dispatch('FETCH_project', { projectId, project: data.project })
    } catch (err) {
      console.error(err)
    }
  },
  approveProgram: async ({ rootState, state, dispatch }, { id, approve, message }) => {
    try {
      const { data } = await axios.patch(`${ rootState.api.learning_src }project_program/${ id }/${ approve ? 'approve' : 'decline' }/`, { message })
      dispatch('FETCH_project', { id: state.project.id, project: data.project })
      
      const status_to_text = {
        'PPS1': 'Куратору',
        'PPS2': 'Руководителю образовательной программы',
        'PPS3': 'Главному куратору',
        'PPS4': 'Главному руководителю образовательной программы',
      }
      const projectProgram = state.project.programs.find(program => program.id === id)
      infoMessage(`Отправлено на ${approve ? 'согласование' : 'доработку'} ${projectProgram ? status_to_text[projectProgram.status] : ''}`);
      // commit('SET_approveProgram', {
      //   id,
      //   approve,
      //   role: {
      //     meIsMROP: getters.meIsMROP,
      //     meIsRCUR: getters.meIsRCUR,
      //     meIsMCUR: getters.meIsMCUR,
      //     meIsRROP: getters.meIsRROP 
      //   }
      // })
      dispatch('FETCH_messages', { id: state.project.id })
      return true
    } catch (err) {
      console.error(err)
    }
  },
  saveRequest: async ({ rootState }, { draft, params }) => {
    try {
      const { data } = await axios.post(`${ rootState.api.learning_src }request/`, params)      
      const programs = params.programs
      const hasMyProgram = rootState.user.programs.some(myProgram => programs.some(program => myProgram.id === program))

      if (draft) {
        infoMessage('Заявка сохранена как черновик');
      } else {
        let notifText = '<p>Вы получите ответ по&nbsp;заявке до&nbsp;' + format(data.exp_date, 'DD.MM.YYYY') + ' включительно.</p>'
        if (programs && programs.length === 1 && hasMyProgram) {
          notifText = '<p>Заявка переведена в&nbsp;статус "Принята". Вам нужно назначить куратора.</p>'
        }
        if (programs && programs.length > 1 && hasMyProgram) {
          notifText = '<p>Вы стали главным руководителем образовательной программы.</p><p>Дополнительные руководители образовательных программ получили приглашения.</p><p>Вам необходимо назначить куратора и&nbsp;принять проект в&nbsp;работу.</p>'
        }
        const messageVNode = app.$createElement('div', { domProps: { innerHTML: notifText } })
        app.$bvModal.msgBoxOk([messageVNode], {
          title: 'Заявка отправлена',
          hideHeaderClose: false,
          centered: true
        })
      }
      
      // if (id) {
      //   axios.delete(`${ rootState.api.learning_src }request/${ id }/`)
      // }
      return data
    } catch (err) {
      console.error(err)
    }
  },
  sendRequest: async ({ rootState }, { id, params }) => {    
    const programs = params.programs
    const hasMyProgram = rootState.user.programs.some(myProgram => programs.some(program => myProgram.id === program))
    try {
      const { data } = await axios.post(`${ rootState.api.learning_src }request/${id}/send/`, params)   
        let notifText = '<p>Вы получите ответ по&nbsp;заявке до&nbsp;' + format(data.exp_date, 'DD.MM.YYYY') + ' включительно.</p>'
        if (programs && programs.length === 1 && hasMyProgram) {
          notifText = '<p>Заявка переведена в&nbsp;статус "Принята". Вам нужно назначить куратора.</p>'
        }
        if (programs && programs.length > 1 && hasMyProgram) {
          notifText = '<p>Вы стали главным руководителем образовательной программы.</p><p>Дополнительные руководители образовательных программ получили приглашения.</p><p>Вам необходимо назначить куратора и&nbsp;принять проект в&nbsp;работу.</p>'
        }
        const messageVNode = app.$createElement('div', { domProps: { innerHTML: notifText } })
        app.$bvModal.msgBoxOk([messageVNode], {
          title: 'Заявка отправлена',
          hideHeaderClose: false,
          centered: true
        })      
      return data
    } catch (err) {
      console.error(err)
    }
  },
  patchRequest: async ({ rootState }, { id, params }) => {
    try {
      const { data } = await axios.patch(`${ rootState.api.learning_src }request/${ id }/`, params);
      infoMessage('Заявка сохранена как черновик');
      return data;
    } catch (err) {
      console.error(err)
    }
  },
  removeRequest: async ({ rootState }, { id }) => {
    try {
      const deleteOk = await app.$bvModal.msgBoxConfirm('Вы действительно хотите удалить черновик заявки? Восстановить черновик будет нельзя.', {
        title: 'Удалить черновик',
        okTitle: 'Удалить черновик',
        okVariant: 'primary',
        cancelTitle: 'Отменить',
        hideHeaderClose: false,
        centered: true
      })
      if (deleteOk) {
        await axios.delete(`${ rootState.api.learning_src }request/${ id }`)
        infoMessage('Черновик удален');
        return true
      } else return false
    } catch (err) {
      console.error(err)
      return false
    }
  },
  sendRequestZPdecline: async ({ rootState, dispatch }, { id, text }) => {
    try {
      const sendData = new FormData()
      sendData.append('message', text)

      await axios.post(`${ rootState.api.learning_src }request/${ id }/zp_decline/`, sendData)
      infoMessage('Отказ отправлен');
      // if (state.project && state.project.id == id) {
      //   const newMessage = {
      //     sender: rootState.user.current,
      //     recipient: 0,
      //     type: 'ZPDC',
      //     text: text,
      //     date: Date.now()
      //   }
      //   commit('ADD_message', newMessage)

      //   commit('SET_projectValue', {
      //     request_status: 'DCLN',
      //     bef_status: 'DCLN'
      //   })
      // }
      dispatch('FETCH_project', { id })
      dispatch('FETCH_messages', { id })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  },
  sendReviewResult: async ({ rootState, state, commit, dispatch, getters }, { id, type, params }) => {
    try {
      await axios.post(`${ rootState.api.learning_src }passport/${ id }/${ type }/`, params)

      if (getters.meIsPartner && !getters.meIsRROP) {
        let title = type === 'accept' ? 'Паспорт проекта утвержден' : 'Паспорт отправлен на согласование';
        let message = type === 'accept' ? 'После зачисления в проект команды студентов начнется реализация проекта.\n' +
          'Вы увидите в сервисе страницу команды проекта и сможете отслеживать прогресс реализации.' : 'Мы рассмотрим изменения и отправим ответ в течение 3 дней.';
        app.$bvModal.msgBoxOk(message, {
          title: title,
          hideHeaderClose: false,
          centered: true
        })
      } else {
        infoMessage(type === 'accept' ? 'Успешно принято' : 'Отправлено на согласование');
      }
      
      commit('SET_projectValue', {
        request_status: type === 'accept' ? 'PSAP' : (state.project.request_status === 'PSPT' ? 'PSUN' : 'PSPT')
      })
      dispatch('FETCH_project', { id })
      return true
    } catch (err) {
      console.error(err)
      if (err.response.data && err.response.data.reload) {
        dispatch('FETCH_project', { id })
        dispatch('FETCH_comments', { id })
        dispatch('FETCH_messages', { id })
      }
      return err.response.data
    }
  },
  FETCH_messages: async ({ rootState, commit }, { id, messages }) => {
    try {
      let data = null;
      commit('SET_messages', [])

      if (messages) {
        data = messages
      } else {
        const response = await axios.get(`${ rootState.api.learning_src }message/?filter=${ id }`)
        data = response.data
      }
      commit('SET_messages', data)

      return data
    } catch (err) {
      console.error(err)
    }
  },
  FETCH_comments: async ({ rootState, commit }, { id }) => {
    try {
      // if (!state.comments || state.comments.length === 0 || (state.project.id != id)) {
        commit('SET_comments', [])
        const { data } = await axios.get(`${ rootState.api.learning_src }comment/?project=${ id }`)
        commit('SET_comments', data)
        return data
      // } else return state.comments
    } catch (err) {
      console.error(err)
    }
  },
  FETCH_history: async ({ rootState, commit }, { id }) => {
    try {
      commit('SET_history', [])
      const { data } = await axios.get(`${ rootState.api.learning_src }passport/${ id }/history/`)
      commit('SET_history', data)
      return data
    } catch (err) {
      console.error(err)
    }
  },
  FETCH_teamproject: async ({ rootState }, { id }) => {
    try {
      const { data } = await axios.get(`${ rootState.api.learning_src }passport/${ id }/implementation/`)
      return data
    } catch (err) {
      console.error(err)
    }
  },
  FETCH_instances: async ({ rootState }, { id }) => {
    try {
      const { data } = await axios.get(`${ rootState.api.learning_src }passport/${ id }/instances/`)
      return data
    } catch (err) {
      console.error(err)
    }
  },
  FETCH_project: async ({ rootState, commit, state, getters }, { id, project, comments, }) => {
    let data  = null
    try {
      commit('SET_rawProject', null)
      if (project) {
        commit('SET_rawProject', project)
      } else {
        data = await axios.get(`${ rootState.api.learning_src }request/${ id }/${ comments ? '?comments=yes' : '' }`)
        commit('SET_rawProject', data.data)
      }
      if (state.currentProgram === null || (state.currentProgram && state.project.programs.find(program => program.id === state.currentProgram.id) === undefined)) {
        if (getters.myProgram && getters.myProgram.id) {
          commit('SET_currentProgram', getters.myProgram.id)
        } else if (state.meIsPartner) {
          commit('SET_currentProgram', 0)
        } else if (state.project && state.project.programs) {
          const firstProgram = state.project.programs.find(program => program.roles.length)
          if (firstProgram) {
            commit('SET_currentProgram', firstProgram.id)
          }
        }
      } else if (state.currentProgram){
        commit('SET_currentProgram', state.currentProgram.id)
      }
      return {
        data: project ? project : data.data,
        status: 200
      }
    } catch (err) {
      console.error(err)
      return err
    }
  },
  FETCH_shortProject: async ({ rootState, commit}, { id, project }) => {
    let data  = null
    try {
      commit('SET_shortProject', null)
      if (project) {
        commit('SET_shortProject', project)
      } else {
        data = await axios.get(`${ rootState.api.learning_src }request/${ id }/short/`)
        commit('SET_shortProject', data.data)
      }
      return {
        data: project ? project : data.data,
        status: 200
      }
    } catch (err) {
      console.error(err)
      return err
    }
  },
  SAVE_comment: async ({ rootState, commit }, comment) => {
    try {
      let data = await axios.post(`${ rootState.api.learning_src }comment/`, comment);
      commit('ADD_comment', {
        ...comment,
        date: rootState.app.serverTime,
        user: rootState.user.current,
      });
      return {
        status: 200,
        data: data.data,
      }
    } catch (err) {
      console.error(err);
    }
  },
  SAVE_project: ({ rootState }, { id, data }) => {
    try {
      const sendData = JSON.stringify(data)
      axios.patch(`${ rootState.api.learning_src }passport/${ id }/`, sendData, {
        headers: { 'Content-Type': 'application/json' }
      }).then(() => {
        // commit('SET_projectValue', {
        //   edited: true
        // })
        infoMessage('Изменения успешно сохранены');
        app.$router.push({ path: '/passport/' + id })
      })
    } catch (err) {
      console.error(err)
    }
  },
  startProjectEdit: async ({ rootState }, { id }) => {
    try {
      await axios.post(`${ rootState.api.learning_src }passport/${ id }/editing/`)
    } catch (err) {
      if (err.response && err.response.data.data) {
        return err.response.data.data
      } else {
        console.error(err)
      }
    }
  },
  stopProjectEdit: async ({ rootState }, { id }) => {
    try {
      await axios.post(`${ rootState.api.learning_src }passport/${ id }/cancel_editing/`)
    } catch (err) {
      console.error(err)
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
