
<template>
    <div class="loginbg">
        <div class="wt-login">
            <div class="wt-logo">
                <img src="../../assets/logo.png"/>
            </div>
            <!-- <div class="lq-title">蓝保中心</div> -->
            <div>
                <mt-field label="账号" :placeholder="placeholders.userid" :state="state.userid" v-model="form.userid" autocomplete="false"></mt-field>
                <mt-field label="密码" :placeholder="placeholders.password" :state="state.password" type="password" v-model="form.password" autocomplete="false"></mt-field>
            </div>
            
            <div class="wt-login-btn">
                <mt-button type="primary" size="large" @click="submit" >登录</mt-button>
            </div>

        </div>
    </div>
</template>
<script type="text/javascript">
    import { mapActions } from 'vuex';
    import { Toast } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    export default {
      data () {
        return {
            form: {
                userid: '',
                password: ''    
            },
            state:{
                userid:null,
                password:null
            },
            placeholders:{
                userid:"请输入用户名",
                password:"请输入密码"
            }
        }
      },
      methods:{
        ...mapActions(['USER_SIGNIN']),  
        valid:function(){
            if( !this.form['userid'] ){
                this.state['userid'] = "error";
                Toast({
                    message: this.placeholders['userid'],
                    position: 'top',
                    duration: 3000
                });
                return false;
            }else{
                this.state['userid'] = "success";
            }

            if( !this.form['password'] ){
                this.state['password'] = "error";
                Toast({
                    message: this.placeholders['password'],
                    position: 'top',
                    duration: 3000
                });
                return false;
            }else{
                this.state['password'] = "success";
            }

            return true;
        },
        submit:function(){
            let _this = this;
            if(_this.valid()){
                Indicator.open({
                    text: '登录中...',
                    spinnerType: 'fading-circle'
                });
                let parms = _this.form;
                _this.$http({
                    method:"post",
                    url:"/login/GetBaseinfo",
                    data:parms
                }).then(response => {
                    let result = response.data
                    Indicator.close();
                    if( result._status ){
                        let suc = Toast({
                            message: '登录成功',
                            iconClass: 'icon icon-success'
                        });
                        setTimeout(() => {
                            suc.close();
                            let userInfo = JSON.parse(result._data)[0]
                            this.USER_SIGNIN(userInfo);
                            _this.$router.replace({ path: 'home' });
                        }, 1000);
                    }else{
                        Toast({
                            message: result._message,
                            position: 'top',
                            duration: 3000
                        });
                         _this.state['userid'] = "error";
                         _this.state['password'] = "error";
                    }
                }, result => {
                    Indicator.close();
                    console.log(result)
                })
                                
            }
        }
      }
    }
</script>
<style type="text/css" lang="scss" scoped>
    .loginbg{
        background:url('../../assets/bg.png') no-repeat center center;
        background-size:cover;
        width: 100%;
        height: 100%;
    }
    .wt-login{
        width:90%;
        max-width: 400px;
        // background:#fff;
        padding:1rem;
        box-sizing: border-box;
        // box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.5);
        position: fixed;
        left: 50%;
        top:50%;
        transform: translate(-50%,-50%);
        border-radius:4px;
        .wt-logo{
            // width: 6rem;
            width: 18rem;
            max-width:320px;
            // height: 6rem;
            margin:0 auto 1rem;
            // background:#fff;
            // border-radius: 50%;
            // box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.5) inset;
            img{
                width: 100%;
                height: 100%;
                padding:5px;
                box-sizing: border-box;
                box-shadow: 0px 0px 10px 0px rgba(255,255,255,0.5);
                background: rgba(255,255,255,0.2);
            }
        }
        .lq-title{
            text-align: center;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            font-weight: bolder;
            letter-spacing: 5px;
            color: #fff;
            text-shadow: 2px 2px 5px rgba(0,0,0,0.5);
        }
        .wt-login-btn{
            margin-top: 10px;
            .mint-button-text{
                letter-spacing: 1rem;
                text-indent: 1rem;
            }
        }
        .wt-login-otherbtn{
            padding-top: 1rem;
            a{
                width: 50%;
                float: left;
                &:nth-child(2){
                    text-align: right;
                }
            }
        }
        .lq-summary{
            text-align: right;
            font-size: 12px;
            line-height: 30px;
            color: #999;
        }
        // .mint-cell{
        //     background: none;
        //     .mint-cell-wrapper{
        //         background-image: none;
        //         .mint-cell-text{
        //             color:#fff;
        //         }
        //     }
        // }
    }    
    #canvas{
        position: fixed;
        left: 0;
        top: 0;
        right:0;
        bottom:0;
    }
</style>