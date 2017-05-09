<template>
  <div class="seller" ref="seller">
    <div class="'seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc">
          <star :size='36' :score='seller.score'></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>
            </div>
          </li>
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click='toggleFavorite'>
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>

      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item border-1px" v-for="(item,index) in seller.supports">
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class='pics'>
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref='picWrapper'>
        <!-- //这里是为了去UL的宽度，因为只有当内层内容宽度大于外层wrapper的时候BScroll才会起作用 -->
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for='pic in seller.pics'>
               <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title">商家信息</h1>
        <ul>
          <li class="info-item" v-for='info in seller.infos'>{{info}}</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import BScroll from 'better-scroll'
import star from '../star/star'
import split from '../split/split'
import {saveToLocal,loadFromLocal} from '../../common/js/store'
export default {
  //这个seller从APP.vue得来
  props:{
    seller:{
      type:Object
    }
  },
  components:{
    star,
    split
  },
  data() {
    return {
      favorite:(() => {
        return loadFromLocal(this.seller.id, 'favorite', false);  
      })()
    };
  },
  created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  //seller的内容是异步获取的，而这个组件中的内容是依赖seller的，所以一开始内容并未overflow，所以无法通过BScroll进行滚动，但是通过watch响应数据变化就可以解决异步问题，但是注意只有在页面刷新的时候，才会执行watch中的seller，而在评论组件--商家组件切换，并不会执行watch中的seller
  // 开发遇到的问题之一，watch和mounted二者缺一不可
 watch: {
    seller:function(){
      this.$nextTick(() => {
        this._initScroll()
        this._initPics();
      });
    }
  },
  computed:{
    favoriteText(){
      return this.favorite?'已收藏':'收藏'
    }
  },
  //mounted的中会优先于watch中执行
 mounted() {
  //   //刷新输出为空对象，seller的内容是异步获取的，而这个组件中的内容是依赖seller的，所以一开始内容并未被撑开，并未overflow，所以无法滚动
    // console.log(this.seller)
      this.$nextTick(() => {
        this._initScroll();
        this._initPics();
      });
      
  },
  methods:{
    toggleFavorite(){
      if(!event._constructed){
        return;
      }
      //不能直接this.favorite = !favorite
      this.favorite = !this.favorite;
      saveToLocal(this.seller.id,'favorite',this.favorite);
    },

    _initScroll(){
      if(!this.scroll){
        this.scroll = new BScroll(this.$refs.seller,{
          click:true
        })
      }else{
        this.scroll.refresh();
      }
    },
    _initPics(){
      if(this.seller.pics){
        let picWidth = 120;
        let margin = 6;
        let width =(picWidth + margin)*this.seller.pics.length - margin;
        //因为只有当内容超过包裹成的内容才能滑动，而因为继承原因外层wrapper和UL一样宽，所以这里要从新设置UL层picLisst的width，才会起效果
        this.$refs.picList.style.width = width + 'px';
        this.$nextTick(()=>{
          if(!this.picscroll){
            this.picScroll = new BScroll(this.$refs.picWrapper,{
              //可以X轴滑动
              scrollX:true,
              //在这个区域不允许竖向滑动
              eventPassthrough:'vertical'
            })
            
          }else{
            this.picScroll.refresh();
          }
        });
      }
    }
   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin'
.seller
  position: absolute
  top: 192px
  bottom: 0
  left: 0
  width: 100%
  overflow: hidden
  .overview
    padding:18px
    position:relative
    .title
      margin-bottom:8px
      font-size:14px
      color:rgb(7,17,27)
      line-height:14px
    .desc
      padding-bottom: 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .star
        display:inline-block
        margin-right:8px
        vertical-align:top
      .text
        display:inline-block
        margin-right:12px
        font-size:10px
        color:rgb(77,85,93)
        line-height:18px
    .remark
      display:flex
      padding:18px 0 0 0
      .block
        display:inline-block
        flex:1
        text-align:center
        border-right:1px solid rgba(7, 17, 27, 0.1)
        &:last-child
            border: none
        h2
          margin-bottom:4px
          font-size:10px
          color:rgb(147,153,159)
          line-height:10px
        .content
          font-size:10px
          font-weight:200
          color:rgb(7,17,27)
          line-height:24px
          .stress
            font-size:24px
    .favorite
      //设置宽度以后收藏心不会改变位置了，因为宽度固体，而心又在中心
      width:50px
      position:absolute
      right:18px
      top:18px
      text-align:center
      .icon-favorite
        display:block
        color:#d4d6d9
        line-height:24px
        font-size:24px
        &.active
            color: rgb(240, 20, 20)
      .text
        line-height: 10px
        font-size: 10px
        color: rgb(77, 85, 93)
  .bulletin
    padding:18px 18px 0 18px
    .title
      margin-bottom:8px
      lien-height:14px
      color:rgb(7,17,27)
      font-size: 14px
    .content-wrapper
      padding: 0 12px 16px 12px
      border-1px(rgba(7, 17, 27, 0.1))
      .content
        line-height: 24px
        font-size: 12px
        color: rgb(240, 20, 20)
    .supports
      .support-item
        padding: 14px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 0
        &:last-child
          border-none()
      .icon
        display: inline-block
        width: 16px
        height: 16px
        vertical-align: top
        margin-right: 6px
        background-size: 16px 16px
        background-repeat: no-repeat
        &.decrease
          bg-image('./img/decrease_4')
        &.discount
          bg-image('./img/discount_4')
        &.guarantee
          bg-image('./img/guarantee_4')
        &.invoice
          bg-image('./img/invoice_4')
        &.special
          bg-image('./img/special_4')
      .text
        line-height: 16px
        font-size: 12px
        color: rgb(7, 17, 27)
  .pics
    padding:18px
    .title
      margin-bottom: 12px
      line-height: 14px
      color: rgb(7, 17, 27)
      font-size: 14px
    .pic-wrapper
      width:100%
      overflow:hidden
      white-space:nowrap
      .pic-list
        font-size:0
        .pic-item
          display:inline-block
          margin-right:6px
          width:120px
          height:90px
          &:last-child
            margin:0
 .info
    padding: 18px 18px 0 18px
    color: rgb(7, 17, 27)
    .title
      padding-bottom: 12px
      line-height: 14px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 14px
    .info-item
      padding: 16px 12px
      line-height: 16px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 12px
      &:last-child
        border-none()

      

</style>
