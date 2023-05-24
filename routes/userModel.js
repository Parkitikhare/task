const mongoose =  require('mongoose')

const userSchema = new mongoose.Schema({
 
  Name:String,
  email: String,
  mobile: String,
 
  tasks:{
    type: Array,
    ref: "taskModel"
  },
});

module.exports = mongoose.model('userModel', userSchema);
