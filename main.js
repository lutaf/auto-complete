var http = require('http')
	, fs = require('fs')
	, path = require('path')
	, router = require('./router');
	
String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};



function binsearch(data, val){
	if(!data) return -1;
	
	var low = 0,high = data.length - 1,word_size = val.length;
		
	while (low <= high){
		var mid = Math.floor((low+high)/2);
		tmp = data[mid][0].substr(0,word_size);
		
		if(tmp < val){
			low = mid +1;
		}else if( tmp >val){
			high = mid -1;
		}else{
			return 	mid;
		}
	}
	return -1;
}
function KeywordList ()
{

	this.data = [];
	this.count =0;
	
	this.search = function(kw,limited){
		
		var max_count = limited ||20;
		if(!kw ) return "";
		
		//先二分法查询前缀
		var idx = binsearch(this.data,kw);
		//console.log("idx=",idx);
		if(idx == -1) return "";
		
		var low = idx - 1;
    	while(low >= 0 && this.data[low][0].substr(0,kw.length) == kw){
        	low -= 1;
        }
 
    	var high = idx + 1
    	while( high < this.data.length && this.data[high][0].substr(0,kw.length) == kw)
        	high += 1;
 
 		//array.slice(begin,end) 不包含end
    	var ret = this.data.slice(low+1,high);
    	
    	//sort by weigth
    	ret.sort(function(a,b){ return b[1] - a[1];});
    	var tmp =[];
    	for(var i=0;i<Math.min(max_count,ret.length);i++)
    	{
    		tmp.push(ret[i][0]);
    	}
    	return tmp;
	 }
	 
	 //load 数据，并排序
	
	self = this;	
	this.init = function(data_dir){ 
		fs.readdir(data_dir,function(err,files){
			
			files.forEach(function(f){
			
				fs.readFile( path.join(data_dir,f),{encoding:'utf-8'},function(err,data){
						if(err) throw err;
						var lines = data.split("\n");
						
						for(var i=0;i< lines.length;i++)
						{
							var s = lines[i].trim();
							if(s.length ==0 ) continue;
							
							var  L = s.split("\t");
							var weight = parseInt(L[1]) ||0;
													
							self.data.push([L[0],weight]);
						}
						self.data.sort(function(a,b){ 
								
								if(a[0] < b[0]) return -1;
								if(a[0] > b[0]) return 1;
								return 0;
						
						});
						console.log("load " + f +"  success!");
						
					
				});		
			});

		});//end readdir
	}

}

var kw = new KeywordList();

kw.init("./data");

var urls= [
	['^/qs.b',function(req,res,param){
		 var query = param.query;
		 res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
		 
		 var js = kw.search(query.q,query.size);
  		 res.end(JSON.stringify(js));	
	}],
	
	['^/',function(req,res){
		
		 res.writeHead(200, {'Content-Type': 'text/html'});
		 
		 fs.readFile('./index.html', function (err, data) {
  				if (err) throw err;
  			 res.end(data);
		 });	
	}]
		
]


http.createServer(  router.include(urls) ).listen(8080, '0.0.0.0');
console.log('Server running at http://127.0.0.1:8080/');
