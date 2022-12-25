const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors =require("cors");

//routes
const authRoute = require('./routes/auth');
const productRoute = require('./routes/products')
const orderRoute = require('./routes/orders')

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB connection Success!"))
    .catch((err)=>{
        console.log(err);
    });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);


app.listen(process.env.PORT || 5000, () => {
    console.log("backend is running");
})