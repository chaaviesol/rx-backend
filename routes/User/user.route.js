const express = require('express')
const userRouter =express.Router()
const {userRegistration,listArea,listDoctors,getAddedDoctor,todaysTravelPlan,addSchedule,editSchedule,approveDoctors,
    getDoctorList_forApproval,SubmitAutomaticTp,findUserHeadquaters,EditTravelPlan,userAddedTP,doctorsInTp,addedChemist,resetPassword,checkPassword,
    markVisitedData,approveTp,deleteTp,Performance,userPerformance,rejectTp,visitedCount,addAddress,findTpAddedMonth,getUserAddedTp
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
userRouter.post('/doctorsInTp',doctorsInTp)
userRouter.post('/addedChemist',addedChemist)
userRouter.post('/resetPassword',resetPassword)
userRouter.post('/checkPassword',checkPassword)
// userRouter.post('/addAddress',addAddress)
userRouter.post('/markVisitedData',markVisitedData)
userRouter.post('/approveTp',approveTp)
userRouter.delete('/deleteTp',deleteTp)
userRouter.post('/Performance',Performance)
userRouter.post('/userPerformance',userPerformance)
userRouter.post('/rejectTp',rejectTp)
userRouter.post('/visitedCount',visitedCount)
userRouter.post('/addAddress',addAddress)
userRouter.post('/findTpAddedMonth',findTpAddedMonth)
userRouter.post('/getUserAddedTp',getUserAddedTp)






module.exports = userRouter
