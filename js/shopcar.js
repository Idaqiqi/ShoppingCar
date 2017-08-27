/**
 * Created by Miss.Xie on 2017/8/24.
 */
var vm = new Vue({
    el:"#shopCar",
    //页面数据
    data:{
        productList:[],
        productListLength:0,
        selectAllFlag:false,
    },
    /*
    //生命周期： 页面加载完毕(实例化完毕)执行的方法
    //目的：让数据在初始化的时候完成数据显示
    //确保vue的实例vm完全插入文档并完成编译
    */
    mounted: function () {
        // 代码保证 this.$el 在 document 中
        this.$nextTick(function () {
            this.cartView();
        })
    },
    methods:{
        cartView(){
            /*请求接口数据
            * vue-resource插件 集成在vue里面的
            * 所以必须由vue实例去调用$http对象里的get方法获取接口数据
            * get方法的参数就是接口
            * 返回的结果通过then方法获取 then(function(res){...})  res就是返回的结果
            * */
            /*es6语法  箭头函数
            * 内侧作用域指向外侧作用域
            * then(res=>{})  等价于
            * then(function(res){})  但是箭头函数没有作用域  相当于是当前域的
            * */
            this.$http.get("data/result.json").then(res => {
                //res是返回的数据集合  真实json数据放在res.body.下
                this.productList = res.body.result.list;
                this.productListLength=this.productList.length;
            })
        },
        //全选
        selectAll(){
            this.selectAllFlag = !this.selectAllFlag;
            for (var i=0; i<this.productListLength; i++){
                this.productList[i].productSelectedFlag = this.selectAllFlag;
            }
            this.selectProductFlag = !this.selectProductFlag;
        },
        //单选
        selectProduct(index){
            this.productList[index].productSelectedFlag = !this.productList[index].productSelectedFlag;
            var times=0;
            //检测商品是否被全选
            for (var i=0; i<this.productListLength; i++){
                if(this.productList[i].productSelectedFlag){
                    times++;
                }
            };
            if (times == this.productListLength){
                this.selectAllFlag=true;
            }else {
                this.selectAllFlag=false;
            }
        },
        //增加商品数量
        addProduct(index){
            this.productList[index].productNum++;
        },
        //减少商品数量
        cutProduct(index){
            this.productList[index].productNum--;
            if(this.productList[index].productNum <= 1){
                this.productList[index].productNum=1
            }
        },
        //修改商品数量
        listenNum(pro){
            // console.log('method');
            parseInt(pro.productNum);
            if (pro.productNum<1 || isNaN(pro.productNum)){
                pro.productNum = 1;
            }
        },
        //删除商品
        deleteProduct(index){
            this.productList.splice(index,1);
            this.productListLength = this.productList.length;
        },

    },
    computed:{
        //购物车总数
        totalNum:function () {
            // console.log('computed');
            var totalNum = 0;
            for (var i=0; i<this.productListLength; i++){
                totalNum += parseInt(this.productList[i].productNum);
            }
            // console.log(typeof totalNum);
            // console.log(totalNum)
            return totalNum;
        },
        //已选商品总数
        selectTotalNum:function () {
            var selectTotalNum = 0;
            for (var i=0; i<this.productListLength; i++){
                if(this.productList[i].productSelectedFlag){
                    selectTotalNum += parseInt(this.productList[i].productNum);
                }
            }
            return selectTotalNum;
        },
        //已选商品总价
        totalMoney:function () {
            var totalMoney = 0;
            for (var i=0; i < this.productListLength; i++) {
                if (this.productList[i].productSelectedFlag){
                    totalMoney += this.productList[i].productPrice * this.productList[i].productNum;
                }
            }
            return totalMoney;
        },
    }
})