import app from "./app.js";
import connectDb from "./db/db.js";
const port = process.env.PORT || 5000;
connectDb();

app.listen(port, () => {
  console.log(`server running on port::${port}`);
});
