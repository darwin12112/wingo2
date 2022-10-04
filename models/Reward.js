const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RewardSchema = new Schema({  
  userphone:{
    type: Number,
    required:true,
    index:true
  },
  money:{
    type:Number,
	    required:true
  },

  status:{
    type:Boolean,
    default:false
  }
  
});

module.exports = Reward = mongoose.model("reward", RewardSchema);
