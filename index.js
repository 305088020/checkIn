const axiosInstance = axios.create({
  	    headers: {'Content-Type': 'application/json;charset=utf-8'},// 设置传输内容的类型和编码
  	});

// 设置cookie
var app = new Vue({
	el: '#app',
	data: {
		checkInfo: '',
		checkOutInfo: '',
		checkInFlag: true,
		checkOutFlag: true,
		today: new Date(),
		returnMessage:'',
		id:'',
	},
	created: function(){
		this.getCookie();
		this.searchCheckInfo();
	},
	computed:{
		date: function () {
		  return (Format(this.today,"yyyy-MM-dd"));
		},
		day: function () {
		  return xingqi(this.today);
		},
	},
	methods: {
		getCookie: function(){
			this.id = getCookie('id');
		},
		setCookie: function (){
			console.log('cookie' + this.id);
			setCookie('id', this.id, 365);
			this.$buefy.toast.open({
			    message: '用户设置成功！11',
			    type: 'is-dark'
			});
			this.searchCheckInfo();
		},
		searchCheckInfo: function(){
			// if(th != undefined){
			// 	this = th;
			// }
			if(this.id == ''){
				this.$buefy.toast.open({
			        message: '先设置用户！',
			        type: 'is-dark'
			    });
				return;
			};
			axiosInstance.get('searchInfo?id='+this.id)
			  .then((response)=> {
				if(response.data['status'] != undefined && response.data['status'] == 'fail'){
					console.log(this);
					this.$buefy.toast.open({
					    message: '无此用户！',
					    type: 'is-dark'
					});
					return;
				}
				let checkInSign = response.data.signbtns[0]['sign']
				let checkOutSign = response.data.signbtns[1]['sign']
				if(checkInSign){
					this.checkInfo = response.data.signbtns[0]['detail']['signTime'] || '';
				}
				if(checkOutSign){
					this.checkOutInfo = response.data.signbtns[1]['detail']['signTime'];
				}
				if(this.checkInfo != ''){
					this.checkInfo = '已签到：(' + this.checkInfo + ')';
					this.checkOutFlag = false;
				}else{
					this.checkInFlag = false;
					this.checkOutFlag = true;
				}
				if(this.checkOutInfo != ''){
					this.checkOutInfo = '已签退：(' + this.checkOutInfo + ')';
					this.checkOutFlag = false;
				}
			  })
			  .catch(function (error) {
				this.checkInfo = error
				console.log(error);
			});
		},
		checkin: function(){
			axiosInstance.get('checkIn?id='+this.id)
			  .then((response)=>  {
				if(response.data['status'] != undefined && response.data['status'] == 'fail'){
					console.log(this);
					this.$buefy.toast.open({
					    message: '无此用户！',
					    type: 'is-dark'
					});
					return;
				}
				this.$buefy.toast.open({
				    message: '签到成功！',
				    type: 'is-dark'
				});
				this.$options.methods.searchCheckInfo.call(this);
			  })
			  .catch(function (error) {
				console.log(error);
			});
		},
		checkout: function(){
		  axiosInstance.get('checkOut?id='+this.id)
			  .then((response)=>  {
				if(response.data['status'] != undefined && response.data['status'] == 'fail'){
					console.log(this);
					this.$buefy.toast.open({
					    message: '无此用户！',
					    type: 'is-dark'
					});
					return;
				}
				this.$buefy.toast.open({
				    message: '签退成功！',
				    type: 'is-dark'
				});
				this.$options.methods.searchCheckInfo.call(this);
			  })
			  .catch(function (error) {
				console.log(error);
		  });
		}
	}
})







