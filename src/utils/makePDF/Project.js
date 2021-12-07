import { userFullName, model } from '@/utils';
import format from 'date-fns/format';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

export default (project, type) => {
    const files = type === 'request' ? project.req_files : project.proj_files;

    const contentPDF = [
        { text: project.name ? project.name : 'Проект', style: 'h1' },
    ];

    if (type === 'passport') {
        contentPDF.push(
            {
                text: `Паспорт №${ project.uid } от ${ format(project.passport_date, 'DD.MM.YYYY') } `,
                color: '#72808e',
            },
            {
                text: `на основании заявки №${ project.uid } от ${ format(project.date, 'DD.MM.YYYY') }`,
                color: '#72808e',
                margin: [0, 0, 0, 15],
            },
        );
    } else {
        contentPDF.push(
            {
                text: `${ project.uid } от ${ format(project.date, 'DD.MM.YYYY') }`,
                color: '#72808e',
                margin: [0, 0, 0, 15],
            }
        );
    }

    contentPDF.push(
        { text: 'Название проекта', style: 'h2' },
        { text: project.name },
        { text: 'Цель', style: 'h2' },
        htmlToPdfmake(project.goal),
        { text: 'Результат (продукт)', style: 'h2' },
        htmlToPdfmake(project.result),
        { text: 'Критерии приемки', style: 'h2' },
        htmlToPdfmake(project.criteria),
        { text: 'Описание проекта', style: 'h2' },
        htmlToPdfmake(project.description),
        { text: 'Максимальное количество экземпляров проекта', style: 'h2' },
        { text: project.max_copies },

        { text: 'Заказчик', style: 'h2' },
        { text: userFullName(project.manager) },
    );

    if (type === 'request') {
        contentPDF.push(
            { text: 'Образовательная программа', style: 'h2' },
            { ul: project.programs.map(program => program.program && Object({
                text: program.program.uid + '  ' + program.program.name, color: '#555555',
            })) },
        );
    }


    if (type === 'passport') {
        // Roles
        const mainRoles = []
        project.programs.forEach(program => {
            program.roles.forEach(role => {
                let roleName
                if (role.role === 'RROP') {
                    roleName = program.is_main ? 'Главный руководитель образовательной программы' : 'Руководитель образовательной программы'
                } else {
                    roleName = role.role === 'MCUR' ? 'Главный куратор' : 'Куратор'
                }
                mainRoles.push([
                    { text: userFullName(role.user) },
                    {
                        text: roleName,
                        color: '#72808e',
                        fontSize: 8,
                        margin: [0, 0, 0, 10]
                    }
                ])
            })
        })
        if (mainRoles.length) {
            contentPDF.push(
                { text: 'Участники проекта от университета', style: 'h2' },
                { ul: mainRoles }
            )
        }

        // Expert
        const experts = []
        project.programs.forEach(program => {
            if (program.experts && program.experts.length) {
                experts.push([
                    { text: program.experts },
                    {
                        text: program.program.name,
                        color: '#72808e',
                        fontSize: 8,
                        margin: [0, 0, 0, 10]
                    }
                ])
            }
        })
        if (experts.length) {
            contentPDF.push(
                { text: 'Эксперты', style: 'h2' },
                { ul: experts }
            )
        }

        // Programs
        const programInfo = []
        project.programs.forEach(program => {
            let courseString = program.course.reduce((all, course) => {
                all += (['COUI', 'COII', 'CIII', 'COIV', 'COUV'].indexOf(course) + 1) + ', '
                return all
            }, '')
            courseString = courseString.slice(0, -2)

            programInfo.push(
                { text: 'Направление подготовки', style: 'h3' },
                { text: program.program.area.uid + '  ' + program.program.area.name },
                { text: 'Образовательная программа', style: 'h3' },
                { text: program.program.uid + '  ' + program.program.name },
                { text: 'Курс', style: 'h3' },
                { text: courseString, margin: [0, 0, 0, 15] },
            )
        })
        contentPDF.push(
            { text: 'Образовательная программа', style: 'h2' },
            ...programInfo
        )

        // Тип и сложность проекта
        project.programs.forEach(program => {
            contentPDF.push(
                { text: 'Тип и сложность проекта', style: 'h2' },
                {
                    text: program.program.name,
                    color: '#72808e',
                    fontSize: 8
                },
                { text: 'Тип проекта', style: 'h3' },
                { text: model(program.work_type) },
                { text: 'Уровень сложности', style: 'h3' },
                { text: model(program.difficulty_type), margin: [0, 0, 0, 15] }
            )
        })

        // Количество команд и студентов
        contentPDF.push(
            { text: 'Количество команд и студентов', style: 'h2' },
            { text: 'Количество команд', style: 'h3' },
            { text: project.max_copies, margin: [0, 4, 0, 8] },
        )
        project.programs.forEach(program => {
            contentPDF.push(
                { text: 'Количество студентов в команде', style: 'h3' },
                {
                    text: program.program.name,
                    color: '#72808e',
                    fontSize: 8
                },
                { text: project.max_copies, margin: [0, 4, 0, 8] },
            )
        })

        // Требования к ролям
        project.programs.forEach(program => {
            contentPDF.push(
                { text: 'Требования к ролям', style: 'h2' },
                {
                    text: program.program.name,
                    color: '#72808e',
                    fontSize: 8,
                    margin: [0, 0, 0, 4]
                }
            )
            contentPDF.push(
                { ul: program.compet_roles.map(competRole => {
                        return [
                            { text: [
                                competRole.role.name,
                                { text: ' x ' + competRole.quantity, color: '#555555' }
                            ]},
                            htmlToPdfmake(competRole.description),
                        ]
                    })
                }
            )
        })

        // Список формируемых компетенций
        project.programs.forEach(program => {
            contentPDF.push(
                { text: 'Список формируемых компетенций', style: 'h2' },
                {
                    text: program.program.name,
                    color: '#72808e',
                    fontSize: 8,
                    margin: [0, 0, 0, 4]
                },
                htmlToPdfmake(program.professional_competence_group_text),
            )
        })

        // Выделенные заказчиком ресурсы
        project.programs.forEach(program => {
            contentPDF.push(
                { text: 'Выделенные заказчиком ресурсы', style: 'h2' },
                {
                    text: program.program.name,
                    color: '#72808e',
                    fontSize: 8,
                    margin: [0, 0, 0, 4]
                }
            )
            contentPDF.push(
                { ul: program.resources.map(resource => {
                        return { text: [
                            resource.resource.name,
                            { text: ' x ' + resource.description, color: '#555555' }
                        ]}
                    })
                }
            )
        })

    }


    if (files && files.length) {
        contentPDF.push(
            { text: 'Приложения', style: 'h2' },
            { ul: files.map(file => Object({
                text: file.human_name, color: '#555555'
            })) }
        )
    }

    const docDefinition = {
        info: {
            title: project.name ? project.name : 'Проект',
            subject: 'Проект',
        },
        content: contentPDF,
        styles: {
            h1: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 4]
            },
            h2: {
                fontSize: 12,
                bold: true,
                margin: [0, 20, 0, 4]
            },
            h3: {
                fontSize: 10,
                bold: true,
                margin: [0, 10, 0, 4]
            }
        },
        defaultStyle: {
            fontSize: 10,
            color: '#222222'
        }
    }
    pdfMake.createPdf(docDefinition).download(project.uid + ' ' + (project.name ? project.name : '') + '.pdf');
}
