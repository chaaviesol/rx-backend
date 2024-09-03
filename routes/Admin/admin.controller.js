const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


//getting complete manager details
const getUserDetails = async(req,res)=>{
    try{
       
        const getManagerData = await prisma.manager_details.findMany({
            select:{
                id:true,
                name:true,
                unique_id:true
            }
        })
        console.log({getManagerData})
        const getRepData = await prisma.rep_details.findMany({
            select:{
                id:true,
                name:true,
                unique_id:true
            }
        })
        console.log({getRepData})
        const data = [...getManagerData ,...getRepData]

        res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            data:data
        })
    }catch(err){
        console.log("err----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })

    }
}

//get leave request by manager
const getLeaveRequest = async(req,res)=>{
    try{
        
        const leaveRequest = await prisma.leave_table.findMany({
            where:{
                
                status:"Pending"
            }
        })
        console.log({leaveRequest})
        const userData = []
        for(let i=0; i<leaveRequest.length;i++){
            const leave_request = leaveRequest[i]
            
            const requesterId = leaveRequest[i]?.uniqueRequester_Id
            console.log({requesterId})
            let data = []

            if(requesterId.startsWith('Mngr')){
            data = await prisma.manager_details.findMany({
                where:{
                    unique_id:requesterId
                },
                select:{
                    name:true
                }
            })
            console.log({data})

        }else{
            data = await prisma.rep_details.findMany({
                where:{
                    unique_id:requesterId
                },
                select:{
                    name:true
                }
            }) 
            console.log({data})
        }
        
        userData.push({
                leaveRequest: leave_request,
                userdetails: data[0]
              });
        }
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:userData,
            
        })
    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//getting leaveRequest applied by Rep
const repLeaveRequest = async(req,res)=>{
    try{
        
        const leaveRequest = await prisma.leave_table.findMany({
            where:{
                uniqueRequester_Id:{
                    startsWith:"Rep"
                },
                
            }
        })
        console.log({leaveRequest})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:leaveRequest
        })
    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//accept/reject leave request
const acceptLeaveRequest = async(req,res)=>{
    try{
        const{leaveRequestId,status,leaveType,uniqueRequesterId,approved_by} = req.body
        const date = new Date()
          const leaveRequset = await prisma.leave_table.update({
            where:{
                id:leaveRequestId,
                type:leaveType,
                uniqueRequester_Id:uniqueRequesterId
            },
            data:{
                status:status,
                approved_by:approved_by,
                approved_date:date
            }
          })
          console.log({leaveRequset})
          res.status(200).json({
            error:false,
            success:true,
            message:`successfully ${status} the leave request`,
            data:leaveRequset
          })
    }catch(err){
       res.status(404).json({
        error:true,
        success:false,
        message:"internal server error"
       })
    }
}

//expense list
const getExpenseRequest = async(req,res)=>{
    try{
        
        const expenseRequest = await prisma.expense_report.findMany({
            where:{
                
                status:"Pending"
            }
        })
        console.log({expenseRequest})
        const userData = []
        for(let i=0; i<expenseRequest.length;i++){
            const expense_request = expenseRequest[i]
            
            const requesterId = expenseRequest[i]?.uniqueRequesterId
            console.log({requesterId})
            let data = []

            if(requesterId.startsWith('Mngr')){
            data = await prisma.manager_details.findMany({
                where:{
                    unique_id:requesterId
                },
                select:{
                    name:true
                }
            })
            console.log({data})

        }else{
            data = await prisma.rep_details.findMany({
                where:{
                    unique_id:requesterId
                },
                select:{
                    name:true
                }
            }) 
            console.log({data})
        }
        
        userData.push({
                expenseRequest: expense_request,
                userdetails: data[0]
              });
        }
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:userData,
            
        })
    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//accept/reject expense request
const acceptExpenseRequest = async(req,res)=>{
    try{
        const{expenseRequestId,status,tripDate,uniqueRequesterId,approved_by} = req.body
        const date = new Date()
          const expenseRequest = await prisma.expense_report.update({
            where:{
                id:expenseRequestId,
                trip_date:tripDate,
                uniqueRequesterId:uniqueRequesterId
            },
            data:{
                status:status,
                approved_by:approved_by,
                approved_date:date
            }
          })
          console.log({expenseRequest})
          res.status(200).json({
            error:false,
            success:true,
            message:`successfully ${status} the expense request`,
            data:expenseRequest
          })
    }catch(err){
        console.log({err})
       res.status(404).json({
        error:true,
        success:false,
        message:"internal server error"
       })
    }
}

//for accepting multiple leave request
const multipleLeave_approval = async (req, res) => {
   
    try {
        const requestData = req.body
         console.log({requestData})
         const approvedData =[]
        for (let i = 0; i < requestData.length; i++) {
          

            const { leaveRequestId,status,uniqueRequesterId,approved_by,leaveType } = requestData[i]
            const currentDate = new Date();


            // const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;


            // const istDate = new Date(currentDate.getTime() + istOffset);

            const approval_data = await prisma.leave_table.updateMany({
                where: {
                    id: leaveRequestId,
                    uniqueRequester_Id:uniqueRequesterId,
                    type:leaveType
                },
                data: {
                    
                    status: status,
                    approved_by:approved_by,
                    approved_date:currentDate
                },

            })

            console.log({approval_data})
            
            approvedData.push(approval_data)
       }
       res.status(200).json({
        error:true,
        success:false,
        message:'Successfull',
        data:approvedData
    })
    } catch (err) {
        console.log("error------", err)
        res.status(400).json({
            error: true,
            success: false,
            message: "internal server error"
        })

    }
}

//for accepting multiple leave request
const multipleExpense_approval = async (req, res) => {
   
    try {
        const requestData = req.body
         console.log({requestData})
         const approvedData =[]
        for (let i = 0; i < requestData.length; i++) {
          

            const { expenseRequestId,status,tripDate,uniqueRequesterId,approved_by} = requestData[i]
            const currentDate = new Date();


            // const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;


            // const istDate = new Date(currentDate.getTime() + istOffset);

            const approval_data = await prisma.expense_report.updateMany({
                where: {
                id:expenseRequestId,
                trip_date:tripDate,
                uniqueRequesterId:uniqueRequesterId
                },
                data: {
                status:status,
                approved_by:approved_by,
                approved_date:currentDate
                },

            })

            console.log({approval_data})
            
            approvedData.push(approval_data)
       }
       res.status(200).json({
        error:false,
        success:true,
        message:'Successfull',
        data:approvedData
    })
    } catch (err) {
        console.log("error------", err)
        res.status(400).json({
            error: true,
            success: false,
            message: "internal server error"
        })

    }
}

//get complete doctors 
const doctorList = async(req,res)=>{
    try{
        const get_doctor = await prisma.doctor_details.findMany({
           
            select:{
                id:true,
                doc_name:true,
                // status:true
            },
            where:{
                status:"active"
            }
        })
        console.log({get_doctor})
        res.status(200).json({
            error:false,
            success:true,
            message:'Successfull',
            data:get_doctor
        })

    }catch(err){
        console.log({err})
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//get visit report
const getVisitReport = async(req,res)=>{
    try{
        const visitReport = await prisma.reporting_details.findMany({
           orderBy:{
            datetime:"desc"
           }
        })
       console.log({visitReport})
       const data =[]
       
       for (let i=0; i<visitReport.length ; i++){
        const doctorId = visitReport[i].doctor_id
        const requesterId = visitReport[i].unique_reqId
        console.log({requesterId})
       const doctorDetails = await prisma.doctor_details.findMany({
                where:{
                    id:doctorId
                },
                select:{
                    id:true,
                    doc_name:true
                }
            })
            console.log({doctorDetails})
            let requesterData
            if(requesterId.startsWith('Rep')){
                requesterData = await prisma.rep_details.findMany({
                    where:{
                        unique_id:requesterId
                    },
                    select:{
                        id:true,
                        name:true,
                        unique_id:true
                    }
                })
            }else{
                requesterData = await prisma.manager_details.findMany({
                    where:{
                        unique_id:requesterId
                    },
                    select:{
                        id:true,
                        name:true,
                        unique_id:true
                    }
                })
            }

           
            data.push({
                ...visitReport[i],
                doctorDetails: doctorDetails[0],
                requesterDetails: requesterData[0]
            });
            
       }
       res.status(200).json({
        error:false,
        success:true,
        message:"Successfull",
        data:data
       })
    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}




module.exports = {getUserDetails,getLeaveRequest,repLeaveRequest,acceptLeaveRequest,getExpenseRequest,acceptExpenseRequest,multipleLeave_approval,
    multipleExpense_approval,doctorList,getVisitReport}