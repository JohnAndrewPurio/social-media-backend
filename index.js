const { config } = require('dotenv')
config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const connectToDB = require('./utils/connectToDB')

const app = express()
const port = process.env.PORT
const authRouter = require('./routes/authRoute')
const postRouter = require('./routes/postRoute')
const userRouter = require('./routes/userRoute')
const verifyTokenMiddleware = require('./middlewares/verifyTokenMiddleware')

connectToDB('socialMediaApp')

app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

app.use('/', authRouter)
app.use('/posts', verifyTokenMiddleware, postRouter)
app.use('/user', verifyTokenMiddleware, userRouter)

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`)
})

