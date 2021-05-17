const {Schema, model, ObjectId} = require('mongoose')

const resumeSchema = new Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    patronymic: {type: String, required: true},
    birthday: {type: Date, required: true},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    github: {type: String, required: true},
    city: {type: String, required: true},
    sphere: {type: String, required: true},
    wished_salary: {type: Number, required: true},
    busyness: {type: String, required: true},
    userId: {type: ObjectId, ref: 'users'},
    work_exp: {
        from: {type: Date},
        to: {type: Date},
        sphere: {type: String},
        organization: {type: String},
        responsibilities: {type: String}
    },
    courses: {
        profession: {type: String},
        education_institution: {type: String},
        year_of_ending: {type: Number},
        duration: {type: String},
    },
    foreign_languages: {
        language_and_level: [
            {
                language: {type: String},
                level: {type: String}
            }
        ]
    }
})

module.exports = model('resumes', resumeSchema)