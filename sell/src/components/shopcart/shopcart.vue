<template>
  <div>
    <div class="shopcart">
  <!-- @click='toggleList'放在content的时候，cartcontrol组件必须阻止冒泡才行 -->
   <div class="content" @click='toggleList'>
    <div class="content-left" >
      <div class="logo-wrapper">
        <div class="logo" :class="{'highLight':totalCount>0}">
        <!-- 这里图标字体也要加上高亮属性才行，购物车图标才会变亮 -->
          <i class="icon-shopping_cart" :class="{'highLight':totalCount>0}">
          </i>
        </div>
        <div class="num" v-show='totalCount>0'>
          {{totalCount}}
          
        </div>
      </div>
      <div class="price" :class="{'highLight':totalPrice>0}">
       ￥{{totalPrice}}
      </div>
      <div class="desc">
        另需配送费￥{{deliveryPrice}}元
      </div>
    </div>
    <!-- stop阻止冒泡时间      -->
    <div class="content-right" @click.stop.prevent='pay'>
      <div class="pay" :class='payClass'>
        {{payDesc}}   
      </div>
    </div> 
    <!-- 小球动画两层，一层控制一个方向 -->
    <div class="ball-container">
      <div v-for="ball in balls">
      <!-- 这里设置动画用的是JS的钩子函数，直接操作DOM -->
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
          <!-- //为什么这里要加v-show? -->
          <!-- Vue只有在插入，更新或者移除DOM元素时才会应用过渡效果 -->
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
      </div>
     
    </div> 
    <transition name='fold'>
      <div class='shopcart-list' v-show='listShow'>
        <div class='list-header'>
          <h1 class="title">购物车</h1>
          <span class="empty" @click='empty'>清空</span>
        </div>
        <div class="list-content" ref='listContent'>
          <ul>
            <li class="food" v-for='food in selectFoods'>
              <span class="name">{{food.name}}</span>
              <div class='price'>
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class='cartcontrol-wrapper'>
                <cartcontrol :food='food'></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    

   </div>
    </div>
    <transition name='fade'>
      <div class='list-mask' @click='hideList' v-show='listShow'>
      
      </div>
    </transition>
    
  </div>
 

</template>

<script>
 import BScroll from 'better-scroll'
 import cartcontrol from '../cartcontrol/cartcontrol'
export default {
  components:{
    cartcontrol
  },
  props: {
    deliveryPrice: {
      type: Number,
     
    },
    minPrice: {
      type: Number,
      default: 0
    },
    selectFoods:{
      type:Array,
      //type为Array或者object,default默认为一个函数
      default(){
        return [
        {
          price:10,
          count:1
        }
        ]
      }
    },
   
  },
  methods:{
     drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },

      beforeDrop(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            //32为小球的左偏移
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            //一开始v-show导致el.style=none;动画开始时所以在加号按钮那个位置，就不会显示，为了动画从点击出就开始显示所以style设为空，去掉none的影响
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      dropping(el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;//为了触发浏览器重绘
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
        });
      },
      //为什么要有这个函数？
      afterDrop(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }//
      },
      toggleList(){
        if(!this.totalCount){
          return;
        }
        this.fold = !this.fold;
      },
      empty(){
        this.selectFoods.forEach((food)=>{
          food.count = 0;
        })
      },
      //点击listmask退出浮层，设置fold为true,show中为false,达到目的
      hideList(){
        this.fold = true;
      },
      pay(){
        if(this.totalPrice<this.minPrice){
          return;
        }
        window.alert(`支付${this.totalPrice}`)
      }
   
  },
  data () {
    return {
      //开发问题balls中一个show也可以，放置多个是为了当连续点击加号时产生连续的效果
      //为什么放置多个show就可以产生连续的效果了？
     balls:[
       {
        show:false
       },
       {
        show:false
       },
       {
        show:false
       },
       {
        show:false
       },
       {
        show:false
       }
     ],
     dropBalls: [],
     // listShow:false
        fold: true
    }
  },
  computed:{
    totalPrice(){
      let total = 0;
      this.selectFoods.forEach((food)=>{
        total += food.price*food.count
      });

      return total;
    },
    totalCount(){
      let count = 0;
      this.selectFoods.forEach((food)=>{
         count += food.count
      })
        //函数必须有返回值，这里不return，上面{{totalCount}}取不到值
      return count
    },
     payDesc(){
      if(this.totalPrice === 0){
        return `￥${this.minPrice}元起送`;
      }else if(this.totalPrice<this.minPrice){
        let diff = this.minPrice - this.totalPrice
        return  `还差￥${diff}元起送`;
      }else{
        return `去结算`;
      }
    },
    payClass(){
      if(this.totalPrice<this.minPrice){
        return 'not-enough' 
      }else{
        return 'enough' 
      }
    },
   listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
  }
 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopcart
    position:fixed
    left:0
    bottom:0
    z-index:50
    width:100%
    height:48px
    background:#000
    .content
      display:flex
      background:#141d27
      font-size:0
      .content-left
        flex:1
        .logo-wrapper
          display:inline-block
          position:relative
          top:-10px
          margin:0 12px
          padding:6px
          width:56px
          height:56px
          box-sizing:border-box
          vertical-align:top
          border-radius: 50%
          background:#141d27
          // background:red
          .logo
            width:100%
            height:100%
            border-radius:50%
            background:#2b343c
            text-align:center
            &.highLight
              background:rgb(0,160,220)
            .icon-shopping_cart
              line-height:44px
              font-size:24px
              color:#80858a
              &.highLight
                color:#fff
          .num
            position:absolute
            top:0
            right:0
            width:24px
            height:16px
            line-height:16px
            text-align:center
            border-radius:16px
            font-size:9px
            font-weight:700
            color:#fff
            background:rgb(240,20,20)
            box-shadow:0 4px 8px rgba(0,0,0,0.4)
              
              
        .price
          display:inline-block
          vertical-align:top
          line-height:24px
          margin-top:12px
          padding-right:12px
          box-sizing:border-box
          border-right:1px solid rgba(255,255,255.0.1)
          font-size:16px
          font-weight:700
          color:rgba(255,255,255,0.4)
          &.highLight
            color:#fff
        .desc
          display:inline-block
          position:relative
          vertical-align:top
          margin:12px 0 0 12px
          font-size:10px
          color:rgba(255,255,255,0.4)
          font-weight:700
          line-height:24px
      .content-right
        flex:0 0 105px
        width:105px
        .pay
          height:48px
          line-height:48px
          text-align:center
          font-size:12px
          color:rgba(255,255,255,0.4)
          font-weight:700
          background:#2b343c
          &.not-enough
            background:#2b333b
          &.enough
            background:#00b43c
            color:#fff
    .ball-container
      .ball
        position:fixed
        left:32px
        bottom:22px
        z-index:200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        //贝塞尔曲线动画展示，可取cubic-bezier.com查看
        // .inner
        //   width: 16px
        //   height: 16px
        //   border-radius: 50%
        //   background: rgb(0, 160, 220)
        //   transition: all 0.4s linear
        &.drop-enter,&.drop-enter-active
          .inner
            width:16px
            height:16px
            border-radius:50%
            background:rgb(0,160,220)
            transition:all 0.4s linear
    .shopcart-list
      position:absolute
      top:0
      left:0
      z-index:-1
      width:100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px
  .list-mask
    position:fixed
    top:0
    left:0
    width:100%
    height:100%
    z-index:40
    backdrop-filter: blur(10px)
    opacity:1
    background:rgba(7,17,27,0.6)
    &.fade-enter-active,&.fade-leave-active
      transition:all 0.5s
     
    &.fade-enter,&.fade-leave-active  
      opacity:0
      background:rgba(7,17,27,0)
        
        
</style>
