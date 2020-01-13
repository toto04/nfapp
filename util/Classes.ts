interface ClassStructure {
    [key: string]: { year: string, sections: string[], subjects: string[] }[]
}

let defaultSubjects = ['Italiano', 'Matematica', 'Inglese', 'Ginnastica', 'Storia']
let fieldSubjects = {
    scientifico: ['Latino', 'Fisica', 'Arte', 'Scienze'],
    scienzeApplicate: ['Fisica', 'Informatica', 'Arte', 'Scienze'],
    linguistico: ['Francese', 'Tedesco', 'Scienze'],
    scienzeUmane: ['Diritto - Economia', 'Scienze Umane'],
}

export class Class {
    static classStructure: ClassStructure = {
        'Scientifico': [{
            year: '1^',
            sections: ['1AS'],
            subjects: [...defaultSubjects, ...fieldSubjects.scientifico]
        }, {
            year: '2^',
            sections: ['2AS'],
            subjects: [...defaultSubjects, ...fieldSubjects.scientifico]
        }, {
            year: '3^',
            sections: ['3AS'],
            subjects: [...defaultSubjects, ...fieldSubjects.scientifico, 'Filosofia']
        }, {
            year: '4^',
            sections: ['4AS'],
            subjects: [...defaultSubjects, ...fieldSubjects.scientifico, 'Filosofia']
        }, {
            year: '5^',
            sections: ['5AS', '5BS'],
            subjects: [...defaultSubjects, ...fieldSubjects.scientifico, 'Filosofia']
        }],
        'Scienze Applicate': [{
            year: '1^',
            sections: ['1ASA', '1BSA'],
            subjects: [...defaultSubjects, ...fieldSubjects.scienzeApplicate]
        },{
            year: '2^',
            sections: ['2ASA'],
            subjects: [...defaultSubjects, ...fieldSubjects.scienzeApplicate]
        },{
            year: '3^',
            sections: ['3ASA'],
            subjects: [...defaultSubjects, ...fieldSubjects.scienzeApplicate, 'Filosofia']
        },{
            year: '4^',
            sections: ['4ASA'],
            subjects: [...defaultSubjects, ...fieldSubjects.scienzeApplicate, 'Filosofia']
        }, {
            year: '5^',
            sections: ['5ASA'],
            subjects: [...defaultSubjects, ...fieldSubjects.scienzeApplicate, 'Filosofia']
        }],
        'Linguistico': [{
            year: '1^',
            sections: ['1AL', '1BL'],
            subjects: [...defaultSubjects, ...fieldSubjects.linguistico, 'Latino']
        },{
            year: '2^',
            sections: ['2AL', '2BL'],
            subjects: [...defaultSubjects, ...fieldSubjects.linguistico, 'Latino']
        },{
            year: '3^',
            sections: ['3AL', '3BL'],
            subjects: [...defaultSubjects, ...fieldSubjects.linguistico, 'Fisica', 'Arte', 'Filosofia']
        },{
            year: '4^',
            sections: ['4AL', '4BL', '4CL'],
            subjects: [...defaultSubjects, ...fieldSubjects.linguistico, 'Fisica', 'Arte', 'Filosofia']
        }, {
            year: '5^',
            sections: ['5AL', '5BL'],
            subjects: [...defaultSubjects, ...fieldSubjects.linguistico, 'Fisica', 'Arte', 'Filosofia']
        }],
        'Scienze Umane': [{
            year: '1^',
            sections: ['1ASU'],
            subjects: [...defaultSubjects, ...fieldSubjects.scienzeUmane, 'Scienze']
        },{
            year: '2^',
            sections: ['2ASU'],
            subjects: [...defaultSubjects, ...fieldSubjects.scienzeUmane, 'Scienze']
        },],
    }
    field: string
    yearIndex: number
    sectionIndex: number
    className: string
    constructor(className: string) {
        for (let field in Class.classStructure) {
            for (let year of Class.classStructure[field]) {
                let section = year.sections.indexOf(className)
                if (section != -1) {
                    this.field = field
                    this.yearIndex = Class.classStructure[field].indexOf(year)
                    this.sectionIndex = section
                    this.className = className
                    return
                }
            }
        }
        throw new Error('Invalid class name')
    }
}
