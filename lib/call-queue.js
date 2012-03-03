/*
 * A queue for serializing async function calls.
 */

(function(def){
	def(function(require,exports){

		/* Make a call queue using a platform specific 'whilst' function.
		 *
		 * @param whilst	A function whilst(testFn(),loopFn(loop)) async.whilst will do.
		 */

		exports.makeCallQueue = function(whilst){

			return function(obj){
				var restart = null,
					queue = [],
					add = null,
					makeOutline = null,
					callQueue = this;

				whilst(
					function(){ return true;},
					function(loop){
						var task = null,
							fnName = null,
							args = null,
							runLoop = null,
							fromTask = null;

						restart = false;

						if(queue.length < 1){
							restart = loop;
							return;
						}

						task = queue.shift();
						fnName = task.shift();
						fromTask = task.pop();
						args = task.slice();

						runLoop = function(){
							fromTask.apply(callQueue,arguments);
							loop();
						}

						args.push(runLoop);

						obj[fnName].apply(obj,args);	
					},
					function(){
						/* Smeg */
					}
				);

				this.cancelAll = function(){
					return queue.splice(0,callQueue.length);
				}

				add = function(parts){
					var fnName = null,
						fromTask = null;

					fnName = parts[0];
					fromTask = parts[parts.length - 1];

					if(typeof obj[fnName] !== "function"){
						throw "'" + fnName + "' is not a function.";
					}

					if(typeof fromTask !== "function"){
						throw "Last argument must be function";
					}

					queue.push(parts);

					if(restart){
						restart();
					}
				}

				makeOutline = function(name){
					return function(){
						var parts = Array.prototype.slice.apply(arguments);
						parts.unshift(name);
						add(parts);
					}
				}

				this.getOutline = function(){
					var key = null,
						outline = {};
					
					for(key in obj){
						if(obj.hasOwnProperty(key) && typeof obj[key] === "function"){
							outline[key] = makeOutline(key);
						}
					}

					return outline;
				}
			}
		}
	});
})(typeof define == "function" ? define : function(fn){
	fn(null,typeof exports == "object" ? exports : this);
});
