	class Calculator{
		constructor(Expression){
			let stack = [];
			let ex = Expression;

			while(stack.length > 0){
				console.log(stack[stack.length-1]);
				stack.pop();
			}

			this.toArray = function(Expression){
				var ret = [];
				for(var i = 0 ; i < Expression.length ; ++i){
					var num = 0, f = 0, aft = 0.0, p = 0;
					while(i < Expression.length && Expression[i] >= '0' && Expression[i] <= '9'){
						num*=10;
						num += (Expression[i]-'0');
						++i;
						f = 1;
					}
					var q = 0;
					if(i < Expression.length && Expression[i] == '.'){
						++i;
						while(i < Expression.length && Expression[i] >= '0' && Expression[i] <= '9'){
							aft*=10;
							aft += (Expression[i]-'0');
							++i;
							f = 1;
							++q;
						}
						aft /= (Math.pow(10, q));
						num += aft;
					}
					if(f == 1)  ret.push(num);
					if(i<Expression.length)   ret.push(Expression[i]);
				}
				var last = ret[0];
				if(this.isOperator(last)){
					ret[1] *= -1;
					ret.splice(0, 1);
					last = ret[0];
				}
				for(var i = 1 ; i < ret.length ; ++i){
					if(this.isOperator(last) && this.isOperator(ret[i])){
						ret[i+1] *= -1;
						ret.splice(i, 1);
					}
					last = ret[i];
				}
				return ret;
			}

			this.isOperator = function(x){
				return (x=="+" || x=="-" || x=="*" || x=="/" || x=="%" || x=="^");
			}

			this.toPostFix = function(A){
				let ret = [];
				let precedence = {
					'+' : 0,
					'-' : 0,
					'*' : 1,
					'/' : 1,
					'%' : 1,
					'^' : 2,
				};
				let st = [];
				for(var i = 0 ; i < A.length ; ++i){
					if(A[i] == '(')   st.push(A[i]);
					else if(A[i] == ')'){
						while(st.length > 0 && st[st.length-1] != '('){
							ret.push(st[st.length-1]);
							st.pop();
						}
						if(st[st.length-1] == '(')    st.pop();
					}else if(this.isOperator(A[i])){
						if(st.length == 0 || precedence[A[i]] > precedence[st[st.length-1]]){
							st.push(A[i]);    //the first operation | waiting the next operand
						}else{
							while(st.length > 0 && st[st.length-1] != '(' && precedence[st[st.length-1]] >= precedence[A[i]]){
								ret.push(st[st.length-1]);
								st.pop();
							}
							st.push(A[i]);
						}
					}else  ret.push(A[i]);
				}
				while(st.length > 0){
					if(st[st.length-1] != '('){
						ret.push(st[st.length-1]);
					}
					st.pop();
				}
				return ret;
			}

			this.calc = function(x, y, op){
				switch(op){
					case '+' : return x+y;
					case '-' : return x-y;
					case '*' : return x*y;
					case '^' : return Math.pow(x, y);
					case '/' : return x/y;
					case '%' : return x%y;
				}
			}

			this.calculate = function(Expression){
				let ex = this.toArray(Expression);
				ex = this.toPostFix(ex);
				let out = "";
				let st = [];
				for(var i = 0 ; i < ex.length ; ++i)
					console.log(ex[i]);
				st.push(ex[0]);
				st.push(ex[1]);
				for(var i = 2 ; i < ex.length ; ++i){
					if(this.isOperator(ex[i])){
						var s = st[st.length-1];
						st.pop();
						var f = st[st.length-1];
						st.pop();
						st.push(this.calc(f, s, ex[i]));
					}else{
						st.push(ex[i]);
					}
				}
				return st[0];
			}
		}
	}
	a = new Calculator("");
	var exp = "";
	
	function buttonClicked(){
		var txt = document.getElementById('expressionArea');
		var ans = document.getElementById("answer");
		ans.innerHTML = a.calculate(txt.value);
	}
	function one(){
		var txt = document.getElementById('expressionArea');
		exp += "1";
		txt.value = exp;
	}
	function two(){
		var txt = document.getElementById('expressionArea');
		exp += "2";
		txt.value = exp;
	}
	function three(){
		var txt = document.getElementById('expressionArea');
		exp += "3";
		txt.value = exp;
	}
	function four(){
		var txt = document.getElementById('expressionArea');
		exp += "4";
		txt.value = exp;
	}
	function five(){
		var txt = document.getElementById('expressionArea');
		exp += "5";
		txt.value = exp;
	}
	function six(){
		var txt = document.getElementById('expressionArea');
		exp += "6";
		txt.value = exp;
	}
	function seven(){
		var txt = document.getElementById('expressionArea');
		exp += "7";
		txt.value = exp;
	}
	function eight(){
		var txt = document.getElementById('expressionArea');
		exp += "8";
		txt.value = exp;
	}
	function nine(){
		var txt = document.getElementById('expressionArea');
		exp += "9";
		txt.value = exp;
	}
	function zero(){
		var txt = document.getElementById('expressionArea');
		exp += "0";
		txt.value = exp;
	}
	function minus(){
		var txt = document.getElementById('expressionArea');
		exp += "-";
		txt.value = exp;
	}
	function plus(){
		var txt = document.getElementById('expressionArea');
		exp += "+";
		txt.value = exp;
	}
	function power(){
		var txt = document.getElementById('expressionArea');
		exp += "^";
		txt.value = exp;
	}
	function mul(){
		var txt = document.getElementById('expressionArea');
		exp += "*";
		txt.value = exp;
	}
	function mod(){
		var txt = document.getElementById('expressionArea');
		exp += "%";
		txt.value = exp;
	}
	function divide(){
		var txt = document.getElementById('expressionArea');
		exp += "/";
		txt.value = exp;
	}
	function lp(){
		var txt = document.getElementById('expressionArea');
		exp += "(";
		txt.value = exp;
	}
	function rp(){
		var txt = document.getElementById('expressionArea');
		exp += ")";
		txt.value = exp;
	}
	function reset(){
		var txt = document.getElementById('expressionArea');
		exp = "";
		txt.value = exp;
	}
	function change(){
		var txt = document.getElementById('expressionArea');
		exp = "";
		exp = txt.value;
	}
