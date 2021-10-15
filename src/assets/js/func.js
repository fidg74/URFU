// import $ from 'jquery';
export default {
    name: 'lkp',
    getCookie(cname) {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie)
        const ca = decodedCookie.split(';')
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1)
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length)
            }
        }
        return ''
    },
    setUser(user) {
        const userWidgetCaption = document.querySelector('.shell-user-widget .shell-caption')
        if (userWidgetCaption) userWidgetCaption.textContent = user.last_name + ' ' + user.first_name
        const companyWidgetCaption = document.querySelector('.shell-company-widget .shell-caption')
        if (companyWidgetCaption) companyWidgetCaption.textContent = user.org.short_name

        const companyWidgetIcon = document.querySelector('.shell-company-widget .shell-icon')
        if (companyWidgetIcon) {
            if (user.org.type === 'staff') {
                companyWidgetIcon.classList.remove('empty')
                companyWidgetIcon.classList.add('staff')
            } else {
                companyWidgetIcon.classList.remove('staff')
                companyWidgetIcon.classList.add('empty')
            }
        }
    },
    datetimeToStr(dt) {
        const
            dd = ('0' + dt.getDate()).slice(-2),
            mm = ('0' + (dt.getMonth() + 1)).slice(-2),
            yyyy = dt.getFullYear(),
            hh = ('0' + dt.getHours()).slice(-2),
            ii = ('0' + dt.getMinutes()).slice(-2),
            ss = ('0' + dt.getSeconds()).slice(-2);
        return `${dd}.${mm}.${yyyy} ${hh}:${ii}:${ss}`;
    },
    dateToStr(dt) {
        const
            dd = ('0' + dt.getDate()).slice(-2),
            mm = ('0' + (dt.getMonth() + 1)).slice(-2),
            yyyy = dt.getFullYear();
        return `${dd}.${mm}.${yyyy}`;
    },
    getToken() {
        const self = this;
        let cookie = window.lkp.jwt_cookie;

        if (location.hostname === 'localhost') {
            return this.getCookie('key')
        } else {
            return self.getCookie(cookie);
        }
    },
    sendMenuToKernel(isServiceActivated) {
        const sidebarMenu = {
            content: 'sidebar-menu',
            action: 'create',
            pathToParent: ['ptraining'],
            items: {
                'ptraining/requests': {
                    name: 'Заявки',
                    href: '/ptraining/services/learning/#/requests',
                    innerPages: ['requests']
                },
                'ptraining/projects': {
                    name: 'Паспорта',
                    href: '/ptraining/services/learning/#/projects',
                    innerPages: [/passport\/\d+$\/?/.source]  
                },
                'ptraining/implementations': {
                    name: 'Реализуемые проекты',
                    href: '/ptraining/services/learning/#/implementations',
                    innerPages: [/passport\/\d+\/implementation\/?/.source]
                },
            }
        };
        const zp = window.lkp.user.groups.filter(group => group === 'zp');
        if (zp.length > 0) {
            sidebarMenu.items['ptraining/settings'] = {
                    name: 'Настройки сервиса',
                    href: '/ptraining/services/learning/#/settings',
                    groups: ['zp']
                },
            sidebarMenu.items['ptraining/curators'] = {
                    name: 'Кураторы',
                    href: '/ptraining/services/learning/#/curators',
                    groups: ['zp']
                }
            }
        const urlToKernel = '/';

        if (isServiceActivated) {
            const timer1 = setInterval(() => {
                if (window.isKernelListeningForMenu) {
                    window.postMessage(sidebarMenu, urlToKernel);
                    clearInterval(timer1);
                }
            }, 100);
        }

        const userWidgetMenu = {
            content: 'user-widget-menu',
            action: 'create',
            items: {
                'profile': {
                    name: 'Мой профиль',
                    href: '/app/#/lk'
                },
                'change-password': {
                    name: 'Смена пароля',
                    href: '/app/#/password-change'
                },
            }
        };

        const timer2 = setInterval(() => {
            if (window.isKernelListeningForMenu) {
                window.postMessage(userWidgetMenu, urlToKernel);
                clearInterval(timer2);
            }
        }, 100);
    },
}