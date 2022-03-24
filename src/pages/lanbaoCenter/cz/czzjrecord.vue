<!-- 充值足迹 -->
<template>
  <div class="contains" :class="{overflowHidden:showsearch}" style="overflow:hidden;">
        <mt-header :title="'充值足迹'+( allList.length > 0 ? '【'+ allList.length + '】' : '' )" fixed>
            <router-link to="/" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <!-- 筛选按钮 -->
            <mt-button slot="right" @click="showFilterBar">
                <icon class="icon lq-icon-filter" name="filter" scale="4"></icon>
            </mt-button>
            <!-- <mt-button icon="search" slot="right" @click="showsearchBar"></mt-button> -->
        </mt-header>
        <!-- 充值页面 -->
        <v-recharge :show="showRecharge" @hide="hideRecharge" ref="recharge"></v-recharge>
        <!-- 详情页面 -->
        <v-recharge-detail :show="showRechargeDetail" @hide="hideRechargeDetail" ref="rechargeDetail"></v-recharge-detail>
        <!-- 筛选面板 -->
        <v-filter :show="showFilter" @hide="hideFilter" ref="filter"></v-filter>
        <!-- 记录列表页 -->
        <div class="record-body" style="height:100%;overflow:auto;">
            <div class="record-part">
                <!-- <div class="record-title">
                    <div>{{listBdate}}&emsp;至&emsp;{{listEdate}}</div>
                </div> -->
                <ul class="record-list"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="10">
                    <template v-if="list.length > 0">
                        <li class="record-list-part" v-for="(data,i) in list" :key="i" >
                            <div class="record-list-content">
                                <div class="record-list-content-center">
                                    <div>
                                        <span class="label">保险公司：</span>
                                        <span>{{data.InsurerName}}</span>
                                    </div>
                                    <div>
                                        <span class="label">企业ID：</span>
                                        <span class="red">{{data.TMSCode}}</span>
                                    </div>
                                    <div>
                                        <span class="label">公司名称：</span>
                                        <span>{{data.Name}}</span>
                                    </div>
                                    <div>
                                        
                                        <span class="label">账户总额：</span>
                                        <span class="red">{{data.Income}}￥</span>
                                    </div>
                                    <div>
                                        <span class="label">账户支出：</span>
                                        <span class="green" style="width:6rem;">{{data.Disbursement}}￥</span>
                                        <span v-show="data.Balance" class="label">剩余保费：</span>
                                        <span v-show="data.Balance" class="red">{{data.Balance}}￥</span>
                                        
                                    </div>
                                    <div class="btn-body">
                                        <mt-button type="primary" size="small" @click.native="rechargehandle(i)" v-if="['华泰保险','太平洋保险'].includes(data.InsurerName)">充值</mt-button>
                                        <mt-button type="primary" size="small" @click.native="rechargeDetailHandle(i)">详情</mt-button>
                                    </div>
                                </div>
                            </div>
                            <div class="record-list-icon">{{i+1}}</div>
                            <!-- <div class="record-list-acc">
                                <mt-button type="primary" size="small" @click.native="rechargehandle(i)">充值</mt-button>
                                <mt-button type="primary" size="small" @click.native="rechargeDetailHandle(i)">详情</mt-button>
                            </div> -->
                        </li>
                    </template>
                    <template v-else>
                       <li class="unshowData">暂无数据</li>
                    </template>
                </ul>
                <div class="loadMore" v-show="loading">
                    <div class="loadMore-icon">
                        <mt-spinner type="fading-circle" color="#26a2ff"></mt-spinner>
                    </div>
                    <span class="loadMore-txt">加载中...</span>
                </div>
                
            </div>
        </div>
        <!-- 开单记录查询页面 -->
        <mt-popup
            class="searchBar-outer contains"
            v-model="showsearch"
            :modal="closeOnClickModal"
            position="right">
            <mt-header title="充值足迹查询" fixed>
                <mt-button slot="left" icon="back" @click="showsearchBar"></mt-button>
            </mt-header>
            <div class="lq-form-content">
                <div class="lq-part" @click="openComPicker('bxgs')">
                    <mt-cell title="保险公司" is-link :value="coidinsurer_text"></mt-cell>
                </div>
            </div>
            <div class="lq-btn-content">
                <mt-button type="primary" size="large" @click="submit" >查询</mt-button>
            </div>

            <!-- 下拉列表 -->
            <mt-popup  v-model="isshow" position="bottom" class="lq-picker-body">
                <mt-picker :slots="slots" showToolbar :valueKey="slotsValueKey"	@change="onValuesChange">
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
        </mt-popup>
        
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui';
import { MessageBox } from 'mint-ui';
import recharge from "@/pages/lanbaoCenter/cz/rechargeMoney"
import rechargeDetail from "@/pages/lanbaoCenter/cz/rechargeDetail"
import filter from "@/pages/lanbaoCenter/cz/filter"

export default {
    data () {
        return {
            showsearch:false,
            closeOnClickModal:false,
            showRecharge:false,//显示充值页面
            showRechargeDetail:false,//显示详情页面
            showFilter:false,//显示筛选面板
            loading:false,
            totalNum:0,
            pageSize:20,
            pageNum:1,
            allList:[],
            noChangeAllData:[],
            list:[],
            form:{
                coidinsurer:"全部",
            },
            coidinsurer_text:"全部",
            curIndex:0,
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
                { id: "全部", text: "全部" },
                { id: "WTTX_RBCX_NEW", text: "云南人保" },
                { id: "WTTX_RSCX", text: "人寿财险" },
                { id: "WTTX_HTBX", text: "华泰保险" },
                { id: 'WTTX_RBCX', text: "湖南人保" },
                { id: "WTTX_ZHBX", text: "中华保险" },
                { id: "WTTX_ZTBX", text: "永诚保险" },
                { id: "WTTX_TPYBX", text: "太平洋保险" },
                
            ],
            pickerSelVal:"",
            curType:""

        };
    },
    components:{
        "v-recharge":recharge,
        "v-recharge-detail":rechargeDetail,
        "v-filter":filter
    },
    methods: {
        // 显示隐藏搜索栏
        showsearchBar(){
            this.showsearch = !this.showsearch
        },
        // 提取数据
        submit(unshow){
            if( typeof unshow == "object" ){
                this.showsearchBar();
            }
            
            let _this = this;

            Indicator.open({
                text: '查询中...',
                spinnerType: 'fading-circle'
            });
            let parms = _this.form;
            _this.$http({
                method:"post",
                url:"/CommonInsurer/GetRechargeFoot",
                // data:parms
            }).then(response => {
                let result = response.data

                Indicator.close();
                if( result._status && result._data){
                    let data = JSON.parse(result._data)  || []
                    _this.allList = data;
                    _this.noChangeAllData = data;
                    _this.totalNum = data.length;
                    _this.pageNum = 1;
                    _this.pageCount = Math.ceil(_this.totalNum / _this.pageSize);
                    _this.list =  _this.allList.slice(0,_this.pageSize);

                    let suc = Toast({
                        message: '查询成功',
                        iconClass: 'icon icon-success'
                    });
                    setTimeout(() => {
                        suc.close();
                    }, 1000);
                }else{
                    _this.allList = [];
                    _this.totalNum = 0;
                    _this.pageNum = 1;
                    _this.pageCount = 0;
                    _this.list =  [];
                    Toast({
                        message: result._message || "查无数据",
                        position: 'center',
                        duration: 3000
                    });
                }
            }, result => {
                Indicator.close();
            })
                                

        },
        // 向下加载更多
        loadMore() {
            let _this = this;
            if( _this.loading ){
                return false;
            }
            if( _this.list.length == 0 ){
                _this.loading = false;
                return false;
            }
            _this.pageNum+=1;
            if( _this.pageNum > _this.pageCount){
                _this.loading = false;
                return false;
            }
            _this.loading = true;
            setTimeout(() => {
                let nextlist =  _this.allList.slice(_this.pageSize*(_this.pageNum-1),_this.pageSize*_this.pageNum);
                _this.list = _this.list.concat(nextlist);
                _this.loading = false;
            },10);
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
                this.coidinsurer_text = this.pickerSelVal['text'];
                this.form.coidinsurer = this.pickerSelVal['id'];
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
            }            
        },
        rechargehandle(index){
            this.$refs.recharge.setData(this.list[index])
            this.showRecharge = true;
        },
        rechargeDetailHandle(index){
            this.$refs.rechargeDetail.setData(this.list[index])
            this.showRechargeDetail = true;
        },
        hideRecharge(refresh){
            this.showRecharge = false
            if(refresh == "refresh"){
                this.submit();
            }
        },
        hideRechargeDetail(refresh){
            this.showRechargeDetail = false
            if(refresh == "refresh"){
                this.submit();
            }
        },
        hideFilter(filterData){
            this.showFilter = false
            if(!filterData.type){
                let _this = this;
                let data = _this.noChangeAllData.filter((item)=>{
                    let isInArray = filterData.coidinsurer.length >0 ? filterData.coidinsurer.includes((item["CoidInsurer"] || "").toUpperCase()) : true;
                    let regCode = new RegExp(filterData.tmscode);
                    let regName = new RegExp(filterData.name);
                    return isInArray && regCode.test(item.TMSCode) && regName.test(item.Name)
                })
                _this.allList = data;
                _this.totalNum = data.length;
                _this.pageNum = 1;
                _this.pageCount = Math.ceil(_this.totalNum / _this.pageSize);
                _this.list =  _this.allList.slice(0,_this.pageSize);
            }
        },
        showFilterBar(){
            this.showFilter = !this.showFilter
        }
    },
    watch:{
        // 监听输入值的变化进行筛选
        pickerFilter:function (val, oldVal) { 
            this.filterData(val)
        }
    },
    created(){
        this.submit();
    }
}

</script>
<style lang='scss' scoped>
    .overflowHidden{
        overflow: hidden;
    }
    .searchBar-outer{
        width: 100%;
        height: 100%;
        background: #fff;
    }
    .record-title{
        padding:0.5rem  1rem;
        div{
            font-size: 0.9rem;
            line-height: 1.4rem;
            text-align: center;
            color: #999;           
        }

    }
    .record-list-part{
        overflow: hidden;
        background:#fff;
        border-bottom: 1px solid #f3f3f3;
        .record-list-content{
            float: left;
            width: 100%;
            padding-left:3rem;
            padding-right:0.5rem;
            box-sizing: border-box;
            font-size: 0.8rem;
            .record-list-content-center{
                border-left: 1px solid #eee;
                box-sizing: border-box;
                padding:0.5rem;
                div{
                    line-height: 1.5rem;
                    span{
                        display: inline-block;
                        font-size: 1rem;
                    }
                    .label{
                        width: 5rem;
                        text-align: right;
                        color: #666;
                    }
                }                
            }

        }
        .record-list-acc{
            float: left;
            width: 100%;
            font-size: 1rem;
            line-height: 3rem;
            padding-right: 1rem;
            box-sizing: border-box;
            text-align: right;
            border-top:1px solid #eee;
        }
        .record-list-icon{
            float: left;
            width: 3rem;
            padding: 0.5rem;
            box-sizing: border-box;
            margin-left: -100%;
            color: #26a2ff;
            text-align: center;
            line-height: 1.6rem;
            
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
    }
    .lq-part{
        border-bottom:1px solid #eee;
        .mint-cell{
            background-image: none;
            .mint-cell-wrapper{
                background-image: none;
            }
        }
    }
    .lq-detail-tit{
        margin-top: 1rem;
        text-align: center;
        line-height: 2rem;
        font-size: 1.4rem;
    }
    .lq-detail-acc{
        font-size: 2rem;
        text-align: center;
        line-height: 3rem;
    }
    .lq-detail-list{
        padding:0 1rem;
        margin-top: 1rem;
        li{
            overflow: hidden;
            padding:0.5rem 0;
            div{
                float: left;
                line-height: 1.8rem;
                font-size:1rem;
                &:last-child{
                    width: 7rem;
                    margin-left: -100%;
                    color: #999;
                }
                &:first-child{
                    padding-left:7.5rem;
                    width: 100%;
                    box-sizing: border-box;
                    text-align: right;
                    height: 2rem;
                }
            }
            &.line{
                background: #eee;
                padding: 0;
                margin:0.5rem 0;
                height: 1px;
                width: 100%;
            }
        }
    }
    .mint-field{
        border-bottom: 1px solid #eee
    }
    .loadMore{
        text-align: center;
    }
    .loadMore-icon{
        width: 30px;
        margin: 0 auto;
    }
    .imgpart{
        text-align: center;
        span{
            text-align: center;
            display: block;
        }
        img{
            max-width: 100%;
        }
    }
    .unshowData{
        padding-top: 11rem;
        text-align: center;
        font-size: 16px;
        color: #999;
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