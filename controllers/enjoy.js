const User = require("../models/User");
const Enjoy = require("../models/Enjoy");
const Bonus1 = require("../models/Bonus1");
const Bonus2 = require("../models/Bonus2");
const MyEnjoy = require("../models/MyEnjoy");
var status = 0;
var d = new Date();
var start_time = d.getTime();
//betters info
var bet = [];
//
var bet_no = [];
//result
var result = [];
var all_log = [];
//total budget
var budget;
//total price
var no = 1;
var log_time;
var auto = false;
for (var i = 0; i < 4; i++) {
	bet[i] = [];
	bet_no[i] = 0;
	Enjoy.find({ level: i }).sort({ _id: -1 })
		.limit(10)
		.then(reviews => {
			all_log[i] = reviews;
		});
}



var completing = () => {
	setTimeout(betting, 30000);
	status = 1;
	no++;



	for (var k = 0; k < 4; k++) {
		// console.log(auto);
		if (auto == true) {
			// console.log('sdfsdfsdfsssssssss');
			var number_amounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			var budget_predict = 0;
			var top_budget_num, top_budget;
			let top_profits_arr=[];
			for (var i = 0; i < bet_no[k]; i++) {
				for (var l = 0; l < 13; l++) {
					number_amounts[l] += parseInt(bet[k][i][2][l]);

				}

			}
			var tmp_budget, tmp_price;
			for (i = 0; i < 10; i++) {
				if (i % 5 === 0) {
					tmp_price = Math.floor(number_amounts[i] * 7.82 + number_amounts[12] * 3.41 + number_amounts[11 - (i % 2)] * 0.47);
					tmp_budget = 0;
					for (var l = 0; l < 13; l++)
						tmp_budget += number_amounts[l];
					tmp_budget = Math.floor(tmp_budget - tmp_price - number_amounts[i] - number_amounts[12] - number_amounts[11 - (i % 2)]);
				} else if (i % 2 === 0) {
					tmp_price = Math.floor(number_amounts[i] * 7.82 + number_amounts[11] * 0.96);
					tmp_budget = 0;
					for (l = 0; l < 13; l++)
						tmp_budget += number_amounts[l];
					tmp_budget = Math.floor(tmp_budget - tmp_price - number_amounts[i] - number_amounts[11]);
				} else {
					tmp_price = Math.floor(number_amounts[i] * 7.82 + number_amounts[10] * 0.96);
					tmp_budget = 0;
					for (l = 0; l < 13; l++)
						tmp_budget += number_amounts[l];
					tmp_budget = tmp_budget - tmp_price - number_amounts[i] - number_amounts[10];
				}

				if (top_budget === undefined) {
					top_budget = tmp_budget;
					top_budget_num = i;
					top_profits_arr.push(i);
				} else {
					if (top_budget < tmp_budget) {
						top_budget = tmp_budget;
						top_budget_num = i;
						top_profits_arr=[];
						top_profits_arr.push(i);
					}else if (top_budget == tmp_budget) {
						top_profits_arr.push(i);
					}
				}


			}
			if(top_profits_arr.length>1){
				const index=Math.round(top_profits_arr.length*Math.random());
				result[k] = top_profits_arr[index];
			}else
				result[k] = top_budget_num;
			// console.log(result);
		}



		//each rooms -parity, sapre, ...
		budget = 0;
		for (var i = 0; i < bet_no[k]; i++) {
			//each betters...
			bet[k][i][3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			//total contract
			bet[k][i][4] = 0;
			//total price
			bet[k][i][5] = 0;
			for (var color = 0; color < 13; color++) {
				if (bet[k][i][2][color] == 0)
					continue;


				switch (color) {
					case 10:
						{
							// console.log("sdfsdf");
							if ([1, 3, 7, 9].find(ele => ele == result[k])) {
								bet[k][i][3][color] = parseInt(bet[k][i][2][color] * 0.98 * 2);
							} else if (result[k] == 5) {
								bet[k][i][3][color] = parseInt(bet[k][i][2][color] * 0.98 * 1.5);

							}

							// console.log(bet[i]);
							break;
						}
					case 11:
						{
							if ([2, 4, 6, 8].find(ele => ele == result[k])) {
								bet[k][i][3][color] = parseInt(bet[k][i][2][color] * 0.98 * 2);
							} else if (result[k] == 0) {
								bet[k][i][3][color] = parseInt(bet[k][i][2][color] * 0.98 * 1.5);


							}
							break;
						}
					case 12:
						{
							console.log(result[k]);
							if (result[k] == 0 || [0, 5].find(ele => ele == result[k])) {
								console.log('hi');
								bet[k][i][3][color] = parseInt(bet[k][i][2][color] * 0.98 * 4.5);
							}
							break;
						}
					default: {
						if (result[k] == color)
							bet[k][i][3][color] = parseInt(bet[k][i][2][color] * 0.98 * 9);
						break;
					}

				}
				bet[k][i][4] += bet[k][i][2][color];
				bet[k][i][5] += bet[k][i][3][color];
				//MyEnjoy add
				////////////////////////////////
				const myEnjoy = {};
				myEnjoy.period = log_time;
				myEnjoy.contract = bet[k][i][2][color];
				myEnjoy.select = color;
				myEnjoy.result = result[k];
				myEnjoy.amount = bet[k][i][3][color] - bet[k][i][2][color];
				myEnjoy.user = bet[k][i][0];
				myEnjoy.category = k;
				new MyEnjoy(myEnjoy)
					.save()
					.then((res) => {
					})
					.catch((res) => {
					});
				//player budget
				/////////////////////////////////////
				bet[0][i][1] += bet[k][i][3][color];
				//Enjoy log 
				////////////////////////////////
				budget = budget - bet[k][i][3][color] + bet[k][i][2][color];



			}

		}
		//Enjoy add
		//////////////////////////
		const enjoy = {};
		enjoy.joiner = bet_no[k];
		enjoy.budget = budget;
		enjoy.recommend = result[k];
		enjoy.price = Math.floor(1000 + Math.random() * 9000);
		enjoy.level = k;

		enjoy.createdAt = log_time;



		new Enjoy(enjoy)
			.save()
			.then((res) => {
			})
			.catch((res) => {
			});

	}
	bet[0].forEach((ele, index) => {
		User.findById(ele[0], (err, doc) => {
			// console.log(parseFloat(doc.budget)+" "+parseFloat(bet[2][index][1])+" "+ parseFloat(ele[1]));
			doc.budget = parseFloat(doc.budget) - parseFloat(bet[2][index][1]) + parseFloat(ele[1]);
			doc.save();
		});
	});




};
var betting = () => {
	setTimeout(completing, 150000);
	var d = new Date();
	var d = d.getFullYear() + "" + (1 + parseInt(d.getMonth())) + d.getUTCDate();
	if (log_time === undefined) {
		Enjoy.find({ createdAt: { '$regex': d + ".*" } }).sort({ createdAt: -1 }).exec((err, docs) => {
			// console.log(err);
			// console.log(docs);
			if (err || docs.length == 0) {
				log_time = d + "000" + 1;
				no = 1;
			}
			else {
				const tmp_no = parseInt(docs[0].createdAt.substring(d.length));
				if (tmp_no < 9)
					log_time = d + "000" + (tmp_no + 1);
				else if (tmp_no < 99)
					log_time = d + "00" + (tmp_no + 1);
				else if (tmp_no < 999)
					log_time = d + "0" + (tmp_no + 1);
				else if (tmp_no < 9999)
					log_time = d + "" + (tmp_no + 1);
				no = tmp_no + 1;
			}


			for (var i = 0; i < 4; i++) {
				status = 0;
				bet_no[i] = 0;
				d = new Date();
				start_time = d.getTime();
				bet[i] = [];
				result[i] = Math.round(Math.random() * 10);
				if (result[i] == 10) {
					result[i] = 0;
				}
			}

		});
	} else {
		if (no < 10)
			log_time = d + "000" + (no);
		else if (no < 100)
			log_time = d + "00" + (no);
		else if (no < 1000)
			log_time = d + "0" + (no);
		else if (no < 10000)
			log_time = d + "" + (no);


		for (var i = 0; i < 4; i++) {
			status = 0;
			bet_no[i] = 0;
			d = new Date();
			start_time = d.getTime();
			bet[i] = [];
			result[i] = Math.round(Math.random() * 10);
			if (result[i] == 10) {
				result[i] = 0;
			}
		}
	}




};
betting();



exports.getEnjoy = (req, res, next) => {
	//getInfo
	try {
		var d = new Date();
		var cur_time = d.getTime();
		const level = parseInt(req.params.level);
		if (bet[level].length == 0) {
			for (var i = 0; i < 4; i++) {
				bet[i][bet_no[i]] = [];
				bet[i][bet_no[i]][0] = req.userFromToken._id;
			}

			User.findById(req.userFromToken._id, (err, user) => {
				for (var i = 0; i < 4; i++) {
					bet[i][bet_no[i]][1] = user.budget;
					bet[i][bet_no[i]][2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
					//each betters...
					bet[i][bet_no[i]][3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
					//total contract
					bet[i][bet_no[i]][4] = 0;
					bet_no[i]++;
				}
				//console.log("budget="+user);

				// console.log(bet[0][1]+bet[0][0]);
				// console.log(bet_no);
				// console.log(bet[bet_no-1]);
				Enjoy.find({ level: level }).sort({ _id: -1 })
					.limit(10)
					.then(reviews => {
						all_log[level] = reviews;
						MyEnjoy.find({ '$and': [{ category: level }, { user: bet[level][bet_no[level] - 1][0] }] }).sort({ _id: -1 })
							.limit(10)
							.then(myReview => {
								Enjoy.find({ level: level }).count().then(enjoy_count => {
									MyEnjoy.find({ '$and': [{ category: level }, { user: bet[level][bet_no[level] - 1][0] }] }).count().then(my_enjoy_count => {
										// console.log(myReview);
										var tmp_bet = [];
										tmp_bet[0] = bet[0][bet_no[level] - 1][1];
										tmp_bet[1] = bet[0][bet_no[level] - 1][2];
										return res.status(200).json({
											log_time: log_time, time: cur_time - start_time,
											records: all_log[level], 'bet': tmp_bet, my_records: myReview,
											records_page: 1,
											last_records_page: Math.ceil(enjoy_count / 10),
											records_my_page: 1,
											last_records_my_page: Math.ceil(my_enjoy_count / 10)
										});


									});
								});
							});

					});

			});
		} else if (bet[level].find(ele => ele[0] == req.userFromToken._id) === undefined) {
			for (var i = 0; i < 4; i++) {
				bet[i][bet_no[i]] = [];
				bet[i][bet_no[i]][0] = req.userFromToken._id;
			}
			console.log('prior bet'+bet);

			User.findById(req.userFromToken._id, (err, user) => {
				for (var i = 0; i < 4; i++) {
					console.log('after bet[i][bet_no[i]]'+bet[i][bet_no[i]]);
					bet[i][bet_no[i]][1] = user.budget;
					bet[i][bet_no[i]][2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
					//each betters...
					bet[i][bet_no[i]][3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
					//total contract
					bet[i][bet_no[i]][4] = 0;
					bet_no[i]++;
				}
				//console.log("budget="+user);

				// console.log(bet[0][1]+bet[0][0]);
				// console.log(bet_no);
				// console.log(bet[bet_no-1]);
				Enjoy.find({ level: level }).sort({ _id: -1 })
					.limit(10)
					.then(reviews => {
						all_log[level] = reviews;
						try {
							MyEnjoy.find({ '$and': [{ category: level }, { user: req.userFromToken._id }] }).sort({ _id: -1 })
								.limit(10)
								.then(myReview => {
									// console.log(myReview);
									Enjoy.find({ level: level }).count().then(enjoy_count => {
										MyEnjoy.find({ '$and': [{ category: level }, { user: req.userFromToken._id }] }).count().then(my_enjoy_count => {
											// console.log(myReview);
											var tmp_bet = [];
											tmp_bet[0] = bet[0][bet_no[level] - 1][1];
											tmp_bet[1] = bet[0][bet_no[level] - 1][2];

											return res.status(200).json({
												log_time: log_time, time: cur_time - start_time,
												records: all_log[level], 'bet': tmp_bet, my_records: myReview,
												records_page: 1,
												last_records_page: Math.ceil(enjoy_count / 10),
												records_my_page: 1,
												last_records_my_page: Math.ceil(my_enjoy_count / 10)
											});


										});
									});

								});
						} catch (error) {
							console.log('fsl My Enjoy try catch error: ', error.message);
						}
					});

			});
		} else {
			if (status == 0) {
				//bettting
				// console.log('0');
				var _bet = bet[level].find(ele => ele[0] == req.userFromToken._id);
				var _bet_id = bet[level].findIndex(ele => ele[0] == req.userFromToken._id);
				// console.log(bet_no);
				// console.log(bet[bet_no-1]);
				Enjoy.find({ level: level }).sort({ _id: -1 })
					.limit(10)
					.then(reviews => {
						all_log[level] = reviews;
						MyEnjoy.find({ '$and': [{ category: level }, { user: req.userFromToken._id }] }).sort({ _id: -1 })
							.limit(10)
							.then(myReview => {

								Enjoy.find({ level: level }).count().then(enjoy_count => {
									MyEnjoy.find({ '$and': [{ category: level }, { user: req.userFromToken._id }] }).count().then(my_enjoy_count => {
										// console.log(myReview);
										var tmp_bet = [];
										tmp_bet[0] = bet[0][_bet_id][1];
										tmp_bet[1] = bet[level][_bet_id][2];
										return res.status(200).json({
											log_time: log_time, time: cur_time - start_time,
											records: all_log[level], 'bet': tmp_bet, my_records: myReview,
											records_page: 1,
											last_records_page: Math.ceil(enjoy_count / 10),
											records_my_page: 1,
											last_records_my_page: Math.ceil(my_enjoy_count / 10)
										});


									});
								});
							});

					});


			} else {


				var _bet = bet[level].find(ele => ele[0] == req.userFromToken._id);
				var _bet_id = bet[level].findIndex(ele => ele[0] == req.userFromToken._id);

				console.log('_bet_id'+_bet_id);
				Enjoy.find({ level: level }).sort({ _id: -1 })
					.limit(10)
					.then(reviews => {
						all_log[level] = reviews;
						MyEnjoy.find({ '$and': [{ category: level }, { user: _bet[0] }] }).sort({ _id: -1 })
							.limit(10)
							.then(myReview => {
								var tmp_contract = [0, 0, 0, 0];
								var tmp_price = [0, 0, 0, 0];
								for (var i = 0; i < 4; i++) {
									console.log('bet[i][_bet_id]='+bet[i][_bet_id]);
									tmp_contract[i] = bet[i][_bet_id][4];
									tmp_price[i] = Math.floor(1000 + Math.random() * 9000);
								


								}
								// console.log("price="+tmp_price);
								// console.log(myReview);

								Enjoy.find({ level: level }).count().then(enjoy_count => {
									MyEnjoy.find({ '$and': [{ category: level }, { user: _bet[0] }] }).count().then(my_enjoy_count => {
										var tmp_bet = [];
										console.log('_bet_id='+_bet_id);
										console.log(bet[level][_bet_id]);
										tmp_bet[0] = bet[0][_bet_id][1];
										tmp_bet[1] = bet[level][_bet_id][2];
										return res.status(200).json({
											number: result, price: tmp_price, contract: tmp_contract, log_time: log_time, time: cur_time - start_time,
											records: all_log[level], 'bet': tmp_bet, my_records: myReview,
											records_page: 1,
											last_records_page: Math.ceil(enjoy_count / 10),
											records_my_page: 1,
											last_records_my_page: Math.ceil(my_enjoy_count / 10)
										});


									});
								});


							});

					});



			}
		}
	} catch (error) {
		next(error);
	}


};
exports.postEnjoy = (req, res, next) => {
	try {
		var d = new Date();
		var cur_time = d.getTime();
		const level = req.body.level;
		if (status == 0) {
			var _bet = bet[level].find(ele => ele[0] == req.userFromToken._id);
			var _bet_id = bet[level].findIndex(ele => ele[0] == req.userFromToken._id);
			// console.log(bet_no);
			// console.log(bet[bet_no-1]);
			if (!_bet)
				return res.status(200).json({ 'error': "unknown user" });
			const input_contract = Math.abs(parseInt(req.body.contract_money));
			// _bet[2][parseInt(req.body.guess)]=
			if (input_contract < 10) {
				return res.status(200).json({ 'error': "more than 9 inr" });
			}
			else if (bet[0][_bet_id][1] - input_contract < 0) {
				return res.status(200).json({ 'error': "low budget" });
			}
			else {
				bet[0][_bet_id][1] = bet[0][_bet_id][1] - input_contract;
				_bet[2][parseInt(req.body.guess)] += input_contract;
			}
			var tmp = [];
			// const bonus1 = parseInt(input_contract) >= 1000 ? parseInt(input_contract) * 0.003 : parseInt(input_contract) * 0.006;
			// const bonus2 = parseInt(input_contract) >= 1000 ? parseInt(input_contract) * 0.0015 : parseInt(input_contract) * 0.003;
			const bonus1 =  parseInt(input_contract) * 0.01;
			const bonus2 =  parseInt(input_contract) * 0.005;
			User.findById(req.userFromToken._id, (err, user) => {
				if(user.refer1){
					const tmp1 = {};
					tmp1.better = req.userFromToken._id;
					tmp1.money = bonus1;
					tmp1.receiver = user.refer1;
					new Bonus1(tmp1)
						.save();
				}
				if(user.refer2){
					const tmp1 = {};
					tmp1.better = req.userFromToken._id;
					tmp1.money = bonus2;
					tmp1.receiver = user.refer2;
					new Bonus2(tmp1)
						.save();
				}				
				tmp[0] = bet[0][_bet_id][1];
				tmp[1] = bet[level][_bet_id][2];
				return res.status(200).json({ 'bet': tmp });
			});

		} else {
			return res.status(200).json({ 'error': "finished", time: cur_time - start_time });
		}
	} catch (error) {
		next(error);
	}

};
exports.getEnjoyPage = (req, res, next) => {
	try {
		const level = req.params.level;
		const page = req.params.page;
		Enjoy.find({ level: level }).sort({ _id: -1 })
			.skip((page - 1) * 10)
			.limit(10)
			.then(reviews => {
				Enjoy.find({ level: level }).count().then(enjoy_count => {

					return res.status(200).json({
						records: reviews,
						records_page: page,
						last_records_page: Math.ceil(enjoy_count / 10)
					});


				});
			});
	} catch (error) {
		next(error);
	}



};
exports.getEnjoyMyPage = (req, res, next) => {
	try {
		const level = req.params.level;
		const page = req.params.page;
		MyEnjoy.find({ '$and': [{ category: level }, { user: req.userFromToken._id }] }).sort({ _id: -1 })
			.skip((page - 1) * 10)
			.limit(10)
			.then(reviews => {
				MyEnjoy.find({ '$and': [{ category: level }, { user: req.userFromToken._id }] }).count().then(enjoy_count => {

					return res.status(200).json({
						my_records: reviews,
						records_my_page: page,
						last_records_my_page: Math.ceil(enjoy_count / 10)
					});


				});
			});
	} catch (error) {
		next(error);
	}



};



exports.getEnjoyAdmin = (req, res, next) => {
	try {
		if (req.params.level == 4) {
			var d = new Date();
			var cur_time = d.getTime();


			res.status(200).json({
				log_time: log_time,
				time: cur_time - start_time,
				bet: bet,
				auto: auto,
				'number': result
			});
		} else {
			const level = req.params.level;

			var d = new Date();
			var cur_time = d.getTime();


			res.status(200).json({
				log_time: log_time,
				time: cur_time - start_time,
				bet: bet[level],
				auto: auto,
				'number': result[level]
			});
		}
	} catch (error) {
		next(error);
	}





};
exports.postEnjoyAdmin = (req, res, next) => {
	try {
		const level = req.body.level;
		if (status == 0) {
			//bettting
			// console.log('0');

			// console.log(bet_no);
			// console.log(bet[bet_no-1]);
			if (req.body.number >= 0 && req.body.number < 10) {
				result[level] = req.body.number;
				return res.status(200).json({ 'message': 'ok' });
			} else {
				return res.status(200).json({ 'error': 'Numbers Range 0 ~ 9' });
			}



		} else {
			// console.log("number="+number);


			return res.status(200).json({ 'error': 'Already finished!' });
		}
	} catch (error) {
		next(error);
	}




};
exports.postEnjoyAdminAuto = (req, res, next) => {
	auto = req.body.auto;
	// console.log(auto);
	res.status(200).json({ message: "ok" });
};