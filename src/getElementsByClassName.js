// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className
){
	var result = [];
	return helper(className.split(' '), [document.body]);

	function helper(classNames, segment) {
		_.each(segment, function(element){
			if(_(classNames).intersection(element.classList).length === classNames.length) result.push(element);
			helper(classNames,element.childNodes);
		});

		return result;
	}
};

