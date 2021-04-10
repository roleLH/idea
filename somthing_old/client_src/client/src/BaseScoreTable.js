import { Table, Tag, Space, Card } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: '数量',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: '得分',
    dataIndex: 'score',
    key: 'score',
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    number: 32,
    score: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    number: 42,
    score: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    number: 32,
    score: 'Sidney No. 1 Lake Park',
  },
];


class BaseScoreTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }

    render() {
        return (<Table
            title = {()=> <h1>基础得分表</h1>}
            columns = {columns}
            dataSource = {data}
        ></Table>);
    }


}

class BaseScore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }



    render() {
        let basescore = <span color={"#f00"} >{this.props.basescore}</span>
        let num = <span color={"#f00"}>{this.props.count}</span>
        let score_limit = <span>{this.props.scoreLimit}</span>
        let {visible} = this.state;
        if(visible) {
            return (<Card>
                您的基础得分为{basescore}, 共统计了{num}个预设。您的扣分项为{score_limit}
            </Card>);
        }
        return <div/>
    }
}


export default BaseScore