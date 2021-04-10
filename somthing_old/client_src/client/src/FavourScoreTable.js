import { Table, Tag, Space } from 'antd';
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
    title: '统计数量',
    dataIndex: 'number',
    key: 'number',
  },
  {
      title: "计数得分",
      dataIndex: 'count_score',
      key: "count_score",
  },
  {
    title: '材质得分',
    dataIndex: 'material_score',
    key: 'material_score',
  },
  {
    title: "颜色得分",
    dataIndex: "color_score",
    key: "color_score",
  },
  {
      title: "总分",
      dataIndex: "sum_score",
      key: "sum_score",
  }
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


class ScoreTable extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<Table
            title = {()=> <h1>喜好得分表</h1>}
            columns = {columns}
            dataSource = {data}
        ></Table>);
    }
}

export default ScoreTable