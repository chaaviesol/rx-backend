const express = require('express')
const server = express()
const cors = require('cors')
//for python
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

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
    return res.status(400).json({ 
      error: true, 
      message: 'userId is required' 
    });
  }

  try {
    const findDr = await prisma.doctor_details.findMany({
      where: { 
        created_UId: userId 
      },
      select: {
        id: true,
        firstName: true,
        lastName:true, 
        created_UId: true, 
        visit_type: true 
      }
    });

    if (findDr.length === 0) {
      return res.status(404).json({ 
        error: true, 
        message: 'No doctors found for the given userId' 
      });
    }

    const scheduleData = [];
    for (let i = 0; i < findDr.length; i++) {
      const doctorId = findDr[i].id;
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
     
    //getting the path of the scheduleData.json file 
    // const scheduleDataPath = path.join(__dirname, 'scheduleData.json');
    // console.log({scheduleDataPath})
    // const dataToSend = { scheduleData, month };
    // fs.writeFileSync(scheduleDataPath, JSON.stringify(dataToSend, null, 2));
    // //  console.log({dataToSend})
    // const executePythonScript = () => {
    //   console.log("hhhhhhhhh")
    //   return new Promise((resolve, reject) => {
    //     console.log("kkkkkkkkkkkkkk")
    //     const command = `python python/travelplan.py "${scheduleDataPath}"`;
    //     exec(command, { maxBuffer: 1024 * 1024 * 10}, (error, stdout, stderr) => {
    //       console.log("mmmmmmmmmmmmm")
    //       if (error) {
    //         console.log("Error-------")
    //         console.error(`Error executing script: ${error.message}`);
    //         return reject(error);
    //       }
    //       if (stderr) {
    //         console.log("stedrr")
    //         console.error(`Python stderr: ${stderr}`);
    //       }
    //       try {
    //         const result = JSON.parse(stdout);
    //         console.log("result------")
    //         resolve(result);
    //       } catch (parseError) {
    //         console.error(`Error parsing Python output: ${parseError.message}`);
    //         reject(parseError);
    //       }
    //     });
    //   });
    // };

    // const runPythonScript = async () => {
    //   try {
    //     const pythonOutput = await executePythonScript();
    //     return res.status(200).json({ data: pythonOutput });
    //   } catch (error) {
    //     console.error('Error in runPythonScript:', error);
    //     return res.status(500).send('An error occurred while executing the script.');
    //   }
    // };
 
    // await runPythonScript();

    const scheduleDataPath = path.join(__dirname, 'scheduleData.json');
    console.log({ scheduleDataPath });
    
    const dataToSend = { scheduleData, month };
    fs.writeFileSync(scheduleDataPath, JSON.stringify(dataToSend, null, 2));
    
    const executePythonScript = () => {
      console.log("Starting Python script execution...");
      return new Promise((resolve, reject) => {
        // Ensure the Python command is cross-platform friendly
        const pythonScriptPath = path.join(__dirname, 'python', 'travelplan.py');
        const command = `python "${pythonScriptPath}" "${scheduleDataPath}"`;
    
        console.log(`Executing command: ${command}`);
    
        exec(command, { maxBuffer: 1024 * 1024 * 20 }, (error, stdout, stderr) => {
          console.log("Inside exec callback");
          if (error) {
            console.log("Error in execution");
            console.error(`Error executing script: ${error.message}`);
            return reject(new Error("Python script execution failed"));
          }
          if (stderr) {
            console.log("Python stderr:");
            console.error(stderr);
          }
    
          // Log the raw stdout for debugging
          console.log(`Python stdout: ${stdout}`);
    
          // try {
          //   console.log("Parsing Python script output...");
          //   const result = JSON.parse(stdout); // Parsing the output
          //   console.log("Parsed result from Python script:", result);
          //   resolve(result);
          // } catch (parseError) {
          //   console.error(`Error parsing Python output: ${parseError.message}`);
          //   reject(new Error("Failed to parse Python script output"));
          // }

          try {
            // Remove any potential extraneous characters or text
            const cleanedStdout = stdout.trim();
            console.log("Parsing Python script output...");
            const result = JSON.parse(cleanedStdout); // Parsing the output
            console.log("Parsed result from Python script:", result);
            resolve(result);
          } catch (parseError) {
            console.error(`Error parsing Python output: ${parseError.message}`);
            reject(new Error("Failed to parse Python script output"));
          }
        });
      });
    };
    
    // const runPythonScript = async (req, res) => {
    //   try {
    //     const pythonOutput = await executePythonScript();
    //     // Send response back to client with parsed data
    //     return res.status(200).json({ data: pythonOutput });
    //   } catch (error) {
    //     console.error('Error in runPythonScript:', error);
    //     return res.status(500).send('An error occurred while executing the script.');
    //   }
    // };
    const runPythonScript = async () => {
      try {
        const pythonOutput = await executePythonScript();
        // Send response back to client with parsed data
        return res.status(200).json({ data: pythonOutput });
      } catch (error) {
        console.error('Error in runPythonScript:', error);
        return res.status(500).send('An error occurred while executing the script.');
      }
    };
    // await runPythonScript(req, res); // Make sure you have access to `req` and `res` here
   
    await runPythonScript();
  } catch (error) {
    console.error('An error had occurred:', error);
    return res.status(500).json({ error: true, message: 'An error occurred while generating the visit plan.' });
  }
});




server.listen(3004, () => {
  console.log("server started at http://localhost:3004")
})