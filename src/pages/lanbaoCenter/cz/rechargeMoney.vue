<!-- 账户充值 -->
<template>
  <div class="contains rechargeBody" v-show="show">
        <mt-header title="账户充值" fixed>
            <mt-button icon="back" slot="left" @click="hide"></mt-button>
        </mt-header>
        <div class="lq-form-content">
            <mt-field label="保险公司" type="text" v-model="form.insurername" disabled></mt-field>
            <mt-field label="企业ID" type="text" v-model="form.tmscode" disabled></mt-field>
            <mt-field label="公司名称" type="text" v-model="form.name" disabled></mt-field>
            <mt-field label="充值金额" type="number" v-model="form.amount"></mt-field>
            <mt-field label="业务员" type="text" v-model="form.yewuyuan"></mt-field>
            <mt-field label="备注" type="textarea" v-model="form.remark" rows="3"></mt-field>
        </div>
        <div class="lq-btn-content">
            <mt-button type="primary" size="large" @click="submit" >确定</mt-button>
        </div>

  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui';
import { MessageBox } from 'mint-ui';
import { mapState } from 'vuex'
export default {
    props:{
        show:{
            type:Boolean,
            default:false
        },
    },
    data () {
        return {
            // 提交表单数据
            form:{
                coidinsurer:"",//保险公司编号
                insurername:"",//保险公司名称
                coid:"",//物通企业编码
                tmscode:"",//蓝桥企业ID
                name:"",//公司名称
                amount :"",//充值金额
                yewuyuan:"",//业务员
                remark :"",//备注
                createby:""//操作人
            }
        }
    },
    computed: mapState({ users: state => state }),
    methods: {
        submit(){

            let _this = this;
            let parms = _this.form;

            if( !parms.amount || parms.amount <= 0){
                MessageBox('提示', '充值金额必须大于等于0！');
                return;
            }
            if( !parms.yewuyuan ){
                MessageBox('提示', '业务员不能为空！');
                return;
            }

            Indicator.open({
                text: '保存中...',
                spinnerType: 'fading-circle'
            });
            
            
            _this.$http({
                method:"post",
                url:"/CommonInsurer/UpdateCompanyAccount",
                data:parms
            }).then(response => {
                let result = response.data

                Indicator.close();
                if( result._status){
                    let suc = Toast({
                        message: '充值成功',
                        iconClass: 'icon icon-success'
                    });
                    setTimeout(() => {
                        suc.close();
                        _this.hide("refresh");
                    }, 500);
                }else{
                    MessageBox('提示', result._message || "查无数据");
                }
            }, result => {
                Indicator.close();
            })
                                

        },
        showMsg(msg){
            let suc = Toast({
              message: msg,
              position:"top"
            });
            setTimeout(() => {
              suc.close();
            }, 1000);
        },
        hide(refresh){
            this.$emit('hide',refresh); 
        },
        setData(data){
            this.form.coidinsurer = data.CoidInsurer
            this.form.insurername = data.InsurerName
            this.form.coid = data.COId
            this.form.tmscode = data.TMSCode
            this.form.name = data.Name
            this.form.amount = ""
            this.form.yewuyuan = ""
            this.form.remark = ""
            this.form.createby = this.users.userInfo.userid
        }
    }
}

</script>
<style type="text/css" lang="scss" scoped>
    .rechargeBody{
        position: fixed;
        left: 0;
        top:0;
        background: #eee;
        z-index: 999;
    }
</style>