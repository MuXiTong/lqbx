<!-- 年保管理 -->
<template>
  <div class="contains" style="padding-top:0;" v-show="show">
        <!-- 查询页面 -->

        <mt-header title="年保记录查询" fixed>
            <mt-button slot="left" icon="back" @click="hide"></mt-button>
        </mt-header>
        
        <div class="lq-form-content">
            <div class="lq-part" @click="openPicker('beginDate')">
                <mt-cell title="登记时间从" is-link :value="form.beginDate"></mt-cell>
            </div>
            <div class="lq-part" @click="openPicker('endDate')">
                <mt-cell title="到" is-link :value="form.endDate"></mt-cell>
            </div>
            <div class="lq-part" @click="openComPicker('bxgs')">
                <mt-cell title="保险公司" is-link :value="coidinsurer_text"></mt-cell>
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
            form:{
                coidinsurer:"全部",
                beginDate:this.dateFormat(new Date(new Date()/1-1000*60*60*24*2),"yyyy-MM-dd"),
                endDate:this.dateFormat(new Date(),"yyyy-MM-dd"),
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
                { id: 'WTTX_RBCX', text: "湖南人保" },
                { id: "WTTX_RBCX_NEW", text: "云南人保" },
                { id: "WTTX_ZHBX", text: "中华保险" },
                { id: "WTTX_ZTBX", text: "永诚保险" },
                
            ],
            date:new Date(),
            enddate:new Date(),
            pickerSelVal:"",
            curType:""

        };
    },
    components:{
    },
    methods: {
        submit(){
            this.hide();
            this.$emit('setData',this.form); 
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
                this.pickerFilter = '';
            }
        },
        // 下拉列表值改变时触发
        onValuesChange(picker, values) {
            if(values[0]){
                this.pickerSelVal = values[0];
            }            
        },
        hide(data){
            this.$emit('hide',data); 
        },
        // 打开日期控件
        openPicker(type){
            this.curtype = type;
            this.date = this.form[type];
            this.$refs.datepicker.open();
        },
        // 确定赋值日期
        handleConfirm:function(val){
            let yymmdd = this.dateFormat(val,"yyyy-MM-dd");
            this.form[this.curtype] = yymmdd;
        },
        // 日期格式化
        dateFormat (date,fmt) { 
            var o = {
                "M+": date.getMonth() + 1, //月份 
                "d+": date.getDate(), //日 
                "h+": date.getHours(), //小时 
                "m+": date.getMinutes(), //分 
                "s+": date.getSeconds(), //秒 
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
                "S": date.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
    },
    watch:{
        // 监听输入值的变化进行筛选
        pickerFilter:function (val, oldVal) { 
            this.filterData(val)
        }
    },
    created(){
        this.submit()
    }
}

</script>
<style lang='scss' scoped>

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
</style>