<!-- 筛选面板 -->
<template>
  <div class="contains filterBar" v-show="show">
        <div class="filterBarMain">
            <div class="filterHead">筛选</div>
            <div class="lq-form-content">
                <mt-checklist
                    class="checklist"
                    title="保险公司"
                    v-model="form.coidinsurer"
                    :options="options">
                </mt-checklist>
                <mt-field label="企业ID" type="text" v-model="form.tmscode"></mt-field>
                <mt-field label="公司名称" type="text" v-model="form.name"></mt-field>
            </div>
            <div class="lq-btn-content">
                <mt-button type="default" size="normal" @click="hide" >取消</mt-button>
                <mt-button type="primary" size="normal" @click="submit" >确定</mt-button>
            </div>
        </div>
        <div class="mask" @click="hide"></div>

  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui';
import { MessageBox } from 'mint-ui';
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
                coidinsurer:[],//保险公司编号
                tmscode:"",//蓝桥企业ID
                name:"",//公司名称
            },
            options:[
                { value: "WTTX_RBCX_NEW", label: "云南人保" },
                { value: "WTTX_RSCX", label: "人寿财险" },
                { value: "WTTX_HTBX", label: "华泰保险" },
                { value: 'WTTX_RBCX', label: "湖南人保" },
                { value: "WTTX_ZHBX", label: "中华保险" },
                { value: "WTTX_ZTBX", label: "永诚保险" },
                { value: "WTTX_TPYBX", label: "太平洋保险" },
            ]
        }
    },
    methods: {
        showMsg(msg){
            let suc = Toast({
              message: msg,
              position:"top"
            });
            setTimeout(() => {
              suc.close();
            }, 1000);
        },
        hide(data){
            this.$emit('hide',data); 
        },
        submit(){
            this.hide(this.form)
        }
    }
}

</script>
<style type="text/css" lang="scss" scoped>
    .checklist .mint-cell{

        width:50%;
        display: inline-block;

    }
    .filterHead{
        width: 100%;
        background: #fff;
        text-align: center;
        line-height: 40px;
        font-size: 20px;
        color: #999;
        border-bottom: 1px solid #eee;
    }
    .filterBar{
        position: absolute;
        width: 100%;
        padding-top: 0;
        z-index: 999;
    }
    .filterBarMain{
        position: relative;
        z-index: 1;
        width:98%;
        margin:1rem auto;
        background: #fff;
    }
    .lq-form-content{
        width: 100%;
        margin: 0;
    }
    .mask{
        position: absolute;
        left: 0;
        top:0;
        width: 100vw;
        height:100%;
        background: rgba($color: #000000, $alpha: 0.6);
    }
    .mint-button{
        width: 49%;
    }
    .lq-btn-content{
        padding-bottom: 1rem;
    }
</style>