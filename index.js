const express =require('express');
const dbConnect = require('./config/dbConnect');
const app=express();
const dotenv=require('dotenv').config();
const PORT =process.env.PORT || 4000;
const authRouter=require('./routes/authRoutes');
const productRouter=require('./routes/productRoute');
const blogRouter=require('./routes/blogRoutes');
const bodyParser = require('body-parser');
const { notFound } = require('./middleware/errorHandler');
const {errorHandler} = require('./middleware/errorHandler');
const {authMiddleware,isAdmin} = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');
const morgan=require('morgan');

dbConnect();
//app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(cookieParser());

app.use('/api/user',authRouter);
app.use('/api/Product',productRouter);
app.use('/api/blog',blogRouter);

app.use(notFound);
app.use(errorHandler);
app.use(authMiddleware);
app.use(isAdmin);


app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
});



