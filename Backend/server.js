require ("dotenv").config()
const app=require("./src/app")
const connectToDB=require("./src/config/database")
// const {resume,selfDescription,jobDescription} =require("./src/services/temp")
// const generateInverviewReport=require("./src/services/ai.service")

connectToDB();  
app.get('/', (req, res) => {
    res.status(200).json({ message: "Vista ResuAI API is running!" });
});
// generateInverviewReport({resume,selfDescription,jobDescription});
app.listen(3000,()=>{
    console.log("Server running on port 3000")
})
