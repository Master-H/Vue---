<template>
  <transition name = 'move' >
  <!-- ref='food'绑定属性是为了下面BScroll可以访问到 -->
  <div class="food" v-show='showFlag' ref='food'>
    <div class="food-content">
      <div class="image-header">
        <img :src='food.image'>
        <div class="back" @click='hide'>
           <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class='detail'>
          <span class="sell-count">月售{{food.sellCount}}份</span>
          <span class="rating">好评率{{food.rating}}份</span>
        </div>
        <div class="price">
          <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
        </div>
        <div class="cartcontrol-wrapper">
      <!-- 这里cartcontro相当于是food.vue的子组件，cartcontrol中emmit了add事件，所以父组件food.vue要对其进行监听，然后触发addFood函数，这个函数又去emmit,add事件（对food.vue的父类，goods.vue),然后goods.vue中监听的add事件就可以执行小球动画了 -->
        <cartcontrol @add='addFood' :food='food'> </cartcontrol>
        </div>
        <transition name='fade'>
          <div @click="addFirst" class="buy" v-show="!food.count||food.count === 0">
        加入购物车
          </div>
        </transition>
      </div>
      <split v-show = 'food.info'></split>
      <div class="info" v-show='food.info'>
        <h1 class="title">商品信息</h1>
        <h1 class="text">{{food.info}}</h1>
      </div>
      <split></split>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent='onlyContent' :desc='desc' :ratings='food.ratings'></ratingselect>
        <div class='rating-wrapper'>
        <!-- 二者只会显示一个 -->
          <ul v-show='food.ratings && food.ratings.length'>
          <!-- v-show绑定一个函数注意其用法 -->
            <li v-show="needShow(rating.rateType,rating.text)" v-for='rating in food.ratings' class="rating-item">
              <div class='user'>
                <div class="name">
                  {{rating.username}}
                </div>
                <img class="avatar" width="12" height="12" :src='rating.avatar'>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
              <div class="text">
                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
              </div>
            </li>
          </ul>
          <div class="no-rating" v-show='!food.ratings || !food.ratings.length'>
            暂无评价
          </div>
        </div>
      </div>
    </div>
  </div>
  </transition>
 
</template>

<script>
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol';
import Vue from 'vue'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'
import {formatDate} from '../../common/js/date'
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
  components:{
    cartcontrol,
    split,
    ratingselect
  },
  props:{
    food:{
      type:Object
    }
  },
  //有上面time竖线|带来
 filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
  },
  data(){
    return{
      showFlag:false,
      //selectType是对ratingselect组件的跟踪
      selectType:ALL,
      onlyContent:true,
      desc:{
        all:'全部',
        positive:'推荐',
        negative:'吐槽'
      }

    }
  },
  methods:{
    //如果组件私有方法一般用_show,可以被外部调用的用show()
    show(){
      this.showFlag = true;
      //因为可能被多个foods使用，所以初始化selectType和onlyContent
      this.selectType = ALL;
      this.onlyContent = true;
      //使用BScroll一定要使用￥nextTick这样才能保证DOM被渲染
      this.$nextTick(()=>{
        if(!this.scroll){
          this.scroll = new BScroll(this.$refs.food,{
            click:true
          })
        }else{
          //重新做一次计算
         this.scroll.refresh();
        }
      })
    },
    addFood() {
      this.$emit('add', event.target);
    },
    hide(){
      this.showFlag = false;
    },
    addFirst(event){
      console.log('click')
      if(!event._constructed){
        return;
      }
      console.log(event.target)
      //调用小球动画不出现，是因为一触发addFirst时间，这个元素就消失；而小球动画要通过取得元素,getBoundingclientRect(),计算距离来做动画
      this.$emit('add', event.target);
      Vue.set(this.food,'count',1);
    },
    needShow(type,text){
      if(this.onlyContent&&!text){
        return false;
      }
      if(this.selectType === ALL){
        return true;
      }else{
        return type === this.selectType;
      }
    },
    selectRating(type) {
      this.selectType = type;
      //必须放在$nextTick()中进行refresh因为这里改变selectType,DOM并未更新所以得放在$nextTick()中
      // 因为VUE中更新数据是异步的，放在一个队里周期，使用$nextTick可以解决DOM未被跟新问题
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    toggleContent() {
      this.onlyContent = !this.onlyContent;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    }
  }
 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin';
  .food
    position:fixed
    left:0
    top:0
    bottom:48px
    //小于购物车和mask的z-index
    z-index:30
    width:100% 
    background:#fff
    opacity:1
    // &.move-enter-active,&.move-leave-active
    //   transition all 0.3s linear
    //   transform:translate3d(0,0,0)
    // &.move-enter,&.move-leave-active
    //   opacity:0
    //   transform:translate3d(-100%,0,0)
    &.move-enter
      opacity:0
      transform:translate3d(-100%,0,0) 
    &.move-enter-active,&.move-leave-active
      transition all 0.3s linear
      // transform:translate3d(0,0,0)
    &.move-leave-active
      // transition all 1s linear
      transform:translate3d(-100%,0,0)
      opacity:0
      //image-header设置一个宽高相等的容器，以显示（手机）的宽度来定这个容器，而不会因为高度为零，有内容来撑开，导致图片占满整个屏幕
    .image-header
      position:relative
      width:100%
      height:0
      //padding-top为了使这个盒子的上下宽高一直（padding-top的100%，是以盒子的宽度为模板100%
      padding-top:100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position:absolute
        top:10px
        left:0
        .icon-arrow_lift
          display:block
          //加Padding，增加点击宽度
          padding:10px
          font-size:20px
          color:#fff
    .content
      position:relative
      padding:18px
      .title
        line-height:14px
        margin-bottom:8px
        font-size:14px
        font-weight:700
        color:rgb(7,17,27)
      .detail
        margin-bottom:18px
        line-height:10px
        height:10px
        font-size:0
        .sell-count,.rating
          font-size:10px
          color:rgb(147,153,159)
        .sell-count
          margin-right:12px
      .price
        font-weight:700
        line-height:24px
        .now
          // color:rgb(240,20,20)
          color:red
          margin-right:18px
          font-size:14px
        .old
          text-decoration:line-through
          font-size:10px
          color:rgb(147,153,159)
      .cartcontrol-wrapper
        position:absolute
        right:12px
        bottom:12px
      .buy
        position:absolute
        right:18px
        bottom:18px
        z-index:10
        height:24px
        line-height:24px
        padding:0 12px
        box-sizing:border-box
        font-size:10px
        border-radius:12px
        color:#fff
        opacity: 1
        background:rgb(0,160,220)
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.2s
        &.fade-enter, &.fade-leave-active
          opacity: 0
          z-index: -1
    .info
      padding:18px
      .title
        font-size:14px
        // height:14px
        line-height:14px
        margin-bottom:6px
        color:rgb(7,17,27)
      .text
        font-size:12px
        line-height:24px
        // font-weight:100
        padding:0 8px
        color:rgb(77,85,93)
    .rating
      padding-top:18px
      .title
        margin-left:18px
        line-height:6px
        font-size:14px
        color:rgb(7,17,27)
      .rating-wrapper
        padding:0 18px
        .rating-item
          position:relative
          padding:16px 0 
          border-1px(rgba(7,17,27,0,1))
          .user
            position:absolute
            right:0
            top:16px
            font-size:0
            line-height:12px
            .name
              display:inline-block
              vertical-align:top
              font-size:10px
              margin-right:6px
              color:rgb(147,153,159)
            .avatar
              border-radius:50%
          .time
            margin-bottom:6px
            line-height:12px
            font-size:10px
            color:rgb(7,17,27)
          .text
            line-height:16px
            font-size:12px
            color:rgb(7,17,27)
            .icon-thumb_up,icon-thumb_down
              line-height:16px
              margin-right:4px
              font-size:12px
            .icon-thumb_up
              color:rgb(0,160,220)
            .icon-thumb_down
              color:rgb(147,153,159)
        .no-rating
          padding:16px 0
          font-size:12px
          color:rgb(147,153,159)

        

</style>
