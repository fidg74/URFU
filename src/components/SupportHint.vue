<template>
  <div>
    <div class="fab-container" @click="$bvToast.show('support-contacts-toast')">
      <div class="fab fab-icon-holder tech-support-button">
      
      </div>
    </div>
    <b-toast id="support-contacts-toast" static no-auto-hide no-close-button>
      <div class="support-contacts-toast__row">
        <div class="support-contacts-toast__col-1" cols="2">
          <div class="support-contacts-toast__question-container">
            <div class="support-contacts-toast__question-circle">
              <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.819 12.241C4.00871 12.241 3.32631 11.5788 3.45662 10.779C3.51933 10.3941 3.61018 10.0564 3.72919 9.76593C3.98076 9.1518 4.43951 8.54876 5.10544 7.95683C5.77876 7.35749 6.22642 6.87285 6.44839 6.50289C6.67037 6.12553 6.78135 5.72967 6.78135 5.31532C6.78135 4.06486 6.20422 3.43962 5.04994 3.43962C4.5024 3.43962 4.06215 3.60981 3.72919 3.95017C3.14012 4.55263 2.54655 5.33752 1.70396 5.33752H1.63786C0.736083 5.33752 -0.0339451 4.58129 0.249654 3.72527C0.472509 3.0526 0.844341 2.48383 1.36515 2.01898C2.26785 1.21987 3.49612 0.820312 5.04994 0.820312C6.61857 0.820312 7.83574 1.20137 8.70144 1.96349C9.56715 2.7182 10 3.78739 10 5.17103C10 5.79996 9.85942 6.3956 9.57825 6.95794C9.29708 7.51288 8.80503 8.13071 8.10211 8.81143L7.20311 9.66604C6.64077 10.2062 6.3189 10.8388 6.23751 11.5639C6.21254 11.9448 5.89633 12.241 5.51464 12.241H4.819ZM3.02997 15.6483C3.02997 15.1525 3.19645 14.7456 3.52941 14.4274C3.86977 14.1019 4.30263 13.9391 4.82797 13.9391C5.35331 13.9391 5.78246 14.1019 6.11543 14.4274C6.45579 14.7456 6.62597 15.1525 6.62597 15.6483C6.62597 16.1366 6.45949 16.5399 6.12653 16.858C5.80096 17.1762 5.36811 17.3353 4.82797 17.3353C4.28783 17.3353 3.85128 17.1762 3.51831 16.858C3.19275 16.5399 3.02997 16.1366 3.02997 15.6483Z" fill="white"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="support-contacts-toast__col-2">
          <h3 class="support-contacts-toast__msg_header">Техническая поддержка</h3>
          <p>По вопросам организации проектного обучения и его сопровождения обращайтесь в Центр&nbsp;развития инженерного образования<br>
            e-mail: <a href="mailto:project@urfu.ru">project@urfu.ru</a></p>
          <p>По вопросам работы сервиса обращайтесь в Отдел&nbsp;технической&nbsp;поддержки пользователей<br>
            телефон: <a href="tel:+73432272070">+7 (343) 227-20-70</a><br>
            e-mail: <a href="mailto:support@urfu.ru">support@urfu.ru</a></p>
        </div>
      </div>
      <CrossCloseBtn class="support-contacts-toast__close-btn" @click="$bvToast.hide('support-contacts-toast')"/>
    </b-toast>
  </div>
</template>

<script>
import CrossCloseBtn from '@/components/CrossCloseButton.vue';

export default {
  components: {
    CrossCloseBtn
  },
}
</script>

<style lang="stylus">
.fab {
  width: 60px;
  height: 60px;
  background: #d23f31;
}
.fab-container {
  position: fixed;
  bottom: 45px;
  right: 48px;
  z-index: 999;
  cursor: pointer;
}
.fab-icon-holder {
  width: 58px;
  height: 58px;
  border-radius: 100%;
  background: #E1EAF9;
}
.fab-icon-holder:hover {
  opacity: 0.8;
}
.fab-icon-holder i {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 25px;
  color: #233746;
}
.tech-support-button {
  padding: 0;
  outline: none;
  background: #E1EAF9 url("data:image/svg+xml,%3Csvg width='48' height='34' viewBox='0 0 48 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.01941 21.495H5.14814V18.3416C5.14814 8.21182 13.3598 0 23.4897 0C33.6196 0 41.8313 8.21182 41.8313 18.3416V21.495H42.6035C45.4352 21.495 47.6233 24.0049 47.6233 26.901V34.9455C47.6946 37.7525 45.4769 40.0858 42.6699 40.1571C42.6478 40.1578 42.6257 40.1581 42.6035 40.1584H37.8412C37.1666 40.1267 36.6455 39.554 36.6772 38.8795C36.6783 38.8552 36.6802 38.831 36.6828 38.8068V23.0395C36.6828 22.2673 37.1333 21.4949 37.8412 21.4949H39.257V18.3415C39.257 9.63346 32.1977 2.57414 23.4897 2.57414C14.7817 2.57414 7.7224 9.63346 7.7224 18.3415V21.4949H9.13826C9.84618 21.4949 10.2967 22.2671 10.2967 23.0395V38.8068C10.3685 39.4783 9.8824 40.0809 9.21093 40.1527C9.18679 40.1553 9.16253 40.1571 9.13826 40.1582H7.6581L7.78682 40.3513C9.71795 42.9178 12.7482 44.421 15.9601 44.4057C16.6632 40.958 20.0283 38.7329 23.476 39.4362C26.4244 40.0374 28.5502 42.6196 28.5739 45.6285C28.5387 49.1577 25.6676 52 22.1383 51.9998C20.3912 51.9714 18.7259 51.2545 17.5047 50.0047C16.6807 49.1609 16.1408 48.081 15.9601 46.9155C11.9379 46.9308 8.14479 45.0461 5.72747 41.8314L4.50463 40.0294C1.73735 39.8364 -0.000259399 38.0988 -0.000259399 35.5888V27.5443C-0.000385284 24.7772 2.05898 21.495 5.01941 21.495ZM39.257 37.5841H42.6035C43.9893 37.5504 45.0854 36.3997 45.0517 35.0139C45.051 34.9911 45.0502 34.9683 45.0491 34.9454V26.9009C45.0491 25.4207 44.0194 24.0692 42.6035 24.0692H39.257V37.5841ZM19.3709 48.2029C20.0841 48.9762 21.0862 49.4191 22.1382 49.4257C24.232 49.3925 25.9312 47.7216 25.9996 45.6286C26.0004 43.5316 24.3011 41.8309 22.2041 41.8301C20.107 41.8292 18.4064 43.5285 18.4055 45.6256C18.4055 45.6266 18.4055 45.6277 18.4055 45.6286C18.3519 46.5842 18.7022 47.5183 19.3709 48.2029ZM2.57388 35.5891C2.57388 37.3267 4.24718 37.5841 5.01941 37.5841H7.7224V24.0693H5.01941C3.60356 24.0693 2.57388 26.0644 2.57388 27.5445V35.5891Z' fill='%23204050'/%3E%3C/svg%3E")no-repeat center center;
  transition: background-color .2s ease-in-out;
  &:hover, &.active {
    background-color: #fff;
  }
}

#support-contacts-toast {
  max-width: 100%;
  background: rgba(255,255,255,1);
  padding: 0
  &__toast_outer {
    right: 120px !important;
    bottom: 48px !important;
    min-width: 538px;
    position: fixed;
  }
  .toast-body {
    padding: 22px 29px 10px 19px;
    max-width: 100%
  }
}

.support-contacts-toast {
  &__row {
    display: flex;
  }
  &__col-2 {
    padding-left: 18px;
    p {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: -0.2px;
    }
  }
  &__question-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 61px;
    height: 64px;
    background: #467BE3;
    border-radius: 6px;
  }
  &__question-circle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border: 2px solid #FFFFFF;
    border-radius: 50%;
  }

  &__msg {
    &_header {
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      color: #111112;
      margin-bottom: 12px;
    }
  }

  &__close-btn {
    position: absolute;
    top: 16px;
    right: 19px;
  }
}
</style>