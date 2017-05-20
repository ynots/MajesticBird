(function(){
	(function(){
		function pingAlive(){
			// lfc_alv = lifecycle alive date
			utils.mark_day('lfc.alv','alive',true,function(newday){
				if (newday)
					utils.count('c.alv');
			});
			// try again in 10 minutes
			setTimeout(pingAlive,1000*60*10);
		}
		// ping alive after 20 seconds (if the extension is disabled within the first 10 seconds of its installation,
		// it means it's not alive, and also that something stops it automatically.	
		setTimeout(pingAlive,20000);
	}());
}());