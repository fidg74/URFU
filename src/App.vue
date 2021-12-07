<template>
  <div id="app" ref="mainApp">
    <div v-if="isLocalhost" class="aside">
      <b-button variant="danger" @click="closeAside" class="ml-4"><i class="fas fa-times" /></b-button>
      <b-list-group class="menu mt-4">
        <!-- <a class="ml-4 mb-2" href="https://gitlab.com/urfudev/lkp_demo">
          <i class="fas fa-times" /> <span class="ml-2">gitlab</span>
        </a>
        <a class="ml-4 mb-2" href="http://localhost:8080/">
          <i class="fas fa-times" /> <span class="ml-2">local</span>
        </a> -->
        <b-list-group-item :active="$route.path === '/requests'" to="/requests">Заявки</b-list-group-item>
        <b-list-group-item :active="$route.path === '/projects'" to="/projects">Паспорта</b-list-group-item>
        <b-list-group-item v-if="$route.params && $route.params.id" :active="$route.path === '/teamproject/' + $route.params.id" :to="'/teamproject/' + $route.params.id">Teamproject</b-list-group-item>
        <hr>
        <h4 class="ml-4">Интерфейс ЗП</h4>
        <b-list-group-item :active="$route.path === '/settings'" to="/settings">День Х</b-list-group-item>
        <b-list-group-item :active="$route.path === '/curators'" to="/curators">Кураторы</b-list-group-item>
        <hr>
        <b-list-group-item :active="$route.path === '/ui'" to="/ui" class="mt-4">UI kit</b-list-group-item>
      </b-list-group>
      

      <div class="m-4">
        <div><b>appReady:</b> {{ appReady ? 'Готово' : 'Загружается' }}</div>
        <div class="mt-2" v-if="user && user.current">
          <b>user:</b><br>ID: {{ user.id }}<br>
          {{ user.current.username }}
        </div>
      </div>
      <div class="m-4">
        <b-button @click="visibleImg = !visibleImg">Макет {{ visibleImg }}</b-button>
      </div>
      <hr />
      <div class="m-4">
        <div class="mb-2 weight-medium">Тестовый http запрос</div>
        <div style="display: flex;">
          <b-button style="width: 140px;" @click="getStatus">Запрос {{ httpStatus }}</b-button>
          <b-form-input
            v-model.number="httpStatus"
            style="width: 80px;"
            type="number"
            placeholder="Number"
          />
        </div>
      </div>
      <hr />
      <div class="m-4">
        <div class="mb-2 weight-medium">Установить источник learning</div>
        <b-button class="mb-2" @click="setLearning('http://localhost/learning/')">http://localhost:3000</b-button>
        <b-button class="mb-2" @click="setLearning('https://dev1.urfu.ru/learning/')">https://dev1.urfu.ru</b-button>
      </div>
    </div>
    <router-view v-if="hasUser && appReady" />
    <footer class="app__footer">
      <b-container>
        <div>По вопросам организации проектного обучения и его сопровождения в сервисе Проектное обучение Личного кабинета партнера можно обратиться в Центр развития инженерного образования по электронной почте <a href="mailto:project@urfu.ru">project@urfu.ru</a></div>
        <div>© ФГАОУ ВО «УрФУ имени первого Президента России Б.Н. Ельцина» 2020-2021 <a href="/files/lkp_terms_of_use.pdf" target="_blank">Пользовательское соглашение</a></div>
      </b-container>
    </footer>
    <!-- <div style="position: absolute; top: 0; left: -1px; opacity: 0.3; pointer-events: none;" v-if="visibleImg">
      <img src="./assets/img/m223.jpg" />
    </div> -->
  </div>
</template>

<script>
import func from '@/assets/js/func'
import format from 'date-fns/format'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      visibleImg: false,
      httpStatus: 500,
      testResponse: null,
    }
  },
  async created () {
    await this.$store.dispatch('api/SET_default')
    
    const userCurrent = await this.$store.dispatch('user/FETCH_user')
    window.lkp.user = userCurrent
    // if (!this.isLocalhost) {
    //   func.setUser(userCurrent)
    // }

    await this.$store.dispatch('api/FETCH_api', { key: 'ugn' })
    await this.$store.dispatch('api/FETCH_api', { key: 'programs' })
    
    this.$store.dispatch('user/setProgram')


    this.$store.dispatch('api/FETCH_api', { key: 'rops' })
    this.$store.dispatch('api/FETCH_api', { key: 'semester' })
    
    const isServiceActivated = userCurrent.service_status === this.SERVICE_ACTIVATED
    func.sendMenuToKernel(isServiceActivated)

    window.addEventListener('message', data => {
      if (data.data && data.data.action === 'sidebar') {
        if (data.data.value === 'opened') {
          this.$refs.mainApp.classList.remove('sidebar_closed')
        }
        if (data.data.value === 'closed') {
          this.$refs.mainApp.classList.add('sidebar_closed')
        }
      }
    })
  },
  methods: {
    formatDateTime: date => format(date, 'DD.MM.YYYY HH:mm'),
    getStatus () {
      try {
        this.$axios.get(this.learning_src + 'error/' + this.httpStatus + '/')
      } catch (err) {
        console.error(err)
      }
    },
    setLearning (url) {
      localStorage.setItem('learning_src', url)
      document.location.reload()
    },
    closeAside () {
      window.postMessage({
        serviceName: 'kernel',
        action: 'sidebar',
        value: 'closed'
      }, '/')
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      learning_src: state => state.api.learning_src,
    }),
    ...mapGetters('user', [
      'hasUser'
    ]),
    ...mapGetters('api', [
      'isLocalhost',
      'appReady'
    ]),
    ...mapState('app', [
      'SERVICE_ACTIVATED',
    ]),
  }
}
</script>

<style>
  @import './assets/css/styles.css';
  .shell-main > main {
    height: 100%;
  }
  #app {
    padding-bottom: 2.5rem;
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* Убрать верх */
    background: #F1F4FA;
    padding-top: 100px;
  }
  .app__footer {
    text-align: center;
    margin-top: 2rem;
  }
  /* убрать верх */
  .aside {
      display: none;
  }
</style>
