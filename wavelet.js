//TODO Sync part

var Wavelet = {

	createNew : function(n,maxS,name){
		var wavelet = {};
		wavelet.n = n;
		wavelet.maxS = maxS;
		wavelet.attack_speed = 3000;
		wavelet.baseurl = "http://hq.sinajs.cn/list=";
		wavelet.codes = [];
		wavelet.buffer = [];
		wavelet.name = name;

		console.log("wavelet " + name + " created");

		for(i = -1; ++i < wavelet.n;){
    		wavelet.buffer[i] = [];
    		for(j = -1; ++j < wavelet.maxS;){
    			wavelet.buffer[i].push(Math.random());
    		}
		}

		wavelet.injectCodes = function(codes){
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
			wavelet.attack_speed = 1000 * second;
			return wavelet;
		};
		wavelet.setUrl = function(url){
			wavelet.baseurl = url;
			return wavelet;
		};
		wavelet.fire = function(){
			console.log(wavelet.name + " started pull data from " + wavelet.baseurl);
			var task = setInterval(function(){
				wavelet.buffer.forEach(function(d){
					d.shift();
					d.push(Math.random());
				});
			},wavelet.attack_speed);
		};


		return wavelet;
	}


}


    
