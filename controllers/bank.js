const Complaints = require("../models/User");
const User = require("../models/User");
const Withdrawl=require("../models/Withdrawl");
const bcrypt = require("bcryptjs");
const Recharge=require("../models/Recharge");
const Recharging=require("../models/Recharging");
const request = require('request');
var crypto    = require('crypto');
const Razorpay = require('razorpay');
exports.postBank = (req, res, next) => {
    
    const comp=req.body;
    
    console.log(comp);
    User.findById(req.userFromToken._id,(err,user)=>{
        comp.email=user.email;
        user.bank_card.push(comp);
        user.save();
        return res.status(200).json({message:"Add succesfully"});
    })
    // new Complaints(comp).save((err,user)=>{
    //     console.log(err);
    //     return res.status(200).json({message:"Send succesfully"});
    // });

};
exports.deleteBank = (req, res, next) => {
    const key=req.body.key;
    User.findById(req.userFromToken._id,(err,user)=>{
        user.bank_card.splice(key,1);
        
        user.save();
        return res.status(200).json({message:"Remove succesfully"});
    })
    
    // new Complaints(comp).save((err,user)=>{
    //     console.log(err);
    //     return res.status(200).json({message:"Send succesfully"});
    // });

};


exports.postWithdrawl = async (req, res, next) => {
    const amount=Math.abs(parseFloat(req.body.amount));
    if(amount<100)
        return res.status(400).json({error:"Only more than 100 inr allowed"});
    var time=parseInt((new Date()).getTime());
    const old=await Withdrawl.find({user:req.userFromToken._id}).sort('-createdAt');
    if(old.length!==0){
        console.log(time);
        console.log(parseInt((new Date(old[0].createdAt)).getTime()));

        if(time-parseInt((new Date(old[0].createdAt)).getTime())<3600000){
            return res.status(400).json({error:"Withdraw is only allowed 1 time per hour!"});
        }
    }
    

    User.findById(req.userFromToken._id,(err,user)=>{
        bcrypt.compare(req.body.password, user.password).then((isMatch) => {
            
            if (isMatch) {
              if(parseFloat(user.budget)<amount)
                return res.status(401).json({error:"You don't have enough money!"});
              const comp={};
              comp.user=user._id;
              comp.bank=req.body.bank;
              comp.money=amount;
              user.budget=parseFloat(user.budget)-amount;
              user.save();
              new Withdrawl(comp).save();
              return res.status(200).json({message:'success! It will be take a few hours to transfer.'});
            } else return res.status(401).json({error:"Password incorrect!"});
          });
        
    })
    // new Complaints(comp).save((err,user)=>{
    //     console.log(err);
    //     return res.status(200).json({message:"Send succesfully"});
    // });

};

exports.getAdminWithdrawl = (req, res, next) => {
    

    (async ()=>{
        var withdrawls=await Withdrawl.find({'$or':[{status:'0'},{status:'1'}]}).sort("-createdAt");
        const res_data=[];
        for(var i=0;i<withdrawls.length;i++){
            try{
                const aa=await User.findById(withdrawls[i].user);
                res_data[i]={};
                res_data[i]._id=withdrawls[i]._id;
                res_data[i].status=withdrawls[i].status;
                res_data[i].userId=aa._id;
                res_data[i].userNickname=aa.nickname;
                res_data[i].userPhone=aa.phone;
                res_data[i].amount=withdrawls[i].money;
                res_data[i].actual_name=aa.bank_card[withdrawls[i].bank].actual_name;
                res_data[i].ifsc_code=aa.bank_card[withdrawls[i].bank].ifsc_code;
                res_data[i].bank_name=aa.bank_card[withdrawls[i].bank].bank_name;
                res_data[i].bank_account=aa.bank_card[withdrawls[i].bank].bank_account;
                res_data[i].state_territory=aa.bank_card[withdrawls[i].bank].state_territory;
                res_data[i].city=aa.bank_card[withdrawls[i].bank].city;
                res_data[i].address=aa.bank_card[withdrawls[i].bank].address;
                res_data[i].mobile_number=aa.bank_card[withdrawls[i].bank].mobile_number;
                res_data[i].email=aa.bank_card[withdrawls[i].bank].email;
                res_data[i].upi_account=aa.bank_card[withdrawls[i].bank].upi_account;
            }catch(ex){
                continue;
            }
            
        }
      
        return res.status(200).json({data:res_data});
    })();
    
   
    // new Complaints(comp).save((err,user)=>{
    //     console.log(err);
    //     return res.status(200).json({message:"Send succesfully"});
    // });

};

exports.postAdminWithdrawl = (req, res, next) => {
    
    
    (async ()=>{
        var withdrawls=await Withdrawl.findById(req.body.id);
        var user=await User.findById(withdrawls.user);
        // console.log("budget="+user.budget);
        // console.log("withdraw="+withdrawls.money);
        // console.log(req.body.status);
        // console.log(req.body.status);
        switch(req.body.status){
            case 2:{
                //decline
                //  console.log('decline');
                user.budget=parseFloat(user.budget)+parseFloat(withdrawls.money);
                withdrawls.status=2;
                const saved_w=await withdrawls.save();
                // console.log("withdraw status="+saved_w.status);
                break;
            }
            case 1:{
                 //approve
                //  console.log('approve');
                 withdrawls.status=1;
                 const saved_w=await withdrawls.save();
                // console.log("withdraw status="+saved_w.status);
                 break;
            }
            case 3:{
                //complete
                // console.log('complete');
                withdrawls.status=3;
                const saved_w=await withdrawls.save();
                // console.log("withdraw status="+saved_w.status);
                break;
            }
            case 4:{
                //error
                // console.log('error');
                user.budget=parseFloat(user.budget)+parseFloat(withdrawls.money);
                withdrawls.status=4;
                const saved_w=await withdrawls.save();
                // console.log("withdraw status="+saved_w.status);
                
                break;
            }
        }
        // console.log('user.budget= '+user.budget);
        try{
            const saved=await user.save();
            // console.log('saved user.budget='+saved.budget);
        }catch(ex){
            console.log(ex);
        }
        
        return res.status(200).json({message:'ok'});
    })();
    
   
    // new Complaints(comp).save((err,user)=>{
    //     console.log(err);
    //     return res.status(200).json({message:"Send succesfully"});
    // });

};



exports.getAdminRecharge = (req, res, next) => {
    

    (async ()=>{
        var recharges=await Recharge.find({}).sort("-createdAt");
        const res_data=[];
        for(var i=0;i<recharges.length;i++){
            try{
                const aa=await User.findById(recharges[i].user);
                res_data[i]={};
                res_data[i]._id=recharges[i]._id;
                res_data[i].status=recharges[i].status;
                res_data[i].orderID=recharges[i].orderID;
                res_data[i].createdAt=recharges[i].createdAt;
                res_data[i].userId=aa._id;
                res_data[i].userNickname=aa.nickname;
                res_data[i].userPhone=aa.phone;
                res_data[i].money=recharges[i].money;
                
            }catch(ex){
                continue;
            }
            
        }
      
        return res.status(200).json({data:res_data});
    })();
    
   
    // new Complaints(comp).save((err,user)=>{
    //     console.log(err);
    //     return res.status(200).json({message:"Send succesfully"});
    // });

};

exports.postAdminRecharge = (req, res, next) => {
    
    
    (async ()=>{
        var recharge=await Recharge.findById(req.body.id);
        var user=await User.findById(recharge.user);
        
        // console.log("budget="+user.budget);
        // console.log("withdraw="+recharge.money);
        // console.log(req.body.status);
        // console.log(req.body.status);
        if(req.body.status==1 && recharge.status!=1)       
            user.budget=parseFloat(user.budget)+parseFloat(recharge.money);              
        else if(req.body.status==-1 && recharge.status==1)       
            user.budget=parseFloat(user.budget)-parseFloat(recharge.money);   
        recharge.status=req.body.status;
       
        // console.log('user.budget= '+user.budget);
        try{
            const saved_w=await recharge.save();
            const saved=await user.save();
            // console.log('saved user.budget='+saved.budget);
        }catch(ex){
            console.log(ex);
        }
        

        var recharges=await Recharge.find({}).sort("-createdAt");
        const res_data=[];
        for(var i=0;i<recharges.length;i++){
            try{
                const aa=await User.findById(recharges[i].user);
                res_data[i]={};
                res_data[i]._id=recharges[i]._id;
                res_data[i].status=recharges[i].status;
                res_data[i].orderID=recharges[i].orderID;
                res_data[i].createdAt=recharges[i].createdAt;
                res_data[i].userId=aa._id;
                res_data[i].userNickname=aa.nickname;
                res_data[i].userPhone=aa.phone;
                res_data[i].money=recharges[i].money;
                
            }catch(ex){
                continue;
            }
            
        }
        
        return res.status(200).json({res_data});
        
    })();
    
   
    // new Complaints(comp).save((err,user)=>{
    //     console.log(err);
    //     return res.status(200).json({message:"Send succesfully"});
    // });

};



exports.getWithdrawlList = (req, res, next) => {
    

    (async ()=>{
        var withdrawls=await Withdrawl.find({user:req.userFromToken});
       
        return res.status(200).json({data:withdrawls});
    })();
    
   
    // new Complaints(comp).save((err,user)=>{
    //     console.log(err);
    //     return res.status(200).json({message:"Send succesfully"});
    // });

};

exports.getRechargeList = (req, res, next) => {
    

    (async ()=>{
        var recharges=await Recharge.find({user:req.userFromToken});
       
        return res.status(200).json({data:recharges});
    })();
    
   
    // new Complaints(comp).save((err,user)=>{
    //     console.log(err);
    //     return res.status(200).json({message:"Send succesfully"});
    // });

};
exports.postRecharge =async (req, res, next) => {   
    
    //manual recharge
    // const comp={};
    // comp.user=req.userFromToken._id;
    // const user=await User.findById(comp.user);
    // comp.phone=user.phone;
    // comp.money=req.body.money;
    // comp.orderID=req.body.email;
    // var existing = await Recharge.findOne({
    //     orderID: req.body.email
    //   });
    
    // if (existing) {
    // return res.status(200).json({
    //     message: 'already exists'
    // });
    // }
    // await (new Recharge(comp)).save();
    // return res.status(200).json({message:'ok'});

    //cashfree
    // User.findById(req.userFromToken._id,(err,user)=>{
    //     const orderID="order"+(new Date()).getTime();
    //     const comp={};
    //     comp.user=req.userFromToken._id;
    //     comp.money=Math.abs(parseFloat(req.body.amount));
    //     console.log(comp);
    //     new Recharge(comp).save((err,data)=>{
    //         var postData = {
    //             "appId" : process.env.CASHFREE_ID,
    //             "orderId" : data._id,
    //             "orderAmount" : Math.abs(parseFloat(req.body.amount)),
    //             "orderNote" : 'test',
    //             'customerName' : user.nickname,
    //             "customerEmail" : req.body.email,
    //             "customerPhone" : user.phone,
    //             "returnUrl" : process.env.APP_URL+"api/response-recharge",
    //             "notifyUrl" : process.env.APP_URL+"api/notify-recharge"
    //         };
    //         console.log(process.env.APP_URL+"response-recharge");
    //         mode = "PROD";
    //         secretKey = process.env.CASHFREE_KEY;
    //         // console.log(secretKey);
    //         sortedkeys = Object.keys(postData);
    //         url="";
    //         signatureData = "";
    //         sortedkeys.sort();
    //         for (var i = 0; i < sortedkeys.length; i++) {
    //             k = sortedkeys[i];
    //             signatureData += k + postData[k];
    //         }
    //         var signature = crypto.createHmac('sha256',secretKey).update(signatureData).digest('base64');
    //         postData['signature'] = signature;
    //         user.email=req.body.email;
    //         user.save();
    //         if (mode == "PROD") {
    //           url = "https://www.cashfree.com/checkout/post/submit";
    //         } else {
    //           url = "https://test.cashfree.com/billpay/checkout/post/submit";
    //         }
    //         return res.status(200).json({postData,url});
    //     });
        
        
        
       
    // });
    ////////////////////////////////////////////////
	// res.render('request',{postData : JSON.stringify(postData),url : url});
   

   
    // new Complaints(comp).save((err,user)=>{
    //     console.log(err);
    //     return res.status(200).json({message:"Send succesfully"});
    // });



    ///////////////////////////////////////////////////////////
    //Razorpay
    console.log("amount="+req.body.money);
    if(req.body.money==="" || req.body.email===""){
        return res.status(400).json({error:"Please input correct money"});
    }
    User.findById(req.userFromToken._id,(err,user)=>{
        const comp={};
        comp.user=req.userFromToken._id;
        comp.money=Math.abs(parseFloat(req.body.money));
        console.log(comp);
        user.email=req.body.email;
        user.save((err,saved)=>{
            new Recharge(comp).save((err,data)=>{  
                var options = {
                    amount: comp.money*100,  // amount in the smallest currency unit
                    currency: "INR",
                    receipt: "order_"+data._id
                  };
                  var instance = new Razorpay({
                    key_id: process.env.RAZ_KEY,
                    key_secret: process.env.RAZ_SECRET
                  })
                  instance.orders.create(options, function(err, order) {

                    if(!err){
                        new Recharging({
                            order:order.id,
                            recharge_id:data._id,
                            user:req.userFromToken._id
                        }).save((err,data)=>{
                            if(!err){
                                return res.status(200).json({order,key:process.env.RAZ_KEY,email:req.body.email,url: process.env.APP_URL+"api/response-recharge"});

                            }else{
                                return res.status(400).json({message:'error'});

                            }
                        })
                    }else{
                        return res.status(400).json({message:'error'});
                    }
                });
                
    
                
                
                
            });
        });
        
        
        
        
       
    });
};
exports.postResponseRecharge =async (req, res, next) => {    
    //Razorpay
    const order_ids=await Recharging.find().catch(err=>{
        return res.redirect('/my/recharge');
    });
	var bool_tmp=false;
	var recharge_id;
    for(var i=0;i<order_ids.length;i++){
		// console.log(req.body.razorpay_order_id+" "+ order_ids[i].order);
        if(order_ids[i].order==req.body.razorpay_order_id){
            body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
            var crypto = require("crypto");
            var expectedSignature = crypto.createHmac('sha256', process.env.RAZ_SECRET)
                                            .update(body.toString())
                                            .digest('hex');
            // console.log(expectedSignature+ " "+ req.body.razorpay_signature);                
            if(expectedSignature == req.body.razorpay_signature){
				recharge_id=order_ids[i].recharge_id;
				bool_tmp=true;
				break;
                
            }else{
                return res.redirect('/my/recharge');
            }
        }
        
    }
	if(bool_tmp){
		Recharge.findById(recharge_id,(err,data)=>{
                    console.log(data.money+"inr");
                    data.status=1;
                    data.save();
                    User.findById(data.user,(err,user)=>{
                        user.budget=parseFloat(user.budget)+parseFloat(data.money);
						console.log(user.budget+"inr");
                        user.save((err)=>{                   
                            return res.redirect('/my/recharge');
                        });
                    });
                
                });
	}else
		return res.redirect('/my/recharge');
    
    

   
    // new Complaints(comp).save((err,user)=>{
    //     console.log(err);
    //     return res.status(200).json({message:"Send succesfully"});
    // });

};
exports.postNotifyRecharge = (req, res, next) => {    


    return res.redirect('/my/recharge');
   
    // new Complaints(comp).save((err,user)=>{
    //     console.log(err);
    //     return res.status(200).json({message:"Send succesfully"});
    // });

};
exports.getBudget = (req, res, next) => {
    

    (async ()=>{
        var user=await User.findById(req.userFromToken);
       
        return res.status(200).json({budget:user.budget});
    })();
    
   
    // new Complaints(comp).save((err,user)=>{
    //     console.log(err);
    //     return res.status(200).json({message:"Send succesfully"});
    // });

};