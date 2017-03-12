
<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="请输入老师"></el-input>
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
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%">
			<!-- <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;"> -->
			<el-table-column type="selection" width="50">
			</el-table-column>
				<el-table-column type="index" prop='tid' width="100">
				</el-table-column>
				<el-table-column prop="tname" label="名字" width="200" sortable>
				</el-table-column>
				<el-table-column prop="introduce" label="描述" min-width='220' sortable>
				</el-table-column>
				<!-- <el-table-column prop="age" label="年龄" width="120" sortable>
				</el-table-column>
				<el-table-column prop="addr" label="详细地址" min-width="160" sortable>
				</el-table-column>
				<el-table-column prop="birth" label="从业时间" min-width="160" sortable>
				</el-table-column> 
			<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="totalPage" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名字" prop="tName">
					<el-input v-model="addForm.tName" auto-complete="off" class='myInput'></el-input>
				</el-form-item>
				
				<el-form-item label="描述">
					<el-input v-model="addForm.introduce" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label="教师图片">
					<el-upload
					  class="upload-demo"
					  action="/momingtang/web/backTeacher/addTeacher"
					  ref="upload"
					  :auto-upload="false"
					  >
					  <el-button size="small" type="primary">点击上传</el-button>
					  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog> 

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名字" prop="tName">
					<el-input v-model="addForm.tName" auto-complete="off" class='myInput'></el-input>
				</el-form-item>
				
				<el-form-item label="描述">
					<el-input v-model="addForm.introduce" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label="教师图片">
					<el-upload
					  class="upload-demo"
					  action="/momingtang/web/backTeacher/addTeacher"
					  ref="upload"
					  :auto-upload="false"
					  >
					  <el-button size="small" type="primary">点击上传</el-button>
					  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
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
/*	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';*/

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				totalPage: 0,
				currentPage: 0,
				pageSize: 20,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					tName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					tid: 0,
				    tname: "",
				    introduce: "",
				    timage: ""
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					tName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
				    tName: "",
				    introduce: "",
				    cover: {}
				}

			}
		},
		methods: {
			//性别显示转换
			/*formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},*/
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					totalPage: this.totalPage,
					currentPage: this.currentPage,
					pageSize: this.pageSize,
					name: this.filters.name
				};
				this.listLoading = true;
				NProgress.start();
				$.ajax({
					url: '/momingtang/web/backTeacher/getPageTeacher',
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
					let para = { tid: row.id };
					$.ajax({
						url: `/momingtang/web/backTeacher/deleteTeacher/:tid`,
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
					})
					.fail(function() {
						console.log("error");
					})
					.always(function() {
						console.log("complete");
					});
					
					/*removeUser(para).then((res) => {
						this.listLoading = false;
						NProgress.done();
						this.$notify({
							title: '成功',
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});*/
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
				this.addForm = {
					tName: '',
					introduce: '',
					cover: '',
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
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							this.addForm.cover = Object.assign({}, this.$refs.upload.uploadFiles[0].raw);
							console.log(typeof this.$refs.upload.uploadFiles[0].raw)
							NProgress.start();
							let para = Object.assign({}, this.addForm);
							console.log(para)
							$.ajax({
								url: '/momingtang/web/backTeacher/addTeacher',
								type: 'POST',
								data: para,
							})
							.done(function(res) {
								console.log("success");
								this.addLoading = false;
								NProgress.done();
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
										type: 'success'
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
							});
							
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
						});
					}
				});
			},
			selsChange: function (sels) {
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
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>
.myInput{width:218px;}
</style>

