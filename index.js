const express = require("express");
const { Connection } = require("./database/db");
const dotenv = require("dotenv");
const cors = require("cors");

// *****************************
const authRoutes = require("./routes/auth");
// const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const homeRoute = require('./routes/homeSection')
const blogRoute = require('./routes/Blogs')
const galleryRoute = require('./routes/Gallery')
const cartroute = require('./routes/cart')
const ordersRoute = require('./routes/order')

// *****************************

const app = express();

dotenv.config();
const PORT = process.env.PORT || 8000;

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('documents'))

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      "Access-Control-Allow-Methods": "PUT, POST, PATCH, DELETE, GET"
    });
    return res.status(200).end()
  }
  next();
});
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//     return res.status(200).json({});
//   }
//   next();
// });


// ********************************

app.use("/api", authRoutes);
// app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use('/api/home', homeRoute)
app.use("/api", blogRoute)
app.use("/api", galleryRoute)
app.use("/api", cartroute)
app.use("/api", ordersRoute)

// ********************************

const MONGODB_URL = process.env.MONGODB_URL;
Connection(MONGODB_URL);
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to Dudhi Server");
});
