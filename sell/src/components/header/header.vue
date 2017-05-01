<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
       <!--  不加v-if会报错，是因为，在app.vue中seller一开始为空，通过AJAX异步获得过后才有内容，下面代码是在异步执行之前就解析了 -->
        <div v-if='seller.supports' class="support">
          <span class="icon" :class='classMap[seller.supports[0].type]'></span>
          <span class="text">{{seller.supports[0].description}}</span>

        </div>
      </div>
      <div v-if='seller.supports' class="support-count" @click='showDetail'>
        <span class="count" >{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
     <div class="bulletin-wrapper" @click='showDetail'>
        <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
        <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src='seller.avatar' width='100%' height='100%'>
    </div>
    <transition name='fade'>
      <div v-show='detailShow' class="detail">
      <div class="detail-wrapper clearfix" >
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class='star-wrapper'>
             <star :size="48" :score="seller.score"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if='seller.supports' class="supports">
            <li class="support-item" v-for='item in seller.supports'>
              <span class="icon" :class="classMap[item.type]">fdf</span>
              <span class="text">{{item.description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
            
          </div>
          <div class="bulletin">
              {{seller.bulletin}}
            </div>
        </div>
        
      </div>
      <div class="detail-close" @click='hideDetail'>
          <i class="icon-close"></i>
      </div>
    </div>
    </transition>
    
  </div>
</template>

<script>
import star from '../star/star'

export default {
  name: 'hello',
  components:{
    star
},
  //接受父组件传来的属性
  props:{
    seller:{
      type:Object
    }
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      detailShow:false
    }
  },
  methods:{
    showDetail(){
      this.detailShow = true
    },
    hideDetail(){
      this.detailShow = false
    }
  },
  created(){
    //根据data.json中的顺序来的
    this.classMap = ['decrease','discount','special','invoice','guarantee'];
  }
}
// console.log(item.type)
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
//这里的import不同通过设置alias别名来引入，因为alias针对import一个JS库的 
@import '../../common/stylus/mixin';
  .header
    position:relative
    color:#fff
    overflow:hidden
    background:rgba(7,17,27,0.5)
    .content-wrapper
      //父类设字体0消除由于空格导致内联元素的间隙
      font-size:0
      position:relative
      padding:24px 12px 18px 24px
      .avatar
        display:inline-block
        img
          border-radius:4px
      .content
        display:inline-block
        font-size:14px
        margin-left:16px
        .title
          margin:2px 0 8px 0
          .brand
            //brand位行内元素设置宽高无效
            display:inline-block
            vertical-align:top
            width:30px
            height:18px
            //mixin里面写好的bg-image函数
            bg-image('./img/brand')
            background-size:30px 18px
            background-repeat:no-repeat
          .name
            //没字体大小因为继承父类的
            margin-left:6px
            font-size:16px
            line-height:18px
            font-weight:bold   
        .description
          line-height:12px
          margin-bottom:10px
          font-size:12px
        
        .support
          .icon
            display:inline-block
            vertical-align:top
            width:12px
            height:12px
            margin:10px 4px 0 0px
            background-size:12px 12px
            background-repeat:no-repeat
            &.decrease
              bg-image('img/decrease_1')
            &.discount
              bg-image('img/discount_1')
            &.guarantee
              bg-image('img/guarantee_1')
            &.invoice
              bg-image('img/invoice_1')
            &.special
              bg-image('img/special_1')
          .text
            line-height 32px
            font-size 10px
      
      .support-count
        position:absolute
        right:12px
        bottom:14px
        padding:0 8px
        height:24px
        line-height:24px
        border-radius:14px
        background:rgba(0,0,0,0.2)
        text-align:center
        .count
          vertical-align:top
          font-size:10px
        .icon-keyboard_arrow_right
          font-size:10px
          line-height:24px
          margin-left:2px
    .bulletin-wrapper
      // font-size:0
      background:rgba(7,17,27,0.2)
      position:relative
      height:28px
      line-height:28px
      padding:0 22px 0 12px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      .bulletin-title
        vertical-align:top
        //vertical-align:top并不能使title和text对齐所以要用margin-top来修饰
        margin-top:8px
        display:inline-block
        width:22px
        height:12px
        bg-image('./img/bulletin')
        background-size:22px 12px
        background-repeat:no-repeat
      .bulletin-text
        vertical-align:top
        margin:0 4px
        font-size:10px
      .icon-keyboard_arrow_right
        position:absolute
        font-size:10px
        right:12px
        top:8px
    .background
      position:absolute
      top:0
      left:0
      width:100%
      height:100%
      z-index:-1
      filter:blur(10px)
    .detail
      position:fixed
      top:0
      left:0
      z-index:100
      width:100%
      height:100%
      //auto超出屏幕可以滚动
      overflow:auto
      background:rgba(7,17,27,0.8)
      .detail-wrapper
        width:100%
        min-height:100%
        .detail-main
          margin-top:64px
          padding-bottom:64px 
          .name
            line-height:16px
            text-align:center
            font-size:16px
            font-weight:700
          .star-wrapper
            margin-top:18px
            padding:2px 0
            text-align:center
          .title
            display:flex
            width:80%
            margin:28px auto 24px auto
            .line
              flex:1
              position:relative
              top:-6px
              border-bottom:1px solid rgba(255,255,255,0.5)
            .text
              display:inline-block
              padding:0 12px
              font-size:14px
              font-weight:700
          .supports
            width:80%
            margin:0 auto
            .support-item
              padding:0 12px
              margin-bottom:12px
              font-size:0
              &:last-child
                margin-bottom:0
              .icon
                display:inline-block
                vertical-align:top
                width:16px
                height:16px
                margin-right:6px
                background-size: 16px 16px
                background-repeat:no-repeat
                &.decrease
                  bg-image('img/decrease_2')
                &.discount
                  bg-image('img/discount_2')
                &.guarantee
                  bg-image('img/guarantee_2')
                &.invoice
                  bg-image('img/invoice_2')
                &.special
                  bg-image('img/special_2')
            .text
              line-height:16px
              font-size:10px
          .bulletin
            padding 0 48px
            font-size 12px
            font-weight 200
            color rgb(255,255,255)
            line-height 24px
      .detail-close
          position:relative
          width:32px
          height:32px
          margin:-64px auto 0 auto
          clear:both
          font-size:32px
      &.fade-enter-active, &.fade-leave-active {
          transition: opacity 2.5s
      }
      &.fade-enter, &.fade-leave-active {
          opacity: 0
      }        
</style>          
</style>
