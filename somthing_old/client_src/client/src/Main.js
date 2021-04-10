import { Layout, Carousel} from 'antd';
import React from 'react';
import 'antd/dist/antd.css';
import BuildingSetting from "./Buildings"
import BaseScoreTable from "./BaseScoreTable"
const { Header, Content, Footer } = Layout;

const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

class SiderDemo extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
        <Layout className="layout">
    <Header>
      <p style={ {fontSize: "30px", textAlign:"center", color:"DodgerBlue"}} >家园建筑模拟器</p>
    </Header>
    
    <Content visibled={false} style={{ padding: '0 50px' }}>
        <BuildingSetting />
        <BaseScoreTable 
            basescore = {10086}
            count = {30}
            scoreLimit = {10}    
        />
    </Content>
    <Footer style={{ textAlign: 'center' }}>Dont Starve New Home</Footer>
  </Layout>
    );
  }
}

/*
<Carousel autoplay>
    <div>
      <h3 style={contentStyle}>家园建筑模拟器1.0</h3>
    </div>
    <div>
      <h3 style={contentStyle}>你好</h3>
    </div>
    <div>
      <h3 style={contentStyle}>世界</h3>
    </div>
    <div>
      <h3 style={contentStyle}>:)</h3>
    </div>
  </Carousel>
*/

export default SiderDemo