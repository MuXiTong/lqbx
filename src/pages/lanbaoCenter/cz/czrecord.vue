<!-- 签约记录 -->
<template>
  <div class="contains" :class="{overflowHidden:showsearch}" style="overflow:hidden;">
        <mt-header :title="'签约记录'+( allList.length > 0 ? '【'+ allList.length + '】' : '' )" fixed>
            <router-link to="/" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <!-- 筛选按钮 -->
            <mt-button slot="right" @click="showFilterBar">
                <icon class="icon lq-icon-filter" name="filter" scale="4"></icon>
            </mt-button>
            <!-- <mt-button icon="search" slot="right" @click="showsearchBar"></mt-button> -->
        </mt-header>
        <!-- 充值 -->
        <v-recharge :show="showRecharge" @hide="hideRecharge" ref="recharge"></v-recharge>
        <!-- 筛选面板 -->
        <v-filter :show="showFilter" @hide="hideFilter" ref="filter"></v-filter>
        <!-- 查询面板 -->
        <v-search :show="showsearch" @hide="hideSearchBar" @setData="submit" ref="search"></v-search>
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
                        <li class="record-list-part" v-for="(data,i) in list" :key="i" :class="{redBg:data.Balance && data.Balance <=500 }">
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
                                        <span class="label">账户状态：</span>
                                        <span v-if="data.Income > 0" class="green">已开通</span>
                                        <span v-else class="red">未开通</span>
                                        &emsp;
                                        <span v-show="data.Balance" class="label">剩余保费：</span>
                                        <span v-show="data.Balance" class="red">{{data.Balance}}￥</span>
                                    </div>
                                </div>
                            </div>
                            <div class="record-list-icon">{{i+1}}</div>
                            <div class="record-list-acc">
                                <mt-button type="primary" size="small" @click.native="rechargehandle(i)">充值</mt-button>
                            </div>
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

  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui';
import { MessageBox } from 'mint-ui';
import recharge from "@/pages/lanbaoCenter/cz/rechargeMoney"
import filter from "@/pages/lanbaoCenter/cz/filter"
import search from "@/pages/lanbaoCenter/cz/search"

export default {
    data () {
        return {
            showsearch:false,//显示筛选面板
            showRecharge:false,//显示充值页面
            showFilter:false,//显示筛选面板
            loading:false,
            totalNum:0,
            pageSize:20,
            pageNum:1,
            allList:[],
            noChangeAllData:[],
            list:[],

        };
    },
    components:{
        "v-recharge":recharge,
        "v-filter":filter,
        "v-search":search,
    },
    methods: {
        // 显示隐藏搜索栏
        showsearchBar(){
            this.showsearch = !this.showsearch
        },
        hideSearchBar(){
            this.showsearch = false
        },
        // 提取数据
        submit(parms){         
            let _this = this;

            Indicator.open({
                text: '查询中...',
                spinnerType: 'fading-circle'
            });
            _this.$http({
                method:"post",
                url:"/CommonInsurer/GetCompanyInfoSign",
                data:parms
            }).then(response => {
                let result = response.data

                Indicator.close();
                if( result._status && result._data){
                    let data = JSON.parse(result._data) || []
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
        rechargehandle(index){
            this.$refs.recharge.setData(this.list[index])
            this.showRecharge = true;
        },
        hideRecharge(){
            this.showRecharge = false
        },
        hideFilter(filterData){
            this.showFilter = false
            if(!filterData.type){
                let _this = this;
                let data = _this.noChangeAllData.filter((item)=>{
                    let isInArray = filterData.coidinsurer.length >0 ? filterData.coidinsurer.includes(item["CoidInsurer"].toUpperCase()) : true;
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
        // this.submit();
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
            // padding-right:5rem;
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
            width: 5rem;
            margin-left: -5.5rem;
            font-size: 1rem;
            line-height: 3.5rem;
            box-sizing: border-box;
            text-align: right;
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
    
</style>