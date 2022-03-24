<!-- 保险注册 -->
<template>
  <div class="contains rechargeBody" v-show="show || isHomeCome">
        <mt-header title="保险注册" fixed>
            <router-link to="/" slot="left" v-if="isHomeCome">
                <mt-button icon="back"></mt-button>
            </router-link>
            <mt-button v-else icon="back" slot="left" @click="hide"></mt-button>
        </mt-header>
        <div class="lq-form-content">
            <div class="search-out">
                <mt-field label="企业ID" type="text" v-model="form.TMSCode" ></mt-field>
                <button class="search-btn">检测</button>
            </div>
            <mt-field label="公司名称" type="text" v-model="form.Name" ></mt-field>
            <div class="lq-part" @click="openComPicker('bxgs')">
                <mt-cell title="保险公司" is-link :value="form.insurername"></mt-cell>
            </div>
            <mt-field label="法人名称" type="text" v-model="form.LegalPerson"></mt-field>
            <mt-field label="法人身份证" type="text" v-model="form.LP_IDCard"></mt-field>
            <mt-field label="公司地址" type="text" v-model="form.comaddr"></mt-field>
            <mt-field label="手机号码" type="number" v-model="form.LoginName"></mt-field>
            <!-- <mt-field label="登录密码" type="text" v-model="form.password"></mt-field>
            <mt-field label="确认密码" type="text" v-model="form.cpassword"></mt-field> -->
            <!-- <mt-field label="技术支持" type="text" v-model="form.jsName"></mt-field> -->
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
                TMSCode:"",//蓝桥企业ID
                Name:"",//公司名称
                LoginName:"",//手机号码
                // password:"",//密码
                // cpassword:"",//确认密码
                LegalPerson:"",//法人
                LP_IDCard:"",//法人身份证
                comaddr:"",//公司地址
                // jsName:"",//技术支持
            },
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
                // { id: "WTTX_YTCX", text: "亚太财险" },
                // { id: "WTTX_ZHBX", text: "中华保险" },
                // { id: "WTTX_ZTBX", text: "永诚保险" },
                
            ],
            companyData:[],
            pickerSelVal:"",
            curType:""
        }
    },
    computed: mapState({ users: state => state }),
    methods: {
        submit(){
            
            let _this = this;
            let parms = _this.form;
            if( !parms.insurername.replace(/\s/g,"") ){
                MessageBox('提示', '保险公司不能为空！');
                return;
            }
            if( !parms.TMSCode.replace(/\s/g,"") ){
                MessageBox('提示', '企业ID不能为空！');
                return;
            }
            if( !parms.Name.replace(/\s/g,"") ){
                MessageBox('提示', '公司名称不能为空！');
                return;
            }
            if( !parms.LegalPerson.replace(/\s/g,"") ){
                MessageBox('提示', '法人名称不能为空！');
                return;
            }
            if( !checkID.check(parms.LP_IDCard) ){
                MessageBox('提示', '法人身份证不正确！');
                return;
            }
            if( !parms.comaddr.replace(/\s/g,"") ){
                MessageBox('提示', '公司地址不能为空！');
                return;
            }
            if( !/^1[3-9]\d{9}$/.test(parms.LoginName) ){
                MessageBox('提示', '手机号码不正确！');
                return;
            }
            // if( !parms.password.replace(/\s/g,"") ){
            //     MessageBox('提示', '密码不能为空！');
            //     return;
            // }
            // if( parms.password != parms.cpassword){
            //     MessageBox('提示', '确认密码跟密码不一致！');
            //     return;
            // }
            Indicator.open({
                text: '保存中...',
                spinnerType: 'fading-circle'
            });
            
            
            _this.$http({
                method:"post",
                url:"/Insurer/InsurerRegAdd",
                data:parms
            }).then(response => {
                let result = JSON.parse(response.data)
                Indicator.close();
                if( result.code == 10000){
                    
                    let suc = Toast({
                        message: '注册成功',
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
                    MessageBox('提示', result.msg || "查无数据");
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
        },
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
var checkID = {
    check:function (val) {
        if(this.checkCode(val)) {
            var date = val.substring(6,14);
            if(this.checkDate(date)) {
                if(this.checkProv(val.substring(0,2))) {
                    return true;
                }
            }
        }
        return false;
    },
    checkCode:function (val) {
        var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
        var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
        var code = val.substring(17);
        if(p.test(val)) {
            var sum = 0;
            for(var i=0;i<17;i++) {
                sum += val[i]*factor[i];
            }
            if(parity[sum % 11] == code.toUpperCase()) {
                return true;
            }
        }
        return false;
    },
    checkDate:function (val) {
        var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
        if(pattern.test(val)) {
            var year = val.substring(0, 4);
            var month = val.substring(4, 6);
            var date = val.substring(6, 8);
            var date2 = new Date(year+"-"+month+"-"+date);
            if(date2 && date2.getMonth() == (parseInt(month) - 1)) {
                return true;
            }
        }
        return false;
    },
    checkProv:function (val) {
        var pattern = /^[1-9][0-9]/;
        var provs = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门"};
        if(pattern.test(val)) {
            if(provs[val]) {
                return true;
            }
        }
        return false;
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
    .search-out{
        display: flex;
        background-color: #fff;
        justify-content: center;
        align-items: center;
    }
    .search-btn{
        width: 60px;
        height: 30px;
        background-color: #26a2ff;
        color: #fff;
        border: 0 none;
        outline: none;
        border-radius: 5px;
        margin-right: 10px;
        cursor: pointer;
    }
</style>