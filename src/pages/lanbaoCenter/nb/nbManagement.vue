<!-- 年保管理 -->
<template>
  <div class="contains" :class="{overflowHidden:showsearch}" style="overflow:hidden;">
        <mt-header :title="'年保管理'+( allList.length > 0 ? '【'+ allList.length + '】' : '' )" fixed>
            <router-link to="/" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <!-- 筛选按钮 -->
            <mt-button slot="right" @click="showFilterBar">
                <icon class="icon lq-icon-filter" name="filter" scale="4"></icon>
            </mt-button>
            <mt-button icon="search" slot="right" @click="showsearchBar"></mt-button>
        </mt-header>
        <!-- 筛选面板 -->
        <v-filter :show="showFilter" @hide="hideFilter" ref="filter"></v-filter>
        <!-- 查询面板 -->
        <v-search :show="showsearch" @hide="hideSearchBar" @setData="submit" ref="search"></v-search>
        <!-- 新增 -->
        <v-add :show="showAddPage" @hide="hideAddPage"  ref="addpage"></v-add>
        <!-- 详情页 -->
        <v-details :show="showDetailsPage" @hide="hideDetailsPage"  ref="detailspage"></v-details>
        <!-- 记录列表页 -->
        <div class="record-body" style="height:100%;overflow:auto;">
            <div class="record-part">
                <ul class="record-list"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="100">
                    <template v-if="list.length > 0">
                        <li class="record-list-part" v-for="(data,i) in list" :key="i" @click="showdetailBar(i)">
                            <div class="record-list-content">
                                <div class="record-list-content-center">
                                    <div>
                                        <span class="label">流水号：</span>
                                        <span class="blue">123456</span>
                                    </div>
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
                                        <span class="label">年保费用：</span>
                                        <span class="red" style="width:6rem;">{{data.Balance}}￥</span>
                                        &emsp;
                                        <span class="label">已缴费用：</span>
                                        <span class="red">{{data.Balance}}￥</span>
                                    </div>
                                    <div>
                                        <span class="label">业务员：</span>
                                        <span>保险业务员</span>
                                    </div>
                                </div>
                            </div>
                            <div class="record-list-icon">{{i+1}}</div>
                            <div class="record-list-acc">
                                <span class="red">已提交</span>
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
        <!-- 操作栏 -->
        <mt-actionsheet
            :actions="actions"
            v-model="sheetVisible">
        </mt-actionsheet>
        <div id="addBtn" @click="showAddPageMethod">+</div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui';
import { MessageBox } from 'mint-ui';
import filter from "@/pages/lanbaoCenter/cz/filter"
import search from "@/pages/lanbaoCenter/nb/search"
import add from "@/pages/lanbaoCenter/nb/add"
import details from "@/pages/lanbaoCenter/nb/details"

export default {
    data () {
        return {
            showsearch:false,//显示筛选面板
            showFilter:false,//显示筛选面板
            sheetVisible:false,//显示操作按钮
            showAddPage:false,//显示新增界面
            showDetailsPage:false,//显示详情界面
            loading:false,
            totalNum:0,
            pageSize:20,
            pageNum:1,
            allList:[],
            noChangeAllData:[],
            list:[],
            curSelIndex:0,
            // 操作按钮
            actions:[
                {
                    name:"修改年保",
                    method:this.editUnit
                },
                {
                    name:"查看详情",
                    method:this.lookDetail
                },
                {
                    name:"删除年保",
                    method:this.delUnit
                },
                {
                    name:"提交审核",
                    method:this.delUnit
                }
            ]
        };
    },
    components:{
        "v-filter":filter,
        "v-search":search,
        "v-add":add,
        "v-details":details,
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
        },
        showdetailBar(index){
            this.curSelIndex = index;
            this.sheetVisible = !this.sheetVisible
        },
        showAddPageMethod(){
            this.showAddPage = !this.showAddPage
        },
        hideAddPage(){
            this.showAddPage = false
        },
        hideDetailsPage(){
            this.showDetailsPage = false
        },
        lookDetail(){
            this.showDetailsPage = true
            this.$refs.detailspage.setData(this.list[this.curSelIndex])
        }
    },
    watch:{

    },
    created(){
        
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
            margin-left: -5rem;
            font-size: 1rem;
            line-height: 3rem;
            padding-right: 1rem;
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
    .blue{
        color:#03A9F4;
    }
    .lq-icon-filter{
        width:24px;
        height:24px;
        vertical-align: middle;
        margin-right: 10px;
    }
    #addBtn{
        position: fixed;
        bottom:4rem;
        right: 1rem;
        width: 3rem;
        height: 3rem;
        text-align: center;
        line-height: 3rem;
        font-size: 2rem;
        background:rgba($color: #03A9F4, $alpha: 0.8);
        color: #fff;
        border-radius: 50%;
    }
</style>