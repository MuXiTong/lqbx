<style type="text/css" scoped>
  .slide-right-enter-active, .slide-right-leave-active {
  transition: all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
  .slide-right-enter, .slide-right-leave-active {
  transform:translateY(100%);
}
  .slide-left-enter-active, .slide-left-leave-active {
  transition: all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
  .slide-left-enter, .slide-left-leave-active {
  transform:translateY(-100%);
}
</style>
<template>
  <div class="wh100" style="padding:50px 0 54px;">

    <mt-header fixed :title="tabnav[selected].name" id="header">
       <mt-button slot="right" v-if="selected == 1" @click.native="confirm"><icon slot="icon" name="logout" scale="2.5" ></icon></mt-button>
    </mt-header>

    <!-- <transition :name="transitionName" mode="out-in"> -->
      <router-view></router-view>
    <!-- </transition> -->

    <mt-tabbar v-model="selected" :fixed="fixed" id="footer">
      <mt-tab-item 
        v-for="(item,index) in tabnav" 
        :id="index" 
        :key="index"
      >
        <icon slot="icon" :name="item.icon" scale="4" ></icon>
        {{item.name}}
      </mt-tab-item>
    </mt-tabbar>

  </div>
</template>

<script type="text/javascript">
  import { mapActions } from 'vuex'
  import { MessageBox } from 'mint-ui';

  export default {
    data () {
      return {
        selected:0,
        transitionName:null,
        tabnav:[
          {name:"首页",icon:'home',url:"home"},
          {name:"我的",icon:'user',url:"user"},
        ],
        fixed:true
      }
    },
    watch:{
      selected:function(val, oldVal) {
        this.$router.push({ path: this.tabnav[this.selected].url });
      },
      $route:function(to, from){
        this.selected = to.meta.index
      }
    },
    mounted(){
      this.$router.push({ path: "home" });
    },
    methods:{
      ...mapActions(["USER_SIGNOUT"]),
      confirm:function(){
        MessageBox.confirm('确定退出?','退出提示').then(action => {

          this.logout()

        }).catch(cancel =>{

          console.log(cancel)
          
        });
      },
      logout:function(){
        this.USER_SIGNOUT()
        this.$router.replace({ path: '/login' })
      }
    }
  }

</script>