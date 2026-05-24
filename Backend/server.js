import app from "./src/app.js"
import connectDB from "./src/config/db.js"
import config from "./src/config/config.js";

connectDB();

const PORT= config.PORT || 300

app.listen(3000, ()=>{
    console.log("Server is running on port " + PORT)
})