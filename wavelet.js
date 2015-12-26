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
		var tickers = [];
		console.log("wavelet " + name + " created");

    	buffer = d3.range(n).map(function(){return d3.range(maxS).map(function(){return 0;});});

		wavelet.injectCodes = function(code, cb, do_analysis){
			//customize
			codes = code.map(function(d){
				prefix = d.toString().substr(0,2);
				if(prefix == "60") return "sh" + d;
				if(prefix == "00") return "sz" + d;
				if(prefix == "30") return "sz" + d;
				return d;
			});
			tickers = codes;
			if(do_analysis)
				return wavelet.testCodes(codes,cb);
			cb(codes);
			return wavelet;
		};
		wavelet.testCodes = function(code,cb){
			var url = baseurl + codes.toString();
			if(DEBUG)
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
			if(second < 1) second = 1;
			attack_speed = 1000 * second;
			if(!task) 
				return wavelet;
			return wavelet.stop().fire();
		};
		wavelet.setUrl = function(url){
			baseurl = url;
			return wavelet;
		};
		wavelet.fire = function(){
			var url = baseurl + codes.toString();

			console.log(name + " started pull data from " + baseurl);
			task = setInterval(function(){

				d3.select("head").select("#reload_"+ name).remove(); 
				////////
				// dont use same id
				// or if wavelet 1 create a script, wavelet 2 can remove it imediately
				////////////
				d3.select("head").append("script").attr("id","reload_" + name).attr("src",url).attr("onload",
					function(){
						console.log(name + " new data recieved");
						buffer.forEach(function(d,i){
							var s = eval("hq_str_" + codes[i]).split(","); //potential bug
							if( s == undefined){
								d.push(d[d.length-1]);
								d.shift();
							}
							else{
								d.push(+s[3]); //s[1] = open s[2] = close 
								d.shift();
							}
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
		wavelet.getRows = function(lastSeconds){
			//return last k data
			if(lastSeconds == undefined)
				return buffer.map(function(d){return d;});
			return buffer.map(function(d){return d.slice(-lastSeconds);});
		};
		wavelet.getColumns = function(indexes){

			if(typeof(indexes) == typeof([]))
				return d3.permute(buffer,indexes);
			if(typeof(indexes) == typeof(1))
				return buffer[indexes];
			return undefined;
		};

		wavelet.stop = function(){
			clearInterval(task);
		};

		wavelet.name = function(){
			return name;
		};
		wavelet.tickers = function(i){
			if(i == undefined) return tickers;
			return tickers[i];
		};

		return wavelet;

	}


}


    
