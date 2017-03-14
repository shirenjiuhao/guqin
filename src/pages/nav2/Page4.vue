
<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <!-- <el-form-item>
          <el-input v-model="filters.name" placeholder="请输入要查询的内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsers">查询</el-button>
        </el-form-item> -->
        <el-form-item style='float:right'>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <!-- <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;"> @selection-change="selsChange"-->
      <!-- <el-table-column type="selection" width="40">
      </el-table-column> -->
        <el-table-column type="index" prop='rid' width="60">
        </el-table-column>
        <el-table-column prop="classifyName" label="类型" width="100" sortable>
        </el-table-column>
        <el-table-column prop="courseName" label="名称" width="100" sortable>
        </el-table-column>
        <el-table-column prop="cPrice" label="价格" width="90" sortable>
        </el-table-column>
        <el-table-column prop="tname" label="所属老师" min-width="90" sortable>
        </el-table-column>
        <el-table-column prop="sName" label="所属学堂" min-width="100" sortable>
        </el-table-column>
        <el-table-column prop="bespeakTime" label="课程时间" min-width="120" sortable>
        </el-table-column>
      <el-table-column label="操作" width="140">
        <template scope="scope">
          
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
<!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
      <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="totalPage" style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
  <!--   <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
    <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
      
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="editFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
    </div>
  </el-dialog> -->

    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" ref="addForm" name='addForm' action="/momingtang/web/backCourseRelation/addCourseRelation" enctype='multipart/form-data' id='addForm' method='post'>
        <el-form-item label="分类">
          <select name='cid' placeholder="请选择" class='classifyId'>
              <option
                v-for="item in options"
                :label="item.classifyName"
                :value="item.classifyId">
              </option>
            </select>
        </el-form-item>
        <el-form-item label="老师">
          <select  name='tid' placeholder="请选择" class='classifyId'> 
              <option
                v-for="item in teachers"
                :label="item.tname"
                :value="item.tid">
              </option>
            </select>
        </el-form-item>
        <el-form-item label="学堂">
          <select name='sid' placeholder="请选择" class='classifyId'>
              <option
                v-for="item in schools"
                :label="item.sName"
                :value="item.sid">
              </option>
            </select>
        </el-form-item>
        <el-form-item label="授课时间">
          <el-input name='dates' placeholder="请输入时间范围，例3.20-3.22" class='myInput'></el-input>
          <!-- <el-date-picker
            v-model="addForm.bespeakTime"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions0">
          </el-date-picker> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  import NProgress from 'nprogress'
  import $ from 'jquery'
  import '../../jquery-from.js'
  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        users: [],
        totalPage: 0,
        currentPage: 0,
        pageSize: 10,
        listLoading: false,
        options:[],//分类信息
        sels: [],//列表选中列
        teachers:[],//所有老师
        schools:[],//所有学堂
/*
        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        },*/
        //编辑界面数据
        /*editForm: {
          
        },*/
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        },
        //新增界面数据
        addForm: {
          classifyId:'',
          classifyName:'',
          courseName:'',
          cPrice:'',
          tname:'',
          sName:'',
          bespeakTime:[]
        }

      }
    },
    methods: {
      //获取新增数据分类
      getAllClassify(){
        $.ajax({
          url: '/momingtang/web/backCourse/getAllClassify',
          type: 'POST',
        })
        .done(function(res) {
          console.log(res);
          this.options = res.data;
        }.bind(this))
      },
      //获取全部的老师
      getTeachers() {
        $.ajax({
          url: '/momingtang/web/backTeacher/getAllTeacher',
          type: 'POST',
        })
        .done(function(res) {
          console.log(res);
          this.teachers = res.data;
        }.bind(this))
      },
      //获取全部的学堂
      getSchools() {
        $.ajax({
          url: '/momingtang/web/backSchool/getAllSchool',
          type: 'POST',
        })
        .done(function(res) {
          console.log(res);
          this.schools = res.data;
        }.bind(this))
      },
      //分页展示
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getUsers();
      },
      //获取用户列表
      getUsers() {
        let para = {
          totalPage:this.totalPage,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          name: this.filters.name
        };
        this.listLoading = true;
        NProgress.start();
        $.ajax({
          url: '/momingtang/web/backCourseRelation/getPageCourseRelation',
          type: 'POST',
          data: para,
        })
        .done(function(res) {
          console.log(res);
          this.totalPage = res.data.totalPage;
          this.currentPage = res.data.currentPage;
          this.pageSize = res.data.pageSize;
          this.users = res.data.datas;
          this.listLoading = false;
          NProgress.done();
        }.bind(this))
      },
      //删除
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          NProgress.start();
          let para = { rid: row.rid };
         $.ajax({
            url:  '/momingtang/web/backCourseRelation/deleteCourseRelationTime',
            type: 'POST',
            data: para,
          })
          .done(function(res) {
            this.listLoading = false;
            NProgress.done();
            console.log("success");
            if(res.status ==1){
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
            }else{
              this.$notify({
                title: '失败',
                message: '删除失败',
                type: 'error'
              });
            }
            this.getUsers();
          }.bind(this))
          .fail(function() {
            console.log("error");
            this.listLoading = false;
            NProgress.done();
          })
          .always(function() {
            console.log("complete");
          });
        }).catch(() => {

        });
      },
      //显示编辑界面
     /* handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },*/
      //显示新增界面
      handleAdd: function () {
        this.addFormVisible = true;
        this.addForm = {
          classifyId:'',
          classifyName:'',
          courseName:'',
          cPrice:'',
          tname:'',
          sName:'',
          bespeakTime:[]
        };
      },
      //编辑
      /*editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              NProgress.start();
              let para = Object.assign({}, this.editForm);
              para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
              editUser(para).then((res) => {
                this.editLoading = false;
                NProgress.done();
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getUsers();
              });
            });
          }
        });
      },*/
      //新增
      addSubmit: function () {
        var vm = this;
        this.$confirm('确认提交吗？', '提示', {}).then(() => {
          this.addLoading = true;
          NProgress.start();
          $('#addForm').ajaxSubmit({
            url:'/momingtang/web/backCourseRelation/addCourseRelation',
            type:'post',
            beforeSerialize:function(res){
              console.log(res)
            },
            beforeSubmit:function(res){
              //console.log(res)
            },
            success: function(res){
              console.log(res)
              this.addLoading = false;
              NProgress.done();
              if(res.status == 1){
                  this.$notify({
                    title: '成功',
                    message: '提交成功',
                    type: 'success'
                  });
                  vm.$refs['addForm'].resetFields();
                }else{
                  this.$notify({
                    title: '失败',
                    message: '提交失败',
                    type: 'error'
                  });
                }
                this.addFormVisible = false;
                this.getUsers();
            }.bind(this),
            error: function(res) {
              this.addLoading = false;
              NProgress.done();
              this.$notify({
                title: '失败',
                message: '提交失败',
                type: 'error'
              });
            }.bind(this)
          })
        })
        /*this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              NProgress.start();
              let para = Object.assign({}, this.addForm);
              para.bespeakTime = (!para.bespeakTime || para.bespeakTime == '') ? '' : util.formatDate.format(new Date(para.bespeakTime), 'MM-dd');
              $.ajax({
                url: '/momingtang/web/backCourseRelation/addCourseRelation',
                type: 'POST',
                data: para,
              })
              .done(function(res) {
                 this.addLoading = false;
                 NProgress.done();
                console.log("success");
                if(res.status ==1){
                  this.$notify({
                    title: '成功',
                    message: '提交成功',
                    type: 'success'
                  });
                  this.$refs['addForm'].resetFields();
                }else{
                  this.$notify({
                    title: '失败',
                    message: '提交失败',
                    type: 'error'
                  });
                }
                
                this.addFormVisible = false;
                this.getUsers();
              })
              .fail(function() {
                console.log("error");
              })
              .always(function() {
                console.log("complete");
              });*/
              
              /*addUser(para).then((res) => {
                this.addLoading = false;
                NProgress.done();
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getUsers();
              });*/
        /*    });
          }
        });*/
      },
      /*selsChange: function (sels) {
        this.sels = sels;
      },
      //批量删除
      batchRemove: function () {
        var ids = this.sels.map(item => item.id).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          NProgress.start();
          let para = { ids: ids };
          batchRemoveUser(para).then((res) => {
            this.listLoading = false;
            NProgress.done();
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            });
            this.getUsers();
          });
        }).catch(() => {

        });
      }*/
    },
    mounted() {
      this.getUsers();
      this.getAllClassify();
      this.getTeachers();
      this.getSchools();
    }
  }

</script>

<style scoped>
.myInput{width:218px;}
.classifyId{
  width: 218px;
    height: 36px;
    border: 1px solid #bfcbd9;
    border-radius: 4px;
    color: #959ac1;
    padding: 0px 6px;
    font-size: 14px;
}
</style>

