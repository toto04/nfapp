interface ClassStructure {
    [key: string]: { year: string, sections: string[], subjects: string[] }[]
}

let defaultSubjects = ['Italiano', 'Matematica', 'Inglese', 'Ginnastica', 'Storia']
let fieldSubjects = {
    scientifico: ['Latino', 'Fisica', 'Arte', 'Scienze'],
    scienzeApplicate: ['Fisica', 'Informatica', 'Arte', 'Scienze'],
    linguistico: ['Francese', 'Tedesco', 'Scienze'],
    scienzeUmane: ['Diritto - Economia', 'Scienze Umane'],
    artistico: ['Scienze', 'Storia dell\'Arte'],
    artisticoTriennio: ['Filosofia', 'Fisica']
}

export class Class {
    static classStructure: ClassStructure = {
        'Scientifico': [{
            year: '1^',
            sections: ['1AS'],
            subjects: [...defaultSubjects, ...fieldSubjects.scientifico].sort()
        }, {
            year: '2^',
            sections: ['2AS'],
            subjects: [...defaultSubjects, ...fieldSubjects.scientifico].sort()
        }, {
            year: '3^',
            sections: ['3AS'],
            subjects: [...defaultSubjects, ...fieldSubjects.scientifico, 'Filosofia'].sort()
        }, {
            year: '4^',
            sections: ['4AS'],
            subjects: [...defaultSubjects, ...fieldSubjects.scientifico, 'Filosofia'].sort()
        }, {
            year: '5^',
            sections: ['5AS', '5BS'],
            subjects: [...defaultSubjects, ...fieldSubjects.scientifico, 'Filosofia'].sort()
        }],
        'Scienze Applicate': [{
            year: '1^',
            sections: ['1ASA', '1BSA'],
            subjects: [...defaultSubjects, ...fieldSubjects.scienzeApplicate].sort()
        }, {
            year: '2^',
            sections: ['2ASA'],
            subjects: [...defaultSubjects, ...fieldSubjects.scienzeApplicate].sort()
        }, {
            year: '3^',
            sections: ['3ASA'],
            subjects: [...defaultSubjects, ...fieldSubjects.scienzeApplicate, 'Filosofia'].sort()
        }, {
            year: '4^',
            sections: ['4ASA'],
            subjects: [...defaultSubjects, ...fieldSubjects.scienzeApplicate, 'Filosofia'].sort()
        }, {
            year: '5^',
            sections: ['5ASA'],
            subjects: [...defaultSubjects, ...fieldSubjects.scienzeApplicate, 'Filosofia'].sort()
        }],
        'Linguistico': [{
            year: '1^',
            sections: ['1AL', '1BL'],
            subjects: [...defaultSubjects, ...fieldSubjects.linguistico, 'Latino'].sort()
        }, {
            year: '2^',
            sections: ['2AL', '2BL'],
            subjects: [...defaultSubjects, ...fieldSubjects.linguistico, 'Latino'].sort()
        }, {
            year: '3^',
            sections: ['3AL', '3BL'],
            subjects: [...defaultSubjects, ...fieldSubjects.linguistico, 'Fisica', 'Arte', 'Filosofia'].sort()
        }, {
            year: '4^',
            sections: ['4AL', '4BL', '4CL'],
            subjects: [...defaultSubjects, ...fieldSubjects.linguistico, 'Fisica', 'Arte', 'Filosofia'].sort()
        }, {
            year: '5^',
            sections: ['5AL', '5BL'],
            subjects: [...defaultSubjects, ...fieldSubjects.linguistico, 'Fisica', 'Arte', 'Filosofia'].sort()
        }],
        'Scienze Umane': [{
            year: '1^',
            sections: ['1ASU'],
            subjects: [...defaultSubjects, ...fieldSubjects.scienzeUmane, 'Scienze'].sort()
        }, {
            year: '2^',
            sections: ['2ASU'],
            subjects: [...defaultSubjects, ...fieldSubjects.scienzeUmane, 'Scienze'].sort()
        },],
        'Biennio Artistico': [{
            year: '1^',
            sections: ['1A', '1B', '1C'],
            subjects: [...defaultSubjects, ...fieldSubjects.artistico, 'Discipline Grafiche e Pittoriche', 'Discipline Geometriche', 'Discipline Plastiche e Scultoree'].sort()
        }, {
            year: '2^',
            sections: ['2A', '2B', '2C'],
            subjects: [...defaultSubjects, ...fieldSubjects.artistico, 'Discipline Grafiche e Pittoriche', 'Discipline Geometriche', 'Discipline Plastiche e Scultoree'].sort()
        }],
        'Architettura': [{
            year: '3^',
            sections: ['3AA'],
            subjects: [...defaultSubjects, ...fieldSubjects.artistico, ...fieldSubjects.artisticoTriennio, 'Discipline Progettuali'].sort()
        }, {
            year: '4^',
            sections: ['4AA'],
            subjects: [...defaultSubjects, ...fieldSubjects.artistico, ...fieldSubjects.artisticoTriennio, 'Discipline Progettuali'].sort()
        }, {
            year: '5^',
            sections: ['5AA'],
            subjects: [...defaultSubjects, ...fieldSubjects.artistico, ...fieldSubjects.artisticoTriennio, 'Discipline Progettuali'].sort()
        }],
        'Arti Figurative': [{
            year: '3^',
            sections: ['3AF'],
            subjects: [...defaultSubjects, ...fieldSubjects.artistico, ...fieldSubjects.artisticoTriennio, 'Discipline Plastiche/Pittoriche'].sort()
        }, {
            year: '4^',
            sections: ['4AF'],
            subjects: [...defaultSubjects, ...fieldSubjects.artistico, ...fieldSubjects.artisticoTriennio, 'Discipline Plastiche/Pittoriche'].sort()
        }, {
            year: '5^',
            sections: ['5AF'],
            subjects: [...defaultSubjects, ...fieldSubjects.artistico, ...fieldSubjects.artisticoTriennio, 'Discipline Plastiche/Pittoriche'].sort()
        }],
        'Grafica': [{
            year: '3^',
            sections: ['3AG'],
            subjects: [...defaultSubjects, ...fieldSubjects.artistico, ...fieldSubjects.artisticoTriennio, 'Discipline Grafiche'].sort()
        }, {
            year: '4^',
            sections: ['4AG'],
            subjects: [...defaultSubjects, ...fieldSubjects.artistico, ...fieldSubjects.artisticoTriennio, 'Discipline Grafiche'].sort()
        }, {
            year: '5^',
            sections: ['5AG'],
            subjects: [...defaultSubjects, ...fieldSubjects.artistico, ...fieldSubjects.artisticoTriennio, 'Discipline Grafiche'].sort()
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
