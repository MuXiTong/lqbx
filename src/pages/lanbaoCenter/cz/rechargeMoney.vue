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
            <!-- 上传图片控件 -->
            <div class="infoPart">
                <div class="infoTit">图片信息</div>
                <uploader 
                    :src="imgUpLoadUrl"  
                    :showUploadedBtn="false" 
                    ref="uploader" 
                    :uploadedComplete="uploadedComplete"
                    :uploaderError="uploaderError"
                ></uploader>
            </div>
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
import uploader from "@/components/uploader"

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
            },
            imgUpLoadUrl:this.$http.defaults.baseURL+"/CommonInsurer/UploadImg",// 根据基本路径赋值上传接口
            errImgName:[],
            pid:""
        }
    },
    computed: mapState({ users: state => state }),
    components:{
        "uploader":uploader
    },
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
                    _this.pid = result._message;
                    if( _this.$refs.uploader.files.length == 0 ){
                        setTimeout(() => {
                            suc.close();
                            _this.hide("refresh");
                        }, 500);
                    }else{
                        _this.$refs.uploader.submit(_this.pid);
                    }
                    
                    
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
            this.errImgName = []
            this.pid = ""
            // 初始化上传控件
            this.$refs.uploader.finished()
        },
        // 所有图片上传完成之后触发这个
        uploadedComplete(){
            let _this = this;
            let errImgLength = _this.errImgName.length;
            let allImgLength = _this.$refs.uploader.files.length;
            let sucImgLength = allImgLength - errImgLength;
            
            let title = sucImgLength+"张图片上传成功！"
            if( errImgLength > 0 ){
                title+=errImgLength+"张图片上传失败！"
            }

            let suc = Toast({
                message:title,
                iconClass: 'icon icon-success'
            });
            setTimeout(() => {
                suc.close();
                Indicator.close();
                _this.hide("refresh");
            }, 1000);
        },
        // 上传图片失败的时候，把失败的图片信息存进去，告知用户
        uploaderError(data){
            this.errImgName.push(data.name)
        }
    }
}

</script>
<style type="text/css">
    .mint-indicator{
        position: relative;
        z-index: 999;
    }
</style>

<style type="text/css" lang="scss" scoped>
    .rechargeBody{
        position: absolute;
        left: 0;
        top:0;
        background: #eee;
        z-index: 999;
    }
    .infoTit{
        height: 30px;
        line-height: 30px;
        text-indent: 10px;
        font-size: 14px;
        color:#fff;
        background: #26a2ff;
    }
    
</style>