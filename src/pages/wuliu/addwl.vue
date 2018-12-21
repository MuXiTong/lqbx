<!-- 新增物流公司 -->
<template>
  <div class="contains" style="padding-bottom:50px;">
        <mt-header title="新增物流" fixed>
            <router-link to="/" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="lq-form-content addwl-outer">
            <div>
                <div class="infoPart">
                    <div class="infoTit">物流信息</div>
                    <!-- <mt-field label="物流公司序号" type="text" v-model="form.WLGSID" :state="errmsg.WLGSID.state"></mt-field> -->
                    <!-- <mt-field label="物流公司名称" type="text" v-model="form.WLGSMC" :state="errmsg.WLGSMC.state"></mt-field> -->
                    <div class="lq-part" @click="openComPicker(true)">
                        <mt-cell title="物流公司" is-link :value="form.WLGSMC"></mt-cell>
                    </div>
                    <mt-field label="物流公司地址" type="text" v-model="form.WLDZ" ></mt-field>
                    <mt-field label="发货点名称" type="text" v-model="form.FHDMC" :state="errmsg.FHDMC.state"></mt-field>
                    <!-- <mt-field label="发货地坐标X" type="number" v-model="form.FHDZBX" :state="errmsg.FHDZBX.state"></mt-field> -->
                    <!-- <mt-field label="发货地坐标Y" type="number" v-model="form.FHDZBY" :state="errmsg.FHDZBY.state"></mt-field> -->
                </div>
                <!-- <div class="infoPart">
                    <div class="infoTit">警务站信息</div>
                    <mt-field label="所属分局" type="text" v-model="form.SSFJ" :state="errmsg.SSFJ.state"></mt-field>
                    <mt-field label="所属派出所" type="text" v-model="form.SSPCS" :state="errmsg.SSPCS.state"></mt-field>
                    <mt-field label="所属警务站代码" type="text" v-model="form.SSJWZDM" :state="errmsg.SSJWZDM.state"></mt-field>
                    <mt-field label="所属警务站" type="text" v-model="form.SSJWZ" :state="errmsg.SSJWZ.state"></mt-field>
                </div> -->
                <div class="infoPart">
                    <div class="infoTit">寄件信息</div>
                    <mt-field label="运单号" type="text" v-model="form.YDH" :state="errmsg.YDH.state"></mt-field>
                    <mt-field label="寄件人" type="text" v-model="form.JJRXM" :state="errmsg.JJRXM.state"></mt-field>
                    <mt-field label="寄件人身份证号" type="text" v-model="form.JJRSFZH"></mt-field>
                    <mt-field label="寄件人电话" type="tel" v-model="form.JJRDH"></mt-field>
                    <div @click="openPicker()">
                        <mt-field label="寄件时间" type="text" v-model="form.JJSJ" :state="errmsg.JJSJ.state" :disabled='true' ></mt-field>
                    </div>
                    <mt-field label="寄件地址" type="text" v-model="form.JJDZ" :state="errmsg.JJDZ.state"></mt-field>
                    <mt-field label="寄件物品" type="text" v-model="form.JJWP" ></mt-field>
                    <mt-field label="件数" type="number" v-model="form.JS" ></mt-field>
                </div>
                <div class="infoPart">
                    <div class="infoTit">收件信息</div>
                    <mt-field label="收件人姓名" type="text" v-model="form.SJRXM" :state="errmsg.SJRXM.state"></mt-field>
                    <mt-field label="收件人身份证号" type="text" v-model="form.SJRSFZH" ></mt-field>
                    <mt-field label="收件人地址" type="text" v-model="form.SJRDZ" :state="errmsg.SJRDZ.state"></mt-field>
                    <mt-field label="收件人电话" type="tel" v-model="form.SJRDH" ></mt-field>
                    <mt-field label="到货点名称" type="text" v-model="form.DHDMC" :state="errmsg.DHDMC.state"></mt-field>
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
        </div>
        <div class="lq-btn-content">
            <mt-button type="primary" size="large" @click="submit" >确定</mt-button>
        </div>

  </div>
</template>

<script>
import uploader from "@/components/uploader"
import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui';
import { MessageBox } from 'mint-ui';
export default {
    data () {
        return {
            // 提交表单数据
            form:{
                // "WLGSID": "",
                "WLGSMC": "",
                "WLDZ": "",
                "FHDMC": "",
                // "FHDZBX": "",
                // "FHDZBY": "",
                // "SSFJ": "",
                // "SSPCS": "",
                // "SSJWZDM": "",
                // "SSJWZ": "",
                "YDH": "",
                "JJRXM": "",
                "JJRSFZH": "",
                "JJRDH": "",
                "JJSJ": this.dateFormat(new Date(),'yyyy-MM-dd hh:mm'),
                "JJDZ": "",
                "JJWP": "",
                "JS": "",
                "SJRXM": "",
                "SJRSFZH": "",
                "SJRDZ": "",
                "SJRDH": "",
                "DHDMC": "",
                "SupName": "",
                "SupNO": "",
            },
            errmsg:{
                // "WLGSID": {
                //     "msg": "物流公司序号不能为空",
                //     "state": null
                // },
                "WLGSMC": {
                    "msg": "物流公司名称不能为空",
                    "state": null
                },
                // "WLDZ": {
                //     "msg": "物流公司地址不能为空",
                //     "state": null
                // },
                "FHDMC": {
                    "msg": "发货点名称不能为空",
                    "state": null
                },
                // "FHDZBX": {
                //     "msg": "发货地坐标X不能为空",
                //     "state": null
                // },
                // "FHDZBY": {
                //     "msg": "发货地坐标Y不能为空",
                //     "state": null
                // },
                // "SSFJ": {
                //     "msg": "所属分局不能为空",
                //     "state": null
                // },
                // "SSPCS": {
                //     "msg": "所属派出所不能为空",
                //     "state": null
                // },
                // "SSJWZDM": {
                //     "msg": "所属警务站代码不能为空",
                //     "state": null
                // },
                // "SSJWZ": {
                //     "msg": "所属警务站不能为空",
                //     "state": null
                // },
                "YDH": {
                    "msg": "运单号不能为空",
                    "state": null
                },
                "JJRXM": {
                    "msg": "寄件人不能为空",
                    "state": null
                },
                // "JJRSFZH": {
                //     "msg": "寄件人身份证号不能为空",
                //     "state": null
                // },
                // "JJRDH": {
                //     "msg": "寄件人电话不能为空",
                //     "state": null
                // },
                "JJSJ": {
                    "msg": "寄件时间不能为空",
                    "state": null
                },
                "JJDZ": {
                    "msg": "寄件地址不能为空",
                    "state": null
                },
                // "JJWP": {
                //     "msg": "寄件物品不能为空",
                //     "state": null
                // },
                // "JS": {
                //     "msg": "件数不能为空",
                //     "state": null
                // },
                "SJRXM": {
                    "msg": "收件人姓名不能为空",
                    "state": null
                },
                // "SJRSFZH": {
                //     "msg": "收件人身份证号不能为空",
                //     "state": null
                // },
                "SJRDZ": {
                    "msg": "收件人地址不能为空",
                    "state": null
                },
                // "SJRDH": {
                //     "msg": "收件人电话不能为空",
                //     "state": null
                // },
                "DHDMC": {
                    "msg": "到货点名称不能为空",
                    "state": null
                }
            },
            errImgName:[],
            tb:[],
            dateTime:new Date(),
            enddate:new Date(),
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
            slotsValueKey:"SupplierName",
            wlCompanyData:[],
            pickerSelVal:""
        }
    },
    components:{
        "uploader":uploader
    },
    methods: {
        // 验证表单是否为空
        valid(){
            for( var key in this.form ){
                if(this.errmsg[key]){
                    if( !this.form[key] ){
                        this.showMsg(this.errmsg[key]['msg']);
                        this.errmsg[key]['state'] = "error";
                        return false;
                    }else{
                        this.errmsg[key]['state'] = "success";
                    }                    
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
            this.$refs.datepicker.open();
        },
        // 确定时间的时候格式化时间
        handleConfirm:function(val){
            this.form.JJSJ = this.dateFormat(val,'yyyy-MM-dd hh:mm');
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
                console.log(result)
                if( result.state ){                   
                    _this.wlCompanyData = result.data.Table
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
            this.form.WLGSMC = this.pickerSelVal[this.slotsValueKey];
            this.form.SupName = this.pickerSelVal[this.slotsValueKey];
            this.form.SupNO = this.pickerSelVal['SupplierNO'];
        },
        // 打开下拉选择列表 || 取消列表
        openComPicker(isOpen){
            this.isshow = !this.isshow;
            if(isOpen){
                this.slots[0].values = this.wlCompanyData;
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
    created:function(){
        this.companyName()
    }
}

</script>
<style type="text/css" lang="scss">

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