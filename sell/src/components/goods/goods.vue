<template>
  <div class="goods">
  <!-- 这里的foods-wrapper不能写成驼峰 -->
    <div class='menu-wrapper' ref='menuWrapper'>
      <ul>
      <!-- 如果直接@click='select(index)'，在手机端正常，但是在PC端会触发两次，因为本身BScrool默认阻止元素的点击事件，而在电脑上时，BScrool不制止原生click事件，再加上派生的一次点击事件(click:true)所以会触发两次，@event是VUE中的事件 -->
        <li v-for='(item,index) in goods' class="menu-item" :class="{'current':currentIndex===index}" @click='selectMenu(index,$event)'>
          <span class="text border-1px">
            <span v-show='item.type>0' class='icon' :class='classMap[item.type]'></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!-- ref绑定这个属性 -->
    <div class='foods-wrapper' ref='foodsWrapper'>
      <ul>
        <li v-for='item in goods' class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click='selectFood(food,$event)' v-for='food in item.foods' class="food-item  border-1px" >
              <div class="icon">
                <img width='57' height='57' :src="food.icon" alt="">
                
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>                
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div> 
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show='food.oldPrice'>￥{{food.oldPrice}}</span>
                </div> 
                <div class="cartcontrol-wrapper">
                   <cartcontrol @add='addFood' :food='food'></cartcontrol>          
                </div>           
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- ref='shopcart'是为了让父组件能够访问子组件 -->
    <shopcart ref='shopcart' :selectFoods='selectFoods' :deliveryPrice="seller.deliveryPrice" :minPrice = "seller.minPrice" ></shopcart>
    <!-- ref='food'为了可以调用子组件的方法 -->
    <food @add='addFood' :food='selectedFood' ref='food'></food>
  </div>

 
</template>

<script>
import BScroll from 'better-scroll'
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'
const ERR_OK = 0
export default {
  components:{
    shopcart,
    cartcontrol,
    food
  },
  props:{
    seller:{
      type:Object
    }
  },
  created(){
    this.classMap = ['decrease','discount','special','invoice','guarantee'];
    this.$http.get('/api/goods').then((res)=>{
      //body方法将res转化为一个对象
      res = res.body;
      //ERR_OK在APP.VUE这只为0，用来判断请求的错误是否为O
      if(res.errno ===ERR_OK){
        this.goods = res.data;
        //vue对DOM数据的更新是异步的所以，要把其放在nextTick中
        this.$nextTick(()=>{
           this._initScroll()
           this._calculateHeight()
        })
       
        // console.log(this.goods)
      }
    })
  },
  data () {
    return {
      //开始goods为空，当调用这个组件时，通过后端去请求数据
      goods: [],
      listHeight:[],
      scrollY:0,
      selectedFood:{}
    }
  },
  computed:{
    currentIndex(){
      for(let i =0;i<this.listHeight.length;i++){
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i+1];
        //开发遇到的问题，不取等号一开始不会变白，
        if(!height2 ||(this.scrollY>=height1 && this.scrollY<height2)){
          return i
        }
      }
      return 0;
    },
    selectFoods(){
      let foods = [];
      this.goods.forEach((good)=>{
        good.foods.forEach((food)=>{
          if(food.count){
            foods.push(food)
          }
        });
      });
      return foods;
    }
  },
  methods:{
    _initScroll(){
      //this.$refs.foodsWrapper取到这个DOM,不设置click:true原生的点击事件因为被默认阻止，设置click:true相当于 BScroll派发一个点击事件
      this.menuScroll = new BScroll(this.$refs.menuWrapper,{click:true})
      //传入的probeType：3目的是为了让Scroll在滚动的时候实时告诉我们滚动的位置
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
        probeType:3,
        click:true
      }
        
        );
      //通过on实时暴露出scroll的位置,pos就是位置
      this.foodsScroll.on('scroll',(pos)=>{
        // pos.y为小数负值要转换,取到正整数的滚动时的实时scrolly
        this.scrollY = Math.abs(Math.round(pos.y));
      })
    },
    _calculateHeight(){
      // let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let foodList = this.$refs.foodsWrapper.querySelectorAll('.food-list-hook')
      let height = 0;
      this.listHeight.push(height);
      for(let i=0;i<foodList.length;i++){
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height)
      }
    },
    //点击menu跳转到相应的界面
    selectMenu(index,event){
      // 开发遇到的问题
      // 原生的点击事件没有event._constructed,vue才有，所以当为PC端时，event._constructed为false,直接执行return，所以就避免了两次输出
      if(!event._constructed){
        return;
      }
      let foodList = this.$refs.foodsWrapper.querySelectorAll('.food-list-hook')
      let el = foodList[index];
      //better-scrool的一个一个接口scroollToElement
      this.foodsScroll.scrollToElement(el,300);
    },
    addFood(target) {
      this._drop(target);
    },
    _drop(target) {
      // 体验优化,异步执行下落动画
      this.$nextTick(() => {
        //因为上面设置了ref='shopcart'可以方位子组件，所以这里通过$refs访问子组件
        this.$refs.shopcart.drop(target);
       });
    },
    selectFood(food,event){
       if(!event._constructed){
        return;
      }
      this.selectedFood = food;
      this.$refs.food.show();
    }
  }

  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin';
  .goods
    display:flex
    position:absolute
    top:192px
    bottom:46px
    width:100%
    overflow:hidden
    .menu-wrapper
      flex:0 0 80px
      //这里设置width80px是因为安卓浏览器兼容性的问题
      width:80px
      background:#f3f5f7
     
      .menu-item
        //垂直居中，多行也是
        padding:0 12px
        display:table
        height:54px
        width:56px
        line-height:14px
        &.current
          position:relative
          margin-top:-1px
          background:#fff
          z-index:10
          .text
            font-weight:700
            //激活current时去掉下面那条线
            border-none()
            // font-size:14px
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
          .icon
            display:inline-block
            vertical-align:top
            width:12px
            height:12px
            margin-right:2px
            background-size:12px 12px
            background-repeat:no-repeat
            &.decrease
              bg-image('./img/decrease_3')
            &.discount
              bg-image('./img/discount_3')
            &.guarantee
              bg-image('./img/guarantee_3')
            &.invoice
              bg-image('./img/invoice_3')
            &.special
              bg-image('./img/special_3')
         
    .foods-wrapper
      flex:1
      .title
        padding-left:14px
        height:26px
        line-height:26px
        border-left:2px solid #d9dde1
        font-size:12px
        color:rgb(147,153,159)
        background:#f3f5f7
      .food-item
        display:flex
        margin:18px
        padding-bottom:18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom:0
        .icon
          display:0 0 57px
          margin-right:10px
          
        .content
          flex:1
          .name
            margin:2px 0 8px 0
            height:14px
            line-height:14px
            font-size:14px
            color:rgb(7,17,27)
          .desc,.extra
            line-height:10px
            font-size:10px
            color:rgb(147,153,159)
          .desc
             line-height:12px
             margin-bottom:8px
          .extra
            line-height:10px
            .count
              margin-right:12px
              margin-top:5px
          .price
            font-weight:700
            line-height:24px
            .now
              color:rgb(240,20,20)
              margin-right:18px
              font-size:14px
            .old
              text-decoration:line-through
              font-size:10px
              color:rgb(147,153,159)
              
          .cartcontrol-wrapper
            position:absolute
            right:0
            bottom:12px
              
</style>
