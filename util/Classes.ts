interface ClassStructure {
    [key: string]: { year: string, sections: string[], subjects: string[] }[]
}

export class Class {
    static classStructure: ClassStructure = {
        'Scientifico': [{
            year: '1^',
            sections: ['1AS'],
            subjects: ['Matematica', 'Italiano']
        }, {
            year: '2^',
            sections: ['2AS'],
            subjects: ['Matematica', 'Italiano']
        }],
        'Scienze Applicate': [{
            year: '1^',
            sections: ['1ASA', '1BSA'],
            subjects: ['Matematica', 'Italiano']
        }, {
            year: '5^',
            sections: ['5ASA'],
            subjects: ['Matematica', 'Italiano', 'Scienze']
        }]
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
