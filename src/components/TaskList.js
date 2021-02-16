import React, { Component } from "react";
import TaskItem from "./TaskItem";
class TaskList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filterName : '',
            filterStatus : -1
        };
    }

    onChange = (event) =>{
        var target = event.target;
        var name = target.name;
        var value = target.value;
        this.props.onFilter(name === 'filterName' ? value : this.state.filterName ,
             name === 'filterStatus' ? value :  this.state.filterName);
        this.setState({
            [name] : value
        });
    }

    render() {
        var { tasks } = this.props;
        var {filterName , filterStatus} = this.props;
        var elmTasks = tasks.map((task, index) => {
            return <TaskItem key={task.id} index={index} task={task}
                onUpdateStatus={this.props.onUpdateStatus}
                onDeleteTask={this.props.onDeleteTask}
                onUpdateTask={this.props.onUpdateTask}
            />
        });

        return (
            <table className="table table-bordered table-hover mt-15">
                <thead>
                    <tr>
                        <th className="text-center">STT</th>
                        <th className="text-center">Tên</th>
                        <th className="text-center">Trạng Thái</th>
                        <th className="text-center">Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <input type="text" className="form-control"  name = "filterName" onChange = {this.onChange}/>
                        </td>
                        <td>
                            <select className="form-control"  name = "filterStatus" onChange = {this.onChange}>
                                <option value="-1">Tất Cả</option>
                                <option value="0">Ẩn</option>
                                <option value="1">Kích Hoạt</option>
                            </select>
                        </td>
                        <td></td>
                    </tr>
                    {elmTasks}
                </tbody>
            </table>
        );
    }
}


export default TaskList;