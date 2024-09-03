const express = require('express')
const server = express()
const cors = require('cors')
//for python
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();



var bodyParser = require('body-parser')
const managerRouter = require('./routes/manager/manager.routes')
const repRouter = require('./routes/rep/rep.routes')
const adminRouter = require('./routes/Admin/admin.route')
const userRouter = require('./routes/User/user.route');




server.use(cors({
  origin: "*",
  allowedHeaders: "X-Requested-With,Content-Type,auth-token,Authorization",
  credentials: true
}))
server.use(express.json())
server.use(bodyParser.json())

server.use('/manager', managerRouter)
server.use('/rep', repRouter)
server.use('/admin', adminRouter)
server.use('/user', userRouter)



//python code


server.post('/generate-visit-plan', async (req, res) => {

  const { userId, month } = req.body;

  if (!userId) {
    return res.status(400).json({ error: true, message: 'userId is required.' });
  }

  try {
    // Fetch doctor details
    const findDr = await prisma.doctor_details.findMany({
      where: {
        created_UId: userId
      },
      select: {
        id: true,
        firstName: true,
        created_UId: true,
        visit_type: true
      }
    });

    if (findDr.length === 0) {
      return res.status(404).json({ error: true, message: 'No doctors found for the given userId.' });
    }

    const scheduleData = [];
    for (let i = 0; i < findDr.length; i++) {
      const doctorId = findDr[i].id;

      // Fetch address and schedule for each doctor
      const findAddress = await prisma.doctor_address.findMany({
        where: {
          doc_id: doctorId
        },
        select: {
          id: true,
          doc_id: true,
          userId: true,
          address: true,
          area: true
        }
      });

      const findSchedule = await prisma.schedule.findMany({
        where: {
          dr_id: doctorId
        }
      });

      scheduleData.push({
        findDr: findDr[i],
        findAddress: findAddress,
        findSchedule: findSchedule
      });
    }
console.log({scheduleData});
    // Write schedule data to a JSON file
    const scheduleDataPath = path.join(__dirname, 'scheduleData.json');
    
    console.log('Schedule Data Path:', scheduleDataPath ); // Debugging line

    const dataToSend = {
      scheduleData,
      month
    };
console.log({dataToSend})
    fs.writeFileSync(scheduleDataPath, JSON.stringify(dataToSend, null, 2));


    const executePythonScript = () => {
      console.log('Starting Python script execution...');
      return new Promise((resolve, reject) => {
    
        exec(`python python/travelplan.py ${scheduleDataPath}`, (error, stdout, stderr) => {
          
          if (error) {
            console.log("error")
            console.error(`Error executing script: ${error.message}`);
            console.error(`Error stack: ${error.stack}`);
            return reject(error);
          }
    
          if (stderr) {
            console.log("ERROR")
            console.error(`Python stderr: ${stderr}`);
          }
          // console.log("Error in the given code")    
          console.log('Python stdout:', stdout); // Log the stdout to see the output from Python
          resolve(stdout);
        });
      });
    };
    

    // Wait for the Python script to complete

    // const runPythonScript = async () => {

    //   try {
    //     const pythonOutput = await executePythonScript();
    //     console.log('Raw Python Output:', pythonOutput);
    
    //     let parsedOutput;
    //     try {
    //       parsedOutput = JSON.parse(pythonOutput);
    //       console.log({parsedOutput})
    //     } catch (parseError) {
    //       console.error('Failed to parse Python output:', parseError);
    //       return res.status(500).send(`Invalid JSON output from the Python script: ${pythonOutput}`);
    //     }
    
    //     return res.status(200).json({ data: parsedOutput });
    //   } catch (error) {
    //     console.error('Error in runPythonScript:', error);
    //     return res.status(500).send('An error occurred while executing the script.');
    //   }
    // };
    const runPythonScript = async () => {
      try {
        // Wait for the Python script to complete
        const pythonOutput = await executePythonScript();
        console.log({pythonOutput})
        // Send the output as the response
      let  parsedOutput = JSON.parse(pythonOutput);
        return res.status(200).json({ data: parsedOutput })

      } catch (error) {
        // Handle any errors
        console.error('Error in runPythoffffffnScript:', error);
        return res.status(500).send('An error occurred while executing the script.');
      }
    };

    // const runPythonScript = async () => {
    //   try {
    //     const pythonOutput = await executePythonScript();
    //     console.log('Raw Python Output:', pythonOutput);
    
    //     // Assuming you want to return the raw output directly as plain text
    //     return res.status(200).send(pythonOutput);
    
    //   } catch (error) {
    //     console.error('Error in runPythonScript:', error);
    //     return res.status(500).send('An error occurred while executing the script.');
    //   }
    // };
    // Ensure this line awaits the runPythonScript
    await runPythonScript();
    
  //  runPythonScript();
  

  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ error: true, message: 'An error occurred while generating the visit plan.' });
  }
});








server.listen(3004, () => {
  console.log("server started at http://localhost:3004")
})