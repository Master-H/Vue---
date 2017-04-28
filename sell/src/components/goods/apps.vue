<template>
  <div>
    <p>{{message}}</p>
    <p>{{$route.params.color}}</p>
    <button @click='getParam'>getparam</button>
     <router-view></router-view>
    
  </div>
</template>
<script>
  export default{
    data(){
      return{
        message:'i am apple'
      }
    },
    methods:{
      getParam(){
        console.log(this.$route.params)
      }
    }
  }
</script>
