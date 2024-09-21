const { PrismaClient } = require("@prisma/client");
const { changeStatus } = require("../rep/rep.controller");
const prisma = new PrismaClient();




//for user registration
const userRegistration = async(req,res)=>{
    try{
        const{
            name,
            gender,
            dob,
            address,
            mobile,
            email,
            designation,
            nationality,
            qualification,
            headquaters,
            password,
            reportingOfficer,
            createdBy,
            adminid,
            reportingType,
            role
        } = req.body

        console.log("req----",req.body)
        const firstLetters = name.slice(0,3).toUpperCase() 
        const lastNumbers = mobile.slice(-3)
        let uniqueId = `${firstLetters}${lastNumbers}`;
        console.log({uniqueId})

        const registration = await prisma.userData.create({
            data:{
                name:name,
                gender:gender,
                date_of_birth:dob,
                address:address,
                mobile:mobile,
                email:email,
                designation:designation,
                nationality:nationality,
                qualification:qualification,
                headquaters:headquaters,
                password:password,
                role:role,
                reportingOfficer_id:reportingOfficer,
                reporting_type:reportingType,
                createdBy:createdBy,
                adminId:adminid,
                uniqueId:uniqueId,
                status:"Active"
            }
        })
        console.log({registration})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfully added the user",
            data:registration
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


//api for listing the area
const listArea = async(req,res)=>{
    try{
        const {userId} = req.body
        const getHeadquaters = await prisma.userData.findMany({
            where:{
                id:userId
            },
            select:{
                headquaters:true
            }
        })
        console.log({getHeadquaters})
        const area = []
        for(let i=0; i<getHeadquaters.length; i++){
           for(let j=0; j<getHeadquaters[i].headquaters.length; j++){
            const headquarterId = getHeadquaters[i].headquaters[j]
            const findArea = await prisma.headquarters.findMany({
                where:{
                    id:headquarterId
                }
            })
            area.push(findArea)
           }
        }
      
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:getHeadquaters,
            Area:area
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

//api for listing doctor in respective headquaters
const listDoctors = async(req,res)=>{
    // console.log({req})
    try{
        const {areas,day,userId} = req.body
        console.log("area----",areas[0])
        const areaID = []
        const ScheduleList = []
        for(let i=0; i<areas.length;i++){
            const area = areas[i]
            console.log({area})
            const findAreaId = await prisma.headquarters.findMany({
                where:{
                    sub_headquarter:area
                }
            })
            // console.log({findAreaId})
            areaID.push(findAreaId)
            const areaId = findAreaId[0].id
            // console.log({areaId})

            const findDr = await prisma.doctor_details.findMany({
                where:{
                    headquaters:{
                        equals:areaId
                    },
                   approvalStatus:"Accepted",
                   created_UId:userId
                    
                }
            })
            console.log({findDr})
                  
        
        for(let j=0; j<findDr.length ;j++){
            const drId = findDr[j].id
            console.log({drId})
            const firstName = findDr[j].firstName
            const lastName = findDr[j].lastName
            const visitType = findDr[j].visit_type

            //fing the schedule of the doctor
            const findSchedule = await prisma.schedule.findMany({
                where:{
                 schedule:{
                    path:['day'],
                    equals:day
                 },
                 dr_id:drId
                
                }
            })
            console.log({findSchedule})

               if (findSchedule.length > 0) {
                     ScheduleList.push({
            doctor: {
                id: drId,
                firstName: firstName,
                lastName: lastName,
                visitType: visitType,
                schedule: findSchedule
            }
        });
    }
        }
        }
        
       

  


        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:ScheduleList
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

// const listDoctors = async (req, res) => {
//     console.log({ req });
//     try {
//         const { area, day, userId } = req.body;
//         let areaId = null;

//         if (area) {
//             const findAreaId = await prisma.headquarters.findMany({
//                 where: {
//                     sub_headquarter: area
//                 }
//             });
//             console.log({ findAreaId });

//             if (findAreaId.length > 0) {
//                 areaId = findAreaId[0].id;
//             } else {
//                 return res.status(404).json({
//                     error: true,
//                     success: false,
//                     message: "Area not found"
//                 });
//             }
//             console.log({ areaId });
//         }

//         const findDr = await prisma.doctor_details.findMany({
//             where: {
//                 ...(areaId && { headquaters: { equals: areaId } }), // Use JSON filter if required
//                 created_UId: userId
//             }
//         });
//         console.log({ findDr })

//         const ScheduleList = [];
//         for (let i = 0; i < findDr.length; i++) {
//             const drId = findDr[i].id;
//             console.log({ drId });
//             const firstName = findDr[i].firstName;
//             const lastName = findDr[i].lastName;
//             const visitType = findDr[i].visit_type;

//             // Find the schedule of the doctor
//             const findSchedule = await prisma.schedule.findMany({
//                 where: {
//                     schedule: {
//                         path: ['day'],
//                         equals: day
//                     },
//                     dr_id: drId
//                 }
//             });
//             console.log({ findSchedule });

//             if (findSchedule.length > 0) {
//                 ScheduleList.push({
//                     doctor: {
//                         id: drId,
//                         firstName: firstName,
//                         lastName: lastName,
//                         visitType: visitType,
//                         schedule: findSchedule
//                     }
//                 });
//             }
//         }

//         res.status(200).json({
//             error: false,
//             success: true,
//             message: "Successful",
//             data: ScheduleList
//         });
//     } catch (err) {
//         console.log({ err });
//         res.status(404).json({
//             error: true,
//             success: false,
//             message: "Internal server error"
//         });
//     }
// };


//for getting the added doctor
const getAddedDoctor = async(req,res)=>{
    try{
        const {userUniqueId} = req.body
        if(!userUniqueId){
            return res.status(404).json({
                error:true,
                message:"User id is required"
            })
        }
            const findDoctor = await prisma.doctor_details.findMany({
                where:{
                    created_UId:userUniqueId
                }
            })
            console.log(findDoctor)

            //find userType
            const findUserType = await prisma.userData.findMany({
                where:{
                    uniqueId:userUniqueId
                },
                select:{
                    id:true,
                    role:true
                }
            })
            console.log({findUserType})
            const userRole = findUserType[0].role
            console.log({userRole})
            const mngrId = findUserType[0].id
            console.log({mngrId})
            if(userRole === "Manager"){
                //find doctor added by rep under the manager
                const findAddedRep = await prisma.userData.findMany({
                    where:{
                      createdBy:mngrId
                    },
                    select:{
                        id:true,
                        name:true,
                        role:true,
                        uniqueId:true
                    }
                })
                console.log({findAddedRep})
                
                //find dr added by rep
                const addedByRep = []
                  for(let i=0; i<findAddedRep.length;i++){
                    const userId = findAddedRep[i].uniqueId
                    console.log({userId})
          
              const findDr = await prisma.doctor_details.findMany({
                where:{
                      created_UId:userId
                }
            })
            console.log({findDr})
            addedByRep.push(findDr)
            }
               return res.status(200).json({
                error:false,
                success:true,
                message:"Successfull",
                data:findDoctor,
                addedByRep:addedByRep
            })
        }


    }catch(err){
        console.log({err})
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}


//for getting travel plan for a day
const todaysTravelPlan = async(req,res)=>{
    try{
        const {date,userId} = req.body
        const todaysPlan = await prisma.detailedTravelPlan.findMany({
            where:{
                date:date,
                user_id:userId,
                status:"Approved"
            }
        })
        console.log({todaysPlan})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:todaysPlan
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

//adding schedule for doctor
const addSchedule = async(req,res)=>{
    try{
        const{drId,userId,schedule} = req.body
        const addScheduleData = await prisma.schedule.create({
           data:{
            dr_id:drId,
            user_id:userId,
            schedule:schedule
           }
        })
        console.log({addScheduleData})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfully added the schedule details",
            data:addScheduleData
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


//edit schedule
const editSchedule = async(req,res)=>{
    try{
        const{addressId,userId,drId,schedule} = req.body
        const date = new Date()
         
        //check the address
        const checkAddress = await prisma.doctor_address.findMany({
            where:{
                id:addressId
            }
        })

        if(checkAddress.length === 0){
            return res.status(404).json({
                error:true,
                success:false,
                message:"Address not found"
            })
        }
        const editedSchedule = await prisma.schedule.create({
           data:{
               dr_id:drId,
               user_id:userId,
               schedule:schedule,
               addressId:addressId,
               createdDate:date
            }
        })
        console.log({editedSchedule})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfully edited the schedule",
            data:editedSchedule
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


//api for approving doctors
const approveDoctors = async(req,res)=>{
    try{
        const {dr_id,status} = req.body
        
        const approveDoctor = await prisma.doctor_details.update({
            where:{
                id:dr_id
            },
            data:{
                approvalStatus:status
            }
        })
        console.log({approveDoctor})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:approveDoctor
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

//getting dr for approval

const getDoctorList_forApproval = async(req,res)=>{

    try{
        const{userId} = req.body

        const findRep = await prisma.userData.findMany({
            where:{
                reportingOfficer_id:userId 
            },
            select:{
                id:true,
                name:true,
                role:true
            }
        })
        console.log({findRep})
        const pendingDoctor = []
        for(let i=0; i<findRep.length ; i++){
            const userData = findRep[i].uniqueId 
            console.log({userData})
            const findAddeddoctors = await prisma.doctor_details.findMany({
                where:{
                    created_UId:userData,
                    approvalStatus:{
                        in:["Pending", "Accepted", "Rejected"]
                    }
                } 
            })
            console.log({findAddeddoctors})
            pendingDoctor.push({
                ...findRep[i],
                doctorList:findAddeddoctors
            })
        }

        res.status(200).json({
            error:true,
            success:false,
            message:"Successfull",
            data:pendingDoctor
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


//api for saving the tp
const SubmitAutomaticTp = async(req,res)=>{
    try{
        const { user_id, data } = req.body;
        console.log("req---", req.body);
        
        const createdDate = new Date();
        
        // Extract the date from the first key of the first object in the data array
        const getDate = Object.keys(data[0])[0];
        console.log({ getDate });
        
        const [day, month, year] = getDate.split('-');
        const findMonth = new Date(`${month}-${day}-${year}`);
        const Month = findMonth.getMonth() + 1;
        console.log({ Month });


        const createPlan = await prisma.travelPlan.create({
                    data:{
                      user_id:user_id,
                      created_date:createdDate,
                      month:Month,
                      status:"Draft"
                    }
        })
        console.log({createPlan})
    
        const travelPlanid = createPlan.id
        console.log({travelPlanid})
        let createdPlan = []
       
        for(let i=0 ; i<data.length ;i++){
         
            const date = Object.keys(data[i])[0]
            // console.log({date})
          

            const doctorList = data[i][date]
          
             
            for(let j=0 ; j<doctorList.length ; j++){
               const doctors = doctorList[j].doctor
            //    console.log({doctors})
            

            const findDoctor = await prisma.doctor_details.findMany({
                where:{
                    firstName:doctors
                }
            })
            console.log({findDoctor})
            const drId =findDoctor[0].id
            // console.log({drId})

            
            const createDetailedPlan = await prisma.detailedTravelPlan.create({
                data:{
                    travelplan_id:travelPlanid,
                    dr_id:drId,
                    user_id:user_id,
                    date:date,
                    status:"Draft",
                    created_date:createdDate
                }
            })
            // console.log({createDetailedPlan})
            createdPlan.push(createDetailedPlan)
        }
        
}
   



        
        res.status(200).json({
        error:true,
        success:false,
        message:"Successfull",
        data:createPlan,
        createDetailedPlan:createdPlan,
       
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


//api for getting the headquaters of rep
const findUserHeadquaters = async(req,res)=>{
    try{
        const {userId} = req.body
        const findHeadquaters = await prisma.userData.findMany({
            where:{
                uniqueId:userId
            },
            select:{
                headquaters:true
            }
        })
        const headquarters = findHeadquaters[0].headquaters
        console.log({headquarters})
        const headquarter = []
        for(let i=0; i<headquarters.length; i++){
            const headquarterId = headquarters[i]
            console.log({headquarterId})
            const headquatersName = await prisma.headquarters.findMany({
                where:{
                    id:headquarterId
                }
            })
            console.log({headquatersName})
            headquarter.push(headquatersName)
        }
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:headquarter
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





//for editing the travel plan
const EditTravelPlan = async(req,res)=>{
    try{
        //id = detailed travel plan id
        const{travelplanid,editData} = req.body
      
        
        const result = []
        for(let i=0; i<editData.length ; i++){
            const {id,dr_name,date} = editData[i]
            const createdDate = new Date()

            const existingData = await prisma.detailedTravelPlan.findUnique({
                where:{
                    id:id
                }
            })

            // console.log({existingData})
            if(existingData){
               
                
                    const drId = existingData.dr_id
                    // console.log({drId})
                    const findDrId = await prisma.doctor_details.findMany({
                        where:{
                            id:drId
                        }
                    })
                    // console.log({findDrId})
                    const dr_id = findDrId[0].id
                    // console.log({dr_id})
                
                const updateData =  await prisma.detailedTravelPlan.update({
                     where:{
                        id:id
                     },
                     data:{
                        dr_id:dr_id,
                        date:date,
                        created_date:createdDate
                     }
                })
                // console.log({updateData})
            }else{ 


                const drID = existingData.dr_id
                console.log({drID})


                // const addNewData = await prisma.detailedTravelPlan.create({
                //     travelplan_id:travelplanid,
                //     dr_id:dr_id,
                //     date:date,
                //     user_id:userId,
                //     date:date,
                //     status:"Draft",
                //     date:createdDate
                // })
            }
        }

       
       
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:editData
        })


    }catch(err){
        console.log({err})
        res.status(400).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}



//for adding address
// const addAddress = async(req,res)=>{
//     try{
//         const {areaId,scheduleData,address,dr_id,userId } = req.body
//         const date = new Date()

//         const addSchedule = await prisma.doctor_address.create({
//             data:{
//                 doc_id:dr_id,
//                 address:address,
//                 userId:userId,
//                 created_date:date
//             }
//         })

//         console.log({addSchedule})
//         res.status(200).json({
//             error:false,
//             success:true,
//             message:"Successfull",
//             data:addSchedule
//         })

//     }catch(err){
//         console.log({err})
//         res.status(404).json({
//             error:true,
//             success:false,
//             message:"Internal server error"
//         })
//     }
// }



//for getting complete user added tp
const userAddedTP = async (req,res)=>{
    try{
        const{userId} = req.body

        const getUserAddedTp = await prisma.travelPlan.findMany({
            where:{
                user_id:userId
            },
            orderBy:{
               created_date:"desc" 
            }
        })
        console.log({getUserAddedTp})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:getUserAddedTp
        })


    }catch(err){
        console.log({err})
        res.status(400).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}





//getting doctors in a tp
const doctorsInTp = async(req,res)=>{
    try{
        const{userId,month} = req.body
        const findTpId = await prisma.travelPlan.findMany({
            where:{
                user_id:userId,
                month:month,
                status:"Approved"

            }
        })
        console.log({findTpId})
        const drData = []
        for(let i=0; i<findTpId.length ; i++){
            const tpID = findTpId[i].id
            console.log({tpID})

            const travelPlanList = await prisma.detailedTravelPlan.findMany({
                where:{
                    travelplan_id:tpID
                }
            })
            console.log({travelPlanList})

            for(let j=0; j<travelPlanList.length; j++){
                const drId =travelPlanList[j].dr_id
                console.log({drId})
                const drDetails = await prisma.doctor_details.findMany({
                    where:{
                        id:drId
                    }
                })
                console.log({drDetails})
                drData.push(drDetails)
            }
        }
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:drData
        })
    }catch(err){
        console.log({err})
        res.status(400).json({
            error:true,
            success:false,
            message:"Internal server error"
        })

    }
}


//get chemist
const addedChemist = async(req,res)=>{
    try{
        const {userId} = req.body
        const findDr = await prisma.doctor_details.findMany({
            where:{
                created_UId:userId,
                approvalStatus:"Accepted"
            }
        })
        // console.log({findDr})
        const chemist = []
        for(let i =0;i<findDr.length;i++){
            const doct_id = findDr[i].id
            console.log({doct_id})
            const findChemist = await prisma.doctor_address.findMany({
                where:{
                    doc_id:doct_id
                },
                select:{
                    id:true,
                    chemist:true,
                    
                }
            })
            console.log({findChemist})
            // console.log("findchemist--------",findChemist[i].chemist)
            // chemist.push(findChemist)

            if (findChemist.length > 0) {
                const chemistdata = findChemist[0].chemist;  
                // console.log({ chemistdata });

                for(let j=0; j<chemistdata.length; j++){
                    const chemistAddress = chemistdata[j].address
                    console.log({chemistAddress})
                      const chemistDetails = await prisma.add_chemist.findMany({
                        where:{
                          address:chemistAddress
                        },
                        select:{
                            building_name:true,
                            mobile:true,
                            address:true
                        }
                      })
                      console.log({chemistDetails})
                }
            } else {
                console.log("No chemist data found for this doctor");
            }
        }
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:chemist
        })

    }catch(err){
        console.log({err})
        res.status(400).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//check password
const checkPassword = async(req,res)=>{
    try{
     const {userId} = req.body

     const checkModifiedDate = await prisma.userData.findMany({
        where:{
            id:userId
        }
     })
     console.log({checkModifiedDate})
     const modified_date = checkModifiedDate[0].modified_date
     console.log(modified_date)
     if(modified_date){
        return res.status(200).json({
            error:false,
            success:true,
            message:"Password already modified"
        })
     }
     return res.status(200).json({
        error:false,
        success:true,
        message:"Modifie the password"
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




//Reset password
const resetPassword = async(req,res)=>{
    try{
        const{userId,password} = req.body
         const date = new Date()
        const getUserData = await prisma.userData.findMany({
            where:{
                id:userId
            }
        })
        console.log({getUserData})
        const modifiedDate = getUserData[0].modified_date
        console.log({modifiedDate})
        const id = getUserData[0].id
        console.log({id})
        if(modifiedDate){
           return res.status(200).json({
                error:false,
                success:true,
                message:"You have already modified the password"
            })
        }else{
            const updatePassword = await prisma.userData.update({
                where:{
                    id:id
                },
                data:{
                   password:password,
                   modified_date:date
                }
            })
            console.log({updatePassword})
           return res.status(200).json({
                error:false,
                success:true,
                message:"Successfully changed the password",
                data:updatePassword
            })
        }
       


    }catch(err){
        console.log({err})
        res.status(400).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}


const markVisitedData = async(req,res)=>{
    try{
        const{dr_id,requesterId,travelPlanid} = req.body

        // const findTravelPlan = await prisma.

    }catch(err){
        console.log({err})
        res.status(400).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}


// const approveTp = async(req,res)=>{
//     try{
//         const {travelPlanId, userId} = req.body;
//         const date = new Date()
//         // Approve the main travel plan
//         const approveTravelPlan = await prisma.travelPlan.update({
//             where: {
//                 id: travelPlanId,
//                 user_id: userId
//             },
//             data: {
//                 status: "Approved"
//             }
//         });
//         console.log({approveTravelPlan});

//         // Update status in the detailed travel plans
//         await prisma.detailedTravelPlan.updateMany({
//             where: {
//                 travelplan_id: travelPlanId,
//             },
//             data: {
//                 status: "Approved"
//             }
//         });

//         // Retrieve the updated detailed travel plans
//         const updatedDetailedPlans = await prisma.detailedTravelPlan.findMany({
//             where: {
//                 travelplan_id: travelPlanId,
//                 status: "Approved"
//             }
//         });
//         console.log({updatedDetailedPlans});

        
//         for (let i = 0; i < updatedDetailedPlans.length; i++) {
//             const drId = updatedDetailedPlans[i].dr_id;
//             console.log({ drId });
//             //get doctor details
//             const findDetails = await prisma.doctor_details.findMany({
//               where:{
//                 id:drId 
//               },
//               select:{
//                 id:true,
//                 no_of_visits:true
//               }
//             })
//             console.log({findDetails})
//             const userID = updatedDetailedPlans[i].user_id;
//             console.log({ userID });

//             // Find user data by user ID
//             const findUserId = await prisma.userData.findMany({
//                 where: {
//                     id: userID
//                 }
//             });
//             console.log({ findUserId });
            

         


//             //create line with travel plan id
//             const addVisitRecord = await prisma.visit_record.createMany({
//                 data:{
//                     requesterUniqueId:findUserId[0].uniqueId,
//                     dr_Id:drId,
//                     total_visits:findDetails[0].no_of_visits,
//                     dateTime:date,
//                     travel_id:travelPlanId
//                 }
//             })
//             console.log({addVisitRecord})
//         }

//         res.status(200).json({
//             error: false,
//             success: true,
//             message: "Successful",
//             data: approveTravelPlan
//         });

//     } catch (err) {
//         console.log({ err });
//         res.status(400).json({
//             error: true,
//             success: false,
//             message: "Internal server error"
//         });
//     }
// };


//for deleting travel plan
const deleteTp = async(req,res)=>{
    try{
        const {travelPlanId} = req.body

      
        const deletedetailed = await prisma.detailedTravelPlan.deleteMany({
            where:{
                travelplan_id:travelPlanId
            }
        })
        const deletetp = await prisma.travelPlan.delete({
            where:{
                id:travelPlanId
            }
        })
        console.log({deletetp})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:deletedetailed
        })
    }catch(err){
        console.log({err})

    }
}

const approveTp = async (req, res) => {
    try {
        const { travelPlanId, userId } = req.body;
        const date = new Date();

        // Approve the main travel plan
        const approveTravelPlan = await prisma.travelPlan.update({
            where: {
                id: travelPlanId,
                user_id: userId
            },
            data: {
                status: "Approved"
            }
        });
        console.log({ approveTravelPlan });

        // Update status in the detailed travel plans
        await prisma.detailedTravelPlan.updateMany({
            where: {
                travelplan_id: travelPlanId,
            },
            data: {
                status: "Approved"
            }
        });

        // Retrieve the updated detailed travel plans
        const updatedDetailedPlans = await prisma.detailedTravelPlan.findMany({
            where: {
                travelplan_id: travelPlanId,
                status: "Approved"
            }
        });
        console.log({ updatedDetailedPlans });

        for (let i = 0; i < updatedDetailedPlans.length; i++) {
            const drId = updatedDetailedPlans[i].dr_id;
            console.log({ drId });
            const userID = updatedDetailedPlans[i].user_id;
            console.log({ userID });

            // Get doctor details
            const findDetails = await prisma.doctor_details.findFirst({
                where: {
                    id: drId
                },
                select: {
                    id: true,
                    no_of_visits: true
                }
            });
            console.log({ findDetails });

            // Find user data by user ID
            const findUserId = await prisma.userData.findFirst({
                where: {
                    id: userID
                }
            });
            console.log({ findUserId });

            // **Check if a visit record already exists for this doctor and travel plan**
            const existingVisitRecord = await prisma.visit_record.findFirst({
                where: {
                    dr_Id: drId,
                    travel_id: travelPlanId
                }
            });

            // If no record exists, create a new visit record
            if (!existingVisitRecord) {
                const addVisitRecord = await prisma.visit_record.create({
                    data: {
                        requesterUniqueId: findUserId.uniqueId,
                        dr_Id: drId,
                        total_visits: findDetails.no_of_visits,
                        dateTime: date,
                        travel_id: travelPlanId
                    }
                });
                console.log({ addVisitRecord });
            } else {
                console.log(`Visit record for doctor ID ${drId} and travel plan ${travelPlanId} already exists.`);
            }
        }

        res.status(200).json({
            error: false,
            success: true,
            message: "Successful",
            data: approveTravelPlan
        });

    } catch (err) {
        console.log({ err });
        res.status(400).json({
            error: true,
            success: false,
            message: "Internal server error"
        });
    }
};



const Performance = async(req,res)=>{
    try{
        const{requesterUniqueId,drId,month} = req.body
     
      
        const queryConditions = {
            requesterUniqueId: requesterUniqueId,
            dr_Id: drId
        };

       
        if (month) {
            queryConditions.date = {
                contains: `-${month}-` 
            };
        }

    const findVisitCount = await prisma.visit_record.findMany({
            where: queryConditions
        });

        console.log({ findVisitCount });
        const totalVisit =[]
        for (let i = 0; i < findVisitCount.length; i++) {
            const count = findVisitCount[i].visited;
            const totalVisits = findVisitCount[i].total_visits;

            // Calculate the visited percentage
            const visitedPercentage = (count / totalVisits) * 100;

            console.log({ count, visitedPercentage });

            // Add the percentage to the totalVisit array
            totalVisit.push({
                ...findVisitCount[i],
                visitedPercentage: visitedPercentage.toFixed(2) // Keeping up to two decimal places
            });
        }

        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:totalVisit
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

const userPerformance = async(req,res)=>{
    try{
        const{requesterUniqueId} = req.body
     
      
         const findVisitCount = await prisma.visit_record.findMany({
            where: {
                requesterUniqueId: requesterUniqueId,
              
            }
        });
        console.log({findVisitCount})
        const totalVisit =[]
        for (let i = 0; i < findVisitCount.length; i++) {
            const count = findVisitCount[i].visited;
            const totalVisits = findVisitCount[i].total_visits;
            const drId = findVisitCount[i].dr_Id

            const findDrDetails = await prisma.doctor_details.findMany({
                where:{
                    id:drId
                }
            })
            console.log({findDrDetails})
            // Calculate the visited percentage
            const visitedPercentage = (count / totalVisits) * 100;

            console.log({ count, visitedPercentage });

            // Add the percentage to the totalVisit array
            totalVisit.push({
                ...findVisitCount[i],
                visitedPercentage: visitedPercentage.toFixed(2) ,
                doctorDetails:findDrDetails
            });
        }

        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:totalVisit
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



module.exports ={userRegistration,listArea,listDoctors,getAddedDoctor,todaysTravelPlan,addSchedule,editSchedule,approveDoctors,getDoctorList_forApproval,SubmitAutomaticTp,findUserHeadquaters,EditTravelPlan,
    userAddedTP,doctorsInTp,addedChemist,resetPassword,checkPassword,markVisitedData,approveTp,deleteTp,Performance,userPerformance
}