const mongoose= require('mongoose')
const express = require('express')


const taskSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, ref: 'userModel'
    },
    username: String,
    taskname:String,
    status:String
})

module.exports =mongoose.model('taskModel',taskSchema)
