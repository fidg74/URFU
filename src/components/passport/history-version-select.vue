<template>
    <b-row class="history-version-selector">
        <b-col class="latest">
            <div class="caption">Текущая версия</div>
            <b-row v-if="current">
                <b-col class="date" cols="4">{{ formatDateTime(current.date) }}</b-col>
                <b-col cols="8" class="author">
                    <div class="user" v-if="current.user">{{ current.user.last_name }} {{ current.user.initials }}</div>
                    <div class="user" v-else>Гл. куратор проекта</div>
                </b-col>
            </b-row>
        </b-col>
        <b-col class="versions">
            <div class="caption">Сравнить с</div>
            <multiselect
                v-model="version"
                :options="versions"
                :searchable="false"
                :close-on-select="true"
                :show-labels="false"
                placeholder="Выберите версию"
                :allow-empty="true"
            >
                <template slot="noOptions">
                    <div class="empty-list">предыдущих версий пока нет</div>
                </template>
                <template slot="option" slot-scope="props">
                    <div class="option__desc">
                        <span class="option__title" v-if="props.option.user">{{ props.option.user.last_name }} {{ props.option.user.initials }}</span>
                        <span class="option__title" v-else>Гл. куратор проекта</span>
                        <span class="option__small">{{ formatDateTime(props.option.date) }}</span>
                    </div>
                </template>
                <template slot="singleLabel" slot-scope="props">
                    <div class="option__desc">
                        <span class="option__title" v-if="props.option.user">{{ props.option.user.last_name }} {{ props.option.user.initials }}</span>
                        <span class="option__title" v-else>Гл. куратор проекта</span>
                        <span class="option__small">{{ formatDateTime(props.option.date) }}</span>
                    </div>
                </template>
            </multiselect>
        </b-col>
    </b-row>
</template>

<script>
import { mapState } from 'vuex';
import format from 'date-fns/format';

export default {
    name: 'HistoryVersionSelector',
    data () {
        return {
            current: null,
            version: null,
            versions: [],
            loading: true,
        }
    },
    created() {
        // this.loadData();
    },
    methods: {
        formatDate: date => format(date, 'DD.MM.YYYY'),
        formatDateTime: date => format(date, 'DD.MM.YYYY HH:mm'),
        // вывод модалки
        loadData () {
            // обнуляем статусы
            this.loading = true;
            this.version = null;
            this.current = null;
            // подгружаем правки
            this.$axios.get(this.learning_src + 'passport/' + this.project.id + '/history/')
            .then(data => {
                if (data.status == 200) {
                    if (data.data.length) {
                        let tmp_versions = data.data.slice(1);
                        this.current = data.data[0];
                        let cur_date = this.formatDate(this.current.date);
                        let cur_user = this.current.user ? this.current.user.id : null;
                        this.versions = [];
                        // исключаем "повторы"
                        tmp_versions.forEach(v => {
                            if (this.formatDate(v.date) != cur_date ||
                                (v.user && (v.user.id != cur_user)) ||
                                (!v.user && (v.user != cur_user))) {
                                this.versions.push(v);
                                cur_date = this.formatDate(v.date);
                                cur_user = v.user ? v.user.id : null;
                            }
                        });
                    } else {
                        this.versions = [];
                        this.current = null;
                    }
                } else {
                    this.versions = [];
                    this.current = null;
                }
                this.loading = false;
            });
        },
    },
    computed: {
        ...mapState({
            project: state => state.project.project,
            learning_src: state => state.api.learning_src,
        }),
    },
    watch: {
        // подгрузка данных по правкам, при смене выбора версии
        version (v) {
            if (v && v.id) {
                this.$axios.get(this.learning_src + `passport/${this.project.id}/compare/?v1=${this.current.id}&v2=${v.id}`)
                .then(data => {
                    if (data.status == 200) {
                        this.$emit('update', data.data.diff);
                    }
                });
            }
        },
    },
}
</script>
<style>
.row.history-version-selector > .latest > .caption,
.row.history-version-selector > .versions > .caption {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: -0.2px;
    color: #111;
}
.row.history-version-selector > .latest > .caption {
    padding-bottom: 18px;
}
.row.history-version-selector > .versions > .caption {
    padding-bottom: 8px;
}
.row.history-version-selector > .latest > .row > .date {
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.2px;
    color: #111;
    white-space: nowrap;
}
.row.history-version-selector > .latest > .row > .author > .user {
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.2px;
    color: #111;
}
.row.history-version-selector > .latest > .row > .author > .title {
    font-weight: normal;
    font-size: 13px;
    line-height: 16px;
    letter-spacing: -0.2px;
    color: #72808E;
}
.row.history-version-selector > .versions > .multiselect > .multiselect__content-wrapper > .multiselect__content > .multiselect__element > .multiselect__option.multiselect__option--highlight {
    background: #F4F8FF;
    color: #111;
}
.row.history-version-selector > .versions > .multiselect > .multiselect__content-wrapper > .multiselect__content > .multiselect__element > .multiselect__option.multiselect__option--selected {
    background: #F3F3F3;
    color: #111;
}
.row.history-version-selector > .versions > .multiselect >
.multiselect__content-wrapper > .multiselect__content > .multiselect__element >
.multiselect__option > .option__desc > .option__title {
    font-weight: bold;
}
.multiselect__tags {
    min-height: 42px;
}
</style>