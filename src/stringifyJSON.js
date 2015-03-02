// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:
var stringifyJSON = function(obj) {

	var result = [];

	//cases: array
	if(Array.isArray(obj)){
		result = obj.map(function(x){return self.stringifyJSON(x)});
		return "[" +result.join() + "]";
	}

	//cases: object (cannot be null)
	if(obj && typeof obj === "object"){
		for(var key in obj) {
			if(typeof obj[key] !== "undefined" && typeof obj[key] !== "function") {
				result.push( self.stringifyJSON(key)+":"+self.stringifyJSON(obj[key]));  	
			}
		}
		return "{" + result.join() + "}";
	}

	//cases: String
	if(typeof obj === "string") return "\"" +obj + "\"";

	//cases: Null, Boolean, Number
	return String(obj);
};
