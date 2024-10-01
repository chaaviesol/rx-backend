const express = require('express')
const repRouter =express.Router()

const {rep_registration,login,add_doctor,get_addedDoctors,leaveHistory,single_Details,delete_doctor,filter_dr,get_doctorDetail,delete_rep,report_expense,
    individual_expenseReport,add_drAddress,total_repCount,total_drCount,search_Rep,add_chemist,get_chemist,delete_chemist,search_chemist,
    edit_chemist,add_product,delete_product,editProduct,get_product,get_headquarters,notifications,searchByDate,search_expenseTable,
    markAsVisited,getVisitReport,singleChemistDetail,visitedDays,getSpecialization,getVisitedDates,getDoctorAddress,checkLocation,visitedDetailsByMonth,createTravelplan,
    getTravelPlan,changeStatus,cancelTP,markAsVisitedForTp,getSubheadquaters} = require('./rep.controller')


repRouter.post('/repRegistration',rep_registration)
repRouter.post('/login',login)
repRouter.post('/add_dr',add_doctor)
repRouter.post('/getDr',get_addedDoctors)
repRouter.post('/leaveHistory',leaveHistory)
repRouter.post('/singleDetails',single_Details)
repRouter.post('/delete_doctor',delete_doctor)
repRouter.post('/filter_dr',filter_dr)
repRouter.post('/doctorDetail',get_doctorDetail)
repRouter.post('/delete_rep',delete_rep)
repRouter.post('/report_expense',report_expense)
repRouter.post('/repExpense_list',individual_expenseReport)
repRouter.post('/adding_drAddress',add_drAddress)
repRouter.post('/totalRep',total_repCount)
repRouter.post('/totalDr',total_drCount)
repRouter.post('/search_Rep',search_Rep)
repRouter.post('/add_chemist',add_chemist)
repRouter.post('/get_chemist',get_chemist)
repRouter.post('/delete_chemist',delete_chemist)
repRouter.post('/search_chemist',search_chemist)
repRouter.post('/edit_chemist',edit_chemist)
repRouter.post('/add_product',add_product)
repRouter.post('/delete_product',delete_product)
repRouter.get('/get_product',get_product)
// repRouter.post('/travel_plan',travel_plan)
repRouter.get('/get_headquarters',get_headquarters)
// repRouter.post('/get_travelPlan',get_travelPlan)
repRouter.post('/notifications',notifications)
repRouter.post('/searchByDate',searchByDate)
repRouter.post('/search_expenseTable',search_expenseTable)
repRouter.post('/editProduct',editProduct)
repRouter.post('/markAsVisited',markAsVisited)
repRouter.get('/getVisitReport',getVisitReport)
repRouter.post('/singleChemistDetail',singleChemistDetail)
repRouter.post('/visitedDays',visitedDays)
repRouter.get('/getSpecialization',getSpecialization)
repRouter.post('/getVisitedDates',getVisitedDates)
repRouter.post('/getDoctorAddress',getDoctorAddress)
repRouter.post('/checkLocation',checkLocation)
repRouter.post('/visitedDetailsByMonth',visitedDetailsByMonth)
repRouter.post('/createTravelplan',createTravelplan)
repRouter.post('/getTravelPlan',getTravelPlan)
repRouter.post('/changeStatus',changeStatus)
repRouter.post('/cancelTP',cancelTP)
repRouter.post('/markAsVisitedForTp',markAsVisitedForTp)    
repRouter.post('/getSubheadquaters',getSubheadquaters)



module.exports = repRouter