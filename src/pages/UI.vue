<template>
  <b-container>
    <h1 class="demo-title"><span class="mr-3">UI</span> kit</h1>
    <b-row>
      <b-col cols="8">

        <div class="demo-head" id="headings">Headings</div>
        <h1>&lt;h1&gt; Heading 1</h1>
        <h2>&lt;h2&gt; Heading 2</h2>
        <h3>&lt;h3&gt; Heading 3</h3>
        <h4>&lt;h4&gt; Heading 4</h4>

        <div class="danger-dot">Привет</div>

        <div class="h1__subtitle">Sub title</div>


        <div class="demo-head" id="fontweights">Font Weights</div>
        <b-row class="mb-2">
          <b-col cols="2">
            <b-badge variant="primary">.weight-thin</b-badge>
          </b-col>
          <b-col class="weight-thin">
            Эксплуатация Геодезии и дистанционного зондирования
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col cols="2">
            <b-badge variant="primary">.weight-light</b-badge>
          </b-col>
          <b-col class="weight-light">
            Эксплуатация Геодезии и дистанционного зондирования
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col cols="2">
            <b-badge variant="primary">.weight-regular</b-badge>
          </b-col>
          <b-col class="weight-regular">
            Эксплуатация Геодезии и дистанционного зондирования
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col cols="2">
            <b-badge variant="primary">.weight-medium</b-badge>
          </b-col>
          <b-col class="weight-medium">
            Эксплуатация Геодезии и дистанционного зондирования
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col cols="2">
            <b-badge variant="primary">.weight-bold</b-badge>
          </b-col>
          <b-col class="weight-bold">
            Эксплуатация Геодезии и дистанционного зондирования
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="2">
            <b-badge variant="primary">.weight-bolder</b-badge>
          </b-col>
          <b-col class="weight-bolder">
            Эксплуатация Геодезии и дистанционного зондирования
          </b-col>
        </b-row>

        <div class="demo-head" id="buttons">Buttons</div>

        <b-row class="mb-3">
          <b-col cols="2">
            &lt;b-button&gt;
          </b-col>
          <b-col class="weight-bolder">
            <b-row>
              <b-col>Default</b-col>
              <b-col>disabled</b-col>
              <b-col>class="btn_flat"</b-col>
              <b-col>size="sm"</b-col>
            </b-row>
          </b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col cols="2">
            <div class="mt-3">default</div>
          </b-col>
          <b-col>
            <b-row>
              <b-col><b-button class="mr-2">Secondary</b-button></b-col>
              <b-col><b-button class="mr-2" disabled>Secondary</b-button></b-col>
              <b-col><b-button class="mr-2 btn_flat">Secondary</b-button></b-col>
              <b-col><b-button class="mr-2" size="sm">Secondary</b-button></b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col cols="2">
            <div class="mt-3">variant="primary"</div>
          </b-col>
          <b-col>
            <b-row>
              <b-col><b-button class="mr-2" variant="primary">Primary</b-button></b-col>
              <b-col><b-button class="mr-2" disabled variant="primary">Primary</b-button></b-col>
              <b-col><b-button class="mr-2 btn_flat" variant="primary">Primary</b-button></b-col>
              <b-col><b-button class="mr-2" size="sm" variant="primary">Primary</b-button></b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col cols="2">
            <div class="mt-3">variant="danger"</div>
          </b-col>
          <b-col>
            <b-row>
              <b-col><b-button class="mr-2" variant="danger">Danger</b-button></b-col>
              <b-col><b-button class="mr-2" disabled variant="danger">Danger</b-button></b-col>
              <b-col><b-button class="mr-2 btn_flat" variant="danger">Danger</b-button></b-col>
              <b-col><b-button class="mr-2" size="sm" variant="danger">Danger</b-button></b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col cols="2">
            <div class="mt-3">variant="warning"</div>
          </b-col>
          <b-col class="weight-bolder">
            <b-row>
              <b-col><b-button class="mr-2" variant="warning">Warning</b-button></b-col>
              <b-col><b-button class="mr-2" disabled variant="warning">Warning</b-button></b-col>
              <b-col><b-button class="mr-2 btn_flat" variant="warning">Warning</b-button></b-col>
              <b-col><b-button class="mr-2" size="sm" variant="warning">Warning</b-button></b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col cols="2">
            <div class="mt-3">class="btn_full"</div>
          </b-col>
          <b-col>
            <b-button class="btn_full">Кнопка на всю ширину</b-button>
          </b-col>
        </b-row>

        
        <div class="demo-head" id="radio">Radio</div>
        <b-form-group class="radio-list">
          <b-form-radio-group
            v-model="radioGroup"
            buttons
            variant="primary"
            button-variant="outline-primary"
            name="radio-btn-stacked">
            <b-form-radio v-for="(radioItem, index) in ['Вариант 1', 'Вариант 2','Вариант 3']" :key="index" :value="radioItem" variant="primary">
              {{ radioItem }}
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <b-form-group class="radio-list">
          <b-form-radio-group
            v-model="radioGroup"
            buttons
            stacked
            variant="primary"
            button-variant="outline-primary"
            name="radio-btn-stacked">
            <b-form-radio v-for="(radioItem, index) in ['Вариант 1', 'Вариант 2','Вариант 3']" :key="index" :value="radioItem" variant="primary">
              {{ radioItem }}
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>


        <div class="demo-head" id="badge">Badge</div>
        &lt;b-badge&gt;
        <br><br>
        <b-card>
          <b-badge class="mr-2">Default</b-badge>
          <b-badge class="mr-2" variant="primary">Primary</b-badge>
          <b-badge class="mr-2" variant="danger">Danger</b-badge>
          <b-badge class="mr-2" variant="warning">Warning</b-badge>
          <b-badge class="mr-2" variant="dark">Dark</b-badge>
          <b-badge class="mr-2" variant="grey">Grey</b-badge>
        </b-card>


        <div class="demo-head" id="tabs">Tabs</div>

        <Tabs v-model="tabValue" :items="[{ label: 'Активные', value: 'active'}, { label: 'Приглашения', value: 'invite'}]" />
        <div>
          <pre class="mt-4">&lt;Tabs v-model="tabValue" :items="[
  { label: 'Активные', value: 'active'},
  { label: 'Приглашения', value: 'invite'}
]" /&gt;<br>
          </pre>
        </div>
        tabValue = <b>{{ tabValue }}</b>


        <div class="demo-head" id="person">Person</div>
        <Person :user="person">
          <template #caption>
            Подпись  #caption
          </template>
          <template #default>
            <b-button>Действие</b-button>
            <b-button variant="primary">Действие</b-button>
          </template>
        </Person>


        <div class="demo-head" id="forms">Forms</div>
        <b-form-group
          label="Текстовое поле"
          label-for="input-1"
          description="Описание для поля"
        >
          <b-form-input
            id="input-1"
            type="text"
            placeholder="Placeholder"
          />
        </b-form-group>

        <hr>

        <b-form-group class="form__search" label="Form search">
          <b-form-input class="form__search-input" v-model="searchValue" required type="text" placeholder="Поиск по направлению, программе или ФИО" />
          <button class="form__search-close" @click="searchValue = null" />
        </b-form-group>


        <div class="demo-head" id="userlist">Окно со списком пользователей</div>
        <b-button v-b-modal.userListModal>Открыть окно</b-button>

        <b-modal size="lg" centered hide-footer id="userListModal" :title="'Список пользователей. Выбран ' + userSelected">
          <b-form-group>
            <b-form-radio-group class="modal__user-list" v-model="userSelected" stacked>
              <b-form-radio  v-for="index in 10" :key="index" :value="index" variant="primary">
                <Person :user="person" />
              </b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </b-modal>



        <div class="demo-head" id="directives">Directives</div>
        <div v-pin-bottom>
          <b-container>
            <b-card class="card_content">
               v-pin-bottom
            </b-card>
          </b-container>
        </div>

      </b-col>
      <b-col>
        <b-list-group v-pin-aside>
          <b-list-group-item href="#headings">Headings</b-list-group-item>
          <b-list-group-item href="#fontweights">Font weights</b-list-group-item>
          <b-list-group-item href="#buttons">Buttons</b-list-group-item>
          <b-list-group-item href="#badge">Badge</b-list-group-item>
          <b-list-group-item href="#tabs">Tabs</b-list-group-item>
          <b-list-group-item href="#colors">Colors</b-list-group-item>
          <b-list-group-item href="#person">Person</b-list-group-item>
          <b-list-group-item href="#forms">Forms</b-list-group-item>
          <b-list-group-item href="#userlist">Modal User List</b-list-group-item>
          <b-list-group-item href="#directives">Directives</b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>


<script>
import Tabs from '@/components/Tabs'
import Person from '@/components/Person'
// import FileDownload from '@/components/FileDownload'

// import format from 'date-fns/format'
// import model from '@/utils/models'
export default {
  name: 'UIkit',
  components: {
    // FileDownload,
    Tabs,
    Person
  },
  data () {
    return {
      searchValue: null,
      tabValue: 'invite',
      radioGroup: null,
      userSelected: null,
      person: {
        email: "person@person.org",
        first_name: "Иван",
        middle_name: "Иванович",
        id: 999,
        phone: "+7 (900) 000 00 00",
        last_name: "Иванов",
        username: "person@person.org"
      }
    }
  }
}
</script>


<style lang="stylus">
  .demo-title {
    font-size: 6rem;
    font-weight: 700;
    padding: 0 0 4rem;
    color: rgba(0, 0, 0, .25)
  }
  .demo-head {
    border-bottom: 2px solid rgba(0, 0, 0, .1)
    padding-bottom: 0.75rem;
    color: rgba(0, 0, 0, .4);
    font-size: 28px;
    font-weight: 500;
    margin-top: 3rem;
    padding-top: 2rem;
    margin-bottom: 3rem;
    &:first-child {
      margin-top: 0;
    }
  }
</style>
