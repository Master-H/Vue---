<template>
  <div class="cartcontrol">
    <transition name='move'>
      <div class='cart-decrease ' v-show='food.count>0' @click.stop.prevent='decreaseCart' >
      <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    
    <div class="cart-count" v-show='food.count>0'>
      {{food.count}}
    </div>
    <!-- stop.prevent阻止冒泡事件，如果不设置，在shopcart浮出层，点击加号有效果，但是浮出层也会掉下去 -->
    <div class='cart-add icon-add_circle' @click.stop.prevent='addCart'>
      
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props:{
    food:{
      type:Object
    }
  },
  created(){
    // console.log(this.food)
  },
  methods:{
    addCart(event){
      //因为这里点击foodswrapper，由于vue的默认阻止点击事件所以必须在goods.vue，因为这个组件应用的better-scroll设置click:true
     
      // 由于这个组件还是在goods.vue中，引入了BSCROLL，所以还是要解决，PC端（输出两次）和移动端输出一次的问题
      if(!event._constructed){
        return;
      }
       console.log('abc');
      if(!this.food.count){
        // 开发问题，原生JS中可以直接通过this.food.count =1;赋值新属性count的值为1；
        // VUE中设置对象的属性。如果对象是响应式的，确保属性被创建后也是响应式的，同时触发视图更新
        //要通过Vue.set(this.food,'count',0)，来设置新属性和其值
        Vue.set(this.food,'count',1)
      }else{
        this.food.count++;
      }
      //vue1的写法dispatch已经废弃了，vue2用emit
      // this.$dispatch('cart.add',event.target);
      this.$emit('add', event.target);
    },
    decreaseCart(){
      if(!event._constructed){
        return;
      }
      if(this.food.count){
        this.food.count--
      }
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size:0
    .cart-decrease
      display: inline-block
      padding: 6px
      opacity: 1
      //开启GPU硬件加速模式，从而让浏览器在渲染动画时从CPU转向GPU，动画更流畅
      transform: translate3d(0, 0, 0)
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transition: all 1.4s linear
        transform: rotate(0)
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(-24px, 0, 0)
        .inner
          transform: rotate(360deg)
    .cart-count
      display:inline-block
      vertical-align:top
      width:12px
      padding:6px 0
      line-height:24px
      text-align:center
      font-size:10px
      color:rgb(147,153,159)
      
    .cart-add
      padding 6px
      vertical-align top
      line-height:24px
      font-size:24px
      display:inline-block
      color:rgb(0,160,220)
</style>
