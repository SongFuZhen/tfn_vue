<template>
  <div id="sendMsg">
    <h2>短信发送</h2>


    <el-row>
      <el-col :span="12">
        <el-card shadow="hover" header='Step1: 编辑短信内容'>
          <el-row>
            <el-col :span="12">
              <span>选择签名:</span>
              <el-autocomplete class="inline-input" v-model="signValue" :fetch-suggestions="querySearch" @blur='handleBlurSign' placeholder="请选择签名"
                @select="handleSelect"></el-autocomplete>
            </el-col>
          </el-row>

          <p>编辑短信:</p>

          <el-input type='textarea' :rows="4" resize ='none' placeholder="编辑短信内容" @input="handleInputMessageContent" v-model="messageContent">
          </el-input>

          <div style="text-align: right;margin-top: 20px;">
            <span>共计{{messageCount}}个字</span>
            <span>,共 {{messageNum}} 条</span>

            <el-select v-model="backSignValue" filterable @change="handleSelctedBackSign">
              <el-option key="" label="" value=""></el-option>
              <el-option key="回T退订" label="回T退订" value="【回T退订】"></el-option>
              <el-option key="回N退订" label="回N退订" value="【回N退订】"></el-option>
            </el-select>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover" header='余额'>
          <div style="text-align: center">
            <h1 style="color: steelblue;">{{ amount }} 条</h1>
          </div>
        </el-card>
        <el-card shadow="hover" header='短信预览'>
          <div style="height: 54px;overflow: auto;">
            <span v-if="signValue.length > 0">【{{signValue}}】</span>
            <span v-if="messageContent.length > 0">{{messageContent}}</span>
            <span v-if="backSignValue.length > 0">{{backSignValue}}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" header='Step2: 选择运营商及号码归属地'>
      <el-row>
        <el-col :span="24">
          <div style="margin-top: 5px; display: flex;">
            <span style="margin-right: 20px;">运营商选择</span>
            
            <el-checkbox-group v-model="ispValue" @change='handleChangeISP'>
              <el-checkbox key="cm" label="cm">移动</el-checkbox>
              <el-checkbox key="cu" label="cu">联通</el-checkbox>
              <el-checkbox key="ct" label="ct">电信</el-checkbox>
            </el-checkbox-group>
          </div>

          <div style="margin-top: 20px;">
            <p>
              <span>归属地列表</span>
              <el-button type="primary" size="small" v-on:click='handleSelectLocation'>选择归属地</el-button>
              <span style="float: right;">共选择了{{selectedCityDatas.length}}个市</span>
            </p>

            <div class="form-div" style="text-align: center;">
            </div>
          </div>

          <div style="border: 1px solid grey; min-height: 140px; border-radius: 4px; padding: 10px; max-height: 400px; overflow: auto;">
            <el-tag :key="tag.id" v-for="tag in selectedCityDatas" :disable-transitions="false">
              {{tag.name}}
            </el-tag>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-row>
      <el-card shadow="hover" header='Step3: 校验电话号码' style="padding-bottom: 20px;">
        <el-col :span="12">
          <p>上传电话号码</p>

          <el-upload class="upload-demo" drag :show-file-list='false' :on-success="handleUploadSuccess" :on-error='handleUploadError'
            :on-change='handleChangeUpload' :data='uploadParams' :headers='uploadHeaders' action="http://47.96.119.87:9301/api/sendSMS/upload"
            accept='.xls,.xlsx,.txt'>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">支持Excel,Txt文件</div>
          </el-upload>
        </el-col>
        <el-col :span="12" style="text-align: center">
          <p>统计</p>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="rowName" label=""></el-table-column>
            <el-table-column prop="cm" label="移动"></el-table-column>
            <el-table-column prop="cu" label="联通"></el-table-column>
            <el-table-column prop="ct" label="电信"></el-table-column>
          </el-table>
        </el-col>
      </el-card>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-card shadow="hover" header='Step4: 确认发送'>
          <div style="text-align: center;">
            <el-popover placement="top" width="160" v-model="confirmSendVisible">
              <p>您确定要发送吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="confirmSendVisible = false">再等等</el-button>
                <el-button type="primary" v-on:click='sendMsg' size="mini">我确定</el-button>
              </div>
              <el-button slot="reference" type="primary">确认无误，发送短信</el-button>
            </el-popover>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
  @import '../css/thr-linkage.css';

  .el-tag+.el-tag {
    margin-left: 10px;
  }

  #sendMsg {
    padding: 5px 20px;
  }

  .el-card {
    margin: 10px;
  }

  .el-card__body {
    padding: 10px;
  }
</style>

<script>
  import axios from 'axios';
  import VueCookie from 'vue-cookies'
  import VueRouter from '../routes'
  import $ from 'jquery'
  import { linkAgeSelect } from '../js/thr-linkage-1.0.js'
  import { areaData } from '../js/areaData.js'

  const baseUrl = 'http://47.96.119.87:9301/api'
  const getAmountUrl = baseUrl + '/user/getBalance'
  const getSignUrl = baseUrl + '/user/getDefaultSign'
  const getCityCodeUrl = baseUrl + '/user/getCityCode'
  const sendMsgUrl = baseUrl + '/sendSMS/sms/send'

  export default {
    data() {
      return {
        cookies: VueCookie.get('tfn_cookies'),

        amount: 0,

        // 签名
        signDataList: [],

        messageContent: '',
        messageCount: 4,
        messageNum: 1,

        inputSignValue: '',
        signValue: '',

        backSignValue: '回T退订',

        ispValue: ['cm'],

        app_area_data: areaData,

        selectedCityDatas: [],

        uploadParams: {},
        uploadHeaders: {
          "Authorization": VueCookie.get('tfn_cookies')
        },

        uploadFileName: '',
        uploadFilterSuccessNum: 0,

        // TABLE
        tableData: [
          {
            rowName: '原始',
            cm: 0,
            cu: 0,
            ct: 0
          }, {
            rowName: '匹配',
            cm: 0,
            cu: 0,
            ct: 0,
          }
        ],

        confirmSendVisible: false,
      };
    },
    created() {
      this.init()

      linkAgeSelect()
    },
    methods: {
      init() {
        this.getSign()
        this.getAmount()
      },

      querySearch(queryString, cb) {
        const signDataList = this.signDataList;

        const results = queryString ? signDataList.filter(this.createFilter(queryString)) : signDataList;
        cb(results);
      },

      createFilter(queryString) {
        return (signData) => {
          return (signData.value.toLowerCase().indexOf(queryString.substring(0, 2).toLowerCase()) === 0);
        }
      },

      handleBlurSign(e) {
        this.inputSignValue = e.target.value
        this.$set(this, 'selectedCityDatas', [])
      },

      getAmount() {
        const _this = this
        axios
          .get(getAmountUrl, {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              "Authorization": this.cookies
            }
          })
          .then(function (response) {
            const data = response.data

            if (data.code === 0) {
              _this.amount = data.data
            } else {
              _this.$notify({
                title: '错误',
                message: data.msg,
                duration: 4000
              })
            }
          })
      },

      // 获取签名
      getSign() {
        var _this = this

        axios
          .get(getSignUrl, {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              "Authorization": this.cookies
            }
          })
          .then(function (response) {
            const data = response.data
            if (data.code === 0) {
              let singData = []
              data.data.map((d => singData.push({ value: d })))

              _this.signDataList = singData
            } else {
              _this.$notify({
                title: '错误',
                message: data.msg,
                duration: 4000
              })
            }
          })
      },

      // 获取城市代码
      getCityCode(signCode) {
        const _this = this
        axios
          .get(getCityCodeUrl + '/' + signCode, {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              "Authorization": this.cookies
            }
          })
          .then(function (response) {
            const data = response.data.data
            _this.selectedCityDatas.length = 0

            data.map(d => _this.selectedCityDatas.push({ id: d.cityCode, name: d.cityName }))
          })
      },

      handleInputMessageContent(value) {
        this.messageContent = value
        this.messageCount = this.messageContent.length + this.signValue.length + 2 + this.backSignValue.length
        this.messageNum = Math.ceil(this.messageCount / 70)
      },

      handleSelect(item) {
        this.getCityCode(item.value)

        if (this.inputSignValue !== '') {
          this.signValue = this.inputSignValue
        } else {
          this.signValue = item.value
        }

        this.messageCount = this.messageContent.length + this.signValue.length + 2 + this.backSignValue.length
        this.messageNum = Math.ceil(this.messageCount / 70)
      },

      handleSelctedBackSign(value) {
        this.backSignValue = value

        this.messageContent += value
        this.messageCount = this.messageContent.length + this.signValue.length + 2 + this.backSignValue.length

        this.messageNum = Math.ceil(this.messageCount / 70)
      },

      handleChangeISP(value) {
        this.ispValue = value
      },

      handleSelectLocation: function (event) {
        const _this = this

        var thisThr1 = $.linkAgeInit({
          shade: 0.4,
          dataIndex: 2,
          fadeTime: 0,
          dataModel: 'data',
          dataSource: this.app_area_data,
          showSelectHtml: '<li data-id="{code}" data-route="{route}" class="">{area}</li>',
          showCheckHtml: '<dd data-id="{code}" data-route="{route}" class="{_on_}">{area}</dd>',
          dataOnePid: 1,
          dataIdKey: 'id',
          maxChecked: 10000,
          closeCallBack: function (data) {
          },
          confirmCallBack: function (data) {
            _this.selectedCityDatas = data
          }
        });

        thisThr1.set(_this.selectedCityDatas);

        thisThr1.open('.form-div');
      },

      // 统计
      handleUploadSuccess(res, file) {
        const _this = this
        const data = res

        if (data.code === 0) {
          const summaryTableData = [
            {
              rowName: '原始',
              cm: data.data.cmNum,
              cu: data.data.cuNum,
              ct: data.data.ctNum
            }, {
              rowName: '匹配',
              cm: data.data.filterCmNum,
              cu: data.data.filterCuNum,
              ct: data.data.filterCtNum,
            }
          ]
          _this.$message.success('上传成功')
          _this.tableData = [...summaryTableData]
          _this.uploadFileName = data.data.fileNames.join(',')
          _this.uploadFilterSuccessNum = data.data.filterSuccessNum
        } else {
          _this.$message.error(data.msg)
        }
      },

      handleUploadError(err, file, fileList) {
        this.$message.error(err.message)
        return true
      },

      handleChangeUpload(file) {
        if (this.ispValue.length <= 0) {
          this.$message.error('请选择运营商');
          return false
        }

        if (this.selectedCityDatas.length === 0) {
          this.$message.error('请先选择归属地')
          return false
        }

        let selectedCityCodes = []
        this.selectedCityDatas.map(d => selectedCityCodes.push(d.id))

        this.$set(this.uploadParams, 'operator', this.ispValue.join(','));
        this.$set(this.uploadParams, 'cityCodes', selectedCityCodes.join(','));

        return true
      },

      sendMsg() {
        const _this = this
        _this.confirmSendVisible = false

        if (_this.messageNum > parseInt(_this.amount, 0)) {
          _this.$message.error('余额不足，请先充值')
          return
        }

        // if ((Math.ceil(('【' + _this.signValue + '】' + _this.messageContent + _this.backSignValue).length / 70) * _this.uploadFilterSuccessNum) > parseInt(_this.amount, 0)) {
        //   _this.$message.error('余额不足，请先充值')
        //   return
        // }

        const payloadData = {
          "content": '【' + _this.signValue + '】' + _this.messageContent + _this.backSignValue,
          "fileName": _this.uploadFileName,
        }

        var params = { ...payloadData };
        var instance = axios.create({
          headers: {
            'content-type': 'application/json',
            "Authorization": this.cookies
          }
        });

        instance.post(sendMsgUrl, JSON.stringify(params)).then(function (res) {
          var data = res.data;
          if (data.code === 0) {

            _this.$confirm(data.data, '提示', {
              confirmButtonText: '立即前去查看',
              cancelButtonText: '取消',
              type: 'success',
              beforeClose: function (action, instance, done) {
                done()
                VueRouter.push('/login')
                VueRouter.go(-1)
              }
            }).then(() => {
              window.open('http://sms.tianfunuo.cn', '_blank')
            }).catch(() => {
            });
          } else {
            _this.$notify({
              title: '错误',
              message: data.msg,
              duration: 4000
            });
          }
        }).catch(function (err) {
          _this.$notify({
            title: '错误',
            message: err,
            duration: 4000
          });
        });
      }
    }
  }


</script>