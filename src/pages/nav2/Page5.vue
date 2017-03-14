
<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
						<el-date-picker
				      align="right"
				      v-model='filters.name'
				      type="date"
				      placeholder="选择日期"
				      :picker-options="pickerOptions1">
				    </el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click.native="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
				<el-table-column type="index" prop='reservatId' width="60">
				</el-table-column>
				<el-table-column prop="name" label="姓名" width="100" sortable>
				</el-table-column>
				<el-table-column prop="mobile" label="手机号码" min-width="120" sortable>
				</el-table-column>
				<el-table-column prop="classifyName" label="类型" width="100" sortable>
				</el-table-column>
				<el-table-column prop="courseName" label="名称" width="100" sortable>
				</el-table-column>
				<el-table-column prop="tname" label="所属老师" min-width="100" sortable>
				</el-table-column>
				<el-table-column prop="sName" label="所属学堂" min-width="120" sortable>
				</el-table-column>
				<el-table-column prop="reservatTime" label="课程时间" min-width="120" sortable>
				</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="totalPage" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import NProgress from 'nprogress'
	import { getUserListPage } from '../../api/api';
import $ from 'jquery'
	export default {
		data() {
			return {
				filters: {
					name:'',
				},
				users: [],
				totalPage:0,//总页数
				currentPage: 0,//当前页
				pageSize: 10,//每页显示条数
				listLoading: false,

				//选择时间
				 pickerOptions1: {
		          shortcuts: [{
		            text: '今天',
		            onClick(picker) {
		              picker.$emit('pick', new Date());
		            }
		          }, {
		            text: '昨天',
		            onClick(picker) {
		              const date = new Date();
		              date.setTime(date.getTime() - 3600 * 1000 * 24);
		              picker.$emit('pick', date);
		            }
		          }, {
		            text: '一周前',
		            onClick(picker) {
		              const date = new Date();
		              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', date);
		            }
		          }]
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
				this.filters.name = (!this.filters.name || this.filters.name == '') ? '' : util.formatDate.format(new Date(this.filters.name), 'yyyy-MM-dd');
				console.log(typeof this.filters.name);
				let para = {
					totalPage:this.totalPage,
					currentPage: this.currentPage,
					pageSize: this.pageSize,
					date: this.filters.name,
				};
				this.listLoading = true;
				NProgress.start();
				$.ajax({
				  url: '/momingtang/web/backData/getCourseReservats',
				  type: 'POST',
				  data: para,
				})
				.done(function(res) {
				  console.log(res);
				  NProgress.done();
				  if(res.status == 1){
				  	this.totalPage = res.data.totalPage;
					this.currentPage = res.data.currentPage;
					this.pageSize = res.data.pageSize;
					this.users = res.data.datas;
				  }else{
				  	this.users = [];
				  }
				  this.listLoading = false;
				  NProgress.done();
				}.bind(this))
			},

			
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>

