<!-- 账户详情 -->
<template>
  <div class="contains" style="padding-top:0;" v-show="show">
        <mt-header title="账户详情" fixed>
            <mt-button icon="back" slot="left" @click="hide">返回</mt-button>
        </mt-header>
        <!-- 记录列表页 -->
        <div class="record-body" style="height:100%;overflow:auto;">
            <div class="record-part">
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
                                        <span class="label">业务员：</span>
                                        <span style="width:7rem;">{{data.yewuyuan}}</span>
                                        <span class="label">金额：</span>
                                        <span v-if="data.type == '支出'" class="green">{{data.Amount}}￥</span>
                                        <span v-else class="red">{{data.Amount}}￥</span>
                                    </div>
                                    <div>
                                        <span class="label">操作人：</span>
                                        <span>{{data.Operator}}</span>
                                    </div>
                                    <div>
                                        <span class="label">操作时间：</span>
                                        <span>{{data.CreateTime}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="record-list-icon">{{i+1}}</div>
                            <div class="record-list-acc">
                                <span v-if="data.type == '支出'" class="green">{{data.type}}</span>
                                <span v-else class="red">{{data.type}}</span>
                                
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
            loading:false,
            totalNum:0,
            pageSize:20,
            pageNum:1,
            allList:[],
            list:[],
        }
    },
    computed: mapState({ users: state => state }),
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
        hide(refresh){
            this.$emit('hide',refresh); 
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
        setData(data){
            let _this = this;
            _this.$http({
                method:"post",
                url:"/CommonInsurer/GetCompanyAccountInsurerFeeDetail",
                data:{
                    coidinsurer:data.CoidInsurer,
                    coid:data.COId,
                }
            }).then(response => {
                let result = response.data
                
                if( result._status){
                    let data = JSON.parse(result._data) || []
                    _this.allList = data;
                    _this.totalNum = data.length;
                    _this.pageNum = 1;
                    _this.pageCount = Math.ceil(_this.totalNum / _this.pageSize);
                    _this.list =  _this.allList.slice(0,_this.pageSize);
                }else{
                    MessageBox('提示', result._message || "查无数据");
                }
            }, result => {
                
            })
        }
    }
}

</script>
<style type="text/css" lang="scss" scoped>
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
            width: 3rem;
            margin-left: -3rem;
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
    .red{
        color: red;
    }
    .green{
        color:green;
    }
    .unshowData{
        padding-top: 11rem;
        text-align: center;
        font-size: 16px;
        color: #999;
    }
</style>