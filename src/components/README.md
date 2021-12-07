# Библиотека компонентов

- [Paginator](#paginator)
- [CuratorAddToProject](#curatoraddtoproject)
- [ProjectListItem](#projectlistitem)
---


# Paginator
#### Компонет для постраничной навигации

1. Для добавления на страницу необходимо импортировать компонент и подключить его

``` javascript
import Paginator from '@/components/Paginator.vue'

components: {
  Paginator
}
```

2. Разместить компонент на странице передавая входные параметры
``` html
<Paginator :pages="pagesData" @change-page="fetchPage" />
```

#### Входные параметры props

| Имя | Тип | Описание |
|-----|-----|----------|
| `pages` | Array | Массив страниц (page), каждый из которых состоит из 4 параметров. Используется только второй и третий параметр
| `page` | Array | Описывает свойства страницы для пагинатора
| `page[1]` | Number | Номер страницы
| `page[2]` | Boolean | Являетя ли эта страница текущей

#### События

| Имя | Тип | Описание |
|-----|-----|----------|
| `change-page` | Function | callback функция при выборе страницы


---


# CuratorAddToProject
#### Добавление куратора в программу

1. Для добавления на страницу необходимо импортировать компонент и подключить его

``` javascript
import CuratorAddToProject from '@/components/CuratorAddToProject.vue'

components: {
  CuratorAddToProject
}
```

2. Разместить компонент на странице передавая входные параметры
``` html
<CuratorAddToProject :programId="10" :projectId="10" @success="success" />
```

3. Вызвать модальное окно можно с помощью диррективы `v-b-modal` либо  `this.$bvModal.show()`
``` html
<b-button v-b-modal.CuratorAddToProject>Назначить куратора</b-button>
```
``` javascript
this.$bvModal.show('CuratorAddToProject')
```

#### Входные параметры props

| Имя | Тип | Описание |
|-----|-----|----------|
| `programId` | Number | id программы в которую добавляется куратор
| `projectId` | Number | id проекта (паспорта/заявки)

#### События

| Имя | Тип | Описание |
|-----|-----|----------|
| `success` | Function | callback функция при успешном добавлении, в качестве аргумента передает объект с данными выбранного куратора (FIX: Описать формат)

---


# ProjectListItem
#### Карточка проекта для списка заявок и проектов 

1. Для добавления на страницу необходимо импортировать компонент и подключить его

``` javascript
import ProjectListItem from '@/components/ProjectListItem.vue'

components: {
  ProjectListItem
}
```

2. Разместить компонент на странице передавая входные параметры
``` html
<ProjectListItem :mode="mode" :user="user" :project="projects" />
```

На случай если необходима заглушка для карточки, то можно использовать компонент <PlaceholderProjectListItem />. Предварительно подключить к странице


#### Входные параметры props

| Имя | Тип | Описание |
|-----|-----|----------|
| `mode` | String | В каком виде выводится, имеет два значения 'request' или 'project'
| `project` | Object | Данные о проекте
| `user` | Object | Объект описывающий текущего пользователя.

---

