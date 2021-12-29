<template>
    <div class="program-select">
        <h2>Образовательная программа <span class="form_required-el" /></h2>
        <div class="text-caption mt-n1 mb-3">Доступны только программы с применением технологии проектного обучения.</div>
        <p>
            Выберите одну или несколько программ, студенты которых могут поучаствовать
            в проекте.
            <br/>
            При рассмотрении вашей заявки мы дополним ваш выбор, если для выполнения
            проекта больше подходят другие программы.      
        </p>   

        <b-form-checkbox 
            switch
            v-model="onlyMyOwnProgs"
            v-if="user.isRop"
            class="prog_select__only_own d-sm-none"
            size="lg"
        >Только мои программы</b-form-checkbox>

        <div class="steps">
            <div class="steps__arrow steps__arrow--prev d-sm-none"
                v-if="tab !== 'institute'"
                @click="go(prevTab)" 
            >
                <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.99237 0.835757L0.999577 3.82855M0.999577 3.82855L3.99237 6.82134M0.999577 3.82855H16.6567" stroke="#467BE3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div
                class="step"
                :class="{ active: tab == 'institute' }"
                @click="go('institute')"
            >
                Институт
                <b-badge v-if="institute.length">{{ institute.length }}</b-badge>
            </div>
            <div
                class="step"
                :class="{
                    active: tab == 'area',
                }"
                @click="go('area')"
            >
                Направление
                <b-badge v-if="area.length">{{ area.length }}</b-badge>
            </div>
            <div
                class="step"
                :class="{
                    active: tab == 'program',
                }"
                @click="go('program')"
            >
                Образовательная программа
                <b-badge v-if="program.length">{{ program.length }}</b-badge>
            </div>    
            <div class="steps__arrow steps__arrow--next d-sm-none"
                v-if="tab !== 'program'"
                @click="go(nextTab)" 
            >
                <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.6639 0.835757L16.6567 3.82855M16.6567 3.82855L13.6639 6.82134M16.6567 3.82855H0.999577" stroke="#467BE3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>  
            <b-form-checkbox 
                switch
                v-model="onlyMyOwnProgs"
                v-if="user.isRop"
                class="prog_select__only_own d-none d-sm-block"
                size="lg"
            >Только мои программы</b-form-checkbox>
        </div>
        <div class="panels">
            <div class="panel" :class="{ active: tab == 'institute' }">
                <multiselect
                    :multiple="true"
                    :options="institutes"
                    v-model="institute"
                    placeholder="Выберите или напишите название института"
                    :close-on-select="false"
                    track-by="id"
                    label="name"
                    deselectLabel=""
                    selectLabel=""
                    :class="{error: this.error}"
                >
                    <template slot="option" slot-scope="props">
                        <div class="option__desc">
                            <div class="program_sel__checkbox" :class="{ highlighted: props.option.highlighted}"></div>
                            <div class="option__title">{{ props.option.name }}</div>
                        </div>
                    </template>
                    <span slot="noResult">Ничего не найдено.</span>
                </multiselect>
                <div v-if="error" class="form-error">Не выбрана образовательная программа. Укажите нужные программы и нажмите "Подтвердить выбор"</div>
                <div class="buttons">
                    <a href="#" @click.prevent="go('area')" class="link">Далее</a>
                </div>
            </div>
            <div class="panel" :class="{ active: tab == 'area' }">
                <multiselect
                    :multiple="true"
                    :options="filteredAreas"
                    v-model="area"
                    placeholder="Выберите или напишите название направления"
                    :searchable="true"
                    :key="areaKey"
                    :close-on-select="false"
                    label="name"
                    track-by="id"
                    :custom-label="nameWithUid"
                    :class="{error: this.error}"
                >
                    <template slot="option" slot-scope="props">
                        <div class="option__desc jc_space_between">
                            <div class="option__desc mr-3">
                                <div class="program_sel__checkbox" :class="{ highlighted: props.option.highlighted}"></div>
                                <div class="option__grey">{{ props.option.uid }}</div>
                                <div class="option__title">{{ props.option.name }} </div>
                            </div>
                            <div class="option__right">{{ props.option.level_human }} </div>              
                        </div>
                    </template>
                    <span slot="noResult">Ничего не найдено.</span>
                </multiselect>
                <div v-if="error" class="form-error">Не выбрана образовательная программа. Укажите нужные программы и нажмите "Подтвердить выбор"</div>
                <div class="buttons">
                    <a href="#" @click.prevent="go('institute')" class="link">Назад</a>
                    <a href="#" @click.prevent="go('program')" class="link">Далее</a>
                </div>
            </div>
            <div class="panel" :class="{ active: tab == 'program' }">
                <multiselect
                    :multiple="true"
                    :options="programsOptions"
                    v-model="program"
                    placeholder="Выберите или напишите название программы"
                    :searchable="true"
                    :close-on-select="false"
                    :custom-label="nameWithUid"
                    track-by="id"          
                    :key="progKey"
                    :class="{error:this.error}"
                    :group-label="hideAllProgs ? null : 'group'"
                    :group-values="hideAllProgs ? null : 'items'"
                    :group-select="!hideAllProgs"
                    @select="progSelectHandler"
                >
                    <template slot="option" slot-scope="props">
                        <div class="option__desc jc_space_between">
                            <div class="option__desc">                
                                <div class="program_sel__checkbox program__checkbox" :class="{checked:showAllProgSelectedChkbx}"></div>
                                <div class="option__column mr-3">
                                    <div class="option__row ml-2 opt_prog_title">
                                        <p>
                                            <span class="option__prog_uid">{{ props.option.uid }}</span>                    
                                            {{ '$groupLabel' in props.option ? props.option.$groupLabel: props.option.name }}
                                        </p>                    
                                    </div>
                                    <div class="option__grey ml-2" v-if="!('$groupLabel' in props.option)">{{ props.option.area_human }} </div>
                                    <div class="option__grey ml-2" v-if="!('$groupLabel' in props.option)">{{ props.option.institute_human }} </div>
                                </div>
                            </div>
                            <div class="prog_url ml-6">
                                <a :href="props.option.url" v-if="!('$groupLabel' in props.option)" target="blank" @click.stop>Подробнее</a>                 
                            </div>
                        </div>
                    </template>
                    <span slot="noResult">Ничего не найдено.</span>
                    <span slot="noOptions">По условиям поиска программы отсутствуют.</span>
                </multiselect>
                <div class="form-error" v-if="error">Не выбрана образовательная программа. Укажите нужные программы и нажмите "Подтвердить выбор"</div>
                <div class="buttons">
                    <a href="#" @click.prevent="go('institute')" class="link">Назад</a>
                    <a
                        href="#"
                        @click.prevent="addSelected"
                        :class="{ disabled: !(program && program.length) }"
                        class="btn btn-primary"
                    >{{ selected.length ? `Добавить к выбору` : `Подтвердить выбор` }}</a>
                </div>        
            </div>
        </div>
        <div v-if="selected && selected.length" class="selected-programs">
            <hr />
            <h3>Выбранные программы</h3>
            <ul>
                <li v-for="prog in selected" :key="prog.id">          
                    <span class="uid">{{ prog.uid }}</span>
                    <span class="name">{{ prog.name }}</span>
                    <a href="#" @click.prevent="deleteSelected(prog)" class="delete"></a><br/>
                    <span class="institute">
                        {{ prog.institute_human }}
                    </span>          
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import { mapState } from "vuex";
export default {
    name: "ProgramFilterSelect",
    props: {
        value: [Array],
        // показвать ошибку 
        error: Boolean,
        // Массив айдишников уже выбранных программ    
    },
    components: {
        Multiselect,
    },
    data() {
        return {
            // текущий таб
            tab: "institute",
            // список всех табов
            tabNames: ['institute', 'area', 'program'],
            // выбранные в селекте институты
            institute: [],
            // все институты
            institutes: [],
            // ключ версии данных институтов
            instituteKey: 0,
            // ключ версии данных направлений
            areaKey: 0,
            // ключ программ
            progKey: 0,
            // выбранные в селекте области
            area: [],
            // все области
            areas: [],
            // выбранные в селекте программы
            program: [],
            // все программы
            programs: [],
            // список выбранных и подтвержденных программ
            selected: [],
            // режим "только мои программы для РОПа"
            onlyMyOwnProgs: false,      
        };
    },
    mounted() {
        // Загрузим программы
        this.$axios
        .get(this.learning_src + "program/selector/")
        .then((data) => {
            if (data.data) {
                this.programs = data.data.programs;
                this.areas = data.data.areas;
                this.institutes = data.data.institutes;
            }
        })
        .catch(() => {
            console.log("something wrong!");
        });
    },
    methods: {
        go(tab) {
            this.tab = tab;
        },
        toggleAllPrograms() {
            this.checkedAllPrograms = !this.checkedAllPrograms;
        },
        addSelected() {
            // список, из которого будем добавлять в выбранные
            // если нажата ли галка "Все программы" - все отфильтрованные берем
            let programList = this.program.some((prog_item) => prog_item.id == 0)
                ? this.filteredPrograms.slice(1)
                : this.program;
            // Если программ нет в списке выбранных - добавим
            programList.forEach((prog_item) => {
                if (!this.selected.some((sel_item) => sel_item.id === prog_item.id)) {
                    this.selected.push(prog_item);
                }
            });
            this.program = [];
            this.area = [];
            this.institute = [];
            this.tab = "institute";
            this.$emit("input", this.selectedIds);
        },
        deleteSelected(item) {
            let index = this.selected.indexOf(item);
            if (index > -1) {
                this.selected.splice(index, 1);
                this.$emit("input", this.selectedIds);
            }
        },
        // helper-метод поиска элемента в массиве по совпадающему id
        contains_helper(item, array) {
            return array.some((array_item) => array_item.id === item.id);
        },
        progSelectHandler(option, id) {
          // Обработчик выбора программы для функции "Все программы"
          option = id
        },
        progDeselectHandler(option) {
          // Обработчик выбора программы для функции "Все программы"      
          if (option.id === 0) {
            this.programs.forEach(item => {
                if (item.id !=0) {
                    item['highlighted'] = false
                }
            })        
          }
        },
        nameWithUid({ name, uid }) {
            return `${uid} ${name}`;
        },    
    },
    computed: {
        prevTab() {
            // Вернуть имя предыдущего таба, если текущий таб первый вернуть его
            if (this.tabNames.indexOf(this.tab) == 0) {
                return this.tab
            } else {
                return this.tabNames[this.tabNames.indexOf(this.tab) - 1]
            }
        },
        nextTab() {
            // Вернуть имя следующего таба, если текущий таб последний вернуть его
            if (this.tabNames.indexOf(this.tab) == this.tabNames.length - 1) {
                return this.tab
            } else {
                return this.tabNames[this.tabNames.indexOf(this.tab) + 1]
            }
        },
        programsOptions() {
            // список для выбора из программ с учетом группы "Все программы" и опции "только свои программы" для РОП
            if (this.onlyMyOwnProgs) return this.userPrograms      
            let result = [];
            if (!this.hideAllProgs) {
                result.push({
                    id: 0,
                    area: 0,
                    group: 'Все программы',
                    items: this.filteredPrograms,
                });
            } else {        
                result = this.filteredPrograms;
            }      
            return result;
        },
        showAllProgSelectedChkbx() {
            // показать чекбокс выбрано у группы "Все программы"
            let ids = new Set()      
            this.filteredPrograms.forEach(item => ids.add(item.id))
            this.program.forEach(item => ids.delete(item.id))
            return ids.size === 0 
        },
        hideAllProgs() {
            // вычисляемое свойство того, что галку "Все программы надо скрыть"

            // 1. Для РОПа, если он нажал "свои программы"
            if (this.onlyMyOwnProgs) return true;
            // 2. Для случая, когда не выбрано ни института ни направления
            if (!this.institute.length && !this.area.length) return true;
            // 3. если в результате фильтрации ничего нет
            if (!this.filteredPrograms.length) return true;
            return false;
        },
        programsByInstitute() {
            // Программы, отсортированные по принадлежности к выбранным института
            return this.institute.length ? this.programs.filter(p => this.institute.some(i => i.id == p.institute)) : this.programs;
        },
        filteredPrograms() {
            let result = []
            // Первичнее всего направления
            result = this.area.length ? this.programs.filter(p => this.area.some((a) => a.id == p.area)) : this.programs;
            // Затем фильтр по институтам
            result = this.institute.length ? result.filter(p => this.institute.some(i => i.id == p.institute)) : result;
            return result;
        },
        filteredAreas() {
            return this.institute.length
                ? this.areas.filter(a =>
                    this.institute.some(i => a.institute.indexOf(i.id) > -1)).filter(a => 
                        this.programsByInstitute.some(p => a.id == p.area))
                : this.areas;
        },
        selectedIds() {
            return this.selected.map((item) => item.id);
        },
        ...mapState({
            learning_src: (state) => state.api.learning_src,
        }),
        instTotal() {
            // вызов подсчета направлений
            this.areaTotal;
            return this.institutes.filter((item) => "highlighted" in item || this.contains_helper(item, this.institute)).length;
        },
        areaTotal() {
            // вызов подсчета программ
            this.progTotal;
            // подсветим институты
            let all_areas = this.areas.filter((item) => "highlighted" in item || this.contains_helper(item, this.area));
            this.institutes.forEach((item) => delete item.highlighted);
            all_areas.forEach((area) =>
                area.institute.forEach((inst_id) =>
                    this.institutes.forEach((institute) => {
                        if (institute.id === inst_id) institute["highlighted"] = true;
                    })
                )
            );
            return all_areas.length;
        },
        progTotal() {
            // подсветим направления
            this.areas.forEach((item) => {
                delete item.highlighted;
                if (this.program.some((prog_item) => prog_item.area == item.id)) {
                    item["highlighted"] = true;          
                }
            });
            return this.program.length;
        },
        ...mapState ({
            userPrograms: (state) => state.user.programs,
            user: (state) => state.user,
            allPrograms: (state) => state.api.programs
        }),
    },
    watch: {
        value(newVal) {
            this.selected = [];      
            if (newVal && Array.isArray(newVal)) {
                newVal.forEach((item) => {
                    let program = this.allPrograms.find((p) => p.id == item);
                    // if (program && !this.selected.some((s) => s.id == program.id)) {
                    this.selected.push(program);
                    // }
                });
            }
        },    
        institute() {
            this.program = [];
            this.area = [];
        },
        area() {
            this.program = [];
        },
    },
};
</script>
<style>
.multiselect.error {
    border-color: red; 
    border-style: solid;  
    border-radius: 6px;
    color: red;
    border-width: 1px;
}
.prog_select__only_own label {
    font-size: 16px !important;
}
.program-select .option__column {
    flex-direction: column;
    margin-left: 5px;
}

.opt_mt-5{
    margin-top: -5px;
}
.program-select .option__row {
    display: flex;
    flex-direction: row;
}
.program-select .option_row_sp_between{
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.program-select .option__grey{
    color:#8e8e8e;
    margin-right: 5px;
    margin-left: 5px;
    font-size: 90%;
}
.program-select .opt_prog_title{
    margin-bottom: -11px;
}
.program-select .option__prog_uid{
    color:#8e8e8e;  
    font-size: 90%;
    margin-right: 3px;
}

.program-select .option__right{
    margin-right: 50px;
}

.program-select .jc_space_between{
    justify-content: space-between;
}

.program-select .program_sel__checkbox{  
    text-align: center;
    vertical-align: middle;
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border-color: rgba(114, 128, 142, 0.3);  
    color: rgb(203, 207, 201);
    border-style: solid;
    border-width: 1px;
    margin-left: 3px;
    margin-right: 3px;
    min-width: 16px;
}

.program-select .multiselect__element{
    border-bottom: rgba(85, 123, 160, 0.15);
    border-bottom-width: 1px;
    border-bottom-style: solid;    
}
.program-select .multiselect__option--selected .program_sel__checkbox,
.program_sel__checkbox.program__checkbox.checked {
    background: #5386EB;
}
.program-select .multiselect__option--selected .program_sel__checkbox::after,
.program_sel__checkbox.program__checkbox.checked::after {
    content: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEwIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2QpIj4KPHBhdGggZD0iTTEuNSA0LjVMNC41IDYuNUw4LjUgMSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L2c+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2QiIHg9Ii0wLjI1IiB5PSIwLjI1IiB3aWR0aD0iMTAuNTAwMSIgaGVpZ2h0PSI5LjAwMDExIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgo8ZmVPZmZzZXQgZHk9IjEiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMC41Ii8+CjxmZUNvbG9yTWF0cml4IHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjE2IDAiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3QxX2Ryb3BTaGFkb3ciLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3ciIHJlc3VsdD0ic2hhcGUiLz4KPC9maWx0ZXI+CjwvZGVmcz4KPC9zdmc+Cg==");    ;
}
.program-select .option__desc {
    display: flex;    
    flex-direction: row;
    align-items: center;
    min-height: 35px;
}
.program-select .option__title {
    margin-left: 10px;
}
.program-select .multiselect,
.program-select .multiselect__input,
.program-select .multiselect__single {
    font-size: 14px;
}
.program-select .multiselect__tags {
    border: 1px solid #cfcfcf;
    background: #ffffff;
}
.program-select .multiselect__tag {
    margin-right: 8px;
    color: #467be3;
    background: #dce8fa;
    font-size: 0.9rem;
    font-weight: 400;
}
.program-select .multiselect__tag-icon {
    top: -1px;
}
.program-select .multiselect__tag-icon:after {
    content: "\D7";
    color: #467be3;
    font-size: 0.8rem;  
}
.program-select .multiselect__tag-icon:focus,
.program-select .multiselect__tag-icon:hover {
    background: #dce8fa;
}
.program-select .multiselect__option {
    white-space: inherit;
}
.program-select .multiselect__option--highlight,
.program-select .multiselect__option--highlight.multiselect__option--selected {
    background: #F4F8FF;  
    outline: none;
    color:  #111;
}
.program-select .multiselect__option--highlight:after {
    display: none;
    background: #9da7b0;
    color: #fff;
}
.program-select .multiselect__option--selected {  
    background: none;
    color: #111;
    font-weight: unset;
    
}
.program-select .multiselect__option--selected:after {  
    color: silver;
    display: none;
}
.program-select .multiselect__option--selected.multiselect__option--highlight {
   
}
.program-select .multiselect__option--selected.multiselect__option--highlight:after {
    display: none;    
}
.program-select .multiselect__content-wrapper {
    background: #fff;
}
.program-select .multiselect__content {
    width: 100%;
}
.program-select > .steps {
    margin-top: 48px;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid rgba(114, 128, 142, 0.15);
    justify-content: space-between;
}
.program-select > .steps > .step {
    flex: 0 0 auto;
    padding-bottom: 18px;
    margin-bottom: -1px;
    border-bottom: 2px solid transparent;
    font-weight: bold;
    cursor: pointer;
}
.program-select > .steps > .step:hover {
    color: #467be3;
}
.program-select > .steps > .step.active {
    border-bottom: 2px solid #467be3;
}
.program-select > .steps > .step.disabled,
.program-select > .steps > .step.disabled:hover {
    color: #c4c4c4;
    cursor: text;
}
.program-select > .steps > .step > .badge.badge-secondary {
    line-height: 18px;
    height: 18px;
    min-width: 18px;
    text-align: center;
    background: rgba(57, 146, 255, 0.12);
    border-radius: 9px;
    font-weight: bold;
    font-size: 10px;
    color: #111112;
    letter-spacing: -0.5px;
    padding: 0;
}
.program-select > .steps > .step-alt {
    flex: 0 0 auto;
    font-weight: bold;
    color: #467be3;
    cursor: pointer;
}
.program-select > .panels {
}
.program-select > .panels > .panel {
    display: none;
    padding: 24px 0 0 0;
}
.program-select > .panels > .panel.active {
    display: block;
}
.program-select > .panels > .panel > .buttons {
    margin-bottom: 16px;
    margin-top: 16px;
}
.program-select > .panels > .panel > .buttons > a.link {
    color: #467be3;
}
.program-select > .panels > .panel > .buttons > a.link.disabled {
    color: #c4c4c4;
    cursor: text;
}
.program-select > .panels > .panel > .buttons > a + a {
    margin-left: 24px;
}

.program-select .vue-multiselect__check-mark,
.program-select .vue-multilect__minus-mark {
    left: 2px;
    top: 3px;
    width: 10px;
    height: 10px;
    background-size: contain;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEwIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2QpIj4KPHBhdGggZD0iTTEuNSA0LjVMNC41IDYuNUw4LjUgMSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L2c+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2QiIHg9Ii0wLjI1IiB5PSIwLjI1IiB3aWR0aD0iMTAuNTAwMSIgaGVpZ2h0PSI5LjAwMDExIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgo8ZmVPZmZzZXQgZHk9IjEiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMC41Ii8+CjxmZUNvbG9yTWF0cml4IHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjE2IDAiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3QxX2Ryb3BTaGFkb3ciLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3ciIHJlc3VsdD0ic2hhcGUiLz4KPC9maWx0ZXI+CjwvZGVmcz4KPC9zdmc+Cg==");
}
.program-select > .selected-programs {
}
.program-select > .selected-programs > hr {
    margin: 16px 0 24px 0;
}
.program-select > .selected-programs > h3 {
    font-weight: 500;
    font-size: 20px;
    line-height: 22px;
    letter-spacing: -0.2px;
    margin-bottom: 20px;
}
.program-select > .selected-programs > ul {
}
.program-select > .selected-programs > ul > li {
    margin-bottom: 16px;
    margin-left: -24px;
}
.program-select > .selected-programs > ul > li span.uid {
    color: #9da7b0;
}
.program-select > .selected-programs > ul > li span.institute {
    color: #9da7b0;
}

.program-select > .selected-programs > ul > li span.name {
    margin-left: 4px;
}
.program-select > .selected-programs > ul > li a.delete {
    width: 10px;
    height: 10px;
    margin-left: 8px;
    display: inline-block;
    background: center no-repeat;
    background-size: contain;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEgMUw5IDkiIHN0cm9rZT0iIzlEQTdCMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNOSAxTDEgOSIgc3Ryb2tlPSIjOURBN0IwIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=");
}
.program-select > .selected-programs > ul > li > a.delete:hover {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEgMUw5IDkiIHN0cm9rZT0iI2Y1MjIyZCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNOSAxTDEgOSIgc3Ryb2tlPSIjZjUyMjJkIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=");
}

@media (max-width: 575px) {
    /* временно */
    .program-select > .steps {
        /* display: none; */
    }

    .program-select p {
        font-weight: 500;
        font-size: 14px;
        line-height: 18px;
        margin-bottom: 0;
        color: #72808E;
        padding: 0 12px;
    }

    .program-select .text-caption {
        display: none;
    }

    .program-select h2 {
        margin-bottom: 25px;
    }

    .program-select .steps {
        margin-top: 30px;
    }

    .program-select .step:not(.active) {
        display: none;
    }

    .program-select .prog_select__only_own {
        margin-top: 30px;
    }

    .prog_select__only_own label {
        font-size: 14px !important; 
        line-height: 20px;
    }

    .custom-switch.b-custom-control-lg .custom-control-label::before {
        top: 3px;
        width: 32px;
        height: 16px;
    }

    .custom-switch.b-custom-control-lg .custom-control-label::after {
        top: calc( 0.2975rem + 2px );
        width: 10px;
        height: 10px;
        left: calc( -2.7rem + 2px );
        background: #467BE3;
    }

    .program-select > .steps > .step {
        padding-bottom: 12px;
        margin-left: auto;
        margin-right: auto;
    }
}
</style>
