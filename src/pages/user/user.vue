<style type="text/css" lang="scss">
  .wt-user-body{
    height: 8rem;
    width: 96%;
    padding:0.5rem 2%;
    background:#26a2ff;
    .wt-user-logo{
      width: 6rem;
      height: 6rem;
      border-radius: 50%;
      box-sizing: border-box;
      background: #fff;
      margin: 0 auto;
      box-shadow:1px 1px 5px rgba(0, 0, 0, 0.8) inset;
      .wt-user-logo-pic{
        width: 100%;
        height: 100%;
        padding:5px;
        border-radius: 50%;
        box-sizing: border-box;
        color:#26a2ff;
      }
    }
    .wt-user-info{
      width: 100%;
      height: 3rem;
      box-sizing: border-box;
      .wt-user-list{
        width:100%;
        height: 3rem;
        line-height: 3rem;
        font-size: 1rem;
        color:#fff;
        text-align: center;
        margin: 0 auto;
      }
    }
  }
  .wt-part{
    width: 100%;
    height: 100%;
    margin-top:1rem;
    box-sizing: border-box;
    background:#fff;
    box-shadow:0px 4px 15px rgba(0, 0, 0, 0.4);
    .mint-cell-title{
      line-height: 24px;
      text-indent: 5px;
      .icon{
        width: 24px;
        height: 24px;
        float: left;
        color:#26a2ff;
      }
    }
    li{
      padding:10px 5px;
      overflow: hidden;
      border-bottom:1px solid #eee;
      div:first-child{
        float: left;
      }
      div:last-child{
          float: right;
      }
    }
  }
  
</style>
<template>
  <div>
    <div class="wt-user-body clearfix">
        <div class="wt-user-logo" v-if="user.logo">
          <img class="wt-user-logo-pic" :src="user.logo"/>
        </div>
        <div class="wt-user-logo" v-else>
          <icon class="wt-user-logo-pic" name="header"></icon>
        </div>
        <div class="wt-user-info ">
          <div class="wt-user-list">{{users.userInfo.username}}</div>
        </div>
        
    </div>
    <div class="wt-part">
      <ul>
        <li><div>登录账号</div><div>{{users.userInfo.userid}}</div></li>
        <li><div>登录网点</div><div>{{users.userInfo.loginwebid}}</div></li>
        <li><div>所在权限组</div><div>{{users.userInfo.groupname}}</div></li>
      </ul>
    </div>

  </div>
</template>
<script type="text/javascript">
  import { mapState } from 'vuex'
  export default {
    data () {
      return {
        user:{
          logo:''
        },
      }
    },
    computed: mapState({ users: state => state }),
    methods:{

    },
    created(){
      
    }
  }

</script>