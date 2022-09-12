import app from "./app";

if (!process.env.PORT) {
  require("dotenv").config();
}

const PORT = process.env.PORT || 8000;

//Connects to MongoDB and starts recurrent

app.listen(PORT, () => {
  console.log(`Server listing on port ${process.env.PORT}`);
});
