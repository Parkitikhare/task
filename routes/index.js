var express = require('express');
var router = express.Router();
const AdminModel = require('./AdminModel');
const taskModel = require('./taskModel')
const UserModel = require('./userModel')
var passport  = require('passport');
var localStrategy = require('passport-local');
const userModel = require('./userModel');
passport.use(new localStrategy(AdminModel.authenticate()))
passport.use(AdminModel.createStrategy());
const excelJS = require("exceljs");

/* GET home page. */
router.get('/', async function(req, res, next) {
  const AllUser= await userModel.find()
  res.render('AllUser',{AllUser});
});
router.post('/addUser', async function (req, res) {
  let isUserexist=await userModel.findOne({email: req.body.email,})
  if(isUserexist){
    return res.redirect('/')
  }
  const user= await userModel.create({
   Name:req.body.name,
   email: req.body.email,
   mobile: req.body.mobile,
  })
 
   res.redirect('/')
 })
router.get('/assignTask', async function (req, res) {
  let AllUser
  if(req.query.userId){
    AllUser= await userModel.find({_id:req.query.userId})
    res.render('Assigntask',{AllUser})
  }else{
    AllUser= await userModel.find()
    res.render('Assigntask',{AllUser})
  }
 })
router.post('/assignTask', async function (req, res) {
  const user=await userModel.findById(req.body.userid)
  const Task=await taskModel.create({
    userId:user._id,
  username: user.Name,
 taskname:req.body.taskname,
  status:req.body.tasktype
  })
     res.redirect('/')
 })
router.get('/allTask', async function (req, res) {
  let AllTask
  if(req.query.userId){
    AllTask=await taskModel.find({userId:req.query.userId})
    res.render('AllTask',{AllTask})
  }else{
    AllTask=await taskModel.find()
    res.render('AllTask',{AllTask})

  }
 })
router.get('/login',isRedirect, function(req,res){
  res.render('login')
})


router.post('/login',passport.authenticate('local',{
  successRedirect:'/taskPage',
  failureRedirect:'/register'
}));



router.get('/addUser', async function (req, res) {
 
  res.render('AddUser')
})
router.post('/addUser', async function (req, res) {
 const user= await userModel.create({
  Name:req.body.name,
  email: req.body.email,
  mobile: req.body.mobile,
 })

  res.redirect('/')
})

router.get("/edit",async(req,res)=>{
  const task=await taskModel.findById(req.query.taskId)

  res.render("editTask",{task})
})
router.post("/editTask",async(req,res)=>{
console.log(req.body);
  const task= await taskModel.findById(req.body.id)
  console.log(task);
  task.taskname=req.body.taskname
  task.status=req.body.tasktype
  await task.save()

  res.redirect("/allTask")
})
router.get("/delete",async(req,res)=>{
  const task=await taskModel.findByIdAndDelete(req.query.taskId)

  res.redirect("/allTask")
})


router.get("/export",async (req,res)=>{
  const User=await userModel.find()

  const Task=await taskModel.find()

  const AllUserworkbook = new excelJS.Workbook();  // Create a new workbook

  const AllUserworksheet = AllUserworkbook.addWorksheet("All Users");
  const Alltaskworkbook = new excelJS.Workbook();  // Create a new workbook

  const AllTaskworksheet = Alltaskworkbook.addWorksheet("All Task");

  const path = "public"; 
  AllUserworksheet.columns = [
    { header: "S no.", key: "s_no", width: 10 }, 
    { header: "Name", key: "Name", width: 10 },
    { header: "email", key: "email", width: 10 },
    { header: "Mobile Number", key: "mobile", width: 10 }
];
AllTaskworksheet.columns = [
    { header: "S no.", key: "s_no", width: 10 }, 
    { header: "user ID", key: "userId", width: 10 },
    { header: "User Name", key: "username", width: 10 },
    { header: "Task Name", key: "taskname", width: 10 },
    { header: "Task status", key: "status", width: 10 },
];
let counter = 1;
User.forEach((user) => {
  user.s_no = counter;
  AllUserworksheet.addRow(user); // Add data in worksheet
  counter++;
});
let counter1 = 1;
Task.forEach((task) => {
  task.s_no = counter1;
  AllTaskworksheet.addRow(task); // Add data in worksheet
  counter++;
});

try {
  const userData = await AllUserworkbook.xlsx.writeFile(`${path}/users.xlsx`)
  const taskData = await Alltaskworkbook.xlsx.writeFile(`${path}/tasks.xlsx`)
   .then(() => {
     res.send({
       status: "success",
       message: "file successfully downloaded",
       path: `${path}`,
      });
   });
} catch (err) {
    res.send({
    status: "error",
    message: "Something went wrong",
    err
  });
  }
})




router.get('/logout',function(req,res,next){
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect('/login');
  }); 
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect('/login');
  } 
}

function isRedirect(req,res,next){
  if(req.isAuthenticated()){
    res.redirect('/taskPage')
  }else{
    return next();
  }
}
module.exports = router;
