<template>
  <div id="app"> 
      <v-header :seller='seller'></v-header>
      <div class='tab border-1px'>
        <div class="tab-item">
            <router-link :to="{path: 'goods'}" >商品
          </router-link>       
        </div>
        <div class="tab-item">
         <router-link :to="{path: 'ratings' }">评论</router-link>
        </div>
        <div class="tab-item">
          <router-link :to="{path: 'seller'}" >商家</router-link>
        </div>
      </div> 
    <!--   这里传入seller，是因为，shopcart模板接受父组件goods的seller.deliveryPrice,而seller这个自定义属性必须从goods模板的父组件APP模板定义才行；goods是APP的子路由，是渲染到父组件的router-view上的，所以在这里定义了:seller='seller' -->
     <router-view :seller='seller'></router-view> 
  </div>
</template>
<script >
  import header from './components/header/header'
  // import apps from './components/goods/apps'
  const ERR_OK = 0;
  export default{
    components:{
      'v-header':header,
      // 'v-apps':apps
    },
    data() {
      return {
        seller:{},
        url:'goods'
      }
    },
    // creat钩子函数
    created(){
      this.$http.get('/api/seller').then((response) => {  
        // console.log(response)//看response情况
        //将response的东西转为一个对象
        response = response.body;
        //直接用ERR_OK代替0，如果有多个地方，以后需要改动状态码（ERR_OK为1.。），只需改变ERR_OK的值就行
        //errno和data是AJAX请求response带有的属性
        if(response.errno === ERR_OK){
          this.seller = response.data;
          console.log(this.seller)
        }
      })
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/mixin.styl'
  // @import './common/stylus/index'
  #app
    .tab
      display:flex
      width: 100%
      height:40px
      line-height:40px
      .tab-item
        flex:1
        text-align:center
        //调用stylus中mixin实现真正的1px
        border-1px(rgba(7,17,27,0.1))
        //
        // border-bottom:1px solid rgba(7,17,27,0.1) 由于手机端DPR实际在IPO6显示位2px
        a
          //转化为块级元素，点空白处也可以选中
          display:block
          font-size:14px
          color:rgb(77,85,93)
          font-weight: normal
          // font-family:
          //active由new VueRouter中激活设定
          &.active
            font-size 14px
            color:rgb(240,20,20)
        
</style>

