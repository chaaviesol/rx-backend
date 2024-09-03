const express = require('express')
const userRouter =express.Router()
const {userRegistration,listArea,listDoctors,getAddedDoctor,todaysTravelPlan,addSchedule,editSchedule,approveDoctors,
    getDoctorList_forApproval,SubmitAutomaticTp,findUserHeadquaters,EditTravelPlan,userAddedTP
} = require('./user.controller')




userRouter.post('/userRegistration',userRegistration)
userRouter.post('/listArea',listArea)
userRouter.post('/listDoctors',listDoctors)
userRouter.post('/getAddedDoctor',getAddedDoctor)
userRouter.post('/todaysTravelPlan',todaysTravelPlan)
userRouter.post('/addSchedule',addSchedule)
userRouter.post('/editSchedule',editSchedule)
userRouter.post('/approveDoctors',approveDoctors)
userRouter.post('/doctorForApproval',getDoctorList_forApproval)
userRouter.post('/SubmitAutomaticTp',SubmitAutomaticTp)
userRouter.post('/findUserHeadquaters',findUserHeadquaters)
userRouter.post('/EditTravelPlan',EditTravelPlan)
userRouter.post('/userAddedTP',userAddedTP)
// userRouter.post('/addAddress',addAddress)








module.exports = userRouter
