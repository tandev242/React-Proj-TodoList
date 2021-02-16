import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import TaskControl from './components/TaskControl';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import _ from 'lodash';
class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			tasks: [],
			isDisplayForm: false,
			taskEditing: null,
			filter: {
				name: '',
				status: -1
			},
			keyword: '',
			sortBy: 'name',
			sortValue: 1
		};
	}

	componentDidMount() {
		if (localStorage && localStorage.getItem('tasks')) {
			var tasks = JSON.parse(localStorage.getItem('tasks'));
			this.setState({
				tasks: tasks
			});
		}
	}



	onToggleForm = () => {
		this.setState({
			isDisplayForm: !this.setState.isDisplayForm,
			taskEditing: null
		});
	}

	onCloseForm = () => {
		this.setState({
			isDisplayForm: false
		});
	}
	onOpenForm = () => {
		this.setState({
			isDisplayForm: true
		});
	}
	onSubmit = (data) => {
		var { tasks } = this.state;
		if (data.id === '') {
			var task = {
				id: uuidv4(),
				name: data.name,
				status: data.status
			}
			tasks.push(task);
		}
		else {
			var index = this.findIndex(data.id);
			tasks[index] = data;
		}
		this.setState({
			tasks: tasks,
			taskEditing: null
		});
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}

	onUpdateStatus = (id) => {
		// console.log(id);
		var { tasks } = this.state;
		var index = this.findIndex(id);
		// console.log(index);
		if (index !== -1) {
			tasks[index].status = !tasks[index].status;
			this.setState({
				tasks: tasks
			});
			localStorage.setItem('tasks', JSON.stringify(tasks));
		}

	}

	onDeleteTask = (id) => {
		var { tasks } = this.state;
		var index = this.findIndex(id);
		if (index !== -1) {
			tasks.splice(index, 1);
			this.setState({
				tasks: tasks
			});
			localStorage.setItem('tasks', JSON.stringify(tasks));
		}
		this.onCloseForm();
	}
	onUpdateTask = (id) => {
		var { tasks } = this.state;
		var index = _.findIndex(tasks , (task) =>{
			return task.id === id;
		});
		var taskEditing = tasks[index];
		if (index !== -1) {
			this.setState({
				taskEditing: taskEditing
			});
			this.onOpenForm();
		}
	}
	

	findIndex = (id) => {
		var { tasks } = this.state;
		// var { name } = this.state;
		// console.log(name);
		var result = -1;
		tasks.forEach((task, index) => {
			if (task.id === id) {
				result = index;
			}
		});
		return result;
	}
	onFilter = (filterName, filterStatus) => {
		filterStatus = parseInt(filterStatus, 10);
		this.setState({
			filter: {
				name: filterName.toLowerCase(),
				status: filterStatus
			}
		});
	}
	onSearch = (keyword) => {
		this.setState({
			keyword: keyword
		})
	}
	onSort = (sortBy, sortValue) => {
		this.setState({
			sortBy: sortBy,
			sortValue: sortValue
		})
	}

	render() {
		var { tasks, isDisplayForm, taskEditing, filter, keyword, sortBy, sortValue } = this.state;
		if (filter) {
			if (filter.name) {
				tasks = tasks.filter((task) => {
					return task.name.toLowerCase().indexOf(filter.name) !== -1;
				});
			}
			tasks = tasks.filter((task) => {
				if (filter.status === -1) {
					return task;
				}
				else {
					return task.status === (filter.status === 1 ? true : false);
				}
			});
		}
		if (keyword) {
			tasks = tasks.filter((task) => {
				return task.name.toLowerCase().indexOf(keyword) !== -1;
			});
		}
		var elmTaskForm = isDisplayForm ? <TaskForm onSubmit={this.onSubmit}
			onCloseForm={this.onCloseForm}
			task={taskEditing}
		/> : '';
		if (sortBy === "name") {
			tasks.sort((a, b) => {
				if (a.name > b.name) return sortValue;
				else if (a.name < b.name) return -sortValue;
				return 0;
			});
		}
		else{
			tasks.sort((a, b) => {
				if (a.status > b.status) return -sortValue;
				else if (a.status < b.status) return sortValue;
				return 0;
			});
		}

		return (
			<div className="container">
				<div className="text-center">
					<h1>Quản Lý Công Việc</h1>
					<hr />
				</div>
				<div className="row">
					<div className={isDisplayForm ? "col-xs-4 col-sm-4 col-md-4 col-lg-4" : ''}>

						{elmTaskForm}

					</div>
					<div className={isDisplayForm ? "col-xs-8 col-sm-8 col-md-8 col-lg-8" : "col-xs-12 col-sm-12 col-md-12 col-lg-12"}>
						<button type="button" className="btn btn-primary" onClick={this.onToggleForm}>
							<span className="fa fa-plus mr-5"></span>Thêm Công Việc
						</button>
						<TaskControl onSearch={this.onSearch} onSort={this.onSort} sortBy={sortBy} sortValue={sortValue} />

						<div className="row mt-15">
							<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
								<TaskList tasks={tasks}
									onUpdateStatus={this.onUpdateStatus}
									onDeleteTask={this.onDeleteTask}
									onUpdateTask={this.onUpdateTask}
									onFilter={this.onFilter}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
export default App;
