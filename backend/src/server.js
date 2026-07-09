import app from "./app.js";
import env from "./config/env.js";
import connectDb from "./database/db.js";

const PORT = env.PORT 

app.listen(PORT, () => {
    connectDb();
    console.log(`Server is listening on ${PORT}`);
})
