const express = require('express')
const adminRouter =express.Router()

const { getUserDetails,getLeaveRequest,repLeaveRequest,acceptLeaveRequest,getExpenseRequest,acceptExpenseRequest,multipleLeave_approval,multipleExpense_approval,doctorList
  ,getVisitReport  
} = require('./admin.controller')


adminRouter.get('/userDetails',getUserDetails)
adminRouter.get('/getLeaveRequest',getLeaveRequest)
// adminRouter.post('/searchByName',searchByName)
// adminRouter.get('/getRep',getRep)
adminRouter.get('/repLeaveRequest',repLeaveRequest)
adminRouter.post('/LeaveRequest',acceptLeaveRequest) //accept or reject leave request
adminRouter.get('/getExpenseRequest',getExpenseRequest)
adminRouter.post('/acceptExpenseRequest',acceptExpenseRequest) //accept or reject expense request
adminRouter.post('/multipleLeave_approval',multipleLeave_approval)
adminRouter.post('/multipleExpense_approval',multipleExpense_approval)
adminRouter.get('/doctorList',doctorList)
adminRouter.get('/getVisitReport',getVisitReport)




module.exports = adminRouter