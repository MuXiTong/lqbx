
<template>
  <div id="list" >
    <div class="wt-list-body" v-for="(list,index) in lists" :key="index">
        <div class="wt-list-tit">{{list.title}}</div>
        <ul class="wt-list-flexul clearfix">
          <li v-for="(items,i) in list.children" @click="openWin(items.url)" :key="i">
            <icon class="icon" :class="'lq-icon-'+items.icon" :name="items.icon" scale="4" ></icon>
            <span>{{items.name}}</span>
          </li>
        </ul>
    </div>
    <router-view></router-view>
  </div>
</template>
<script type="text/javascript">

  export default {
    data () {
      return {
        lists: [
          {
            title:"蓝保中心",
            children:[
              {name:"签约记录",icon:'record',url:"czrecord"},
              {name:"账户记录",icon:'record',url:"zhrecord"},
              {name:"年保管理",icon:'record',url:"nbManagement"},
            ]
          }
        ]
      }
    },
    methods:{
      openWin:function(url){
        this.$router.push({ path:url });
      }
    }
  }

</script>
<style type="text/css" lang="scss">
  .wt-list-body{
    width: 96%;
    margin: 0.8rem auto ;
    padding:2%;
    box-sizing: border-box;
    border-radius: 4px;
    background:#fff;
    box-shadow:0 4px 14px rgba(0, 0, 0, 0.5);
    .wt-list-tit{
      text-indent: 0.5rem;
      font-size: 1rem;
      border-bottom: 1px solid #eee;
      line-height: 2rem;
      position: relative;
      color:#666;
      &::after{
        content:"";
        position: absolute;
        left: 0;
        top: 0.5rem;
        width: 3px;
        height: 1rem;
        background: #26a2ff;
      }
    }
    .wt-list-flexul{
      width:100%;
      li{
        text-align: center;
        width:25%;
        float: left;
        &:active{
          background:#efefef;
        }
        .icon{
          width:2rem;
          height:2rem;
          display:block;
          margin: 1rem auto 0.2rem;
          color:#26a2ff;
          &.lq-icon-czrecord{
            width: 1.7rem;
            height: 1.7rem;
            padding: 0.15rem;
          }
        }
        span{
          color:#999;
        }
      }
    }
  }
</style>