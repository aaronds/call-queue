var async = require("async"),
	CallQueue = require("../lib/call-queue").makeCallQueue(async.whilst);

describe("What I would like it to look like",function(){
	var noOpp = function(){};

	it("will construct from an simple object",function(){
		var q = new CallQueue({
			"hello" : function(world,fromHello){
			}
		});

		expect(q).toBeTruthy();
	});

	it("presents a 'outline' object which has all the same methods but their invocation is routed via the que",function(){

		var q = new CallQueue({"hello" : function(fromHello){}}),
			outline = null;

		outline = q.getOutline();

		expect(outline).toBeTruthy();

		expect(outline.hello).toBeTruthy();
		expect(typeof outline.hello).toEqual("function");
	});

	it("works for a simple case",function(){
		var done = false,
			test = null,
			q = null,
			outline = null;

		q = new CallQueue({
			go : function(fromGo){
				test = true;
				fromGo();
			}
		});

		outline = q.getOutline();

		runs(function(){
			outline.go(function(){
				done = true;
			});
		});

		waitsFor(function(){
			return done;
		});

		runs(function(){
			expect(test).toBeTruthy();
		});
	});

	it("two calls to the outline are executed in series",function(){
		var done = false,
			counter = 0,
			q = null,
			returnFromGo = null,
			outline = null;

		q = new CallQueue({
			go : function(fromGo){
				done = true;
				counter++;
				returnFromGo = fromGo;
			}
		});

		outline = q.getOutline();

		runs(function(){
			outline.go(noOpp);
			outline.go(noOpp);
		});

		waitsFor(function(){
			return done;
		});

		runs(function(){
			expect(counter).toEqual(1);
			done = false;
			returnFromGo();
		});

		waitsFor(function(){
			return done;
		});

		runs(function(){
			expect(counter).toEqual(2);
			done = false;
			returnFromGo();
		});
	});

	it("It will restart after a period of inactivity",function(){
		var done = false,
			counter = 0,
			q = null,
			returnFromGo = null,
			outline = null;

		q = new CallQueue({
			go : function(fromGo){
				done = true;
				counter++;
				returnFromGo = fromGo;
			}
		});

		outline = q.getOutline();

		runs(function(){
			outline.go(noOpp)
		});

		waitsFor(function(){
			return done;
		});

		runs(function(){
			expect(counter).toEqual(1);
			returnFromGo();
			done = false;

			setTimeout(function(){
				outline.go(noOpp);
			},1000);
		});

		waitsFor(function(){
			return done;
		});

		runs(function(){
			expect(counter).toEqual(2);
			returnFromGo();
		});
	});
});
