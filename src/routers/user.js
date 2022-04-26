const express = require('express')
const User = require('../models/user')
const { schema, rawListeners } = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendGreetingMessage, senteGoodbyeMessage} = require('../emails/account.js')

const router = new express.Router()


router.post('/user', async (req, res) => {
    const user = new User(req.body)
    const token = await user.createAuthToken()

    try {
        await user.save()
        sendGreetingMessage(user.email, user.name)
        res.status(201).send({user, token})

    }catch(e) {
        res.status(400).send(e)
    }
 
})
 
router.post('/user/login', async (req, res) => {
    try {
    
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.createAuthToken()
        res.send({user, token})

    } catch(e) {
        res.status(400).send() 
    }

})

router.post('/user/logout', auth, async function(req, res) {
    try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
    await req.user.save()
    res.send()
    } catch(e) {
        res.status(500).send()
    }
} )

router.post('/user/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth,  async (req, res) => {
    res.send(req.user)
})


router.patch('/user/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email', 'name', 'age', 'password']
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update))

    if (!isValidUpdate) return res.status(400).send({error: "Unallowed update"})

    try {
    
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
     
    res.send(req.user)
    }catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/user/me', auth,  async (req, res) => {
    try {
        req.user.delete()
        senteGoodbyeMessage(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e) {
        res.status(500).send(e)
    }
}) 

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) return cb(new Error('File must be of picture format'))

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send(error.message)
})


router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id) 

        if (!user || !user.avatar) throw new Error()

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch(e) {
        res.status(404).send()
    }
})

module.exports = router