import { app } from '@/main';
import models from './models';
import format from 'date-fns/format';

// Получение сообщения об ошибке при любом ключе, принимает строку либо массив
// err - объект ошибки возвращаемая catch
// Пример: errorMessage(err)
export const errorMessage = err => {
    let message, status;
    const tag = app.$createElement;
    status = (err && err.response && err.response.status) ? err.response.status : 500;
    if (typeof status === 'string') status = 500;
  
    if (err.response && err.response.data && typeof err.response.data === 'object') {
        const data = err.response.data;
        for (let key in data) {
            if (typeof data[key] === 'string') {
                message = data[key];
            } else if (Array.isArray(data[key])) {
                message = data[key].reduce((prev, cur) => prev + cur + '; ', '');
            } else if (key === 'errors' && typeof data[key] === 'object') {
                message = [];
                for (let k in data[key]) {
                    if (typeof data[key][k] === 'object') {
                        message.push(tag('b', null, k + ': '), JSON.stringify(data[key][k]), tag('br'));
                    } else {
                        message.push(tag('b', null, k + ': '), data[key][k], tag('br'));
                    }
                }
            }
        }
    } else {
        message = err.message;
    }
  
    if (status === 401) message = 'Ошибка доступа';
    if (status === 404) message = 'Ресурс не найден';
    if (status > 499) message = 'Критическая ошибка, обратитесь в поддержку по телефону +7 (922) 222-78-07';

    if (!message || (message && message.length === 0)) message = 'Произошла ошибка';
    if (!status || (status && status.length === 0)) status = '...';

    app.$bvToast.toast([ tag('div', null, message) ], {
        title: 'Ошибка ' + status,
        variant: 'danger',
        noAutoHide: status > 499,
        autoHideDelay: 15000,
        toaster: 'b-toaster-top-center',
        appendToast: true,
        noCloseButton: status < 500,
        toastClass: ['message-toast', 'error-message-toast', ],
    });

    if (status === 401) {
        // Logout
        // Выход при 401 ошибке от сервера. Очистка куки и редирект на главную
        deleteCookie(window.lkp.jwt_cookie || 'key');
        window.location.href = '/';
    }
}

export const escapeHtml = string => {
    const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;',
    }
    return String(string).replace(/[&<>"'`=/]/g, s => entityMap[s]);
}

// export const parseTextUrl = text => {
//   // const urlRegex = /(https?:\/\/)?[\w\-~]+(\.[\w\-~]+)+(\/[\w\-~@:%]*)*(#[\w\-]*)?(\?[^\s]*)?/gi
//   const urlRegex = /(https?:\/\/[^\s]+)/g
//   return text.replace(urlRegex, url => '<a href="' + url + '">' + url + '</a>')
// }

export const userFullName = user => (user.last_name ? user.last_name : '') + ' ' + (user.first_name ? user.first_name : '') + ' ' + (user.middle_name ? user.middle_name : '');
export const userShortName = user => (user.last_name ? user.last_name : '') + ' ' + (user.first_name ? user.first_name[0] + '. ' : ' ') + (user.middle_name ? user.middle_name[0] + '.' : '');

// Отступ от элемента до верха документа
export const offsetTop = el => {
    if (el) {
        let offsetTop = 0;
        do {
            offsetTop += el.offsetTop;
            el = el.offsetParent;
        } while (el && !isNaN(el.offsetTop))
        return offsetTop - 10;
    }
}

// Склонение числительных
// Пример: declOfNum(sum, ['роль', 'роли', 'ролей'])
export const declOfNum = (n, titles) => {
    return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
}

// Перевод даты в текст по типу 10 минут назад
export const dateToWord = date => {
    let diff = new Date() - new Date(date);
    if (diff < 0) diff = 0;
    const min = Math.floor(diff / 60000); // меньше часа
    if (min < 60) return min + ' ' + declOfNum(min, ['минуту', 'минуты', 'минут']) + ' назад';
    const hour = Math.floor(diff / 3600000); // меньше суток
    if (hour < 24) return hour + ' ' + declOfNum(hour, ['час', 'часа', 'часов']) + ' назад';

    return format(date, 'DD.MM.YYYY HH:mm');
}

// Получить куку по имени
export const getCookie = name => {
    let matches = document.cookie.match(new RegExp(
        '(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/\+^])/g, '\\$1') + '=([^;]*)'
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Установить куку
export const setCookie = (name, value, options = {}) => {
    options = {
        path: '/',
        ...options,
    };
    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
    document.cookie = updatedCookie;
}

// Удаление куки
export const deleteCookie = name => {
    setCookie(name, '', { 'max-age': -1 });
}

export const model = name => models[name];

// Получить случайную строку по типу uid с заданой длиной
export const makeUID = length => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // length 62
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * 62));
    }
    return result;
}

// Торозящая функция, пока используется для торможения запросов в списке проектов при изменении фильтров и поиска
export const throttle = function (func, ms) {
    let isThrottled = false,
        savedArgs,
        savedThis;

    function wrapper () {
        if (isThrottled) {
            savedArgs = arguments;
            savedThis = this;
            return;
        }

        func.apply(this, arguments);
        isThrottled = true;

        setTimeout(() => {
            isThrottled = false;
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs);
                savedArgs = savedThis = null;
            }
        }, ms);
    }

    return wrapper;
}

// Тормозящая функция.
// func вызовется с таймаутом.
// Если func вызывается несколько раз в течение delay, то сработает только последний вызов
export const debounce = function (func, delay) {
    let timeout = null;

    return (...args) => {
        const call = () => func(...args);
        clearTimeout(timeout);
        timeout = setTimeout(call, delay);
    };
}

// Тормозящая функция.
// func вызовется сразу.
// Если func вызывается еще несколько раз, то сработает только последний вызов
export const debounceWithInstantCall = function (func, delay) {
    let funcTimeout = null;
    let delayTimeout = null;
    let delayExpired = true;

    return (...args) => {
        const call = () => func(...args);
        clearTimeout(funcTimeout);
        clearTimeout(delayTimeout);

        if (delayExpired) {
            call();
            delayExpired = false;
        } else {
            funcTimeout = setTimeout(call, delay);
        }

        delayTimeout = setTimeout(() => {
            delayExpired = true;
        }, delay);
    }
}

export const groupBy = function (list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
};

export const infoMessage = msg => app.$bvToast.toast(msg, {
    title: '',
    variant: 'success',
    toaster: 'b-toaster-top-center',
    autoHideDelay: 7500,
    appendToast: false,
    toastClass: ['message-toast', 'info-message-toast', ],
});

// текстовое представление даты-времени
export const timeToText = function (dateTime) {
    const date = new Date(dateTime).getTime();
    const now = new Date().getTime();
    const diff = now - date;
  
    const oneMinute = 1000 * 60;
    const tenMinutes = oneMinute * 10;
    const oneHour = oneMinute * 60;
    const oneDay = oneHour * 24;
  
    if (diff < tenMinutes) {
        return 'Сейчас';
    } else if (diff < oneHour) {
        const minutes = Math.floor(diff / oneMinute);
        const word = declOfNum(minutes, ['минута', 'минуты', 'минут']);
        return minutes + ' ' + word + ' назад';
    } else if (diff < oneDay) {
        const hours = Math.floor(diff / oneHour);
        const word = declOfNum(hours, ['час', 'часа', 'часов']);
        return hours + ' ' + word + ' назад';
    } else {
        return format(date, 'DD.MM.YYYY');
    }
}