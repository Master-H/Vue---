<template>
  <div class="goods">
    <div class='menu-wrapper'>
      <ul>
        <li v-for='item in goods'>
          <span class="text border-1px">
            <span v-show='item.type>0' class='icon' :class='classMap[item.type]'></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class='foods-wrapper'>
      <h1>我是foods</h1>
    </div>
  </div>
 
</template>

<script>
const ERR_OK = 0
export default {
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
        // console.log(this.goods)
      }
    })
  },
  data () {
    return {
      //开始goods为空，当调用这个组件时，通过后端去请求数据
      goods: []
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
    top:194px
    bottom:46px
    width:100%
    overflow:hidden
    .menu-wrapper
      flex:0 0 80px
      //这里设置width80px是因为安卓浏览器兼容性的问题
      width:80px
      background:#f3f5f7
      // .menu-item
      //   //垂直居中，多行也是
      //   display:table
      //   height:54px
      //   width:56px
      //   line-height:14px
      //   font-size
      //   .icon
      //     display:inline-block
      //       vertical-align:top
      //       width:12px
      //       height:12px
      //       margin-right:2px
      //       background-size:12px 12px
      //       background-repeat:no-repeat
      //       &.decrease
      //         bg-image('img/decrease_3')
      //       &.discount
      //         bg-image('img/discount_3')
      //       &.guarantee
      //         bg-image('img/guarantee_3')
      //       &.invoice
      //         bg-image('img/invoice_3')
      //       &.special
      //         bg-image('img/special_3')
      //   .text
      //     display:table-cell
      //     width:56px
      //     //垂直居中
      //     vertical-align:middle
      //     border-1px(rgba(7,17,27,0.1))
      //     font-size:12px
    .foods-wrapper
      flex:1

</style>
