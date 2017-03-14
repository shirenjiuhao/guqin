
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
		<el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<!-- <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;"> @selection-change="selsChange" -->
			<!-- <el-table-column type="selection" width="50">
			</el-table-column> -->
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
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="totalPage" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		 <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" name='editForm' action="/momingtang/web/backSchool/updateCourse" enctype='multipart/form-data' id='editForm' method='post'>
				<el-form-item style='display:none'>
					<el-input name='sid' v-model='editForm.sid'></el-input>
				</el-form-item>
				<el-form-item label="省份">
					<el-select v-model="editForm.province" disabled @change='getAllCitys' placeholder="请选择">
					    <el-option
					      v-for="item in province"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item label="市区">
					<select name='attribution' disabled :seleted="editForm.city" placeholder="请选择">
					    <option
					      v-for="item in citys"
					      :label="item.name"
					      :value="item.name">
					    </option>
					  </select>
				</el-form-item>
				<el-form-item label="名称">
					<el-input name='sName' v-model="editForm.sName" placeholder="请输入价格" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label="详细地址">
					<el-input name='address' v-model="editForm.address" placeholder="请输入内容" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label="营业时间">
					<el-input name='businessHours' v-model="editForm.businessHours" placeholder="请输入内容" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label='学堂封面'>
					<el-input type='file' name='cover' class='myInput'></el-input>
				</el-form-item>
				<el-form-item label='学堂介绍'>
					<el-input type='file' name='sdetailsPic' class='myInput'></el-input>
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
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" name='addForm' action="/momingtang/web/backSchool/addSchool" enctype='multipart/form-data' id='addForm' method='post'>
				<el-form-item label="省份">
					<el-select v-model='id' @change='getAllCitys' placeholder="请选择省份">
					    <el-option
					      v-for="item in province"
					      :label='item.name'
					      :value="item.id">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item label="市区">
					<select name='attribution' class='classifyId' placeholder="请选择城市">
					    <option
					      v-for="item in citys"
					      :value="item.name">{{item.name}}
					    </option>
					  </select>
				</el-form-item>
				<el-form-item label="名称">
					<el-input name="sName" v-model='addForm.sName' placeholder="请输入名称" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label="详细地址">
					<el-input name="address" v-model='addForm.address' placeholder="请输入街道地址" class='myInput'></el-input>
				</el-form-item>
				<el-form-item label="营业时间">
					<el-input name="businessHours" v-model='addForm.businessHours' placeholder="请输入时间，如 09:00-18:00" class='myInput'></el-input>
					<!-- <el-time-picker 
					    is-range
					    format='HH:mm'
					    placeholder="选择时间范围">
					  </el-time-picker> -->
				</el-form-item>
				<el-form-item label='学堂封面'>
					<el-input type="file" name='cover' class='myInput' v-model='addForm.cover'></el-input>
				</el-form-item>
				<el-form-item label="学堂介绍">
					<el-input type="file" name='sdetailsPic' class='myInput' v-model='addForm.sdetailsPic'></el-input>
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
				totalPage:0,
				currentPage: 0,
				pageSize: 10,
				listLoading: false,
				pid:0,//获取省份的ID
				id:1,
				options:[],
				province:[],
				citys:[],
				//sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					sName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					sid: 0,
				    sName: "",
				    cover: "",
				    sdetailsPic: "",
				    businessHours: "",
				    address: "",
				    province: "",
				    city: "",
				    attribution:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					/*province: [
						{ required: true, message: '请选择省份', trigger: 'blur' }
					],
					city: [
						{ required: true, message: '请选择省份', trigger: 'blur' }
					],*/
					sName: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					sName: "",
				    sImage: "",
				    sdetailsPic: "",
				    businessHours:'',
				    address: "",
				    province: "",
				    attribution: ""
				}

			}
		},
		methods: {
			//分页展示
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getUsers();
			},
			//获取省份
			getAllProvince(){
				let para = {
					pid : this.pid
				}
				$.ajax({
					url: '/momingtang/region/getRegions',
					type: 'POST',
					data:para
				})
				.done(function(res) {
					console.log(res);
					this.province = res.data;
				}.bind(this))
			},
			//获取市区
			getAllCitys(){
				let para = {
					pid : this.id
				}
				$.ajax({
					url: ' /momingtang/region/getRegions',
					type: 'POST',
					data:para
				})
				.done(function(res) {
					console.log(res);
					this.citys = res.data;
				}.bind(this))
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
					let para = { sid: row.sid };
					$.ajax({
						url: '/momingtang/web/backSchool/deleteSchool',
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
				console.log(vm.editForm.sid)
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					this.editLoading = true;
					NProgress.start();
					$('#editForm').ajaxSubmit({
						url:'/momingtang/web/backSchool/updateCourse',
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
				/*this.$refs.editForm.validate((valid) => {
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
				});*/
			},
			//新增
			addSubmit: function (e) {
				/*this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							NProgress.start();
							let para = Object.assign({}, this.addForm);
							/*para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
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
				});*/
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					this.addLoading = true;
					NProgress.start();
					$('#addForm').ajaxSubmit({
						url:'/momingtang/web/backSchool/addSchool',
						type:'post',
						beforeSerialize:function(res){
							console.log(res)
						},
						beforeSubmit:function(res){
							console.log(res)
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
								this.$refs.addForm.resetFields();
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
			}
		},
		mounted() {
			this.getUsers();
			this.getAllProvince();
			this.getAllCitys();
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
    color: #333956;
    padding: 0px 6px;
    font-size: 14px;
}
</style>

