<template>
    <div v-pin-bottom class="pin-bottom_btns">
        <b-container class="pin-bottom__container">
            <b-row>
                <b-col cols="9">
                    <b-card class="card_content">
                        <span
                            v-b-tooltip
                            :title="meIsRROP && !MCUR ? 'Главный куратор не назначен' : ''">
                        </span>
                        <ActButtons :buttons="buttonsByOrder" @errors="errors => $emit('errors', errors)" />
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import ActButtons from "@/components/passport/ActButtons";

export default {
    name: "Actions",
    components: {
        ActButtons,    
    },
    data() {
        return {
            approve: null,
        };
    },
    methods: {
    },
    computed: {
        ...mapState({
            project: (state) => state.project.project,
            currentProgram: (state) => state.project.currentProgram,
            learning_src: (state) => state.api.learning_src,
        }),
        ...mapGetters("project", [
            "MCUR",
            "meIsRCUR",
            "meIsMCUR",
            "meIsMROP",
            "meIsRROP",
            "meIsPartner",
            "meIsPartnerIsURFU",
            "myProgram",
            "currentProgramIsMain",
            "allProgramsApproved",
            "isMulti",
        ]),    
    
        buttonsByOrder(){
            const actions = []
            // Возвращает кнопки действий с делением (видимая часть / скрыта за точками кнопки)
            // Приоритет в порядке уменьшения слева направо "Отправить на согласование", "Отправить на доработку", "Сменить куратора", "Добавить образовательную программу", "Редактировать", "Сохранить в PDF"

            // Утвердить паспорта
            if ('accept' in this.project.available_actions){
                actions.push('accept')
            }
            // Отправить паспорт на согласование (заказчику / в университет)"
            if ('review' in this.project.available_actions){
                actions.push('review')
            }
            // Отправить программу на согласование (внутри университета)
            if (this.currentProgram && "approve" in this.currentProgram.available_actions && ['PSST', 'PSUN'].indexOf(this.project.request_status) > -1){
                actions.push('approve')
            }
            // Отправить программу на доработку (внутри университета)
            if (this.currentProgram && "decline" in this.currentProgram.available_actions){
                actions.push('decline')
            }
            // Назначить куратора
            if (this.currentProgram && "assign_curator" in this.currentProgram.available_actions){
                actions.push('assign_curator')
            }
            // Сменить куратора
            if (this.currentProgram && "change_curator" in this.currentProgram.available_actions){
                actions.push('change_curator')
            }
            // Редактировать
            if ("edit" in this.project.available_actions || (this.currentProgram && "edit" in this.currentProgram.available_actions)){
                actions.push('edit')
            }
            // Добавить Образовательную программу
            if (this.project.request_status === 'PSST' && this.meIsMROP){
                actions.push('add_program')
            }

            // Выгрузить паспорт в ИТС
            if (this.project.request_status === 'PSAP' && this.meIsMROP && this.project.programs.filter(p => p.published === null).length){
                actions.push('export_its')
            }

            actions.push('print_pdf')

            return actions
        }

    },
}
</script>

<style lang="stylus">
.actions__inline-btns {
    display: inline-block;
}
.actions__hidden {
    position: relative;
    &-btns {
        position: absolute;
        bottom: 115%;
        right: 0;
        display: flex;
        flex-direction: column;
        background: #fff;
        border: 1px solid rgba(114, 128, 142, 0.3);
        border-radius: 6px;
        padding: 16px;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
        white-space: nowrap;
        text-align: left;
    }
    & .like-btn {
        margin: 0 !important;
    }
    & .btn {
        text-align: left;
        width: 100%;
        margin: 0;
    }
}
</style>
