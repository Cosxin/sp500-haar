//TODO Sync part

var Wavelet = {

	names : [],
	sync_loc : Number,
	createNew : function(n,maxS,name){
			// if (Wavelet.names.include(name)) {
			// 	c
			// }
		var wavelet = {};
		var n = n;
		var maxS = maxS;
		var attack_speed = 3000;
		var baseurl = "http://hq.sinajs.cn/list=";
		wavelet.codes = [];
		wavelet.buffer = [];
		var name = name;
		var task = null;
		var price = [];
		console.log("wavelet " + name + " created");

		for(i = -1; ++i < n;){
    		wavelet.buffer[i] = [];
    		for(j = -1; ++j < maxS;){
    			wavelet.buffer[i].push(Math.random());
    		}
		}

		wavelet.injectCodes = function(codes){
			//customize
			wavelet.codes = codes.map(function(d){
				prefix = d.toString().substr(0,2);
				if(prefix == "60") return "sh" + d;
				if(prefix == "00") return "sz" + d;
				if(prefix == "30") return "sz" + d;
				return d;
			});
			return wavelet;
		};
		wavelet.setAttackSpeed = function(second){
			attack_speed = 1000 * second;
			return wavelet;
		};
		wavelet.setUrl = function(url){
			baseurl = url;
			return wavelet;
		};
		wavelet.fire = function(){
			var url = baseurl + wavelet.codes.toString();

			console.log(name + " started pull data from " + baseurl);
			task = setInterval(function(){

				d3.select("head").select("#reload_"+name).remove(); 
				////////
				// dont use same id
				// or if wavelet 1 create a script, wavelet 2 can remove it imediately
				////////////
				d3.select("head").append("script").attr("id","reload_"+name).attr("src",url).attr("onload",
					function(){
						console.log("new data recieved");
						wavelet.buffer.forEach(function(d,i){
							var s = eval("hq_str_"+wavelet.codes[i]).split(","); 
							//console.log(s[0] + " " + s[1]);
							d.push(+s[1]);
							d.shift();
						});
					});
			},attack_speed);
		};
		
		wavelet.stimulate = function(){
			task = setInterval(function(){
				console.log("new data recieved");
				wavelet.buffer.forEach(function(d,i){
					d.push(Math.random());
					d.shift();
				});
			},attack_speed);
		};

		return wavelet;
	}


}


    
