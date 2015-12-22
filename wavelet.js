//TODO Sync part
//Customized for sina api
var Wavelet = {

	names : [],
	sync_loc : Number,
	API : {
		sina : "http://hq.sinajs.cn/list="
	},

	createNew : function(n,maxS,name){
		if(name && n && maxS == undefined)
			return;
		if (Wavelet.names.includes(name)) {
			console.log("name exists");
			return;
		}
		var wavelet = {};
		var n = n;
		var maxS = maxS;
		var attack_speed = 3000;
		var baseurl = Wavelet.API.sina;
		var codes = [];
		var buffer = [];
		var name = name;
		var task = null;
		var rcv = false;
		console.log("wavelet " + name + " created");

		for(i = -1; ++i < n;){
    		buffer[i] = d3.range(maxS).map(function(){return 0;});
		}

		wavelet.injectCodes = function(code, cb){
			//customize
			codes = code.map(function(d){
				prefix = d.toString().substr(0,2);
				if(prefix == "60") return "sh" + d;
				if(prefix == "00") return "sz" + d;
				if(prefix == "30") return "sz" + d;
				return d;
			});
			return wavelet.testCodes(codes,cb);
		};

		wavelet.testCodes = function(code,cb){
			var url = baseurl + codes.toString();
			var tickers = []; 
			d3.select("head").append("script").attr("id","#test_"+ name).attr("src",url).attr("onload",
				function(){
					//need to Sync with matrix binding
							setTimeout(function(){
								console.log("tested codes try");
								try{
									codes.forEach(function(d,i){
										var s = eval("hq_str_" + d).split(",");
										tickers.push(s[0]);

									});
								}catch(e){
									console.log(e);
									tickers = code;
								}
								cb(tickers);
							}, 1000);
				});
			d3.select("head").select("#test_"+ name).remove();
			return wavelet;
		}
		wavelet.setAttackSpeed = function(second){
			attack_speed = 1000 * second;
			return wavelet;
		};
		wavelet.setUrl = function(url){
			baseurl = url;
			return wavelet;
		};
		wavelet.fire = function(){
			var url = baseurl + codes.toString();

			console.log(name + " started pull data from " + baseurl);
			task = setInterval(function(){

				d3.select("head").select("#reload_"+name).remove(); 
				////////
				// dont use same id
				// or if wavelet 1 create a script, wavelet 2 can remove it imediately
				////////////
				d3.select("head").append("script").attr("id","reload_"+name).attr("src",url).attr("onload",
					function(){
						console.log(name + " new data recieved");
						buffer.forEach(function(d,i){
							var s = eval("hq_str_"+codes[i]).split(","); 
							d.push(+s[3]); //s[1] = open s[2] = close 
							rcv = true;
							d.shift();
						});
					});
			},attack_speed);
			return wavelet;
		};
		
		wavelet.stimulate = function(){
			task = setInterval(function(){
				console.log(name + "new data recieved");
				buffer.forEach(function(d,i){
					d.push(Math.random());
					d.shift();
				});
			},attack_speed);
			return wavelet;
		};
		wavelet.getData = function(k){
			//return last k data
			if(k == undefined)
				return buffer.map(function(d){return d;});
			return buffer.map(function(d){return d.slice(-k);});
		};

		wavelet.stop = function(){
			clearInterval(task);
		};
		return wavelet;
	}


}


    
