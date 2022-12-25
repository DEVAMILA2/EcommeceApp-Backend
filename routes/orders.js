const Order = require("../models/Order");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require("./verifyToken");

const router = require("express").Router();

// test midlleware
const testCheckOut = (req,res,next)=>{
     
    next()
}

// CRETAE 

router.post("/", async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
})

//UPDATE 
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
})

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted!");
    } catch (err) {
        res.status(500).json(err)
    }
})

// GET ORDER
router.get("/find/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        res.status(200).json(order)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get("/find/userOrder/:id", verifyToken, async (req, res) => {
    try {
        const order = await Order.find({userId:{$in:[req.params.id]}})
        res.status(200).json(order)
    } catch (err) {
        res.status(500).json(err)
    }
})

// GET ALL Orders
router.get("/", async(req,res)=>{
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
      let orders;
  
      if (qNew) {
        orders = await Order.find().sort({ createdAt: -1 }).limit(1);
      } else if (qCategory) {
        orders = await Order.find({
          categories: {
            $in: [qCategory],
          },
        });
      } else {
        orders = await Order.find();
      }

      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
})

module.exports = router

