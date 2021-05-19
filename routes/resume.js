const {Router} = require('express')
const router = Router()
const Resume = require('../models/resume')
const authMiddleware = require('../middlewares/auth')

router.post('/add', authMiddleware, async (req, res) => {
    try {
        const newResume = new Resume({
            ...req.body,
            email: req.user.email,
            userId: req.user._id
        })
        await newResume.save()
    } catch (error) {
        console.log(error)
    }
})

router.get('/getUsersResumes', authMiddleware, async (req, res) => {
    try {
        const resumes = await Resume.find({userId: req.user.id})
        return res.status(200).json({
            resumes
        })
    } catch (e) {
        console.log(e)
    }
})

module.exports = router