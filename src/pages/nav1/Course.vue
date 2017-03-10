<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.classifyName" placeholder="请输入课程名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row  v-loading="listLoading"  @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="70">
			</el-table-column>
			<el-table-column type="index" prop='cid' width="80">
			</el-table-column>
			<el-table-column prop="courseName" label="名称" width="220" sortable>
			</el-table-column>
			<el-table-column prop="classifyName" label="分类" width="220" sortable>
			</el-table-column>
			<el-table-column prop="cPrice" label="价格" width="200" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="分类" prop="classifyName">
					<el-select v-model="classifyId" placeholder="请选择">
					    <el-option
					      v-for="item in options"
					      :label="item.classifyName"
					      :value="item.classifyName">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item label="价格">
					<el-input v-model="editForm.cPrice" placeholder="请输入价格" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label="名称">
					<el-input v-model="editForm.courseName" placeholder="请输入内容" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label='背景图片'>
					<el-upload
					  class="upload-demo"
					  v-model='editForm.cover'
					  action="/momingtang/web/backCourse/addCourse"
					 >
					  <el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
				</el-form-item>
				
				<el-form-item label="课程内容">
					<el-input v-model="editForm.msg" placeholder="初识古琴"></el-input>
					<el-input v-model="editForm.msg1" placeholder="琴行"></el-input>
					<el-input v-model="editForm.msg2" placeholder="哈哈哈"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" enctype='multipart/form-data'>
				<el-form-item label="分类">
					<el-select v-model="addForm.classifyId" placeholder="请选择">
					    <el-option
					      v-for="item in options"
					      :label="item.classifyName"
					      :value="item.classifyId">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item label="名称">
					<el-input v-model="addForm.courseName" placeholder="请输入内容" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label="价格">
					<el-input v-model="addForm.cPrice" placeholder="请输入价格" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label='背景图片' v-model='addForm.cover'>
					<el-upload
					  class="upload-demo"
					 
					  :file-list="addForm.fileList"
					  action="http://localhost/momingtang/web/backCourse/addCourse"
					 >
					  <el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="课程介绍" v-model='addForm.detailsPic'>
					<el-upload
					  class="upload-demo"
					  
					  action="/momingtang/web/backCourse/addCourse"
					 >
					  <el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="课程内容">
					<el-input v-model="addForm.msg" placeholder="第一天课题"></el-input>
					<el-input v-model="addForm.msg1" placeholder="第二天课题"></el-input>
					<el-input v-model="addForm.msg2" placeholder="第三天课题"></el-input>
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
	//import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
	import $ from 'jquery'
	export default {
		data() {
			return {
				filters: {
					classifyName: ''
				},
				users: [],
				total: 0,
				currentPage:0,
				pageSize:20,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					cid: 0,
					courseName: '',
					classifyName: '',
					cPrice:'',
					cover:'',
					msg:'',
					msg1:'',
					msg2:'',
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请选择类型', trigger: 'blur' }
					]
				},
				//新增界面数据
				options:[],
				addForm: {
					courseName: '',//名称
					classifyName: '',
					cPrice:'',
					classifyId:'',//课程分类ID
					cover:'',
					detailsPic:'',
					msg:'',
					msg1:'',
					msg2:'',
					fileList:{},
				}

			}
		},
		methods: {
			//分页展示
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
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
					this.total = res.data.totalPage;
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
					let para = { id: row.id };
					removeUser(para).then((res) => {
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
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
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
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							console.log(this.addForm)
							this.addLoading = true;
							NProgress.start();
							let para = Object.assign({}, this.addForm);
							$.ajax({
								url: '/momingtang/web/backCourse/addCourse',
								type: 'POST',
								data: para
							})
							.done(function(res) {
								console.log("success");
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
							}.bind(this))
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
			this.getAllClassify();
		}
	}

</script>

<style scoped>
.myInput{width:218px;}
</style>