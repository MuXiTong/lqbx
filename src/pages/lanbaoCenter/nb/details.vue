<!-- 年保详情 -->
<template>
    <div class="contains detailscontains" v-show="show">
        <mt-header title="年保记录详情" fixed>
            <mt-button slot="left" icon="back" @click="hide"></mt-button>
        </mt-header>
        <div class="content-outer">
            <div class="lq-detail-acc">13456{{listDetail.YDH}}</div>
            <ul class="lq-detail-list">
                <li class="infoTit">基本信息</li>
                <li><div>流水号</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>保险公司</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>企业ID</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>公司名称</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>公司地址</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>联系人</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>联系手机</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>联系电话</div><div>{{listDetail.WLGSMC}}</div></li>
                <li class="line"></li>
                <li class="infoTit">年保信息</li>
                <li><div>年保费用</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>已缴费用</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>开始时间</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>结束时间</div><div>{{listDetail.WLGSMC}}</div></li>
                <li class="line"></li>
                <li class="infoTit">登记信息</li>
                <li><div>登记时间</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>登记部门</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>登记人</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>业务员</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>备注</div><div>{{listDetail.WLGSMC}}</div></li>
                <li class="line"></li>
                <li class="infoTit">受理信息</li>
                <li><div>受理日期</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>受理部门</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>受理人</div><div>{{listDetail.WLGSMC}}</div></li>
                <li class="line"></li>
                <li class="infoTit">驳回信息</li>
                <li><div>驳回日期</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>驳回部门</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>驳回人</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>驳回原因</div><div>{{listDetail.WLGSMC}}</div></li>
                <li class="line"></li>
                <li class="infoTit">审核信息</li>
                <li><div>审核日期</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>审核部门</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>审核人</div><div>{{listDetail.WLGSMC}}</div></li>
                <li class="line"></li>
                <li class="infoTit">审批信息</li>
                <li><div>审批日期</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>审批部门</div><div>{{listDetail.WLGSMC}}</div></li>
                <li><div>审批人</div><div>{{listDetail.WLGSMC}}</div></li>
                <li class="line"></li>
                <li class="infoTit">图片信息</li>
                <li v-for="(data,index) in imgList" :key="index" class="imgpart" >
                    <img :src="data.File_Url" :alt="data.filename" onerror>
                    <span>{{data.filename}}</span>
                </li>
            </ul>            
        </div>

    </div>
</template>

<script>
export default {
    props:{
        show:{
            type:Boolean,
            default:false
        },
    },
    data () {
        return {
            listDetail:[],
            imgList:[]
        };
    },

    components: {},

    computed: {},

    methods: {
        hide(data){
            this.$emit('hide',data); 
        },
        setData(data){
            console.log(data)
        }
    }
}

</script>
<style lang='scss' scoped>
    .detailscontains{
        position: fixed;
        width: 100%;
        left: 0;
        top: 0;
        z-index: 99;
        background: #fff;
    }
    .content-outer{
        width: 100%;
        height: 100%;
        overflow-y:auto;
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
        li{
            overflow: hidden;
            color: #03A9F4;
            padding:5px 0;
            div{
                float: left;
                line-height: 1.3rem;
                min-height: 1.3rem;
                font-size:1rem;
                &:first-child{
                    width: 4rem;
                    color: #999;
                    text-align: right;
                }
                &:last-child{
                    float: right;
                    padding-left:4.5rem;
                    margin-left: -100%;
                    width: 100%;
                    box-sizing: border-box;
                    text-align: left;
                    color: #333;
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
</style>