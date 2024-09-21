const { PrismaClient } = require("@prisma/client");

// const { response } = require("express");
const prisma = new PrismaClient();
const geolib = require('geolib')

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    // const year = date.getFullYear();
    return `${day}-${month}`;
  }
  function formatnewDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const normalizeDate = (input) => {
    if (/^\d{8}$/.test(input)) {
      const day = input.slice(0, 2);
      const month = input.slice(2, 4);
      const year = input.slice(4, 8);
      return `${day}-${month}-${year}`;
    }
return input;
  };

  function categorizeVisitCount(visitCount) {
    switch (true) {
        case (visitCount >= 0 && visitCount <= 2):
            return 'important';
        case (visitCount >= 3 && visitCount <= 4):
            return 'core';
        case (visitCount >= 5 && visitCount <= 6):
            return 'supercore';
        default:
            return 'out of range';
    }
}
  
  

//rep registration(not in use)
const rep_registration = async (req, res) => {
    console.log({req})
    try {
        const { name, gender, dob, nationality, mobile, email, designation, qualification, reporting_officer, created_by, address, type, password,headquarters } = req.body
        const date = new Date()
        // const alphabets = "abcdefghijklmnopqrstuvwxyz"
        const numbers = '0123456789'
        let code = ''
        const prefix = 'Rep'


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
        console.log({ code })
        if (name && gender && dob && nationality && mobile && email && designation && qualification && reporting_officer && created_by && address && type && password && headquarters) {
            const registration = await prisma.rep_details.create({
                data: {
                    name: name,
                    gender: gender,
                    date_of_birth: dob,
                    Nationality: nationality,
                    mobile: mobile,
                    email: email,
                    designation: designation,
                    qualification: qualification,
                    reporting_officer: reporting_officer,
                    created_date: date,
                    created_by: created_by,
                    unique_id: code,
                    address: address,
                    type: type,
                    password: password,
                    status: "Active",
                    headquarters:headquarters
                }
            })
            console.log({ registration })
            res.status(200).json({
                error: false,
                success: true,
                message: "successfully added",
                data: registration
            })
        } else {
            return res.status(404).json({
                error: true,
                success: false,
                message: 'You missed some field'
            })
        }
    } catch (err) {
        console.log("error-----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}

//login (in use)
const login = async (req, res) => {
    try {
        const { userId, password } = req.body
        if (!userId || !password) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "UserId and password are required"
            })
        }
       const findUser = await prisma.userData.findMany({
            where:{
                uniqueId:userId,
                password:password
            }
        })

        if (findUser.length === 0) {
            return res.status(401).json({
                error: true,
                success: false,
                message: "Invalid userId or password"
            });
        }

        return res.status(200).json({
            error: false,
            success: true,
            message: "Successfully logined",
            data: findUser
        })

    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error",
        })
    }
}

//add doctor(in use)
const add_doctor = async (req, res) => {
    console.log({req})
    console.log(JSON.stringify(req.body.address, null, 2));

    try {
        const { firstName,lastName,qualification, gender, specialization, mobile, visits, dob, wedding_date,created_UniqueId,address,chemist,product,headquarters,area,schedule} = req.body
        const date = new Date()
        if (firstName && lastName && qualification && gender && specialization && mobile && visits  && dob && wedding_date && created_UniqueId && address) {
            const visitCategory = categorizeVisitCount(visits);
            const dr_registration = await prisma.doctor_details.create({
                data: {
                    firstName:firstName,
                    lastName:lastName,
                    doc_qualification: qualification,
                    gender: gender,
                    specialization: specialization,
                    mobile: mobile,
                    no_of_visits: visits,
                    visit_type:visitCategory,
                    date_of_birth: dob,
                    wedding_date: wedding_date,
                    created_UId: created_UniqueId,
                    created_date: date,
                    status: "active",
                    approvalStatus:"Pending"
                }
            })
            console.log({ dr_registration })
            const doc_id = dr_registration.id
            const userId = dr_registration.created_UId
            const address_ID = []
            const addedAddress = []
            for (let i = 0; i < address.length; i++) {
                const add_drAddress = await prisma.doctor_address.create({
                    data: {
                        doc_id: doc_id,
                        address: address[i],
                        created_date: date,
                        userId:userId,
                        chemist:chemist,
                        product:product
                    }
                })
                console.log({ add_drAddress })
                address_ID.push(add_drAddress.id)
                addedAddress.push(add_drAddress)
            }
             const addressId = addedAddress[0].id
             console.log({addressId})
            //getting the headquaters id
            const getHeadquaters= await prisma.headquarters.findMany({
                where:{
                  headquarter_name:headquarters,
                  sub_headquarter:area
                }

            })
            console.log({getHeadquaters})
            const headquarterId = getHeadquaters[0].id
            console.log({headquarterId})
            //for adding the schedule
            const scheduleDetails = []
            const scheduleId = []
            for(i=0; i<schedule.length;i++){
            const addSchedule = await prisma.schedule.create({
                 data:{
                    dr_id:doc_id,
                    user_id:userId,
                    schedule:schedule[i],
                    createdDate:date,
                    addressId:addressId
                 }
            })
            console.log(addSchedule)
            scheduleDetails.push({addSchedule})
            scheduleId.push(addSchedule.id)
        }

            const add_addressID = await prisma.doctor_details.update({
                where: {
                    id: doc_id
                },
                data: {
                    address_id: address_ID,
                    headquaters:headquarterId,
                    scheduleData:scheduleId 
                }
            })
            console.log({ add_addressID })
            const addVisits = await prisma.visit_record.create({
               data:{
                requesterUniqueId: created_UniqueId,
                dr_Id: doc_id,
                total_visits: visits,
                dateTime:date
               }
            })
            console.log({ addVisits })

           




            res.status(200).json({
                error: true,
                success: false,
                message: "Successfully registered the doctor",
                data: dr_registration,
                addedAddress: addedAddress
            })
        } else {
            return res.status(404).json({
                error: true,
                success: false,
                message: "You have missed some fields"
            })
        }
    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}

//getting the doctors
// const get_addedDoctors = async (req, res) => {
//     console.log({ req })
//     try {
//         const { rep_UniqueId } = req.body
//         if (!rep_UniqueId) {
//             return res.status(404).json({
//                 error: true,
//                 success: false,
//                 message: "Rep unique id is required"
//             })
//         }
//         const getDr = await prisma.doctor_details.findMany({
//             where: {
//                 created_UId: rep_UniqueId,
//                 status: "active"
//             }
//         })
//         console.log({ getDr })
//         if (getDr.length === 0) {
//             return res.status(404).json({
//                 error: true,
//                 success: false,
//                 message: "Invalid unique id, No data found"
//             })
//         }
//         if (rep_UniqueId.startsWith('Mngr')) {
//             const find_mngrDetails = await prisma.manager_details.findMany({
//                 where: {
//                     unique_id: rep_UniqueId
//                 }
//             })
//             console.log({ find_mngrDetails })
//             const manager_id = find_mngrDetails[0].id
//             console.log({ manager_id })
//             const find_rep = await prisma.rep_details.findMany({
//                 where: {
//                     created_by: manager_id
//                 }
//             })
//             console.log({ find_rep })
//             const repaddedDR = []
//             for (let i = 0; i < find_rep.length; i++) {
//                 const rep_UniqueId = find_rep[0].unique_id
//                 console.log({ rep_UniqueId })
//                 const find_addedDr = await prisma.doctor_details.findMany({
//                     where: {
//                         created_UId: rep_UniqueId
//                     }
//                 })
//                 console.log({ find_addedDr })
//                 repaddedDR.push({
//                     addedbyYou:getDr,
//                     addedByRep:find_addedDr
//                 })
//             // repaddedDR.push(...getDr,...find_addedDr)
//             }
//             return res.status(200).json({
//                 error: false,
//                 success: true,
//                 message: "successfull",
//                 datas: repaddedDR
//             })
        
//         }
//         //stop here
//         res.status(200).json({
//             error: false,
//             success: true,
//             message: "successfull",
//             data: getDr
//         })

//     } catch (err) {
//         console.log("error----", err)
//         res.status(400).json({
//             error: true,
//             success: false,
//             message: "internal server error"
//         })
//     }
// }
//

//get added doctor(in use)
const get_addedDoctors = async (req, res) => {
    console.log({ req })
    try {
        const { rep_UniqueId } = req.body;
        if (!rep_UniqueId) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Rep unique id is required"
            });
        }

        const findUserRole = await prisma.userData.findMany({
            where:{
                uniqueId:rep_UniqueId
            }
        })
        console.log({findUserRole})
        const userRole = findUserRole[0].role
        console.log({userRole})

        const getDr = await prisma.doctor_details.findMany({
            where: {
                created_UId: rep_UniqueId,
                status: "active" 
            }
        });
        console.log({ getDr });

        

        if(userRole === "Manager") {
            const find_mngrDetails = await prisma.userData.findMany({
                where: {
                    uniqueId: rep_UniqueId,
                    role:"Manager"
                }
            });
            console.log({ find_mngrDetails });

            if (find_mngrDetails.length === 0) {
                return res.status(404).json({
                    error: true,
                    success: false,
                    message: "Manager not found"
                });
            }

            const manager_id = find_mngrDetails[0].id;
            console.log({ manager_id });

            const find_rep = await prisma.userData.findMany({
                where: {
                    reportingOfficer_id: manager_id
                }
            });
            console.log({ find_rep });

            const repaddedDR = [...getDr];
            for (let i = 0; i < find_rep.length; i++) {
                const rep_UniqueId = find_rep[i].uniqueId;
                console.log({ rep_UniqueId });

                const find_addedDr = await prisma.doctor_details.findMany({
                    where: {
                        created_UId: rep_UniqueId,
                        status: "active"
                    }
                });
                console.log({ find_addedDr });

                repaddedDR.push(...find_addedDr);
            }

            return res.status(200).json({
                error: false,
                success: true,
                message: "Successful",
                data: repaddedDR
            });
        }

        // If not a manager, just return getDr
        res.status(200).json({
            error: false,
            success: true,
            message: "Successful",
            data: getDr
        });

    } catch (err) {
        console.log("error----", err);
        res.status(400).json({
            error: true,
            success: false,
            message: "Internal server error"
        });
    }
};



//getting the personal leave history(in use)
const leaveHistory = async (req, res) => {
    try {
        const { uniqueRequesterId } = req.body
        if (!uniqueRequesterId) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "RequesterID is missing"
            })
        }

        const find_leaveHistory = await prisma.leave_table.findMany({
            where: {
                uniqueRequester_Id: uniqueRequesterId
            }
        })
        console.log({ find_leaveHistory })
        
        if (find_leaveHistory.length === 0) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Provided invalid ID"
            })
        }

        const userId = find_leaveHistory[0].uniqueRequester_Id
        console.log({userId})

        //find user details
        const findUser = await prisma.userData.findMany({
            where:{
               uniqueId: userId
            }
        })
        console.log({findUser})

        
        // if (uniqueRequesterId.startsWith("Rep")) {
        //     const leaveRequestWithRepdetail = []
        //     for (let i = 0; i < find_leaveHistory.length; i++) {
        //         console.log("jjjjj")
        //         const leaveRequest = find_leaveHistory[i]
        //         console.log({ leaveRequest })
        //         const findRepdata = await prisma.rep_details.findMany({
        //             where: {
        //                 unique_id: leaveRequest?.uniqueRequester_Id
        //             }
        //         })
        //         console.log({ findRepdata })
        //         leaveRequestWithRepdetail.push({
        //             ...leaveRequest,
        //             repDetails: findRepdata
        //         });
        //     }
        //     return res.status(200).json({
        //         error: false,
        //         success: true,
        //         message: "Successfully collected the leave details",
        //         data: leaveRequestWithRepdetail
        //     })
        // } else {
        //     const managerDetails = []
        //     for (let i = 0; i < find_leaveHistory.length; i++) {
        //         console.log("jjjjj")
        //         const leaveRequest = find_leaveHistory[i]
        //         console.log({ leaveRequest })
        //         const findRepdata = await prisma.manager_details.findMany({
        //             where: {
        //                 unique_id: leaveRequest?.uniqueRequester_Id
        //             }
        //         })
        //         console.log({ findRepdata })
        //         managerDetails.push({
        //             ...leaveRequest,
        //             repDetails: findRepdata
        //         });
        //     }


        //     return res.status(200).json({
        //         error: false,
        //         success: true,
        //         message: "Successfully collected the leave details",
        //         data: managerDetails
        //     })
        // }
         
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:find_leaveHistory,
            userData:findUser
        })


    } catch (err) {
        console.log("error-----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}

//for getting single user details(in use)
const single_Details = async (req, res) => {
    try {
        const { uniqueId } = req.body

        if (!uniqueId) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Id required"
            })
        }
        // let userArray = []
        // if (uniqueId.startsWith('Mngr')) {
        //     userArray = await prisma.manager_details.findMany({
        //         where: {
        //             unique_id: uniqueId
        //         }
        //     })
        // } else if (uniqueId.startsWith('Rep')) {
        //     userArray = await prisma.rep_details.findMany({
        //         where: {
        //             unique_id: uniqueId
        //         }
        //     })
        // }

        //  else {
        //     return res.status(404).json({
        //         error: true,
        //         success: false,
        //         message: "Invalid Id"
        //     })
        // }
        const userData = await prisma.userData.findUnique({
            where:{
                uniqueId:uniqueId
            }
        })

        if (userData.length === 0) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Invalid id"
            })
        }
        res.status(200).json({
            error: true,
            success: false,
            message: "Successfull",
            data: userData
        })
    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}

//for deleting the doctor (in use)
const delete_doctor = async (req, res) => {
    try {
        const { dr_id } = req.body
        const delete_data = await prisma.doctor_details.update({
            where: {
                id: dr_id
            },
            data: {
                status: "inactive"
            }
        })
        console.log({ delete_data })
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfully deleted the data",
            data: delete_data
        })
    } catch (err) {
        console.log("error-----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}

//searching dr according to their specialization
// const filter_dr = async (req, res) => {
//     console.log({req})
//     try {
//         const {requesterUniqueId,searchData } = req.body
//         console.log({requesterUniqueId})
//         console.log({searchData})
//         const filter_data = await prisma.doctor_details.findMany({
//             where: {
//                  created_UId:requesterUniqueId,
//                 OR: [
//                     {
//                         specialization: {
//                             startsWith: searchData,
//                             mode: 'insensitive'
//                         }
//                     },
//                     {
//                         doc_name: {
//                             startsWith: `Dr.${searchData}`,
//                             mode: "insensitive"
//                         }
//                     }
//                 ],
//                 status:"active"
//             }
//         })
//         console.log({ filter_data })
//         if (filter_data.length === 0) {
//             return res.status(404).json({
//                 error: true,
//                 success: false,
//                 message: "No result found"
//             })
//         }
//         res.status(200).json({
//             error: false,
//             success: true,
//             message: "successfull",
//             data: filter_data
//         })
//     } catch (err) {
//         console.log("error---", err)
//         res.status(404).json({
//             error: true,
//             success: false,
//             message: "internal server error"
//         })
//     }
// }

//(in use)
const filter_dr = async (req, res) => {
    try {
        const { requesterUniqueId, searchData } = req.body;
        console.log('requesterUniqueId:', requesterUniqueId);
        console.log('searchData:', searchData);

        const filter_data = await prisma.doctor_details.findMany({
            where: {
                created_UId: requesterUniqueId,
                OR: [
                    {
                        specialization: {
                            startsWith: searchData,
                            mode: 'insensitive'
                        }
                    },
                    {
                        firstName: {
                            startsWith: `Dr.${searchData}`,
                            mode: 'insensitive'
                        }
                    }
                ],
                status: 'active',
                approvalStatus:"Accepted"
            }
        });

        console.log('filter_data:', filter_data);

        if (filter_data.length === 0) {
            return res.status(404).json({
                error: true,
                success: false,
                message: 'No result found'
            });
        }

        res.status(200).json({
            error: false,
            success: true,
            message: 'Successfull',
            data: filter_data
        });
    } catch (err) {
        console.log('error---', err);
        res.status(500).json({
            error: true,
            success: false,
            message: 'Internal server error'
        });
    }
};


//doctor detail(in use)
const get_doctorDetail = async (req, res) => {
    try {
        const { dr_id } = req.body
        if (!dr_id) {
            return res.status(404).json({
                error: true,
                success: false,
                message: 'Doctor id is missing'
            })
        }
        const get_detail = await prisma.doctor_details.findFirst({
            where: {
                id: dr_id
            }
        })
        console.log({ get_detail })
        const addressId = get_detail.address_id
        console.log({addressId})
        const addressDetail = []
        for(let i=0; i<addressId.length; i++){
            const Id = addressId[i]
            console.log({Id})
            const findAddress = await prisma.doctor_address.findMany({
                where:{
                    id:Id
                }
            }) 
            console.log({findAddress})
            addressDetail.push(findAddress)

        }

        //for getting complete schedule
        const scheduleList = get_detail.scheduleData
        console.log({scheduleList})
       
        const schedule = []

        for(let i=0; i<scheduleList.length ; i++){
              const findSchedule = await prisma.schedule.findMany({
                where:{
                  id:  scheduleList[i] 
                }
              })
              console.log({findSchedule})
              schedule.push(findSchedule)
        }
        console.log({addressDetail})
        //   if(get_detail === 'null'){
        //     return res.status(404).json({
        //         error:true,
        //         success:false,
        //         message:"Invalid doctor id"
        //     })
        //   }
        const doctor_data = []
        doctor_data.push({
            ...get_detail,
            addressDetail:addressDetail,
            schedule:schedule
        })
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfull",
            data: doctor_data
        })
    } catch(err){
        console.log("error-----", err)
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}

//delete user (in use)
const delete_rep = async (req, res) => {
    try {
        const { userId } = req.body
        const delete_UserData = await prisma.userData.update({
            where: {
                id: userId
            },
            data: {
                status: "Inactive"
            }

        })
        console.log({ delete_UserData })
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfully deleted the data",
            data: delete_UserData
        })

    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}

// report expense request(in use)
const report_expense = async (req, res) => {
    try {
        const { amount, remarks, attachment, trip_date, doct_id, requesterId, uniqueRequesterId } = req.body
        const date = new Date()
        const expense_report = await prisma.expense_report.create({
            data: {
                amount: amount,
                remark: remarks,
                attachment: attachment,
                trip_date: trip_date,
                doct_id: doct_id,
                status: "Pending",
                requester_id: requesterId,
                uniqueRequesterId: uniqueRequesterId,
                created_date: date,

            }
        })
        const expense_id = expense_report.id
        //  console.log({expense_id})
        const userId = expense_report.requester_id
         console.log({userId})

        const find_reportingofficer = await prisma.userData.findMany({
            where: {
                id: userId
            }
        })

        console.log({find_reportingofficer})

        const reporting_officer = find_reportingofficer[0]?.reportingOfficer_id
        console.log({reporting_officer})
        const add_officerId = await prisma.expense_report.update({
            where: {
                id: expense_id
            },
            data: {
                reporting_officer: reporting_officer
            }
        })
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfull",
            data: add_officerId
        })
    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}

//list expense request(in use)
const individual_expenseReport = async (req, res) => {
    console.log({req})
    const { uniqueid,searchData } = req.body
    try {
        if(!searchData){
        const list_individualReport = await prisma.expense_report.findMany({
            where: {
                uniqueRequesterId: uniqueid
            }
        })
        
        // console.log({ list_individualReport })
        const completeExpenseData = []
        for(let i=0; i<list_individualReport.length ;i++){
            const getExpenseReport = list_individualReport[i]
           
            const drId = getExpenseReport.doct_id
            // console.log({drId})
            const drDetails = await prisma.doctor_details.findMany({
                where:{
                    id:drId
                },
                select:{
                    id:true,
                    firstName:true
                }
            }) 
            // console.log({drDetails})
            completeExpenseData.push({
                ...getExpenseReport,
                doctorDetails:drDetails
            })
        }
        //find rep_details
    //     if(uniqueid.startsWith('Rep')){
    //     const rep_details = await prisma.rep_details.findMany({
    //         where:{
    //             unique_id:uniqueid
    //         }
    //     })
    //    return res.status(200).json({
    //         error: false,
    //         success: true,
    //         message: "Successfull",
    //         data: completeExpenseData,
    //         rep_details:rep_details
    //     })
    // }else{

    //     const managerDetails = await prisma.manager_details.findMany({
    //         where:{
    //             unique_id:uniqueid
    //         }
    //     })
    //    return res.status(200).json({
    //         error: false,
    //         success: true,
    //         message: "Successfull",
    //         data: completeExpenseData,
    //         managerDetails:managerDetails
    //     })
    // }
    

    //find userDetails(in use)
    const findUser = await prisma.userData.findMany({
        where:{
            uniqueId:uniqueid
        }
    })
    console.log({findUser})
    return res.status(200).json({
        error:false,
        success:true,
        message:"Successfull",
        data: completeExpenseData,
        userDetails:findUser
    })
}else{ 
    const findDr = await prisma.doctor_details.findMany({
        where:{
            created_UId:uniqueid,
            
            firstName:{
                startsWith:searchData,
                mode:"insensitive"
            }
        },
        select:{
            id:true,
            firstName:true
        }
    })
    console.log({findDr})
    
    
    for( let i=0; i<findDr.length ; i++){
        const doctorID = findDr[i].id
        const dr_name = findDr[i].firstName
        const doctorDetails = []
        // console.log({doctorID} )
        const doctorExpense = await prisma.expense_report.findMany({
               where:{
                doct_id:doctorID[i],
                uniqueRequesterId:uniqueid
               }
        })
        console.log({doctorExpense})
        const expenseWithDrName = doctorExpense.map(expense=>({
            ...expense,
            firstName:dr_name
        }))
        // doctorDetails.push({
        //     doctorExpense:doctorExpense,
        //     drName:dr_name
        // })
        return res.status(200).json({
            erorr:true,
            success:false,
            message:"Successfull",
            data:expenseWithDrName
        })
    }
    const dateFormat = normalizeDate(searchData)
    const searchExpense = await prisma.expense_report.findMany({
        where:{
            uniqueRequesterId: uniqueid,
            OR:[
                {
                    amount:{
                        startsWith:searchData
                    }
                },{
                    trip_date:{
                        startsWith:dateFormat
                    }
                }
            ]
        }
    })
    console.log({searchExpense})
    return res.status(200).json({
        error:true,
        success:false,
        message:"Successfull",
        // findDr:findDr,
        data:searchExpense
    })
}
    
    } catch (err) {
        console.log("error-----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }

}

//to add address of doctor(in use)
const add_drAddress = async (req, res) => {
    try {
        const { dr_id, dr_address, latitude, longitude,userId } = req.body
        const date = new Date()
        const add_address = await prisma.doctor_address.create({
            data: {
                doc_id: dr_id,
                address: dr_address,
                latitude: latitude,
                longitude: longitude,
                created_date: date,
                userId:userId
            }
        })
        console.log({ add_address })
        res.status(200).json({
            error: false,
            success: true,
            message: "Address added successfully",
            data: add_address
        })
    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}
//edit dr_address
// const edit_drAddress = async (req, res) => {
//     try {

//     } catch (err) {
//         console.log("error----", err)
//         res.status(404).json({
//             error: true,
//             success: false,

//         })
//     }
// }

//total number of rep (in use)
const total_repCount = async (req, res) => {
    try {
        const{userid} = req.body
        const get_count = await prisma.userData.count({
            where:{
                createdBy:userid,
                role:"Rep"
            }
        })
        const lastestDate = await prisma.rep_details.findFirst({
            orderBy: {
                created_date: "desc"
            },
            select: {
                created_date: true
            }
        })
        const lastRepAddedDate = lastestDate?.created_date ? new Date(lastestDate.created_date).toISOString().split('T')[0] : null;
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfull",
            get_count: get_count,
            lastRepAddedDate: lastRepAddedDate
        })

    } catch (err) {
        console.log("error-----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}

//total doctor count(in use)
const total_drCount = async (req, res) => {
    try {
        const{createdBy} = req.body //unique id of the doctor should be passed
        const get_count = await prisma.doctor_details.count({
            where:{
                created_UId:createdBy
            }
        })
        const lastestDate = await prisma.doctor_details.findFirst({
            orderBy: {
                created_date: "desc"
            },
            select: {
                created_date: true
            }
        })
        const lastDrAddedDate = lastestDate?.created_date ? new Date(lastestDate.created_date).toISOString().split('T')[0] : null;
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfull",
            get_count: get_count,
            lastDrAddedDate: lastDrAddedDate
        })

    } catch (err) {
        console.log("error-----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}

//api for searching the rep(in use)
const search_Rep = async (req, res) => {
    try {
        const {created_by,searchName } = req.body
        const search_data = await prisma.userData.findMany({
            where: {
                createdBy:created_by,
                name: {
                    startsWith: searchName,
                    mode:"insensitive"
                }
            }
        })
        console.log({ search_data })
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfull",
            data: search_data
        })
    } catch (err) {
        console.log("error------", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}


//add chemist(in use)
const add_chemist = async (req, res) => {
    try {
        const { created_by, building_name, mobile, email, lisence_no, address, date_of_birth, uniqueId } = req.body
        const date = new Date()
        const create_chemist = await prisma.add_chemist.create({
            data: {
                created_by: created_by,
                unique_Id: uniqueId,
                building_name: building_name,
                mobile: mobile,
                email: email,
                license_number: lisence_no,
                address: address,
                date_of_birth: date_of_birth,
                // anniversary_date:anniversary_date,
                date_time: date,
                status: "Active"
            }
        })
        console.log({ create_chemist })
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfull",
            data: create_chemist
        })

    } catch (err) {
        console.log("error---->", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}

//get chemist(in use)
const get_chemist = async (req, res) => {
    try {
        const { uniqueId } = req.body
        let getData ;
        if(uniqueId){
             getData = await prisma.add_chemist.findMany({
                orderBy:{
                    date_time:"desc"
                },
                where:{
                    status:"Active",
                    unique_Id:uniqueId
                }
            })
            console.log({ getData })
        }else{
         getData = await prisma.add_chemist.findMany({
            orderBy:{
                date_time:"desc"
            },
            where:{
                status:"Active"
            }
        })
        console.log({ getData })
    }
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfull",
            data: getData
        })

    } catch (err) {
        console.log("error----", err)
        res.status(400).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}

//delete chemist (in use)
const delete_chemist = async (req, res) => {
    try {
        const { chemist_id } = req.body
        const change_status = await prisma.add_chemist.update({
            where: {
                id: chemist_id,

            },
            data: {
                status: "Inactive"
            }
        })
        console.log({ change_status })
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfully deleted",
            data: change_status
        })

    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}

//search chemist(in use)
const search_chemist = async (req, res) => {
    const { searchData } = req.body
    try {
        const searchResult = await prisma.add_chemist.findMany({
            where: {
                OR: [
                    {
                        building_name: {
                            startsWith: searchData,
                            mode: "insensitive"
                        }
                    }, { 
                        address: {
                            startsWith: searchData,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            status:"Active"
        })
        console.log({ searchResult })
        if (searchResult.length === 0) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Not data found"
            })
        } else {
            return res.status(200).json({
                error: false,
                success: true,
                message: "Successfull",
                data: searchResult
            })
        }
    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}

//edit chemist(in use)
const edit_chemist = async (req, res) => {
    try {
        const { chemist_id, building_name, mobile, email, lisence_no, address, date_of_birth } = req.body

        const edited_data = await prisma.add_chemist.update({
            where: {
                id: chemist_id
            },
            data: {

                building_name: building_name,
                mobile: mobile,
                email: email,
                license_number: lisence_no,
                address: address,
                date_of_birth: date_of_birth,


            }
        })
        console.log({ edited_data })
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfull",
            data: edited_data
        })


    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}

//add product(in use)
const add_product = async (req, res) => {
    try {
        const { created_by, productName, quantity } = req.body
    
        const added_product = await prisma.add_product.create({
            data: {
                created_by: created_by,
                product_name: productName,
                quantity: quantity,
                status: 'Active'
            }
        })
        console.log({ added_product })
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfull",
            data: added_product
        })
    } catch (err) {
        console.log("error---", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}

//delete product(in use)
const delete_product = async (req, res) => {
    try {
        const { productId } = req.body
        if (productId) {
            const deleted_product = await prisma.add_product.update({
                where: {
                    id: productId
                },
                data: {

                    status: 'Inactive'
                }
            })
            console.log({ deleted_product })
            return res.status(200).json({
                error: false,
                success: true,
                message: "Successfull deleted",
                data: deleted_product
            })
        } else {
            return res.status(404).json({
                error: true,
                message: "Product id missing"
            })
        }
    } catch (err) {
        console.log("error---", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}


//get product(in use)
const get_product = async (req, res) => {
    try {
        // const{creater_id} = req.body
        const get_data = await prisma.add_product.findMany({
            where:{
                status:"Active"
            }
        })
        console.log({ get_data })
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfull",
            data: get_data
        })
    } catch (err) {
        console.log("error---", err)
        res.status(404).json({
            error: true,
            success: true,
            message: "Internal server error"
        })
    }
}

//edit product(in use)
 const editProduct = async(req,res)=>{
    try{
        const{productId,productName} = req.body
        const product = await prisma.add_product.update({
            where:{
                id:productId
            },
            data:{
                product_name:productName
            }
        })
           console.log({product})
           res.status(200).json({
            error:false,
            success:true,
            message:"Successfully edited the product",
            data:product
           })
    }catch(err){
         res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
         })
    }
 }

//get headquarters(in use)
const get_headquarters = async (req, res) => {
    try {
        const all_data = await prisma.headquarters.findMany()
        console.log({ all_data })
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfull",
            data: all_data
        })

    } catch (err) {
        console.log("error---", err)
        res.status(404).json({
            error: true,
            success: true,
            message: "Internal server error"
        })
    }
}

// const travel_plan = async(req,res)=>{
//     try{
//         const {requester_id,date_headquarters}=req.body
//         const travel_planData =[] 
//         for(let i=0; i<date_headquarters.length ; i++){
       
//         const date = new Date()
//         const add_travelPlan = await prisma.travel_plan.create({
//           data:{
//             requester_id:requester_id,
//             headquarters_date:date_headquarters[i],
//             created_date:date,
//             status:"Pending"
//           }
//         })

//         console.log(add_travelPlan)
//         travel_planData.push(add_travelPlan)
//     }
//     res.status(200).json({
//         error:false,
//         success:true,
//         message:"Successfull",
//         data:travel_planData
//     })

//     }catch(err){
//         console.log("error---",err)
//         res.status(404).json({
//             error:true,
//             success:false,
//             message:"Internal server error"
//         })
//     }
// }

//get travel_plan
// const get_travelPlan = async(req,res)=>{
//     try{
//         const{requesterId} = req.body
//         if(!requesterId){
//             return res.status(404).json({
//                 error:true,
//                 success:false,
//                 message:"Requester id is required"
//             })
//         }
//          const get_plan = await prisma.travel_plan.findMany({
//             where:{
//                 requester_id:requesterId,
//                 // status:"Pending"
//             }
//          })
//          console.log({get_plan})
//          res.status(200).json({
//             error:false,
//             success:true,
//             message:"Successfull",
//             data:get_plan
//         })
    
//     }catch(err){
//         console.log("error---",err)
//         res.status(404).json({
//             error:true,
//             success:false,
//             message:"Internal server error"
//         })
//     }
// }


//getting birthday and anniversary notifications





//for getting event notification(in use)
const notifications = async(req,res)=>{
    try{
        const{requesterUniqueId} = req.body
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedTomorrow = formatDate(tomorrow);
        console.log({formattedTomorrow})


        const today = new Date()
        const formattedToday = formatDate(today)
        console.log({formattedToday})

        const BirthdayNotification = await prisma.doctor_details.findMany({
            where:{
                created_UId:requesterUniqueId,
                date_of_birth:{
                    startsWith:formattedTomorrow
                }
            },
            orderBy:{
                created_date:"desc"
            }
        })
        const findAnniversary = await prisma.doctor_details.findMany({
            where:{
                created_UId:requesterUniqueId,
              wedding_date:{
                startsWith:formattedTomorrow
              }  
            },
            orderBy:{
                created_date:"desc"
            }
        })
        console.log({findAnniversary})
        
        const birthdayToday = await prisma.doctor_details.findMany({
            where:{
                created_UId:requesterUniqueId,
                date_of_birth:{
                    startsWith:formattedToday
                }
            },
            orderBy:{
                created_date:"desc"
            }
        })
        console.log({birthdayToday})
        const anniversaryToday = await prisma.doctor_details.findMany({
            where:{
                created_UId:requesterUniqueId,
              wedding_date:{
                startsWith:formattedToday
              }  
            },
            orderBy:{
                created_date:"desc"
            }
        })
        console.log({anniversaryToday})
        const notifications = []
        const todayEvents = []
        todayEvents.push({
            todayBirthday :birthdayToday,
            todayAnniversary :anniversaryToday
        })
        notifications.push({
            BirthdayNotification:BirthdayNotification,
            AnniversaryNotification:findAnniversary
        })
       
        res.status(200).json({
            error:false,
            success:true,
            // message:`Hey its ${BirthdayNotification.doc_name} Birthday!,Wish her all the best`,
            message:"Successfull",
            UpcomingEvents:notifications,
            todayEvents:todayEvents
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

//search in leave table(in use) 
const searchByDate = async(req,res)=>{
    try{
        const{user_uniqueId,date} = req.body
        if(user_uniqueId && date){
            const getSearchData = await prisma.leave_table.findMany({
                where:{
                    uniqueRequester_Id:user_uniqueId,
                    OR:[
                        {
                            from_date:{
                                startsWith:date
                            }
                        },
                        {
                            to_date:{
                                endsWith:date
                            }
                        }
                    ]
                }
            }) 
            console.log({getSearchData})
            res.status(200).json({
                error:false,
                success:true,
                message:"Successfull",
                data:getSearchData
            })
            if(getSearchData.length === 0){
               return res.status(400).json({
                    error:false,
                    success:true,
                    message:"No result found",
                  
                }) 
            }
        }else{
            return res.status(404).json({
                error:true,
                success:false,
                message:"Invalid Id provided",
              
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

//search in expense table(in use)
const search_expenseTable = async(req,res)=>{
    try{
        const {user_uniqueID,searchdata} = req.body
        if(!user_uniqueID){
            return res.status(404).json({
                error:true,
                success:false,
                message:"User ID id required"

            })
        }else{
            //finding the doctor details first
            const findDr = await prisma.doctor_details.findMany({
                where:{
                    created_UId:user_uniqueID,
                    doc_name:{
                        startsWith:searchdata,
                        mode:"insensitive"
                    }
                },
                select:{
                    id:true,
                    // doc_name:true
                }
            })
            console.log({findDr})
            // const doctorId = []
            
            for( let i=0; i<findDr.length ; i++){
                const doctorID = findDr[i].id
                // console.log({doctorID})
                const doctorExpense = await prisma.expense_report.findMany({
                       where:{
                        doct_id:doctorID[i],
                        uniqueRequesterId:user_uniqueID
                       }
                })
                console.log({doctorExpense})
                // doctorId.push(doctorExpense)
                return res.status(200).json({
                    erorr:true,
                    success:false,
                    message:"Successfull",
                    data:doctorExpense
                })
            }
            // console.log({doctorId})
        const findSearchData = await prisma.expense_report.findMany({
            where:{
                uniqueRequesterId:user_uniqueID,
                OR:[
                    {
                        amount:{
                            startsWith:searchdata
                        }
                    },
                    {
                        trip_date:{
                            startsWith:searchdata   
                        }
                    },
                    {

                    }
                ]
            }
        })
        console.log({findSearchData})
        return res.status(200).json({
            erorr:true,
            success:false,
            message:"Successfull",
            data:doctorExpense
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

//mark as visited(in use)
const markAsVisited = async(req,res)=>{
    try{
        const{reporterUniqueId,reporterId,date,time,products,remark,doctorId} = req.body
        const currentDate =new Date()
       

        const visiteddate = new Date()
        
        const formatteddate = formatnewDate(visiteddate);
        console.log({formatteddate})
        
        const markVisited = await prisma.reporting_details.create({
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
        console.log({markVisited})
        const markedDate = markVisited.visited_date
        console.log({markedDate})
        // const dateOnly = markedDate.toLocaleDateString(); 
        // console.log({dateOnly});
    
        
       
        const visitedId = markVisited.id
        console.log({visitedId})
        let visitReport
        if(date && time){
            visitReport = await prisma.reporting_details.update({
                where:{
                    id:visitedId
                },
                data:{
                    reporting_type:"Offline Reporting"
                }
            })
        }else{
            visitReport = await prisma.reporting_details.update({
                where:{
                    id:visitedId
                },
                data:{
                    reporting_type:"Online Reporting"
                }
            })
        }
        console.log({visitReport})
        //get the datetime from the response
        // const markeddate = new Date(markVisited.datetime)
        // console.log({markeddate})
        const markeddate = markVisited.visited_date
        console.log({markeddate})
      
        //for getting the count of lines
        const countVisits = await prisma.reporting_details.count({
            where:{
                unique_reqId:reporterUniqueId,
                doctor_id:doctorId,
                visited_date:markeddate
            }
        })
        console.log({countVisits})
        //getting the number of visits of doctor
        let getVisitReport = await prisma.doctor_details.findFirst({
            where:{
                created_UId:reporterUniqueId,
                id:doctorId
            },
            select:{
                no_of_visits:true
            }
        })
     
        console.log({getVisitReport})
        
        const visitCount = getVisitReport.no_of_visits
         console.log({visitCount})
        //calculating the balance visits
        const balanceVisit = visitCount-countVisits
        console.log({balanceVisit})
        // finding the line which should get update 
        const findVisitRecord = await prisma.visit_record.findFirst({
        where:{
            requesterUniqueId:reporterUniqueId,
            dr_Id:doctorId
        }
        })
// 
    
        console.log({findVisitRecord})
        const visitID = findVisitRecord.id
        console.log({visitID})
        const visitDate = findVisitRecord.date
        console.log({visitDate})
        const dateTime = findVisitRecord.dateTime
        console.log({dateTime})
        const requester_id = findVisitRecord.requesterId
        console.log({requester_id})
        const requesterUniqueId = findVisitRecord.requesterUniqueId
        console.log({requesterUniqueId})
        const drId = findVisitRecord.dr_Id
        console.log({drId})
        const total_visits=findVisitRecord.total_visits
        console.log({total_visits})

        if(!findVisitRecord){
            return res.status(404).json({
                error:true,
                success:false,
                message:"No visit record found"
            })
        }else{
           if(visitDate === null){
            const updateDate = await prisma.visit_record.update({
                where:{
                    id:visitID
                },
                data:{
                   date:formatteddate,
                   dateTime:currentDate
                }
            })
            console.log({updateDate})
            const updatedate = updateDate.date
            console.log({updatedate})
             

            
           }
           if(findVisitRecord.balance_visit === 0){
            return res.status(404).json({
               error:true,
               success:false,
               message:"Balance visit is 0"
            })
          }
           const currentMonth = currentDate.getMonth() + 1  ;
           console.log({currentMonth})
           const findexistingVisit = await prisma.visit_record.findMany({
            where:{
                id:visitID
            },
            select:{
                date:true
            }
           })
           console.log({findexistingVisit})
           let theDate=''
           theDate=findexistingVisit[findexistingVisit.length-1].date;
           console.log({theDate})
           const getMonthFromDate = (dateString) => {
            const dateParts = dateString.split('-');
            return parseInt(dateParts[1], 10);
        };
        
      
        theDate= getMonthFromDate(theDate);
        console.log(theDate); // Output: 7

        
           console.log({findexistingVisit})
           if(findexistingVisit.length>0){
           

            if(currentMonth !== theDate){
                const addNewDate = await prisma.visit_record.create({
                    data:{
                        // id:visitID,
                        dateTime:currentDate,
                        date:formatteddate,
                        requesterId:requester_id,
                        requesterUniqueId:requesterUniqueId,
                        dr_Id:drId,
                        total_visits:total_visits,
                        visited:1,
                        balance_visit:balanceVisit
                    }
                })
                console.log({addNewDate})
                return res.status(200).json({
                    error:false,
                    success:true,
                    message:"Successfull",
                    data:addNewDate,
                    updateVisit:addNewDate
                })
            }
           
          
          
        
        const updateVisit = await prisma.visit_record.update({
            where:{
               id:visitID
            },
            data:{
              requesterId:reporterId,
              visited:countVisits,
              balance_visit:balanceVisit,
              dateTime:currentDate
            }
        })
        console.log({updateVisit})  
          
        //update detailedTravelPlan table
        // const updatedetailedTravelPlan = await prisma.detailedTravelPlan.findMany({
        //     where:{

        //     }
        // }) 
        
       return res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:visitReport,
            updateVisit:updateVisit
        })
 
    }
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

//get visit report(in use)
const getVisitReport = async(req,res)=>{
    try{
        const visitReport = await prisma.reporting_details.findMany()
        console.log({visitReport})
         
        const completeReportData = []
        for(let i=0;i<visitReport.length;i++){
            const reportData = visitReport[i]
            const dr_id = reportData.doctor_id
            // console.log({dr_id})
            const requesterUniqueId = reportData.unique_reqId
            // console.log({requesterUniqueId})
            const findVisitData = await prisma.visit_record.findMany({
                where:{
                    requesterUniqueId:requesterUniqueId,
                    dr_Id:dr_id
                }
            })
            const findDoctorDetails =  await prisma.doctor_details.findMany({
                where:{
                    id:dr_id
                },
                select:{
                    id:true,
                    doc_name:true,
                    doc_qualification:true
                }
            })
            completeReportData.push({
                reportDetails:visitReport[i],
                doctorDetails:findDoctorDetails,
                visitDetails:findVisitData
         } )
        }
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:completeReportData
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

//single chemist details(in use)
const singleChemistDetail = async(req,res)=>{
    try{
        const{chemistId} = req.body
        if(chemistId){
        const singleData = await prisma.add_chemist.findUnique({
            where:{
                id:chemistId
            }
        })
        console.log({singleData})
       return res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:singleData
        })
    }else{
        return res.status(404).json({
            error:true,
            success:false,
            message:"Chemist Id is required"
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

//getting dr visited days(in use)
const visitedDays = async(req,res)=>{
    try{
        const{uniqueRequesterId,drId} = req.body
    
        const getDate = await prisma.reporting_details.findMany({
            where:{
                unique_reqId:uniqueRequesterId,
                doctor_id:drId
            },
            select:{
                id:true,
                datetime:true
            }
        })
        const visitedData = []
        for(i=0; i<getDate.length; i++){
            const dateData = getDate[i].datetime
            // console.log({dateData})
            const extractDate = (dateData) => {
                const date = new Date(dateData);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); 
                const day = String(date.getDate()).padStart(2, '0');
                return `${day}-${month}-${year}`;
              };
              const dateOnly = extractDate(dateData)
            //   console.log({dateOnly})
              visitedData.push({dateOnly})
        }
        console.log({visitedData})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:visitedData
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


//for getting specialization(in use)
const getSpecialization = async(req,res)=>{
    try{
        const getSpec = await prisma.specialization.findMany()
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:getSpec
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
// for getting doctor visited days(in use)
const getVisitedDates = async(req,res)=>{
    try{
        const{requesterUniqueId,docId} = req.body
        const getDates = await prisma.reporting_details.findMany({
            where:{
                unique_reqId:requesterUniqueId,
                doctor_id:docId 
            },
            select:{
                id:true,
                reporting_type:true,
                datetime:true
            }
        })
        console.log({getDates})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:getDates
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

//getting dr address (in use)
const getDoctorAddress = async(req,res)=>{
    try{
        const {drId} = req.body
        const getAddress = await prisma.doctor_address.findMany({
            where:{
                doc_id:drId
            },
            select:{
                id:true,
                doc_id:true,
                address:true
            }
        })
        console.log({getAddress})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:getAddress
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

//check location
const checkLocation = async(req,res)=>{
    try{
        const{repLocation,drLocation} = req.body
  
        
        const distance = geolib.getDistance(repLocation,drLocation)
        console.log({distance})
        if(distance<=100){
            return res.status(200).json({
               error:false, 
               success:true,
               message:"You are within the location"
            })
            
        }else{
            return res.status(404).json({
                error:true,
                success:false,
                message:"You are not within the location"
            })
            
        }

    }catch(err){
        console.log({err})
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//getting the markasvisited table(in use)
const visitedDetailsByMonth = async(req,res)=>{
    try{
        const{uniqueRequester_Id,month} = req.body
        const visitByMonth = await prisma.reporting_details.findMany({
            where:{
                unique_reqId:uniqueRequester_Id,
                datetime:{
                    gte: new Date(`${new Date().getFullYear()}-${month}-01`)
                }
            }
        })
        console.log({visitByMonth})
    }catch(err){
        console.log({err})
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
    
}

//create travelPlan(in use)

const createTravelplan = async (req, res) => {
    try {
      const { user_id, plan } = req.body;
      console.log("req---", req);
      const createdDate = new Date();
  
      const getDate = plan[0].date;
      console.log({ getDate });
  
      const [day, month, year] = getDate.split("-");
      const findMonth = new Date(`${month}-${day}-${year}`);
      const Month = findMonth.getMonth() + 1;
      console.log({ Month });
  
      const createPlan = await prisma.travelPlan.create({
        data: {
          user_id: user_id,
          created_date: createdDate,
          month: Month,
          status: "Draft",
        },
      });
      console.log({ createPlan });
  
      const travelPlanid = createPlan.id;
      console.log({ travelPlanid });
      let createdPlan = [];
      let doctorId = [];
  
      for (let i = 0; i < plan.length; i++) {
        const date = plan[i].date;
        console.log({ date });
        const doctors = plan[i].doctors;
        console.log({ doctors });
  
        for (let j = 0; j < doctors.length; j++) {
          const dr_id = doctors[j];
          doctorId.push(dr_id);
  
          const createDetailedPlan = await prisma.detailedTravelPlan.create({
            data: {
              travelplan_id: travelPlanid,
              dr_id: dr_id,
              user_id: user_id,
              date: date,
              status: "Draft",
              created_date: createdDate,
            },
          });
  
          console.log({ createDetailedPlan });
          createdPlan.push(createDetailedPlan);
        }
      }
  
      // Counting the number of doctors
      const countDrId = {};
  
      doctorId.forEach((id) => {
        if (countDrId[id]) {
          countDrId[id]++;
        } else {
          countDrId[id] = 1;
        }
      });
      console.log({ countDrId });
  
      const visitCount = [];
      const uniqueId = new Set();
      for (let i = 0; i < doctorId.length; i++) {
        const drId = doctorId[i];
        if (!uniqueId.has(drId)) {
          const findVisitCount = await prisma.doctor_details.findMany({
            where: {
              id: drId,
            },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              no_of_visits: true,
            },
          });
          console.log({ findVisitCount });
          visitCount.push(...findVisitCount); // Spread the results
          uniqueId.add(drId);
        }
      }
      console.log({ visitCount });
  
      // Convert visitCount to a dictionary for easy lookup
      const visitCountDict = visitCount.reduce((acc, doctor) => {
        acc[doctor.id] = doctor.no_of_visits;
        return acc;
      }, {});
  
    // Calculate missed visits
const missedVisits = {};
for (const [drId, plannedVisits] of Object.entries(countDrId)) {
    const recordedVisits = visitCountDict[drId] || 0;
    const missed = recordedVisits - plannedVisits; // Subtract planned from recorded
    if (missed > 0) {
        missedVisits[drId] = missed;
    }
}

// Replace doctor IDs with names in the response
const responseWithDoctorNames = visitCount.map(({ id, firstName, lastName }) => {
    return {
        doctorName: `${firstName} ${lastName}`,
        plannedVisits: countDrId[id] || 0,
        recordedVisits: visitCountDict[id] || 0,
        missedVisits: Math.max((visitCountDict[id] || 0) - (countDrId[id] || 0), 0) // Corrected calculation
    };
});

      res.status(200).json({
        error: false,
        success: true,
        message: "Successful",
        data: createPlan,
        createdPlan: createdPlan,
        dr_id: doctorId,
        countDrId: countDrId,
        visitCount: visitCount,
        missedVisits: missedVisits,
        combinedVisitReport: responseWithDoctorNames,
      });
    } catch (err) {
      console.log({ err });
      res.status(404).json({
        error: true,
        success: false,
        message: "Internal server error",
      });
    }
  };
  


//getting the travelPlan(in use)
const getTravelPlan = async(req,res)=>{
    try{
        const{travelPlanId} = req.body
        const getDetails = await prisma.detailedTravelPlan.findMany({
            where:{
                travelplan_id:travelPlanId
            }
          
        })
        //find dr name
        // const drName = []
        for(let i=0; i<getDetails.length; i++){
            const findDr = await prisma.doctor_details.findMany({
                where:{
                    id:getDetails[i].dr_id
                },
                select:{
                    id:true,
                    firstName:true,
                    lastName:true
                }
              
            })
            console.log({findDr})
            getDetails[i] = {
                ...getDetails[i],
                drDetails: findDr
            };
        }
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:getDetails
        })
    }catch(err){
        console.log({err})
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error",
            data:Successfull
        })
    }
}

//change status for travelPlan(in use)
const changeStatus = async(req,res)=>{
    try{
        const{tripId} = req.body
        const changeTripStatus = await prisma.travelPlan.update({
            where:{
                id:tripId
                
            },
            data:{
                status:"Submitted"
            }
        })
        const changeStatus = await prisma.detailedTravelPlan.updateMany({
            where:{
                travelplan_id:tripId
                
            },
            data:{
                status:"Submitted"
            }
        })

        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            changeTripStatus:changeTripStatus,
            changeStatus:changeStatus
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




const cancelTP = async(req,res)=>{
    try{
        const{tripId} = req.body
        const changeTripStatus = await prisma.travelPlan.update({
            where:{
                id:tripId
                
            },
            data:{
                status:"Cancel"
            }
        })
        const changeStatus = await prisma.detailedTravelPlan.updateMany({
            where:{
                travelplan_id:tripId
                
            },
            data:{
                status:"Cancel"
            }
        })

        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            changeTripStatus:changeTripStatus,
            changeStatus:changeStatus
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


const markAsVisitedForTp = async(req,res)=>{
    try{
        const{reporterUniqueId,reporterId,date,time,products,remark,doctorId,travelid} = req.body
        const currentDate =new Date()
       

        const visiteddate = new Date()
        
        const formatteddate = formatnewDate(visiteddate);
        console.log({formatteddate})
        
        const markVisited = await prisma.reporting_details.create({
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
        console.log({markVisited})
        const markedDate = markVisited.visited_date
        console.log({markedDate})
        // const dateOnly = markedDate.toLocaleDateString(); 
        // console.log({dateOnly});
    
        
       
        const visitedId = markVisited.id
        console.log({visitedId})
        let visitReport
        if(date && time){
            visitReport = await prisma.reporting_details.update({
                where:{
                    id:visitedId
                },
                data:{
                    reporting_type:"Offline Reporting"
                }
            })
        }else{
            visitReport = await prisma.reporting_details.update({
                where:{
                    id:visitedId
                },
                data:{
                    reporting_type:"Online Reporting"
                }
            })
        }
        console.log({visitReport})
        //get the datetime from the response
        // const markeddate = new Date(markVisited.datetime)
        // console.log({markeddate})
        const markeddate = markVisited.visited_date
        console.log({markeddate})
      
        //for getting the count of lines
        const countVisits = await prisma.reporting_details.count({
            where:{
                unique_reqId:reporterUniqueId,
                doctor_id:doctorId,
                visited_date:markeddate
            }
        })
        console.log({countVisits})
        //getting the number of visits of doctor
        let getVisitReport = await prisma.doctor_details.findFirst({
            where:{
                created_UId:reporterUniqueId,
                id:doctorId
            },
            select:{
                no_of_visits:true
            }
        })
     
        console.log({getVisitReport})
        
        const visitCount = getVisitReport.no_of_visits
         console.log({visitCount})
        //calculating the balance visits
        const balanceVisit = visitCount-countVisits
        console.log({balanceVisit})
        // finding the line which should get update 
        const findVisitRecord = await prisma.visit_record.findFirst({
        where:{
            requesterUniqueId:reporterUniqueId,
            dr_Id:doctorId,
            travel_id:travelid
        }
        })
// 
    
        console.log({findVisitRecord})
        const visitID = findVisitRecord.id
        console.log({visitID})
        const visitDate = findVisitRecord.date
        console.log({visitDate})
        const dateTime = findVisitRecord.dateTime
        console.log({dateTime})
        const requester_id = findVisitRecord.requesterId
        console.log({requester_id})
        const requesterUniqueId = findVisitRecord.requesterUniqueId
        console.log({requesterUniqueId})
        const drId = findVisitRecord.dr_Id
        console.log({drId})
        const total_visits=findVisitRecord.total_visits
        console.log({total_visits})
        const travelplanID =findVisitRecord.travel_id
        console.log({travelplanID})

        if(!findVisitRecord){
            return res.status(404).json({
                error:true,
                success:false,
                message:"No visit record found"
            })
        }else{
           if(visitDate === null){
            const updateDate = await prisma.visit_record.update({
                where:{
                    id:visitID
                },
                data:{
                   date:formatteddate,
                   dateTime:currentDate
                }
            })
            console.log({updateDate})
            const updatedate = updateDate.date
            console.log({updatedate})
             

            
           }
           if(findVisitRecord.balance_visit === 0){
            return res.status(404).json({
               error:true,
               success:false,
               message:"Balance visit is 0"
            })
          }
           const currentMonth = currentDate.getMonth() + 1  ;
           console.log({currentMonth})
           const findexistingVisit = await prisma.visit_record.findMany({
            where:{
                id:visitID
            },
            select:{
                date:true
            }
           })
           console.log({findexistingVisit})
           let theDate=''
           theDate=findexistingVisit[findexistingVisit.length-1].date;
           console.log({theDate})
           const getMonthFromDate = (dateString) => {
            const dateParts = dateString.split('-');
            return parseInt(dateParts[1], 10);
        };
        
      
        theDate= getMonthFromDate(theDate);
        console.log(theDate); // Output: 7

        
           console.log({findexistingVisit})
           if(findexistingVisit.length>0){
           

            if(currentMonth !== theDate){
                const addNewDate = await prisma.visit_record.create({
                    data:{
                        // id:visitID,
                        dateTime:currentDate,
                        date:formatteddate,
                        requesterId:requester_id,
                        requesterUniqueId:requesterUniqueId,
                        dr_Id:drId,
                        total_visits:total_visits,
                        visited:1,
                        balance_visit:balanceVisit,
                        travel_id:travelplanID
                    }
                })
                console.log({addNewDate})
                return res.status(200).json({
                    error:false,
                    success:true,
                    message:"Successfull",
                    data:addNewDate,
                    updateVisit:addNewDate
                })
            }
           
          
          
        
        const updateVisit = await prisma.visit_record.update({
            where:{
               id:visitID
            },
            data:{
              requesterId:reporterId,
              visited:countVisits,
              balance_visit:balanceVisit,
              dateTime:currentDate
            }
        })
        console.log({updateVisit})  
          
        
        
       return res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:visitReport,
            updateVisit:updateVisit
        })
 
    }
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


module.exports = {
    rep_registration, login, add_doctor, get_addedDoctors, leaveHistory, single_Details, delete_doctor, filter_dr, get_doctorDetail, delete_rep, report_expense,
    individual_expenseReport, add_drAddress, total_repCount, total_drCount, search_Rep, add_chemist, get_chemist, delete_chemist, search_chemist,
    edit_chemist, add_product, delete_product,editProduct, get_product, get_headquarters,notifications,searchByDate,search_expenseTable,
    markAsVisited,getVisitReport,singleChemistDetail,visitedDays,getSpecialization,getVisitedDates,getDoctorAddress,checkLocation,visitedDetailsByMonth,createTravelplan,
    getTravelPlan,changeStatus,cancelTP,markAsVisitedForTp
}