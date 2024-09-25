const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


function formatnewDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }


//manager registration(not in use)
const register_manager = async(req,res)=>{
    try{
        const{name,dob,gender,qualification,designation,nationality,email,mobile,address,city,pincode,type,password} = req.body
        const date = new Date()
        // const alphabets = "abcdefghijklmnopqrstuvwxyz"
        const numbers = '0123456789'
        let code = ''
        const prefix = "Mngr"
      
        const codeArray = [];
        
        // for (let i = 0; i < 4; i++) {
        //     codeArray.push(alphabets.charAt(Math.floor(Math.random() * alphabets.length)));
        // }
        
        for (let i = 0; i < 4; i++) {
            codeArray.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
        }

      
        // for (let i = codeArray.length - 1; i > 0; i--) {
        //     const j = Math.floor(Math.random() * (i + 1));
        //     [codeArray[i], codeArray[j]] = [codeArray[j], codeArray[i]];
        // }
        const randomNumbers = codeArray.join('');
       
       code = `${prefix}${randomNumbers}`;
        console.log({code})
        const registration = await prisma.manager_details.create({
            data:{
                name:name,
                dob:dob,
                gender:gender,
                qualification:qualification,
                designation:designation,
                nationality:nationality,
                email:email,
                mobile:mobile,
                address:address,
                city:city,
                pincode:parseInt(pincode),
                created_date:date,
                type:type,
                unique_id:code,
                password:password
            }
        })
        console.log({registration})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:registration
        })

    }catch(err){
        console.log("error-----",err)
        res.status(404).json({
            error:true,
            success:true,
            message:"Internal server error"
        })
    }
}

//get employee(rep)list  (in use)
const get_Replist = async(req,res)=>{
    try{
        const {manager_id} = req.body
        if(!manager_id){
            return res.status(404).json({
                error:true,
                success:false,
                message:"Manager ID is required"
            })
        }
        const getRep = await prisma.userData.findMany({
            where:{
              createdBy:manager_id,
              status:"Active"
            }
        })
        console.log({getRep})
        if(getRep.length===0){
            return res.status(404).json({
                error:true,
                success:false,
                message:"NO DATA FOUND"
            })
        }
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:getRep
        })
  
    }catch(err){
        console.log("error---",err)
        res.status(400).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}

//leave request (in use)
const leave_request = async(req,res)=>{
    console.log({req})
    try{
        const {requester_uniqueId,reason,to_date,from_date,type,requester_id} = req.body
         const date = new Date()
        if(requester_uniqueId && reason && to_date &&from_date &&type &&requester_id){
        //   const applyLeave = await prisma.leave_table.create({
        //     data:{
        //         requester_id:requester_id,
        //         remark:reason,
        //         to_date:to_date,
        //         from_date:from_date,
        //         status:"pending",
        //         created_date:date,
        //         type:type,
        //         uniqueRequester_Id:requester_uniqueId

        //     }
        //  })
        //  console.log({applyLeave})
        
         const find_repData = await prisma.userData.findMany({
            where:{
               uniqueId:requester_uniqueId
            }
         })
          console.log({find_repData})
          const managerId = find_repData[0]?.reportingOfficer_id
          console.log({managerId})
          //add mangerId in the table leave_table
         
          const applyLeave = await prisma.leave_table.create({
            data:{
                requester_id:requester_id,
                remark:reason,
                to_date:to_date,
                from_date:from_date,
                status:"Pending",
                created_date:date,
                type:type,
                uniqueRequester_Id:requester_uniqueId,
                manager_uniqueId:managerId
            }
         })
         console.log({applyLeave})
            res.status(200).json({
            error:false,
            success:true,
            message:"Successfully applied the Leave",
            data:applyLeave
         })
        }else{
            return res.status(404).json({
                error:true,
                success:false,
                message:"Some fields are missing"
            })
        }
    }catch(err){
        console.log("error-----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}



//accepting the leave request of rep (in use)
const accept_leaveRequest = async(req,res)=>{
    const{leave_tableId,rep_id,modified_by,status,leave_type} = req.body
    const date =new Date()
    try{
        const leaveAccepting = await prisma.leave_table.update({
            where:{
                id:leave_tableId,
                requester_id:rep_id,
             },
             data:{
                approved_by:modified_by,
                approved_date:date,
                status:status,
                type:leave_type
             }
        })
      
        res.status(200).json({
            error:false,
            success:true,
            message:`Successfully ${status.toLowerCase()} the request`,
            data:leaveAccepting
        })

    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}

//for getting the applied leaveRequest by rep (in use)
const getApplide_leaveReuest = async(req,res)=>{
    console.log({req})
    try{
        const {reportingOfficer_id} = req.body
                // Ensure managerId is defined and valid
                if (!reportingOfficer_id) {
                    return res.status(400).json({
                        error: true,
                        success: false,
                        message: "Manager ID is required"
                    });
                }
        const get_requestedRep = await prisma.leave_table.findMany({
            where:{
                // uniqueRequester_Id:{
                //     startsWith:"Rep"
                // },
                // status:"pending",
                manager_uniqueId:reportingOfficer_id

            },
            orderBy:{
                created_date:"desc"
            }
        })


        console.log({get_requestedRep})
        const leaveRequestWithRepdetail = []
        for(let i=0 ; i<get_requestedRep.length ; i++){
            console.log("jjjjj")
            const leaveRequest=get_requestedRep[i]
            console.log({leaveRequest})
            
            const findRepdata = await prisma.userData.findMany({
                where:{
                    uniqueId:leaveRequest?.uniqueRequester_Id
                }
            })
            console.log({findRepdata})
            leaveRequestWithRepdetail.push({
                ...leaveRequest,
                repDetails: findRepdata
            });
        }
       
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:leaveRequestWithRepdetail
        })

    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}

//editing the doctor details (rep/manager)
const edit_doctor = async(req,res)=>{
    // console.log("request----")
    // console.log("reqffffuest----",req)
    try{
        const {created_UserId,dr_id,dr_name,qualification,gender,specialization,mobile,visits,dob,wedding_date,
            products,chemist,addressId,address
        } = req.body
        const date = new Date()
        const edit_data = await prisma.doctor_details.update({
            where:{
                created_UId:created_UserId,
                id:dr_id
            },
            data:{
              doc_name:dr_name,
              doc_qualification:qualification,
              gender:gender,
              specialization:specialization,
              mobile:mobile,
              no_of_visits:visits,
              date_of_birth:dob,
              wedding_date:wedding_date,
              products:products,
              chemist:chemist,
              modified_date:date,
              modified_by:created_UserId
            }
        })
         console.log({edit_data})
         const editAddress = await prisma.doctor_address.update({
            where:{
                id:addressId
            },
            data:{
              address:address
            }
         })
         console.log({editAddress})
         res.status(200).json({
            error:true,
            success:false,
            message:"Successfully edited",
            data:edit_data
         })
    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}

//list all managers (in use)
const list_manager = async(req,res)=>{
    try{
       
        const list_manager = await prisma.userData.findMany({
            where:{
               role:"Manager"
            }
        })
        res.status(200).json({
            error:true,
            success:false,
            message:"Successfull",
            data:list_manager
        })
    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}
 
//list expense report (in use)
const list_expenseRequest = async(req,res)=>{
    try{
        const{reporting_officerId} = req.body
        const list_report = await prisma.expense_report.findMany({
            where:{
                reporting_officer:reporting_officerId,
                // status:"Pending"
            }
        })
         console.log({list_report})
         const userDetails = []
        
         for(let i=0 ; i<list_report.length; i++){
            const ExpenseReport = list_report[i]
            const dr_id = list_report[i].doct_id
          const userId = ExpenseReport.uniqueRequesterId
          console.log({userId})
          const find_userDetails = await prisma.userData.findMany({
            where:{
               uniqueId:userId 
            },
            select:{
                id:true,
                name:true
            }
          })
          //for finding the doctor details
          const findDoctorDetails = await prisma.doctor_details.findMany({
            where:{
                id:dr_id
            },
            select:{
                id:true,
                firstName:true,
                lastName:true
            }
          })
          console.log({find_userDetails})
          userDetails.push({
            ...ExpenseReport,
            userDetails:find_userDetails,
            doctorDetails:findDoctorDetails
          })
         }
         res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:userDetails
         })
    }catch(err){
        console.log("error-----",err)
        res.status(400).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}

//accept or reject pending request (in use)
const change_reportStatus = async(req,res)=>{
    try{
        const {report_id,status,approved_by} = req.body
        const date = new Date
        const updateStatus = await prisma.expense_report.update({
            where:{
                id:report_id,
            },
            data:{
                status:status,
                approved_by:approved_by,
                approved_date:date
            }
        })
        console.log({updateStatus})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:updateStatus
        })
    }catch(err){
     console.log("error----",err)
     res.status(404).json({
        error:true,
        success:false,
        message:"Internal server error"
     })
    }
}
// searching both dr and rep  (in use)
const search_Rep_Dr = async(req,res)=>{
    try{
        const {searchData} = req.body
        const find_fromDr = await prisma.doctor_details.findMany({
            where:{
                firstName:{
                    startsWith:`Dr.${searchData}`,
                    mode:'insensitive'
                }
            }
        })
        const find_fromRep = await prisma.userData.findMany({
            where:{
                name:{
                    startsWith:searchData,
                    mode:'insensitive'
                },
                role:"Rep"
            }
        })
     const resultarray = []
     resultarray.push({
        doctor_result:find_fromDr,
        rep_result:find_fromRep
     })
     res.status(200).json({
        error:false,
        success:true,
        message:"Successfull",
        data:resultarray
     })
    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}

//edit rep
const editRep = async(req,res)=>{
    console.log({req})
    try{
        const{repId,name, gender, dob, nationality, mobile, email, designation, qualification, reportingOfficer, address, password,headquarters,modified_by,reportingType,role }=req.body
        const date = new Date()
        const editedData = await prisma.userData.update({
            where:{
                id:repId,
            },
            data:{
                
                name:name,
                gender:gender,
                mobile:mobile,
                date_of_birth:dob,
                nationality:nationality,
                email:email,
                designation:designation,
                qualification:qualification,
                reportingOfficer_id:reportingOfficer,
                address:address,
                role:role,
                password:password,
                headquaters:headquarters,
                modified_by:modified_by,
                modified_date:date,
                reporting_type:reportingType
            }
        })
        console.log({editedData})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfully edited the data",
            data:editedData
        })

    }catch(err){
        console.log({err})
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}

//markasvisited (in use)
const markVisit = async(req,res)=>{
    try{
        const{reporterUniqueId,reporterId,date,time,products,remark,doctorId} = req.body
        const visiteddate = new Date()
        const formatteddate = formatnewDate(visiteddate);
        // console.log({formatteddate})
        const currentDate = new Date()
        // console.log({currentDate})

        const reportVisit = await prisma.reporting_details.create({
            data:{
                unique_reqId:reporterUniqueId,
                date:date,
                time:time,
                products:products,  
                remarks:remark,
                rep_id:reporterId,
                doctor_id:doctorId,
                datetime:currentDate,
                visited_date:formatteddate
            }
        })
        // console.log({reportVisit})
        const reportId = reportVisit.id
        let updateReportingType ;
        console.log({reportId})
        if(date && time){
             updateReportingType = await prisma.reporting_details.update({
                where:{
                    id:reportId
                },
                data:{
                    reporting_type:"Offline Reporting"
                }
             })
        }else{
            updateReportingType = await prisma.reporting_details.update({
                where:{
                    id:reportId
                },
                data:{
                    reporting_type:"Spot Reporting"
                }
            })
        }
        console.log({updateReportingType})

        const reportedDate = updateReportingType.visited_date
        // console.log({reportedDate})

        const requesterId = updateReportingType.rep_id
        // console.log({requesterId})

        const drId = updateReportingType.doctor_id
        // console.log({drId})

        const unique_reqId = updateReportingType.unique_reqId
        // console.log({unique_reqId})

        // get the existing detail of currentmonth
        const [day,month,year] = formatteddate.split('-')
        const findCurrentMonth = new Date(`${year}-${month}-${day}`);
        const CurrentMonth = findCurrentMonth.getMonth() + 1
        console.log({CurrentMonth})

        //count the number of reports in the reporting table
        const findReportCount = await prisma.reporting_details.count({
            where:{
                unique_reqId:reporterUniqueId,
                doctor_id:doctorId,
                AND:[
                    {
                        visited_date: {
                            contains: `-${String(CurrentMonth).padStart(2, '0')}-`
                        }
                    }
                ]
            }
        })
        console.log({findReportCount})

        //find the row to update the data
        const findUpdatingRow = await prisma.visit_record.findMany({
            where:{
                requesterUniqueId:reporterUniqueId,
                dr_Id:doctorId
            }
        })
        console.log({findUpdatingRow})
        
        //find the id of the row which should be updated
        const updatingRowId = findUpdatingRow[0].id
        // console.log({updatingRowId})

        //no of visits
        const numOfVisits = findUpdatingRow[0].total_visits
        // console.log({numOfVisits})

        //need to calculate the no of balance visits
        const balanceVisits = numOfVisits - findReportCount
        // console.log({balanceVisits})
        if(balanceVisits < 0){
            return res.status(404).json({
                error:true,
                success:false,
                message:"No more balance visit found"
            })
        }else{
        
        //update the visited count and balance visit in the visit report
        const updateDate = await prisma.visit_record.update({
            
                where:{
                    id:updatingRowId
                },
                data:{
                    date:reportedDate
                }
            
        })
        console.log({updateDate})
        const getUpdatedDate = updateDate.date
        // console.log({getUpdatedDate})
        const getTotalVisits = updateDate.total_visits
        // console.log({getTotalVisits})
        const [day,month,year] = getUpdatedDate.split('-')
        const findVisitedMonth = new Date(`${year}-${month}-${day}`);
        const visitedMonth = findVisitedMonth.getMonth() + 1
        console.log({visitedMonth})
        let updateVisitRecord;
        if(visitedMonth === CurrentMonth){

         updateVisitRecord = await prisma.visit_record.update({
            where:{
                id:updatingRowId
            },
            data:{
                requesterId:requesterId,
                visited:findReportCount,
                balance_visit:balanceVisits,
                // date:reportedDate
            }
        })
        console.log({updateVisitRecord})
      
        }else{
            updateVisitRecord = await prisma.visit_record.create({
              data:{
                    requesterId:requesterId,
                    visited:findReportCount,
                    balance_visit:balanceVisits,
                    date:reportedDate,
                    requesterUniqueId:unique_reqId,
                    dr_Id:drId,
                    total_visits:getTotalVisits
                }
            })
           
        }
        console.log({updateVisitRecord})

    }

        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:updateReportingType,
            count:findReportCount,
            balanceVisit:balanceVisits,
            // updateVisitRecord:updateVisitRecord
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







module.exports = {register_manager,get_Replist,leave_request,accept_leaveRequest,getApplide_leaveReuest,edit_doctor,list_manager,list_expenseRequest,change_reportStatus,search_Rep_Dr,editRep,markVisit}