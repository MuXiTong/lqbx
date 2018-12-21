<!-- 开单记录 -->
<template>
  <div class="contains" :class="{overflowHidden:showsearch || showdetail}" style="overflow:hidden;">
        <mt-header :title="'运单记录'+( allList.length > 0 ? '【'+ allList.length + '】' : '' )" fixed>
            <router-link to="/" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <mt-button icon="search" slot="right" @click="showsearchBar"></mt-button>
        </mt-header>
        
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
                        <li class="record-list-part" v-for="(data,i) in list" :key="i" @click="showdetailBar(i)">
                            <div class="record-list-content">
                                <div>运单号：<span>{{data.YDH}}</span></div>
                                <div>寄件人：{{data.JJRXM}}/{{data.JJRDH}}</div>
                                <div>寄件时间：{{data.JJSJ}}</div>
                            </div>
                            <div class="record-list-icon">{{i+1}}</div>
                            <div class="record-list-acc"> 件数：{{data.JS}} </div>
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
            <mt-header title="开单记录查询" fixed>
                <mt-button slot="left" icon="back" @click="showsearchBar"></mt-button>
            </mt-header>
            <div class="lq-form-content">
                <!-- <mt-field label="物流公司序号" type="text" v-model="form.WLGSID" ></mt-field> -->
                <!-- <mt-field label="物流公司名称" type="text" v-model="form.WLGSMC" ></mt-field> -->
                <div class="lq-part" @click="openComPicker('wlgs')">
                    <mt-cell title="物流公司" is-link :value="SupplierName"></mt-cell>
                </div>
                <div class="lq-part" @click="openComPicker('zzjg')">
                    <mt-cell title="组织架构" is-link :value="organidstrName"></mt-cell>
                </div>
                <div class="lq-part" @click="openComPicker('sctp')">
                    <mt-cell title="上传图片" is-link :value="form.PicBatch"></mt-cell>
                </div>
                <mt-field label="发货点名称" type="text" v-model="form.FHDMC" ></mt-field>
                <!-- <mt-field label="所属分局" type="text" v-model="form.SSFJ" ></mt-field> -->
                <!-- <mt-field label="所属派出所" type="text" v-model="form.SSPCS" ></mt-field> -->
                <!-- <mt-field label="所属警务站" type="text" v-model="form.SSJWZ" ></mt-field> -->
                <mt-field label="运单号" type="text" v-model="form.YDH" ></mt-field>
                <mt-field label="寄件人" type="text" v-model="form.JJRXM" ></mt-field>
                <div class="lq-part" @click="openPicker('JJStartTime')">
                    <mt-cell title="寄件时间从" is-link :value="form.JJStartTime"></mt-cell>
                </div>
                <div class="lq-part" @click="openPicker('JJEndTime')">
                    <mt-cell title="到" is-link :value="form.JJEndTime"></mt-cell>
                </div>
            </div>
            <div class="lq-btn-content">
                <mt-button type="primary" size="large" @click="submit" >查询</mt-button>
            </div>
            <!-- 时间控件 -->
            <mt-datetime-picker
            ref="datepicker"
            v-model="date"
            type="date"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            :endDate="enddate"
            @confirm="handleConfirm">
            </mt-datetime-picker>
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
        <!-- 开单记录详情 -->
        <mt-popup
            class="contains"
            v-model="showdetail"
            :modal="closeOnClickModal"
            position="right">
            <div style="overflow-y:auto;height:100%;">
                <mt-header title="开单记录详情" fixed>
                    <mt-button slot="left" icon="back" @click="showdetail = !showdetail"></mt-button>
                </mt-header>
                <!-- <div class="lq-detail-tit">{{listDetail.WLGSMC}}</div> -->
                <div class="lq-detail-acc">{{listDetail.YDH}}</div>
                <ul class="lq-detail-list">
                    <li class="infoTit">物流信息</li>
                    <!-- <li>
                        <div>{{listDetail.WLGSID}}</div>
                        <div>公司序号</div>
                    </li> -->
                    <li>
                        <div>{{listDetail.WLGSMC}}</div>
                        <div>公司名称</div>
                    </li>
                    <li>
                        <div>{{listDetail.WLDZ}}</div>
                        <div>公司地址</div>
                    </li>
                    <li>
                        <div>{{listDetail.FHDMC}}</div>
                        <div>发货点名称</div>
                    </li>
                    <!-- <li>
                        <div>{{listDetail.FHDZBX}}</div>
                        <div>发货地坐标X</div>
                    </li>
                    <li>
                        <div>{{listDetail.FHDZBY}}</div>
                        <div>发货地坐标Y</div>
                    </li>
                    <li class="line"></li>
                    <li class="infoTit">警务站信息</li>
                    
                    <li>
                        <div>{{listDetail.SSFJ}}</div>
                        <div>所属分局</div>
                    </li>
                    <li>
                        <div>{{listDetail.SSPCS}}</div>
                        <div>所属派出所</div>
                    </li>
                    <li>
                        <div>{{listDetail.SSJWZDM}}</div>
                        <div>所属警务站代码</div>
                    </li>
                    <li>
                        <div>{{listDetail.SSJWZ}}</div>
                        <div>所属警务站</div>
                    </li> -->
                    <li class="line"></li>
                    <li class="infoTit">寄件信息</li>
                    
                    <li>
                        <div>{{listDetail.YDH}}</div>
                        <div>运单号</div>
                    </li>
                    <li>
                        <div>{{listDetail.JJRXM}}</div>
                        <div>寄件人</div>
                    </li>
                    <li>
                        <div>{{listDetail.JJRSFZH}}</div>
                        <div>寄件人身份证号</div>
                    </li>
                    <li>
                        <div>{{listDetail.JJRDH}}</div>
                        <div>寄件人电话</div>
                    </li>
                    <li>
                        <div>{{listDetail.JJSJ}}</div>
                        <div>寄件时间</div>
                    </li>
                    <li>
                        <div>{{listDetail.JJDZ}}</div>
                        <div>寄件地址</div>
                    </li>
                    <li>
                        <div>{{listDetail.JJWP}}</div>
                        <div>寄件物品</div>
                    </li>
                    <li>
                        <div>{{listDetail.JS}}</div>
                        <div>件数</div>
                    </li>
                    <li class="line"></li>
                    <li class="infoTit">收件信息</li>
                    <li>
                        <div>{{listDetail.SJRXM}}</div>
                        <div>收件人姓名</div>
                    </li>
                    <li>
                        <div>{{listDetail.SJRSFZH}}</div>
                        <div>收件人身份证号</div>
                    </li>
                    <li>
                        <div>{{listDetail.SJRDZ}}</div>
                        <div>收件人地址</div>
                    </li>
                    <li>
                        <div>{{listDetail.SJRDH}}</div>
                        <div>收件人电话</div>
                    </li>
                    <li>
                        <div>{{listDetail.DHDMC}}</div>
                        <div>到货点名称</div>
                    </li>
                    <li class="line"></li>
                    <li class="infoTit">图片信息</li>

                    <li v-for="(data,index) in imgList" :key="index" class="imgpart" >
                        <img :src="data.File_Url" :alt="data.filename" onerror>
                        <span>{{data.filename}}</span>
                    </li>
                </ul>
            </div>
        </mt-popup>
        <!-- 操作栏 -->
        <mt-actionsheet
            :actions="actions"
            v-model="sheetVisible">
        </mt-actionsheet>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui';
import { MessageBox } from 'mint-ui';
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
export default {
    data () {
        return {
            sheetVisible:false,
            showsearch:false,
            showdetail:false,
            closeOnClickModal:false,
            date:new Date(),
            enddate:new Date(),
            loading:false,
            totalNum:0,
            pageSize:20,
            pageNum:1,
            allList:[],
            list:[],
            form:{
                // WLGSID:"",
                // WLGSMC:"",
                FHDMC:"",
                // SSFJ:"",
                // SSPCS:"",
                // SSJWZ:"",
                YDH:"",
                JJRXM:"",
                SupplierNO:"全部",
                organidstr:"",
                PicBatch:"全部",
                JJStartTime:new Date(new Date()/1-1000*60*60*24*2).Format("yyyy-MM-dd"),
                JJEndTime:new Date().Format("yyyy-MM-dd"),
            },
            SupplierName:"全部",
            organidstrName:"全部",
            actions:[
                {
                    name:"修改运单",
                    method:this.editUnit
                },
                {
                    name:"查看详情",
                    method:this.lookDetail
                },
                {
                    name:"删除运单",
                    method:this.delUnit
                }
            ],
            listDetail:{},
            imgList:[],
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
            slotsValueKey:"SupplierName",
            wlgsData:[],
            zzjgData:[],
            sctpData:[
                {text:"全部"},
                {text:"未上传图片"},
                {text:"已上传图片"},
            ],
            pickerSelVal:"",
            curType:""

        };
    },
    methods: {
        // 显示隐藏搜索栏
        showsearchBar(){
            this.showsearch = !this.showsearch
        },
        // 显示隐藏运单详情
        showdetailBar(index){
            if(index != undefined && typeof index == "number"){
                this.listDetail = Object.assign({},this.list[index]) ;
            }else{
                this.listDetail = {}
            }
            this.curIndex = index
            this.sheetVisible = !this.sheetVisible
        },
        // 打开日期控件
        openPicker(type){
            this.curtype = type;
            this.date = this.form[type];
            this.$refs.datepicker.open();
        },
        // 确定赋值日期
        handleConfirm:function(val){
            let yymmdd = val.Format("yyyy-MM-dd");
            this.form[this.curtype] = yymmdd;
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
            let parms = _this.jsonFormat(_this.form);
            _this.$http({
                method:"post",
                // url:"/wl",
                data:{
                    parms:parms,
                    procedure:"Q444"
                }
            }).then(response => {
                let result = response.data
                Indicator.close();
                // console.log(result);
                if( result.state && result.data){
                    
                    _this.allList = result.data.Table.reverse();
                    _this.totalNum = result.data.Table.length;
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
                        message: result.msg || "查无数据",
                        position: 'center',
                        duration: 3000
                    });
                }
            }, result => {
                Indicator.close();
            })
                                

        },
        // 格式化数据
        jsonFormat(data){
            let formData = data || {};
            let json_str = [];
            for(let key in formData){
                json_str.push({
                    ParaName:key,
                    ParaValue:formData[key]
                });
            }
            return JSON.stringify(json_str);
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
        // 修改运单
        editUnit(){
            this.$router.push({ name:"editwl",path:'/editwl',params:this.listDetail });
        },
        // 查看详情
        lookDetail(){
            this.sheetVisible = !this.sheetVisible
            this.showdetail = !this.showdetail
            this.searchImg()
        },
        // 根据批次号搜索图片
        searchImg(){
            let _this = this;
            if( _this.listDetail.PicBatch == "无图片" ){
                return false;
            }
            let parms = _this.jsonFormat({Batch_Number:_this.listDetail.PicBatch});
            _this.$http({
                method:"post",
                data:{
                    parms:parms,
                    procedure:"Q60"
                }
            }).then(response => {
                let result = response.data

                if( result.state ){
                    _this.imgList = result.data.Table
                }else{
                    Toast({
                        message: result.msg,
                        position: 'top',
                        duration: 3000
                    });
                    _this.imgList = []
                }
            }, result => {
                _this.imgList = []
            })
        },
        // 删除运单
        delUnit(){
            let data = this.list[this.curIndex]
            let _this = this;
            MessageBox.confirm('确定删除运单<span style="color:red;">'+ data.YDH +'</span>?').then(action => {
                console.log(action)
                let parms = _this.jsonFormat({ID:data.ID});
                _this.$http({
                    method:"post",
                    // url:"/wl",
                    data:{
                        parms:parms,
                        procedure:"Q446"
                    }
                }).then(response => {
                    let result = response.data

                    if( result.state ){
                        
                        let suc = Toast({
                            message: '删除成功',
                            iconClass: 'icon icon-success'
                        });
                        _this.submit(true)
                        setTimeout(() => {
                            suc.close();
                        }, 1000);
                    }else{
                        Toast({
                            message: result.msg,
                            position: 'top',
                            duration: 3000
                        });
                    }
                }, result => {
                    console.log(result)
                })
            },cancel =>{
                console.log(cancel)
            });
        },
        // 获取物流公司数据
        companyName(){
            let _this = this;
            _this.$http({
                method:"post",
                data:{
                    procedure:"Q450"
                }
            }).then(response => {
                let result = response.data
                // console.log(result)
                if( result.state ){                   
                    _this.wlgsData = result.data.Table;
                    _this.wlgsData.unshift({SupplierName:"全部",SupplierNO:"全部"})
                }else{
                    Toast({
                        message: result.msg,
                        position: 'top',
                        duration: 3000
                    });
                }
            }, result => {
                
            })
        },
        // 获取组织架构数据
        zzjgName(){
            let _this = this;
            _this.$http({
                method:"post",
                data:{
                    procedure:"Q449"
                }
            }).then(response => {
                let result = response.data
                // console.log(result)
                if( result.state ){                   
                    _this.zzjgData = result.data.Table
                }else{
                    Toast({
                        message: result.msg,
                        position: 'top',
                        duration: 3000
                    });
                }
            }, result => {
                
            })
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
            if( this.curType == "wlgs" ){
                this.SupplierName = this.pickerSelVal['SupplierName'];
                this.form.SupplierNO = this.pickerSelVal['SupplierNO'];
            }
            else if( this.curType == "zzjg" ){
                this.form.organidstr = this.pickerSelVal['text'] == "全部" ? "" : this.pickerSelVal['text'];
                this.organidstrName = this.pickerSelVal['text'];
            }
            else if( this.curType == "sctp" ){
                this.form.PicBatch = this.pickerSelVal['text'];
            }
            
        },
        // 打开下拉选择列表 || 取消列表
        openComPicker(openType){
            this.isshow = !this.isshow;
            if(openType){
                this.curType = openType;
                this.slots[0].values = this[openType+"Data"];
                this.slotsValueKey = ( openType == "wlgs" ? "SupplierName" : "text" );
                this.pickerFilter = '';
            }
        },
        // 下拉列表值改变时触发
        onValuesChange(picker, values) {
            if(values[0]){
                this.pickerSelVal = values[0];
            }            
        }
    },
    watch:{
        // 监听输入值的变化进行筛选
        pickerFilter:function (val, oldVal) { 
            this.filterData(val)
        }
    },
    created(){
        this.companyName();
        this.zzjgName();
        this.submit();
    }
}

</script>
<style lang='scss'>
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
            padding: 0.5rem 7rem 0.5rem 3.5rem;
            box-sizing: border-box;
            font-size: 0.8rem;
            div{
                line-height: 1.5rem;
                &:first-child span{
                    font-size: 1.1rem;
                    color: red;
                }
                &:last-child{
                    color:#999;
                }
            }
        }
        .record-list-acc{
            float: left;
            width: 8rem;
            margin-left: -8rem;
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
            line-height: 4.5rem;
            border-right: 1px solid #eee;
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
</style>