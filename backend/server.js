import express from "express"
import data from "./data.js"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("mondoDB connected")
  })
  .catch((error) => {
    console.log(err)
  })

const app = express()
app.use(cors())

app.get("/products", function (req, res) {
  res.send(data)
})

app.get("/products/:slug", function (req, res) {
  let product = data.find((item) => {
    if (req.params.slug == item.slug) {
      return item
    }
  })
  res.send(product)
})

app.get("/cartproduct/:id", function (req, res) {
  let product = data.find((item) => {
    if (req.params.id == item._id) {
      return item
    }
  })

  res.send(product)
})

let port = 8000

app.listen(port, () => {
  console.log("Backend Running port 8000")
})
