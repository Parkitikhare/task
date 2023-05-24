const mongoose =  require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/task")
.then(function(){
  console.log("connected to server")
})

const AdminSchema = new mongoose.Schema({
  firstName: String,
  lastName:String,
  email: String,
  mobileNum: String,
  password:String,
  tasks:{
    type: Array,
    ref: "taskModel"
  },
});

AdminSchema.plugin(passportLocalMongoose,{usernameField:'email'})

module.exports = mongoose.model('Admin', AdminSchema);
