const express = require('express')
const managerRouter =express.Router()

const{register_manager,get_Replist,leave_request,accept_leaveRequest,getApplide_leaveReuest,edit_doctor,list_manager,list_expenseRequest,
    change_reportStatus,search_Rep_Dr,editRep,markVisit
}=require('./manager.controller')



managerRouter.post('/managerRegister',register_manager)
managerRouter.post('/get_Replist',get_Replist)
managerRouter.post('/leaveRequest',leave_request) //for both rep and manager
managerRouter.post('/acceptLeave',accept_leaveRequest)
managerRouter.post('/getLeaveRequest',getApplide_leaveReuest)
managerRouter.post('/editDoctor',edit_doctor)
managerRouter.get('/list_manager',list_manager)
managerRouter.post('/list_expenseRequest',list_expenseRequest)
managerRouter.post('/change_reportStatus',change_reportStatus)
managerRouter.post('/search',search_Rep_Dr)
managerRouter.post('/editRep',editRep)
managerRouter.post('/markVisit',markVisit)























module.exports=managerRouter