<!-- 保险签约 -->
<template>
  <div class="contains rechargeBody" v-show="show || isHomeCome">
        <mt-header title="保险签约" fixed>
            <router-link to="/" slot="left" v-if="isHomeCome">
                <mt-button icon="back"></mt-button>
            </router-link>
            <mt-button v-else icon="back" slot="left" @click="hide"></mt-button>
        </mt-header>
        <div class="lq-form-content">
            <div class="lq-part" @click="openComPicker('company')">
                <mt-cell title="企业ID" is-link :value="form.tmscode"></mt-cell>
            </div>
            <div class="lq-part" @click="openComPicker('company')">
                <mt-cell title="公司名称" is-link :value="form.name"></mt-cell>
            </div>
            <!-- 签约列表 -->
            <div class="lq-part qy-outer">
                <mt-cell title="签约列表"></mt-cell>
                <div class="qy-list-head">
                    <span>保险公司</span>
                    <span class="mini-item">是否签约</span>
                    <span class="mini-item">是否默认</span>
                    <span>默认投保金额</span>
                </div>
                <ul class="qy-list">
                    <li v-for="(item,index) in bxgsData" :key="item.COId+index">
                        <div class="item">{{item.Name}}</div>
                        <div class="item mini-item"><mt-switch v-model="item.IsUseSign"></mt-switch></div>
                        <div class="item mini-item"><mt-switch v-model="item.IsUseDefault" @change="qyDefaultChange(item.COId,item.IsUseDefault)"></mt-switch></div>
                        <div class="item item-part-outer">
                            <div class="item-part" v-if="item.IsStepForUnit == 1">
                                <label>单票</label>
                                <select v-model="item.DefaultAmountForUnit">
                                    <option v-for="(o,i) in item.StepForUnit.split(',')" :value="o" :key="item.COId+'IsStepForUnit'+i">{{o}}</option>
                                </select>
                            </div>
                            <div class="item-part" v-else>
                                <mt-field label="单票" type="number" v-model="item.DefaultAmountForUnit"></mt-field>
                            </div>
                            <div class="item-part" v-if="item.IsStepForCar == 1">
                                <label>整车</label>
                                <select v-model="item.DefaultAmountForCar">
                                    <option v-for="(o,i) in item.StepForCar.split(',')" :value="o" :key="item.COId+'IsStepForUnit'+i">{{o}}</option>
                                </select>
                            </div>
                            <div class="item-part" v-else>
                                <mt-field label="整车" type="number" v-model="item.DefaultAmountForCar"></mt-field>
                            </div>
                        </div>
                    </li>
                </ul>
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
                coid:"",//物通企业编码
                tmscode:"",//蓝桥企业ID
                name:"",//公司名称
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
                { COId: "WTTX_TPYBX", Name: "太平洋保险",IsUseSign:false,IsUseDefault:false,DefaultAmountForUnit:0,DefaultAmountForCar:0,IsStepForCar:0,IsStepForUnit:0,StepForCar:"",StepForUnit:"" },
                // { COId: "WTTX_RBCX_NEW", Name: "云南人保",IsUseSign:false,IsUseDefault:false,DefaultAmountForUnit:0,DefaultAmountForCar:0,IsStepForCar:0,IsStepForUnit:0,StepForCar:"",StepForUnit:"" },
                // { COId: "WTTX_RSCX", Name: "人寿财险",IsUseSign:false,IsUseDefault:false,DefaultAmountForUnit:0,DefaultAmountForCar:0,IsStepForCar:0,IsStepForUnit:0,StepForCar:"",StepForUnit:"" },
                { COId: "WTTX_HTBX", Name: "华泰保险",IsUseSign:false,IsUseDefault:false,DefaultAmountForUnit:0,DefaultAmountForCar:0,IsStepForCar:0,IsStepForUnit:0,StepForCar:"",StepForUnit:"" },

                // { COId: 'WTTX_RBCX', Name: "湖南人保",IsUseSign:false,IsUseDefault:false,DefaultAmountForUnit:0,DefaultAmountForCar:0,IsStepForCar:0,IsStepForUnit:0,StepForCar:"",StepForUnit:"" },
                // { COId: 'WTTX_YTCX', Name: "亚太财险",IsUseSign:false,IsUseDefault:false,DefaultAmountForUnit:0,DefaultAmountForCar:0,IsStepForCar:0,IsStepForUnit:0,StepForCar:"",StepForUnit:"" },
                // { COId: "WTTX_ZHBX", Name: "中华保险",IsUseSign:false,IsUseDefault:false,DefaultAmountForUnit:0,DefaultAmountForCar:0,IsStepForCar:0,IsStepForUnit:0,StepForCar:"",StepForUnit:"" },
                // { COId: "WTTX_ZTBX", Name: "永诚保险",IsUseSign:false,IsUseDefault:false,DefaultAmountForUnit:0,DefaultAmountForCar:0,IsStepForCar:0,IsStepForUnit:0,StepForCar:"",StepForUnit:"" },
            ],
            companyData:[],
            pickerSelVal:"",
            curType:""
        }
    },
    computed: mapState({ users: state => state }),
    methods: {
        // 提交数据保存
        submit(){
            let _this = this;
            let parms = _this.form;
            let data = _this.bxgsData;
            if( !parms.tmscode ){
                MessageBox('提示', '企业ID不能为空！');
                return;
            }
            if( !parms.name ){
                MessageBox('提示', '公司名称不能为空！');
                return;
            }
            if( !data.filter(o=>o.IsUseDefault).length ){
                MessageBox('提示', '没有选择默认保险公司！');
                return;
            }


            let obj = data.map(o=>{
                return {
                    TMSCODE:parms.tmscode,//  企业ID
                    COID:o.COId,// 保险公司ID
                    NAME:o.Name,// 保险公司名称
                    ISUSESIGN:o.IsUseSign ? 1 : 0,// 是否签约0/1
                    ISUSEDEFAULT:o.IsUseDefault ? 1 : 0,// 是否默认0/1
                    DefaultAmountForUnit:o.DefaultAmountForUnit-0 || 0,// 单票金额
                    DefaultAmountForCar:o.DefaultAmountForCar-0 || 0// 整车金额
                }
            })
            console.log(obj)
            let datastr = JSON.stringify(obj)
            console.log(datastr)
            Indicator.open({
                text: '保存中...',
                spinnerType: 'fading-circle'
            });
            
            
            _this.$http({
                method:"post",
                url:"/Insurer/ComSignInsurer",
                data:{
                    datastr:datastr
                }
            }).then(response => {
                 let result = JSON.parse(response.data)
                
                Indicator.close();
                if( result.code == 10000){
                    
                    let suc = Toast({
                        message: result.msg || '签约成功',
                        iconClass: 'icon icon-success'
                    });
                    setTimeout(() => {
                        suc.close();
                        if(this.isHomeCome){
                            // _this.clearData();
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
                this.getQyInfo(this.form.tmscode)
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
        // 签约列表 是否默认改变时 改变其他行的 默认 保持只有一个默认
        qyDefaultChange(COId,IsUseDefault){
            this.bxgsData.forEach(o => {
                if(o.COId != COId){
                    o.IsUseDefault = false
                }else if(IsUseDefault){
                    o.IsUseSign = true
                }
            });
        },
        // 获取公司签约信息
        getQyInfo(tmscode){
            let _this = this;
            _this.$http({
                method:"post",
                url:"/Insurer/GetInsurerByTmscodeNew",
                data:{
                    tmscode:tmscode
                }
            }).then(response => {
                let result = JSON.parse(response.data)
                if( result.code == 10000 ){
                    let data = JSON.parse(result.result) || []
                    console.log(data)
                    _this.setQyInfo(data)
                }else{
                    Toast({
                        message: result.msg || "查无数据",
                        position: 'center',
                        duration: 3000
                    });
                }
            }, result => {
                
            })
        },
        // 设置公司签约信息
        setQyInfo(data){
            this.bxgsData.forEach(o=>{
                let item = data.filter(_=>_.COId == o.COId || _.Name == o.Name)
                if(item.length){
                    o.IsUseSign = Boolean(item[0].IsUseSign);
                    o.IsUseDefault = Boolean(item[0].IsUseDefault);
                    o.DefaultAmountForUnit = item[0].DefaultAmountForUnit;
                    o.DefaultAmountForCar = item[0].DefaultAmountForCar;
                    o.IsStepForCar = item[0].IsStepForCar;
                    o.IsStepForUnit = item[0].IsStepForUnit;
                    o.StepForCar = item[0].StepForCar;
                    o.StepForUnit = item[0].StepForUnit;
                }
            })
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

<style lang="scss" scoped>
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
    .qy-list-head{
        background-color: #fff;
        min-height:48px;
        line-height: 48px;
        display:flex;
        text-align: center;
        span:not(.mini-item){
            flex:1;
            font-size: 16px;
        }
        .mini-item{
            width: 80px; 
            font-size: 16px; 
        }
    }
    .qy-list{
        background-color: #fff;
        
        li{
            display: flex;
            align-items: center;
            align-content: center;
            justify-content: space-between;
            flex-direction: row;
            flex-wrap: wrap;
            font-size: 16px;
            .item{
                height: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
                align-content: center;
                flex:1;
                text-align: center;
                .item-part{
                    width: 100%;
                    height: 30px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    align-content: center;
                    label{
                        width: 40px;
                    }
                    select{
                        flex:1;
                        height: 24px;
                        border:1px solid #ddd;
                    }
                }
            }
            .mini-item{
                width: 80px; 
                flex: inherit;
            }
            .item-part-outer{
                justify-content: space-between;
                flex-direction: row;
                flex-wrap: wrap;
            }
            /deep/ .mint-cell{
                min-height: 30px;
                background-image:none;
                .mint-cell-wrapper{
                    padding: 0;
                    background-image:none;
                }
                .mint-cell-value{
                    border-bottom:1px solid #ddd;
                }
            }
        }
    }
    .mint-field {
        /deep/ .mint-cell-title{
            width: 40px;
        }
    }
    .qy-outer{
        margin-top: 10px;
    }
</style>