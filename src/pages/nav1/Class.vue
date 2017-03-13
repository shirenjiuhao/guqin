
<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="请输入课堂"></el-input>
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
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<!-- <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;"> -->
			<el-table-column type="selection" width="50">
			</el-table-column>
				<el-table-column type="index" prop='sid' width="40">
				</el-table-column>
				<el-table-column prop="province" label="省份" width="90" sortable>
				</el-table-column>
				<el-table-column prop="city" label="市区" width="90" sortable>
				</el-table-column>
				<el-table-column prop="sName" label="名称" width="120" sortable>
				</el-table-column>
				<el-table-column prop="address" label="详细地址" min-width="240" sortable>
				</el-table-column>
				<el-table-column prop="businessHours" label="营业时间" min-width="120" sortable>
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
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="totalPage" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<!-- <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
					<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
						<el-form-item label="省份">
							<el-select v-model="editForm.province" placeholder="请选择">
							    <el-option
							      v-for="item in options"
							      :label="item.classifyName"
							      :value="item.classifyName">
							    </el-option>
							  </el-select>
						</el-form-item>
						<el-form-item label="市区">
							<el-select v-model="editForm.city" placeholder="请选择">
							    <el-option
							      v-for="item in options"
							      :label="item.classifyName"
							      :value="item.classifyId">
							    </el-option>
							  </el-select>
						</el-form-item>
						<el-form-item label="名称">
							<el-input v-model="editForm.sName" placeholder="请输入价格" class='myInput'></el-input>
						</el-form-item>
						<el-form-item label="详细地址">
							<el-input v-model="editForm.address" placeholder="请输入内容" class='myInput'></el-input>
						</el-form-item>
						<el-form-item label="营业时间">
							<el-input v-model="editForm.businessHours" placeholder="请输入内容" class='myInput'></el-input>
						</el-form-item>
						<el-form-item label='学堂封面'>
							<el-upload
							  class="upload-demo"
							  ref="upload1"
							  :auto-upload="false"
							  action="/momingtang/web/backCourse/updateCourse"
							 >
							<el-button slot="trigger" size="small" type="primary">选取图片</el-button>
							<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
							</el-upload>
						</el-form-item>
						<el-form-item label='学堂介绍'>
							<el-upload
							  class="upload-demo"
							  ref="upload2"
							  :auto-upload="false"
							  action="/momingtang/web/backCourse/updateCourse"
							 >
							<el-button slot="trigger" size="small" type="primary">选取图片</el-button>
							<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
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
				</el-dialog> -->

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" enctype='multipart/form-data'>
				<el-form-item label="省份" prop='province'>
					<el-select v-model="addForm.province" placeholder="请选择省份">
					    <el-option
					      v-for="item in options"
					      :label="item.province"
					      :value="item.province">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item label="市区" prop='city'>
					<el-select v-model="addForm.city" placeholder="请选择城市">
					    <el-option
					      v-for="item in options"
					      :label="item.city"
					      :value="item.city">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item label="名称" prop='sName'>
					<el-input v-model="addForm.sName" placeholder="请输入名称" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label="详细地址" prop='address'>
					<el-input v-model="addForm.address" placeholder="请输入街道地址" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label="营业时间" prop='businessHours'>
					<el-input v-model="addForm.businessHours" placeholder="请输入时间" class='myInput'></el-input>
					<!-- <el-time-picker 
					    is-range
					    format='HH:mm'
					    placeholder="选择时间范围">
					  </el-time-picker> -->
				</el-form-item>
				<el-form-item label='学堂封面' v-model="addForm.cover">
					<el-upload
					  class="upload-demo"
					  ref="upload1"
					  :auto-upload="false"
					  action="/momingtang/web/backSchool/addSchool"
					 >
					 <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
					<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-form-item>
				<el-form-item label="学堂介绍" v-model="addForm.detailsPic">
					<el-upload
					  class="upload-demo"
					  ref="upload2"
					  :auto-upload="false"
					  action="/momingtang/web/backCourse/addCourse"
					 >
					 <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
					<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
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
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				totalPage:0,
				currentPage: 0,
				pageSize: 10,
				listLoading: false,
				options:[],
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				/*editForm: {
					sid: 0,
				    sName: "",
				    sImage: "",
				    detailsPic: "",
				    businessHours: "",
				    address: "",
				    province: "",
				    city: ""
				},*/

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					province: [
						{ required: true, message: '请选择省份', trigger: 'blur' }
					],
					city: [
						{ required: true, message: '请选择省份', trigger: 'blur' }
					],
					sName: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					sName: "",
				    sImage: "",
				    detailsPic: "",
				    businessHours:'',
				    address: "",
				    province: "",
				    city: ""
				}

			}
		},
		methods: {
			//性别显示转换
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
					url: '/momingtang/web/backSchool/getPageSchool',
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
					let para = { cid: row.cid };
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
			/*handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},*/
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					sName: "",
				    sImage: "",
				    detailsPic: "",
				    businessHours: '',
				    address: "",
				    province: "",
				    city: ""
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
							this.addLoading = true;
							NProgress.start();
							let para = Object.assign({}, this.addForm);
							/*para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');*/
							addUser(para).then((res) => {
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
							});
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

