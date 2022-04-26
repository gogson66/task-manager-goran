const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')


const userScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error('Email is not valid')
        }
    },

    password: {
        type: String,
        trim: true,
        required: true,
        minLength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) throw new Error('Your password can not contain word "password"')
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) throw new Error('Age must be positive number')
        }
    }, 
    avatar: {
        type: Buffer
    },
    tokens: [ {
        token: {
            type: String,
            required: true
        }

        }
    ]
}, {
    timestamps: true,
})

userScheme.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userScheme.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userScheme.methods.createAuthToken =  async function() {
    const user = this

    const token = jwt.sign({'_id': user._id}, process.env.JWT_TOKEN)

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token

}

userScheme.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if (!user) throw new Error('Unable to login')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Unable to login')

    return user
}

userScheme.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) user.password = await bcrypt.hash(user.password, 8)

    next()
})

userScheme.pre('remove', async function(next) {
    const user = this

    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userScheme)

module.exports = User