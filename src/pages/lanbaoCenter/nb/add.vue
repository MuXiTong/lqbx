<!-- 新增年保 -->
<template>
  <div class="contains addcontains" style="padding-bottom:50px;" v-show="show">
        <mt-header title="新增物流" fixed>
            <mt-button icon="back" @click="hide" slot="left"></mt-button>
        </mt-header>
        <div class="lq-form-content addwl-outer">
            <div>
                <div class="infoPart">
                    <div class="infoTit">基本信息</div>
                    <mt-field label="流水号" type="text" v-model="form.numorder" disabled></mt-field>
                    <div class="lq-part" @click="openComPicker(true)">
                        <mt-cell title="保险公司" is-link :value="coidinsurertext"></mt-cell>
                    </div>
                    <mt-field label="企业ID" type="text" v-model="form.tmscode" ></mt-field>
                    <mt-field label="公司名称" type="text" v-model="form.comname" ></mt-field>
                    <mt-field label="公司地址" type="text" v-model="form.comaddr" ></mt-field>
                    <mt-field label="联系人" type="text" v-model="form.comman" ></mt-field>
                    <mt-field label="联系手机" type="text" v-model="form.commb" ></mt-field>
                    <mt-field label="联系电话" type="text" v-model="form.comtel"></mt-field>
                    
                </div>

                <div class="infoPart">
                    <div class="infoTit">年保信息</div>
                    <mt-field label="年保费用" type="text" v-model="form.accnianbao"></mt-field>
                    <mt-field label="已缴费用" type="text" v-model="form.accnianbaoyj"></mt-field>
                    <div @click="openPicker('startdate')">
                        <mt-cell title="开始时间" is-link :value="form.startdate"></mt-cell>
                    </div>
                    <div @click="openPicker('enddate')">
                        <mt-cell title="结束时间" is-link :value="form.enddate"></mt-cell>
                    </div>
                </div>
                <div class="infoPart">
                    <div class="infoTit">登记信息</div>
                    <mt-field label="登记时间" type="text" v-model="form.registerdate" disabled></mt-field>
                    <mt-field label="登记部门" type="text" v-model="form.registersite" disabled></mt-field>
                    <mt-field label="登记人" type="text" v-model="form.registerman" disabled></mt-field>
                    <mt-field label="业务员" type="text" v-model="form.yewuyuan" ></mt-field>
                    <mt-field label="备注" type="textarea" v-model="form.remark" ></mt-field>
                </div>
                <!-- 上传图片控件 -->
                <div class="infoPart">
                    <div class="infoTit">图片信息</div>
                    <uploader 
                        :src="imgUpLoadUrl" 
                        :uploadedMethod="uploadedCallback" 
                        :showUploadedBtn="false" 
                        ref="uploader" 
                        :uploaderImgToServer="uploaderImgToServer"
                        :uploaderError="uploaderError"
                        :editCallBack="function(){}"
                    ></uploader>
                </div>
                
            </div>
        </div>
        <div class="lq-btn-content">
            <mt-button type="primary" size="large" @click="submit" >确定</mt-button>
        </div>
        <!-- 时间控件 -->
        <mt-datetime-picker
        ref="datepicker"
        v-model="dateTime"
        type="datetime"
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
import uploader from "@/components/uploader"
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
            // 提交表单数据
            form:{
                "id": "",
                "numorder": "",
                "cominsurer": "",
                "tmscode": "",
                "comname": "",
                "comaddr": "",
                "comman": "",
                "commb": "",
                "comtel": "",
                "accnianbao": "",
                "accnianbaoyj": "",
                "startdate": this.dateFormat(new Date(),'yyyy-MM-dd hh:mm'),
                "enddate": this.dateFormat(new Date(),'yyyy-MM-dd hh:mm'),
                "registerdate": this.dateFormat(new Date(),'yyyy-MM-dd hh:mm'),
                "registersite": "",
                "yewuyuan": "",
                "registerman": "",
                "remark": "",
            },
            coidinsurertext:"",
            errmsg:{
                "cominsurer": {
                    "msg": "保险公司名称不能为空",
                },
                "comname": {
                    "msg": "公司名称不能为空",
                },
                "accnianbao": {
                    "msg": "年保费用不能为空",
                },
                "accnianbaoyj": {
                    "msg": "已缴费用不能为空",
                },
                "yewuyuan": {
                    "msg": "业务员不能为空",
                },
            },
            errImgName:[],
            tb:[],
            PicBatch:this.getGuid(),
            imgUpLoadUrl:this.$http.defaults.baseURL == "/wl" ? "/uploader" : "/ImageAPI/ImgUploadFile",// 根据基本路径赋值上传接口
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
                { id: "WTTX_RBCX_NEW", text: "云南人保" },
                { id: "WTTX_RSCX", text: "人寿财险" },
                { id: "WTTX_HTBX", text: "华泰保险" },
                { id: 'WTTX_RBCX', text: "湖南人保" },
                { id: "WTTX_ZHBX", text: "中华保险" },
                { id: "WTTX_ZTBX", text: "永诚保险" },
                { id: "WTTX_TPYBX", text: "太平洋保险" },
            ],
            pickerSelVal:"",
            // 时间控件用到
            dateTime:new Date(),
            enddate:new Date(),
            curSelDate:"",
        }
    },
    components:{
        "uploader":uploader
    },
    computed: mapState({ users: state => state }),
    methods: {
        // 验证表单是否为空
        valid(){
            for( var key in this.errmsg ){
                if(!this.form[key]){
                    this.showMsg(this.errmsg[key]['msg']);
                    return false;
                }
            }
            return true;
        },
        // 格式化表单
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
        // 提交数据
        submit(){
            // this.$refs.uploader.submit()
            let _this = this;
            if(_this.valid()){
                Indicator.open({
                    text: '提交中...',
                    spinnerType: 'fading-circle'
                });
                let parms = _this.jsonFormat(_this.form);
                _this.$http({
                    method:"post",
                    // url:"/wl",
                    data:{
                        parms:parms,
                        procedure:"Q445"
                    }
                }).then(response => {
                    let result = response.data
                    Indicator.close();
                    if( result.state ){

                        if( this.$refs.uploader.files.length == 0 ){
                            let suc = Toast({
                                message: '运单新增成功',
                                iconClass: 'icon icon-success'
                            });
                            setTimeout(() => {
                                suc.close();
                                _this.$router.replace({ path: 'home' });
                            }, 1000);
                        }else{
                            // 触发上传图片功能
                            this.$refs.uploader.submit()    
                        }
                        
                    }else{
                        Toast({
                            message: result.msg,
                            position: 'top',
                            duration: 3000
                        });
                    }
                }, result => {
                    Indicator.close();
                    console.log(result)
                })
                                
            }
        },
        // 消息盒子
        showMsg(msg){
            let suc = Toast({
              message: msg,
              position:"middle"
            });
            setTimeout(() => {
              suc.close();
            }, 1000);
        },
        // 获取guid
        getGuid(){
            var guid = "";
            for (var i = 1; i <= 32; i++) {
                var n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
                if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                    guid += "-";
            }
            return guid;
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
            console.log(fmt)
            return fmt;
        },
        // 上传图片回调函数
        uploadedCallback(data,imgData,filesLength){
            let _this = this;
            console.log("uploadedMethod",data,imgData)
            if( data.state ){
                _this.tb.push({
                    Batch_Number: _this.PicBatch,
                    File_Date: _this.dateFormat(new Date(),'yyyy-MM-dd'),
                    File_Name: data.data[0].imgName,
                    File_Remark: "图片上传",
                    File_Type: data.data[0].imgName.split(".")[1],
                    File_Url: data.data[0].imgUrl,
                    User_Name: "admin",
                    fileid: _this.getGuid(),
                    filename: imgData.name,
                    filesize: imgData.size,
                    filestate: "上传成功"
                });
                // if(filesLength == _this.tb.length){
                //     _this.uploaderImgToServer();
                // }
            }
        },
        // 上传完图片后把图片上传到服务器中，根据图片批次号关联起来
        uploaderImgToServer(){
            let _this = this;
            Indicator.open({
                text: '上传图片中...',
                spinnerType: 'fading-circle'
            });
            let parms = [
                {
                    ParaName: "tb",
                    ParaValue: JSON.stringify(_this.tb)
                },
            ];
            console.log(parms)
            _this.$http({
                method:"post",
                // url:"/wl",   
                data:{
                    parms:JSON.stringify(parms),
                    procedure:"Q61"
                }
            }).then(response => {
                let result = response.data
                Indicator.close();
                if( result.state ){
                    _this.bindImgByUnit()
                }else{
                    Toast({
                        message: result.msg,
                        position: 'top',
                        duration: 3000
                    });
                }
            }, result => {
                Indicator.close();
            })
        },
        // 关联完图片跟图片批次号后，把批次号跟运单号关联起来
        bindImgByUnit(){
            let _this = this;
            let parms = _this.jsonFormat({
                YDH:_this.form.YDH,
                PicBatch:_this.PicBatch
            });
            _this.$http({
                method:"post",
                // url:"/wl",
                data:{
                    parms:parms,
                    procedure:"Q448"
                }
            }).then(response => {
                let result = response.data

                if( result.state ){
                    let msg = "新增运单成功！"
                    if( _this.errImgName.length > 0 ){
                        msg+=_this.errImgName.join()+"上传不成功！"
                    }
                    // MessageBox.confirm(msg).then(action => {

                    // });
                    let suc = Toast({
                        message: msg,
                        iconClass: 'icon icon-success'
                    });
                    setTimeout(() => {
                        suc.close();
                        _this.$router.replace({ path: 'home' });
                    }, 2000);
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
                                

        },
        // 上传图片失败的时候，把失败的图片信息存进去，告知用户
        uploaderError(data){
            this.errImgName.push(data.name)
        },
        // 打开日期控件
        openPicker(type){
            this.curSelDate = type
            this.$refs.datepicker.open();
        },
        // 确定时间的时候格式化时间
        handleConfirm:function(val){
            this.form[this.curSelDate] = this.dateFormat(val,'yyyy-MM-dd hh:mm');
        },
        // 下拉筛选数据
        filterData(val){
            let _this = this;
            var data = this.wlCompanyData;

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
            this.form.cominsurer = this.pickerSelVal['id'];
            this.coidinsurertext = this.pickerSelVal['text'];
        },
        // 打开下拉选择列表 || 取消列表
        openComPicker(isOpen){
            this.isshow = !this.isshow;
            if(isOpen){
                this.slots[0].values = this.bxgsData;
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
        }
    },
    watch:{
        // 监听输入值的变化进行筛选
        pickerFilter:function (val, oldVal) { 
            this.filterData(val)
        }
    },
    created:function(){
        this.form.registersite = this.users.userInfo.loginwebid
        this.form.registerman = this.users.userInfo.username
        
    }
}

</script>
<style type="text/css" lang="scss">
    .addcontains{
        position: fixed;
        width: 100%;
        left: 0;
        top: 0;
        z-index: 99;
        background: #fff;
    }
    .addwl-outer.lq-form-content {
        height: 100%;
        margin-top: 0;
        margin-bottom: 0;
        overflow-y: auto;
        .infoPart{
            margin-top: 1rem;
        }
        .infoTit{
            height: 30px;
            line-height: 30px;
            text-indent: 10px;
            font-size: 14px;
            color:#fff;
            background: #26a2ff;
        }
        .mint-cell-wrapper{
            background-image:none;
            border-bottom:1px solid #eee;
        }
        .mint-cell-text {
            font-size: 14px;
        }
        .mint-field-core{
            text-align: right;
        }
    }
    .lq-btn-content{
        margin-top: 5px;
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