<template>
  <div id="sendMsg">
    <el-row>
      <el-col :span="12">
        <!-- 编辑签名 -->
        <el-select v-model="signValue" filterable placeholder="请选择签名">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>

      <el-col :span="12" style="text-align: right">
        余额：
        <b>{{ amount }}</b> 元
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea" />
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        运营商选择
        <el-radio-group v-model="radio2">
          <el-radio :label="3">移动</el-radio>
          <el-radio :label="6">联通</el-radio>
          <el-radio :label="9">电信</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="16">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
        </el-table>
      </el-col>

      <el-col :span="8">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="移动" width="180">
          </el-table-column>
          <el-table-column prop="address" label="联通">
          </el-table-column>
          <el-table-column prop="address" label="电信">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-button type="primary">主要按钮</el-button>
      </el-col>
    </el-row>


  </div>
</template>

<script>
  import axios from 'axios';
  import VueCookie from 'vue-cookies'
  import { Notification } from 'element-ui'

  const baseUrl = 'http://47.96.119.87:9301/api'
  const getAmountUrl = baseUrl + '/user/getBalance'

  const cookies = VueCookie.get('tfn_cookies')

  axios
    .get(getAmountUrl, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Authorization": cookies
      }
    })
    .then(function (response) {
      const data = response.data

      if (data.code === 0) {
        // this.amount = data.data
      } else {
        Notification({
          title: '错误',
          message: data.msg,
          duration: 4000
        })
      }
    })



  export default {
    data() {
      return {
        amount: 0,

        // 签名
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        signValue: '',

        // TABLE
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      };
    },



    methods: {

    }
  }


</script>

<style>
  #sendMsg {
    padding: 20px;
  }
</style>