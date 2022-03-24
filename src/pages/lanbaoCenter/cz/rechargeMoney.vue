<!-- 账户充值 -->
<template>
  <div class="contains rechargeBody" v-show="show || isHomeCome">
        <mt-header title="账户充值" fixed>
            <router-link to="/" slot="left" v-if="isHomeCome">
                <mt-button icon="back"></mt-button>
            </router-link>
            <mt-button v-else icon="back" slot="left" @click="hide"></mt-button>
        </mt-header>
        <div class="lq-form-content">
            <template v-if="isHomeCome">
                <div class="lq-part" @click="openComPicker('bxgs')">
                    <mt-cell title="保险公司" is-link :value="form.insurername"></mt-cell>
                </div>
                <div class="lq-part" @click="openComPicker('company')">
                    <mt-cell title="企业ID" is-link :value="form.tmscode"></mt-cell>
                </div>
                <div class="lq-part" @click="openComPicker('company')">
                    <mt-cell title="公司名称" is-link :value="form.name"></mt-cell>
                </div>
            </template>
            <template v-else>
                <mt-field label="保险公司" type="text" v-model="form.insurername" disabled></mt-field>
                <mt-field label="企业ID" type="text" v-model="form.tmscode" disabled ></mt-field>
                <mt-field label="公司名称" type="text" v-model="form.name" disabled ></mt-field>
            </template>
            
            
            <mt-field label="充值金额" type="number" v-model="form.amount"></mt-field>
            <mt-field label="业务员" type="text" v-model="form.yewuyuan"></mt-field>
            <mt-field label="备注" type="textarea" v-model="form.remark" rows="3"></mt-field>
            <!-- 上传图片控件 -->
            <div class="infoPart">
                <div class="infoTit">转款凭证</div>
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
        <!-- 下拉列表 -->
        <mt-popup  v-model="isshow" position="bottom" class="lq-picker-body">
            <mt-picker 
                :slots="slots" 
                showToolbar 
                :valueKey="slotsValueKey"	
                @change="onValuesChange"
            >
                <div class="picker-filterbody">
                    <div class="picker-filterInput">
                        <mt-field placeholder="输入筛选数据" v-model="pickerFilter"></mt-field>
                    </div>
                    <div class="picker-btn-body">
                        <div class="picker-btn picker-btn-sure"  @click="sureSelect">确定</div>
                        <div class="picker-btn picker-btn-cancel"  @click="openComPicker">取消</div>
                    </div>                    
                </div>
            </mt-picker>
        </mt-popup>
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
            isHomeCome:false,
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
            pid:"",
            isshow:false,
            pickerFilter:"",
            // 下拉列表初始数据
            slots: [
                {
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center',
                    defaultIndex:1,
                }
            ],
            slotsValueKey:"text",
            bxgsData:[
                { id: "WTTX_TPYBX", text: "太平洋保险" },
                // { id: "WTTX_RBCX_NEW", text: "云南人保" },
                // { id: "WTTX_RSCX", text: "人寿财险" },
                { id: "WTTX_HTBX", text: "华泰保险" },
                // { id: 'WTTX_RBCX', text: "湖南人保" },
                // { id: "WTTX_ZHBX", text: "中华保险" },
                // { id: "WTTX_ZTBX", text: "永诚保险" },
                
            ],
            companyData:[],
            pickerSelVal:"",
            curType:""
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
            if( !parms.insurername ){
                MessageBox('提示', '保险公司不能为空！');
                return;
            }
            if( !parms.tmscode ){
                MessageBox('提示', '企业ID不能为空！');
                return;
            }
            if( !parms.name ){
                MessageBox('提示', '公司名称不能为空！');
                return;
            }
            if( !parms.amount || parms.amount <= 0){
                MessageBox('提示', '充值金额必须大于等于0！');
                return;
            }
            if( !parms.yewuyuan.replace(/\s/g,"") ){
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
                    
                    _this.pid = result._message;
                    if( _this.$refs.uploader.files.length == 0 ){
                        let suc = Toast({
                            message: '充值成功',
                            iconClass: 'icon icon-success'
                        });
                        setTimeout(() => {
                            suc.close();
                            if(this.isHomeCome){
                                _this.clearData();
                            }else{
                                _this.hide("refresh");
                            }
                        }, 500);
                    }else{
                        let suc = Toast({
                            message: '充值成功,现在正在上传图片，请勿关闭',
                            iconClass: 'icon icon-success'
                        });
                        setTimeout(() => {
                            suc.close();
                            _this.$refs.uploader.submit(_this.pid);
                        }, 500);
                        
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
                if(this.isHomeCome){
                    _this.clearData();
                }else{
                    _this.hide("refresh");
                }
                
            }, 1000);
        },
        // 上传图片失败的时候，把失败的图片信息存进去，告知用户
        uploaderError(data){
            this.errImgName.push(data.name)
        },
        // 下拉筛选数据
        filterData(val){
            let _this = this;
            let data = _this[_this.curType+"Data"];

            if(data){
                this.slots[0].values = data.filter(function(item,i){
                    
                    var reg = new RegExp(val);
                    return reg.test(item[_this.slotsValueKey]);

                });               
            }

        },
        // 确定选择
        sureSelect(){
            this.isshow = false;
            // 根据类型来选中
            if( this.curType == "bxgs" ){
                this.form.insurername = this.pickerSelVal['text'];
                this.form.coidinsurer = this.pickerSelVal['id'];
            }else if( this.curType == "company" ){
                this.form.name = this.pickerSelVal['name'];
                this.form.coid = this.pickerSelVal['id'];
                this.form.tmscode = this.pickerSelVal['tmscode'];
            }
            
        },
        // 打开下拉选择列表 || 取消列表
        openComPicker(openType){
            this.isshow = !this.isshow;
            if(openType){
                this.curType = openType;
                this.slots[0].values = this[openType+"Data"];
                // this.slotsValueKey = ( openType == "wlgs" ? "SupplierName" : "text" );
                this.pickerFilter = '';
            }
        },
        // 下拉列表值改变时触发
        onValuesChange(picker, values) {
            if(values[0]){
                this.pickerSelVal = values[0];
            }else{
                this.pickerSelVal = {}
            }       
        },
        // 获取签约记录里的公司
        getCompayng(){         
            let _this = this;
            _this.$http({
                method:"post",
                url:"/CommonInsurer/GetCompanyInfoSign",
                data:{
                    coidinsurer:"全部"
                }
            }).then(response => {
                let result = response.data
                if( result._status && result._data){
                    let data = JSON.parse(result._data) || []
                    _this.companyData = _this.duplicateRemoval(data);
                }else{

                    Toast({
                        message: result._message || "查无数据",
                        position: 'center',
                        duration: 3000
                    });
                }
            }, result => {
                
            })
                                

        },
        // 去重
        duplicateRemoval(data){
            var obj = {};
            var arr = []
            data.filter(function(item){
                if(!obj[item.TMSCode] && item.COId){
                    obj[item.TMSCode] = item;
                    arr.push({
                        text:item.TMSCode+" "+item.Name,
                        id:item.COId,
                        name:item.Name,
                        tmscode:item.TMSCode
                    })
                }
            })
            return arr;
        },
        // 清空数据
        clearData(){
            for( var key in this.form ){
                this.form[key] = ""
            }
            this.form.createby = this.users.userInfo.userid;
            this.$refs.uploader.finished()
            this.errImgName = []
            this.pid = ""
        }
    },
    watch:{
        // 监听输入值的变化进行筛选
        pickerFilter:function (val, oldVal) { 
            this.filterData(val)
        }
    },
    created(){
        if( this.$route.meta.isHomeCome ){
            this.isHomeCome = true;
            this.form.createby = this.users.userInfo.userid;
            this.getCompayng()
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
    /* 下拉框样式 */
    .lq-picker-body{
        background:#fff;
        width: 100%;
    }
    .picker-sure{
        float: right;
    }
    .picker-filterbody{
        height: 40px;
        border-bottom: 1px solid #ddd;
        box-sizing: border-box;
    }
    .picker-filterInput{
        width: 70%;
        float: left;
        .mint-cell{
            min-height: 39px;
            background-image:none;
        }
    }
    .picker-btn-body{
        width: 30%;
        height: 100%;
        float: left;
        .picker-btn{
            width: 50%;
            text-align: center;
            color: #26a2ff;
            float: left;
            line-height: 40px;
            font-size: 16px;
        }
    }
    .red{
        color: red;
    }
    .green{
        color:green;
    }
    .lq-icon-filter{
        width:24px;
        height:24px;
        vertical-align: middle;
        margin-right: 10px;
    }
    .btn-body{
        overflow: hidden;
        margin-top: 5px;
        button{
            float: right;
            margin-left: 1rem;
        }
    }
</style>