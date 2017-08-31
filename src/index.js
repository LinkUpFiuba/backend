import express from "express"

const app = express()
const port = process.env.PORT || 5000

app.set("port", port)

app.use(express.static(`${__dirname}/public`))

// views is directory for all template files
app.set("views", `${__dirname}/views`)
app.set("view engine", "ejs")

app.listen(app.get("port"), () => {
  console.log(`Node app is running on port ${port}`)
})
