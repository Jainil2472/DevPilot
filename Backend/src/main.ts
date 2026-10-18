import 'dotenv/config'
import connection from './db/index.js'
import app from './app.js'

const port = process.env.PORT || 8000
connection()
.then(()=>{
    app.listen(port,()=>{
        console.log(`the server is running on port ${port} `);
    })
})
.catch((err) => {
    console.log("mongodb connection failed");
})