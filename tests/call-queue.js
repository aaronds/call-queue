describe("What I would like it to look like",function(){
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
});
