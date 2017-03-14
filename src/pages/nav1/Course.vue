<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.classifyName" placeholder="请输入课程名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getUsers">查询</el-button>
				</el-form-item> -->
				<el-form-item style='float:right'>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row  v-loading="listLoading"  style="width: 100%;">
			<!-- <el-table-column type="selection" width="50" @selection-change="selsChange" >
			</el-table-column> -->
			<el-table-column type="index" prop='cid' width="80">
			</el-table-column>
			<el-table-column prop="courseName" label="名称" width="220" sortable>
			</el-table-column>
			<el-table-column prop="classifyName" label="分类" min-width="220" sortable>
			</el-table-column>
			<el-table-column prop="cPrice" label="价格" width="200" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click.native="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click.native="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<!--分页条-->
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="totalPage" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules='editFormRules' ref="editForm"  name='editForm' action="/momingtang/web/backCourse/updateCourse" enctype='multipart/form-data' id='editForm' method='post'
			>
				<el-form-item style='display:none'>
					<el-input name='cid' v-model='editForm.cid'></el-input>
				</el-form-item>
				<el-form-item label="分类">
					<el-select v-model='editForm.classifyName' disabled placeholder="请选择">
					    <el-option
					      v-for="item in options"
					      :label='item.classifyName'
					      :value="item.classifyId">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item label="价格">
					<el-input name="cPrice" v-model='editForm.cPrice' placeholder="请输入价格" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label="名称">
					<el-input name="courseName" v-model='editForm.courseName' placeholder="请输入内容" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label='背景图片'>
					<el-input type="file" name='cover' v-model='editForm.cover'></el-input>
				</el-form-item>
				<el-form-item label='课程详情'>
					<el-input type="file" name='detailsPic' v-model='editForm.detailsPic'></el-input>
				</el-form-item>
				<!-- <el-form-item label="课程内容">
					<el-input v-model="editForm.msg" placeholder="初识古琴"></el-input>
					<el-input v-model="editForm.msg1" placeholder="琴行"></el-input>
					<el-input v-model="editForm.msg2" placeholder="哈哈哈"></el-input>
				</el-form-item> -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			 <el-form :model='addForm' label-width="80px" ref="addForm" name='addForm' action="/momingtang/web/backCourse/addCourse" enctype='multipart/form-data' id='addForm' method='post'
			>
				<el-form-item label="分类">
					<select name='classifyId' class='classifyId' placeholder="请选择">
					    <option
					      v-for="item in options"
					      :value="item.classifyId">{{item.classifyName}}
					    </option>
					  </select>
				</el-form-item>
				<el-form-item label="名称">
					<el-input name='courseName' placeholder="请输入内容" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label="价格">
					<el-input name='cPrice' placeholder="请输入价格" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label='背景图片'>
					<input type='file' name='cover'/>
				</el-form-item>
				<el-form-item label="课程介绍">
					<input type="file" name='detailsPic'>
				</el-form-item>
				<!-- <el-form-item label="课程内容">
					<el-input v-model="addForm.msg" placeholder="第一天课题"></el-input>
					<el-input v-model="addForm.msg1" placeholder="第二天课题"></el-input>
					<el-input v-model="addForm.msg2" placeholder="第三天课题"></el-input>
				</el-form-item> -->
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
					classifyName: ''
				},
				users: [],
				totalPage: 0,//总页数
				currentPage:1,//当前页
				pageSize:20,//页大小
				listLoading: false,
				//sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					/*classifyName: [
						{ required: true, message: '请选择课程类型', trigger: 'blur' }
					],
					cPrice:[
						{ required: true, message: '请输入价格', trigger: 'blur' }
					],
					courseName:[
						{ required: true, message: '请输入课程名称', trigger: 'blur' }
					]*/
				},
				//编辑界面数据
				editForm: {
					cid: 0,
					courseName: '',
					classifyName: '',
					cPrice:'',
					cover:'',
					detailsPic:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					/*classifyName: [
						{ required: true, message: '请选择类型', trigger: 'blur' }
					],
					cPrice:[
						{ required: true, message: '请输入价格', trigger: 'blur' }
					],
					courseName:[
						{ required: true, message: '请输入课程名称', trigger: 'blur' }
					]*/
				},
				//新增界面数据
				options:[],
				addForm: {
					courseName: '',//名称
					classifyName: '',
					cPrice:'',
					classifyId:'',//课程分类ID
				}

			}
		},
		methods: {
			//分页展示
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					currentPage: this.page,
					classifyName: this.filters.classifyName,
					currentPage: this.currentPage,
					pageSize: this.pageSize
				};
				this.listLoading = true;
				NProgress.start();
				$.ajax({
					url: '/momingtang/web/backCourse/getAllCourse',
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
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					 NProgress.start();
					let para = { cid: row.cid };
					console.log(para)
					$.ajax({
						url: '/momingtang/web/backCourse/deleteCourse',
						type: 'POST',
						data: para,
					})
					.done(function(res) {
						console.log("success-----单个删除");
						this.listLoading = false;
						NProgress.done();
						console.log(res)
						if(res.status == 1){
							this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});
							this.getUsers();
						}else{
							this.$notify({
								title: '失败',
								message: '删除失败',
								type: 'error'
							});
							this.getUsers();
						}
					}.bind(this));
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
			},
			//编辑
			editSubmit: function () {
				console.log('--------------------------------------开始编辑')
				var vm = this;
				console.log(vm.editForm.cid)
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					this.editLoading = true;
					NProgress.start();
					$('#editForm').ajaxSubmit({
						url:'/momingtang/web/backCourse/updateCourse',
						type:'post',
						beforeSerialize:function(res){
							//console.log(res);
						},
						beforeSubmit:function(res){
							//console.log(res)
						},
						success: function(res){
							console.log(res)
							this.editLoading = false;
							NProgress.done();
							if(res.status == 1){
								this.$notify({
									title: '成功',
									message: '提交成功',
									type: 'success'
								});
								vm.$refs.editForm.resetFields();
							}else{
								this.$notify({
									title: '失败',
									message: '提交失败',
									type: 'error'
								});
							}
							this.editFormVisible = false;
							this.getUsers();
						}.bind(this),
						error: function(res) {
							this.editLoading = false;
							NProgress.done();
							console.log(res)
							this.$notify({
								title: '失败',
								message: '提交失败',
								type: 'error'
							});
						}.bind(this)
					})
				});
				/*	}
				})*/
			},
			//新增
			addSubmit: function () {
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					this.addLoading = true;
					NProgress.start();
					$('#addForm').ajaxSubmit({
						url:'/momingtang/web/backCourse/addCourse',
						type:'post',
						beforeSerialize:function(res){
							//console.log(res)
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
			},
			/*selsChange: function (sels) {
				this.sels = sels;
			},*/
			//批量删除
			/*batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					NProgress.start();
					let para = { cid: ids };
					$.ajax({
						url: `/momingtang/web/backCourse/deleteCourse/${para.cid}`,
						type: 'POST',
						data: para,
					})
					.done(function(res) {
						console.log("success-----批量删除");
						this.listLoading = false;
							NProgress.done();
						if(res.status == 1){
							this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});
							this.getUsers();
						}else{
							this.$notify({
								title: '失败',
								message: '删除失败',
								type: 'success'
							});
							this.getUsers();
						}
					}.bind(this))
					.fail(function() {
						console.log("error");
					})
					.always(function() {
						console.log("complete");
					});
				}).catch(() => {

				});
			}*/
		},
		mounted() {
			this.getUsers();
			this.getAllClassify();
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