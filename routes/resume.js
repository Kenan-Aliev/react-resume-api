const {Router} = require('express')
const router = Router()
const Resume = require('../models/resume')
const authMiddleware = require('../middlewares/auth')

router.post('/add', authMiddleware, async (req, res) => {
    try {
        const newResume = new Resume({
            ...req.body,
            email: req.user.email,
            userId: req.user.id
        })
        await newResume.save()
        return res.status(200).json({message: "Вы успешно создали резюме"})
    } catch (error) {
        return res.status(500).json({message: "Что-то пошло не так", error})
    }
})

router.get('/getUsersResumes', authMiddleware, async (req, res) => {
    try {
        const resumes = await Resume.find({userId: req.user.id})
        return res.status(200).json({
            resumes,
            resumesCount: resumes.length
        })
    } catch (error) {
        return res.status(500).json({message: "Что-то пошло не так", error})
    }
})

router.get('/getAll', async (req, res) => {
    try {
        const {limit, page} = req.query
        const offset = +limit * +page - +limit
        const resumes = await Resume.find({}).skip(offset).limit(+limit)
        return res.status(200).json({
            resumes,
            resumesCount: await Resume.find({}).countDocuments()
        })
    } catch (error) {
        return res.status(500).json({message: "Что-то пошло не так", error})
    }
})

module.exports = router