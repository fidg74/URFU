<template>
    <div class="field-changes" :class="{'new': isUpdated}">
        <div
            title="История изменений"
            class="icon"
            v-b-tooltip.hover
            @click="$bvModal.show('fieldChangesView' + uid)"
        >
            <span>New</span>
        </div>
        <b-modal
            :id="'fieldChangesView' + uid"
            title="История правок"
            centered
            size="lg"
            dialog-class="changes-view"
            @shown="modalShown"
            :hide-footer="!editable"
        >
            <template #default>
                <b-overlay :show="loading" rounded>
                    <HistoryVersionSelector @update="onVersionSelect" ref="version_selector" />
                    <hr class="full-width" />
                    <h5>{{ title }}</h5>
                    <div v-if="!editing && getProjectValue && !diff" v-html="getProjectValue"></div>
                    <div v-if="!editing && !getProjectValue && !diff" class="text-muted">Не заполнено</div>
                    <div v-if="!editing && diff" v-html="fieldDiff"></div>
                    <div v-if="editing">
                        <b-form-textarea
                            v-if="fieldType === 'text'"
                            v-model="editedValue"
                            placeholder="Не заполнено"
                            rows="3"
                        ></b-form-textarea>
                        <MinOneInput
                            v-if="fieldType === 'number'"
                            v-model="editedValue"
                            placeholder="Не заполнено"
                            onlyInteger
                        />
                        <Editor
                            v-if="fieldType === 'richtext'"
                            v-model="editedValue"
                            placeholder="Не заполнено"
                        />
                        <b-form-input
                            v-if="fieldType === 'default'"
                            v-model="editedValue"
                            placeholder="Не заполнено"
                        />
                    </div>
                </b-overlay>
            </template>
            <template #modal-footer>
                <b-overlay :show="loading" rounded v-if="editable">
                    <b-button v-if="!editing" @click="edit">Изменить</b-button>
                    <b-button v-if="editing" @click="save" variant="primary">Сохранить</b-button>
                    <b-button v-if="editing" @click="cancel">Отменить</b-button>
                </b-overlay>
            </template>
        </b-modal>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import format from 'date-fns/format';

import { makeUID } from '@/utils';
import Editor from '@/components/Editor';
import MinOneInput from '@/components/MinOneInput';
import HistoryVersionSelector from '@/components/passport/history-version-select';

export default {
    name: 'FieldChanges',
    components: {
        Editor,
        MinOneInput,
        HistoryVersionSelector,
    },
    props: {
        field: String,
        title: String,
        editable: Boolean,
    },
    data () {
        return {
            uid: '',
            diff: null,
            editing: false,
            editedValue: null,
            newChanges: false,
            loading: false,
        }
    },
    created() {
        this.uid = makeUID(3);
    },
    methods: {
        formatDate: date => format(date, 'DD.MM.YYYY'),
        formatDateTime: date => format(date, 'DD.MM.YYYY HH:mm'),
        // вывод модалки
        modalShown () {
            this.$refs.version_selector.loadData();
        },
        // переход в режим правки
        edit () {
            this.editing = true;
            this.editedValue = this.getProjectValue;
        },
        // запись внесенных изменений
        save () {
            this.editing = false;
            let data = {};
            let updatedProject = this.project;
            let mask_search = this.field.match(/(\d+)_([a-z_]+)/i);
            if (mask_search) {
                // обязательно передавать на бэк полный список программ с id, иначе не переданные программы будут удалены
                data['programs'] = this.project.programs.map(prog => {
                    return {
                        id: prog.id
                    }
                });
                const changedProgIndex = this.project.programs.findIndex(el => el.id == mask_search[1]);
                if (changedProgIndex >= 0) {
                    data['programs'][changedProgIndex][mask_search[2]] = this.editedValue;
                }
                updatedProject['programs'][changedProgIndex][mask_search[2]] = this.editedValue;
            } else {
                data[this.field] = this.editedValue;
                updatedProject[this.field] = this.editedValue;
            }
            this.$store.dispatch('project/SAVE_project', { id: this.$route.params.id, data, })
            .then(() => {
                this.$store.dispatch('project/FETCH_project', {
                    id: this.$route.params.id,
                    project: updatedProject,
                });
            });
        },
        // переход в режим просмотра без сохранения правок
        cancel () {
            this.editing = false;
        },
        getObjectValue (obj) {
            let mask_search = this.field.match(/(\d+)_([a-z_]+)/i);
            if (mask_search) {
                let project_program_id = this.project.programs.findIndex(el => el.id == mask_search[1]);
                let obj_program_id = project_program_id >= 0 ? this.project.programs[project_program_id].program.uid : false;
                if (project_program_id >= 0) {
                    if (obj && obj_program_id && obj.programs[obj_program_id]) {
                        return obj.programs[obj_program_id][mask_search[2]];
                    }
                }
                return null;
            } else {
                return obj ? obj[this.field] : null;
            }
        },
        onVersionSelect (data) {
            this.diff = data;
        },
    },
    computed: {
        ...mapState({
            project: state => state.project.project,
            learning_src: state => state.api.learning_src,
        }),
        getProjectValue () {
            let mask_search = this.field.match(/(\d+)_([a-z_]+)/i);
            if (mask_search) {
                let project_program_id = this.project.programs.findIndex(el => el.id == mask_search[1]);
                return (project_program_id >= 0) ? this.project.programs[project_program_id][mask_search[2]] : null;
            } else {
                return this.project[this.field];
            }
        },
        // ввод изменений в поле
        fieldDiff () {
            let value = this.getObjectValue(this.diff);
            return value === null ? this.getProjectValue() : value;
        },
        // проверка на обновления
        isUpdated () {
            let value = this.getObjectValue(this.project.updated_fields.fields);
            return value === null ? false : value;
        },
        // проверка на изменения
        // isChanged () {
        //     let value = this.getObjectValue(this.project.changed_fields);
        //     return value === null ? false : value;
        // },
        // определение типа виджета для поля
        fieldType () {
            let mask_search = this.field.match(/(\d+)_([a-z_]+)/i);
            let field_name = mask_search ? mask_search[2] : this.field;
            if (['students', 'max_copies', ].includes(field_name)) {
                return 'number';
            } else if (['goal', 'result', 'criteria', 'description', 'professional_competence_group_text', ].includes(field_name)) {
                return 'richtext';
            } else if (['experts', ].includes(field_name)) {
                return 'text';
            } else {
                return 'default';
            }
        },
    },
}
</script>
<style>
.field-changes {
    display: inline-block;
    height:  16px;
    line-height: 18px;
    vertical-align: middle;
}
.field-changes.passport-edit {
    margin-left: 8px;
    margin-right: -4px;
}
.field-changes.passport-edit.new {
    margin-left: 40px;
}
.field-changes > .icon {
    display: inline-block;
    cursor:  pointer;
    position: relative;
    height: 16px;
    width: 16px;
    margin-left: 8px;
    background: -10px -8px no-repeat;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzMiIGhlaWdodD0iMzMiIHZpZXdCb3g9IjAgMCAzMyAzMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4IDI0QzIyLjQxOCAyNCAyNiAyMC40MTggMjYgMTZDMjYgMTEuNTgyIDIyLjQxOCA4IDE4IDhDMTUuNzc3MyA4IDEzLjc3MDcgOC45MDg2NyAxMi4zMjI3IDEwLjM3MjdMMTAuODcgOC45MTkzM0wxMCAxMy41OTQ3TDE0LjY0MTMgMTIuNjkyTDEzLjI2NzMgMTEuMzE4QzE0LjQ3NTMgMTAuMDk0IDE2LjE0ODcgOS4zMzMzMyAxOCA5LjMzMzMzQzIxLjY3NiA5LjMzMzMzIDI0LjY2NjcgMTIuMzI0IDI0LjY2NjcgMTZDMjQuNjY2NyAxOS42NzYgMjEuNjc2IDIyLjY2NjcgMTggMjIuNjY2N0MxNC41NDg2IDIyLjY2NjcgMTEuNzAxNCAyMC4wMzA0IDExLjM2NjMgMTYuNjY1N0MxMS4zMjk4IDE2LjI5OTMgMTEuMDM0OSAxNiAxMC42NjY3IDE2QzEwLjI5ODUgMTYgOS45OTcxIDE2LjI5OTUgMTAuMDI3NCAxNi42NjY1QzEwLjM2NjEgMjAuNzcyNyAxMy44MDY0IDI0IDE4IDI0WiIgZmlsbD0iIzlEQTdCMCIvPgo8cGF0aCBkPSJNMTcuMjA3MyAxOS4zMjg0TDE1LjA4NTkgMTcuMjA3TDE0LjYyMTcgMTkuNzkyNkwxNy4yMDczIDE5LjMyODRaIiBmaWxsPSIjNzI4MDhFIi8+CjxwYXRoIGQ9Ik0xNy40MTM4IDE3LjY1NjlMMTYuNzA2NyAxNi45NDk3QzE2LjMxNjEgMTYuNTU5MiAxNi4zMTYxIDE1LjkyNjEgMTYuNzA2NyAxNS41MzU1TDE5LjUzNTEgMTIuNzA3MUMxOS45MjU2IDEyLjMxNjYgMjAuNTU4OCAxMi4zMTY2IDIwLjk0OTMgMTIuNzA3MUwyMS42NTY0IDEzLjQxNDJDMjIuMDQ2OSAxMy44MDQ3IDIyLjA0NjkgMTQuNDM3OSAyMS42NTY0IDE0LjgyODRMMTguODI4IDE3LjY1NjlDMTguNDM3NCAxOC4wNDc0IDE3LjgwNDMgMTguMDQ3NCAxNy40MTM4IDE3LjY1NjlaIiBmaWxsPSIjNzI4MDhFIi8+Cjwvc3ZnPgo=");
}
.field-changes:hover > .icon {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzMiIGhlaWdodD0iMzMiIHZpZXdCb3g9IjAgMCAzMyAzMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4IDI0QzIyLjQxOCAyNCAyNiAyMC40MTggMjYgMTZDMjYgMTEuNTgyIDIyLjQxOCA4IDE4IDhDMTUuNzc3MyA4IDEzLjc3MDcgOC45MDg2NyAxMi4zMjI3IDEwLjM3MjdMMTAuODcgOC45MTkzM0wxMCAxMy41OTQ3TDE0LjY0MTMgMTIuNjkyTDEzLjI2NzMgMTEuMzE4QzE0LjQ3NTMgMTAuMDk0IDE2LjE0ODcgOS4zMzMzMyAxOCA5LjMzMzMzQzIxLjY3NiA5LjMzMzMzIDI0LjY2NjcgMTIuMzI0IDI0LjY2NjcgMTZDMjQuNjY2NyAxOS42NzYgMjEuNjc2IDIyLjY2NjcgMTggMjIuNjY2N0MxNC41NDg2IDIyLjY2NjcgMTEuNzAxNCAyMC4wMzA0IDExLjM2NjMgMTYuNjY1N0MxMS4zMjk4IDE2LjI5OTMgMTEuMDM0OSAxNiAxMC42NjY3IDE2QzEwLjI5ODUgMTYgOS45OTcxIDE2LjI5OTUgMTAuMDI3NCAxNi42NjY1QzEwLjM2NjEgMjAuNzcyNyAxMy44MDY0IDI0IDE4IDI0WiIgZmlsbD0iIzU1OEQ2MSIvPgo8cGF0aCBkPSJNMTcuMjA3MyAxOS4zMjg0TDE1LjA4NTkgMTcuMjA3TDE0LjYyMTcgMTkuNzkyNkwxNy4yMDczIDE5LjMyODRaIiBmaWxsPSIjNTU4RDYxIi8+CjxwYXRoIGQ9Ik0xNy40MTM4IDE3LjY1NjlMMTYuNzA2NyAxNi45NDk3QzE2LjMxNjEgMTYuNTU5MiAxNi4zMTYxIDE1LjkyNjEgMTYuNzA2NyAxNS41MzU1TDE5LjUzNTEgMTIuNzA3MUMxOS45MjU2IDEyLjMxNjYgMjAuNTU4OCAxMi4zMTY2IDIwLjk0OTMgMTIuNzA3MUwyMS42NTY0IDEzLjQxNDJDMjIuMDQ2OSAxMy44MDQ3IDIyLjA0NjkgMTQuNDM3OSAyMS42NTY0IDE0LjgyODRMMTguODI4IDE3LjY1NjlDMTguNDM3NCAxOC4wNDc0IDE3LjgwNDMgMTguMDQ3NCAxNy40MTM4IDE3LjY1NjlaIiBmaWxsPSIjNTU4RDYxIi8+Cjwvc3ZnPgo=");
}
.field-changes > .icon > span {
    display: none;
}
.field-changes.new > .icon > span {
    position: absolute;
    display: inline-block;
    font-weight: 500;
    font-size: 9px;
    line-height: 8px;
    text-align: center;
    letter-spacing: -0.2px;
    color: #FFFFFF;
    padding: 3px 4px 3px 4px;
    top: 1px;
    left: -32px;
    background: #9da7b0;
    border-radius: 4px;
}
.field-changes.new:hover > .icon > span {
    background: #558D61;
}
.changes-view > .modal-content > .modal-header > .modal-title {
    font-weight: 500;
    font-size: 20px;
    line-height: 22px;
    letter-spacing: -0.2px;
    color: #111;
}
.changes-view > .modal-content > .modal-body {
    padding-bottom: 32px;
}
.changes-view > .modal-content > .modal-body > .b-overlay-wrap > hr.full-width {
    margin: 48px -35px 40px -35px;
}
.changes-view > .modal-content > .modal-body > .b-overlay-wrap > h5 {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.2px;
    color: #72808E;
}
.changes-view > .modal-content > .modal-body > .b-overlay-wrap > div {
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.2px;
}
.changes-view > .modal-content > .modal-footer > .b-overlay-wrap {
    margin: 0;
}
</style>