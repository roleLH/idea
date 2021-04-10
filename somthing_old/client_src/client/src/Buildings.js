import React from 'react';
import { TreeSelect } from 'antd';
import { InputNumber } from 'antd';
import { Button, List, Card, Drawer, Space, Row, Col, Switch } from 'antd';
import { Modal } from 'antd';

import 'antd/dist/antd.css';

import GCore from './SystemCore';

const treeData = [
    {
    title: 'Node1',
    value: '0-0',
    disabled: true,
    children: [
        {
        title: 'Node1',
        value: 0,
        },
        {
        title: 'Node2',
        value: 1,
        },
        {
          title: 'Node3',
          value: 2,
          },
          {
          title: 'Node4',
          value: 3,
          },
    ],
    },
    {
    title: 'Node2',
    value: '0-1',
    },
];

const MAXSIZE= 10;
const ID_KEY = "id";
const PREFAB_NAME = "prefab";
function buildTreeDataFromJson(jsondata) {
  let tree = [];
  let obj = JSON.parse(jsondata);
  let length = Math.ceil(obj.length / MAXSIZE);
  for(let i = 0; i < length; ++i) {
    tree.push({
      title: "第" + toString(i) + "组",
      disabled: true,
      children: []
    })
  }
  for(let i = 0; i < obj.length; ++i) {
    let key = Math.floor(i/MAXSIZE);
    let node = tree[key];
    if(node) {
      let children = node.children
      children.push({
        title: obj[i][PREFAB_NAME],
        value: obj[i][ID_KEY],
      });
    } else {
      console.log("[error] build building data error", key)
    }
  }

  return tree;
}

class InputBuilding extends React.Component {
    constructor(props) {
      super(props);
    }

    onChange = value => {
      console.log(value);
      this.props.onChange(value);
    };

    render() {
    return (
        <TreeSelect
        style={{ width: '100%' }}
      
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={treeData}
        placeholder="Please select"
        treeDefaultExpandAll
        onChange={this.onChange}
        value={this.props.buildingid}
        />
    );
    }
}

class HomeItemInfo extends React.Component {
  constructor(props) {
    super(props);
    this.idx = this.props.index;

    this.state = {
      visible: false,
    }
  }

  onChangeNumber = (num)=> {
    this.updateData(this.idx, "count", num);
  }
  onChangeBuildingId = (id)=> {
    this.updateData(this.idx, "buildingid", id);
  }

  updateData(idx, key, value) {
    this.props.onChange(idx, key, value);
  }


  showModal = () => {
    this.setState({
      visible: true
    })
  };

  handleOk = () => {
    this.props.onDelete(this.idx)
    this.setState({
      visible: false
    })
  };

  handleCancel = () => {
    this.setState({
      visible: false
    })
  };


  render() {
    return(
      <>
        <InputBuilding buildingid={this.props.buildingid} onChange={this.onChangeBuildingId}/>
        <InputNumber value={this.props.number} min={1} max={10} onChange={this.onChangeNumber}/>
        <>
          <Button type="primary" onClick={this.showModal}>
            删除
          </Button>
          <Modal title="Basic Modal" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
            确定要删除吗？
          </Modal>
        </>
      </>
    ); 
  }
}

class HomeItemInfos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list : []
    }
  }
  
  addHomeItemInfo() {
    let data = this.state.list;
    let info = {
      buildingid : 0,
      count : 0,
      index : data.length
    };
    data.push(info);
    this.setState({list : data});
  }

  removeHomeItemInfo = (idx)=> {
    let data = this.state.list;
    data.splice(idx, 1);
    data.forEach((item, idx)=>{
      item.index = idx;
    })
    this.setState({list : data});
  }

  updateHomeItemInfo = (idx, key, value)=> {
    let data = this.state.list
    let info = data[idx]
    if(!info) {
      console.log("[error] not found home item info", idx);
      return;
    }
    info[key] = value;
    this.setState({list : data});
  }

  submit = ()=> {
    GCore.submitData("buildings", this.state.list)
  }

  render() {
    const list = this.state.list;


    return (
      <Card>
        <List
        itemLayout="horizontal"
        dataSource = {list}
        size = "small"
        split = {false}
        renderItem = {
          (item) => {
            return (
              <List.Item>
                <HomeItemInfo  index={item.index} 
                  onChange={this.updateHomeItemInfo}
                  onDelete={this.removeHomeItemInfo}
                  number = {item.count}
                  buildingid = {item.buildingid}
                  />
              </List.Item>
            );
          }
        }
      ></List>
      <Row justify="center">
        <Col span={24}>
          <Button onClick={()=>{this.addHomeItemInfo()}}>添加家园建筑信息</Button>
        </Col>
      </Row>
      </Card>
      
    );
  }
}


/// 地板
class InputGround extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange = value => {
    console.log(value);
    this.props.onChange(value);
  };

  render() {
  return (
      <TreeSelect
      style={{ width: '100%' }}
    
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeData}
      placeholder="Please select"
      treeDefaultExpandAll
      onChange={this.onChange}
      value={this.props.groundid}
      />
  );
  }
}

class GroundInfo extends React.Component {
constructor(props) {
  super(props);
  this.idx = this.props.index;

  this.state = {
    visible: false,
  }
}

onChangeNumber = (num)=> {
  this.updateData(this.idx, "count", num);
}
onChangGroundId = (id)=> {
  this.updateData(this.idx, "groundid", id);
}

updateData(idx, key, value) {
  this.props.onChange(idx, key, value);
}


showModal = () => {
  this.setState({
    visible: true
  })
};

handleOk = () => {
  this.props.onDelete(this.idx)
  this.setState({
    visible: false
  })
};

handleCancel = () => {
  this.setState({
    visible: false
  })
};


render() {
  return(
    <>
      <InputGround groundid={this.props.groundid} onChange={this.onChangGroundId}/>
      <InputNumber value={this.props.number} min={1} max={10} onChange={this.onChangeNumber}/>
      <>
        <Button type="primary" onClick={this.showModal}>
          删除
        </Button>
        <Modal title="Basic Modal" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          确定要删除吗？
        </Modal>
      </>
    </>
  ); 
}
}

class GroundInfos extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    list : []
  }
}

addHomeItemInfo() {
  let data = this.state.list;
  let info = {
    groundid : 0,
    count : 0,
    index : data.length
  };
  data.push(info);
  this.setState({list : data});
}

removeHomeItemInfo = (idx)=> {
  let data = this.state.list;
  data.splice(idx, 1);
  data.forEach((item, idx)=>{
    item.index = idx;
  })
  this.setState({list : data});
}

updateHomeItemInfo = (idx, key, value)=> {
  let data = this.state.list
  let info = data[idx]
  if(!info) {
    console.log("[error] not found home item info", idx);
    return;
  }
  info[key] = value;
  this.setState({list : data});
}

submit = ()=> {
  GCore.submitData("grounds", this.state.list)
}

render() {
  const list = this.state.list;


  return (
    <Card>
      <List
      itemLayout="horizontal"
      dataSource = {list}
      size = "small"
      split = {false}
      renderItem = {
        (item) => {
          return (
            <List.Item>
              <HomeItemInfo  index={item.index} 
                onChange={this.updateHomeItemInfo}
                onDelete={this.removeHomeItemInfo}
                number = {item.count}
                groundid = {item.groundid}
                />
            </List.Item>
          );
        }
      }
    ></List>
    <Row justify="center">
      <Col span={24}>
        <Button onClick={()=>{this.addHomeItemInfo()}}>添加地板信息</Button>
      </Col>
    </Row>
    
    </Card>
    
  );
}
}
///////



class HomeLevel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lv: 0
    }
  }

  onChangeHomeLv = (newlv) => {
    this.setState({lv: newlv})
  }

  submit = () => {
    GCore.submitData("homelv", this.state.lv);
  }

  render() {
    return (
      <Card>
        家园等级：
        <InputNumber value={this.state.number} min={1} max={10} onChange={this.onChangeHomeLv}/>
      </Card>
    );
  }
}

class HomeRuinNumber extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    }
  }

  onChange = (number) => {
    this.setState({
      count: number,
    });
  }

  render() {
    return (
      <Card>
        家园废墟数量：
        <InputNumber value={this.state.number} min={1} max={10} onChange={this.onChangeHomeLv}/>
      </Card>
    );
  }
}

class HomeNpc extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasnpc: false,
    }
  }

  onChange = (checked)=> {
    this.setState(
      {hasnpc: checked}
    )
  }

  render() {
    return (
      <Card>
        <Row>
          <Col span={18}>是否拥有对应NPC? </Col>
          <Col span={6}>
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              onChange = {this.onChange}
            ></Switch>
          </Col>
        </Row>
      </Card>
    );
  }

}

class HomeBuildSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          visible: false, 
        };
    }

    onChangeHomeBuilds = (lv) => {

    }





    showDrawer = () => {
      this.setState({
        visible: true,
      });
    };
    onClose = () => {
      this.setState({
        visible: false,
      });
    };

    render() {
      const { visible } = this.state;
      return (
        <div>
          <Button type="primary" onClick={this.showDrawer}>
            设置家园基本信息
          </Button>
          <Drawer
            title="家园信息"
            placement={"left"}
            closable={false}
            onClose={this.onClose}
            visible={visible}
            key={"left"}
            getContainer={false}
            style={{ position: 'absolute' }}
            width={1024}
          >
            <Row>
              <Col span = {6}><HomeLevel/></Col>
              <Col span = {6}><HomeRuinNumber/></Col>
              <Col span = {6}><HomeNpc/></Col>
            </Row>
            <Row>
              <Col span={12}><HomeItemInfos/></Col>
              <Col span={12}><GroundInfos/></Col>
          </Row>
            
            
          </Drawer>
        </div>
      );
    }
}



export default HomeBuildSetting
