<template>
  <b-container>
    <h1>Кураторы</h1>    
    <b-row class="mt-4">
      <b-col cols="8">
        <b-card class="card_content mt-0">
          <b-form-group class="form__search" label="Поиск">
            <b-form-input
              v-model="searchCurator"
              autocomplete="off"
              class="form__search-input"
              type="text"
              required
              placeholder="Введите ФИО"
            />
            <button class="form__search-close" @click="searchCurator = null" />
          </b-form-group>
        
          <b-button variant="primary" @click="revokeCurator(curatorSelected); userSelected = []; curatorSelected = []" v-if="curatorSelected.length">
            Снять с роли выбранных
          </b-button>
        </b-card>

        <b-modal centered size="lg" id="CuratorSelect" title="Добавление куратора">
          <b-form-input
            class="mb-4"
            autocomplete="off"
            v-model="searchUser"
            placeholder="Введите ФИО"
          />

          <template v-if="simpleUsers">
            <DynamicScroller
              :items="canBeCuratorFilter(searchUser)"
              :min-item-size="68"
              class="user-list modal__input-list"
            >
              <template v-slot="{ item, index, active }">
                <DynamicScrollerItem
                  :item="item"
                  :active="active"
                  :data-index="index"
                >
                  <label class="custom-control custom-checkbox" :key="item.id">
                    <input
                      type="checkbox"
                      name="curatorSelected_[]"
                      autocomplete="off"
                      class="custom-control-input"
                      v-model="userSelected"
                      :value="item.id"
                      :id="'curatorSelect__' + item.id"
                    />
                    <div class="custom-control-label">
                      <Person :user="item" />
                    </div>
                  </label>
                </DynamicScrollerItem>
              </template>
            </DynamicScroller>
          </template>
          <div v-else class="user-list modal__input-list">
            <div class="skeleton mb-1" style="height: 68px; width: 100%" />
            <div class="skeleton mb-1" style="height: 68px; width: 100%" />
            <div class="skeleton mb-1" style="height: 68px; width: 100%" />
            <div class="skeleton mb-1" style="height: 68px; width: 100%" />
            <div class="skeleton mb-1" style="height: 68px; width: 100%" />
            <div class="skeleton mb-1" style="height: 68px; width: 100%" />
            <div class="skeleton mb-1" style="height: 68px; width: 100%" />
            <div class="skeleton mb-1" style="height: 68px; width: 100%" />
            <div class="skeleton mb-1" style="height: 68px; width: 100%" />
          </div>
          <template v-slot:modal-footer>
            <b-button variant="primary" @click="invokeCurator(userSelected); $bvModal.hide('CuratorSelect'); userSelected=[]; curatorSelected=[]" :disabled="userSelected.length === 0">
              Назначить куратором
            </b-button>
            <b-button @click="$bvModal.hide('CuratorSelect')">
              Отменить
            </b-button>
          </template>
        </b-modal>

        <b-card class="card_content">
          <div v-if="curators && curators.length" class="user-list">
            <label class="custom-control custom-checkbox" v-for="curator in curatorsFilter(searchCurator)" :key="curator.id">
              <input
                type="checkbox"
                name="curatorSelected_[]"
                autocomplete="off"
                class="custom-control-input"
                v-model="curatorSelected"
                :value="curator.id"
                :id="'curatorSelect_' + curator.id"
              />
              <div class="custom-control-label">
                <Person :user="curator">
                  <b-button @click="revokeCurator([curator.id])">
                    Снять с роли
                  </b-button>                  
                </Person>
              </div>
            </label>
          </div>
          <div v-else>
            <div class="skeleton mb-1" style="height: 68px" />
            <div class="skeleton mb-1" style="height: 68px" />
            <div class="skeleton mb-1" style="height: 68px" />
            <div class="skeleton mb-1" style="height: 68px" />
            <div class="skeleton mb-1" style="height: 68px" />
            <div class="skeleton mb-1" style="height: 68px" />
            <div class="skeleton mb-1" style="height: 68px" />
          </div>
        </b-card>
      </b-col>
      <b-col>
        <div v-pin-aside>
          <b-card class="filter__search_aside card_content mt-0">
            <b-form-group class="form__search" label="Поиск">
              <b-form-input
                v-model="searchCurator"
                autocomplete="off"
                class="form__search-input"
                type="text"
                required
                placeholder="Введите ФИО"
              />
              <button class="form__search-close" @click="searchCurator = null" />
            </b-form-group>
          
            <b-button variant="primary" @click="revokeCurator(curatorSelected); userSelected = []; curatorSelected = []" v-if="curatorSelected.length">
              Снять с роли выбранных
            </b-button>
          </b-card>

          <b-card>
            <h4>Добавление кураторов</h4>
            <div>Назначьте кураторов из списка.</div>
            <b-button variant="primary" class="mt-4" v-b-modal.CuratorSelect>
              Выбрать куратора
            </b-button>
          </b-card>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import Person from '@/components/Person'

export default {
  name: 'Curators',
  components: {
    Person,
  },
  data() {
    return {
      searchCurator: null,
      searchUser: null,
      userSelected: [],
      curatorSelected: []
    }
  },
  created () {
    this.$store.dispatch('api/FETCH_api', { key: 'curators' })
    this.$store.dispatch('api/FETCH_simpleUsers')
  },
  methods: {
    revokeCurator (users) {
      this.$store.dispatch('api/REVOKE_curator', { users: users })      
    },
    invokeCurator (users) {
      this.$store.dispatch('api/INVOKE_curator', { users: users })
    }
  },
  computed: {
    ...mapGetters('api', [
      'curatorsFilter',
      'getCurator',
      'canBeCuratorFilter'
    ]),
    ...mapState({
      curators: state => state.api.curators,
      simpleUsers: state => state.api.simpleUsers
    })
  }
}
</script>
