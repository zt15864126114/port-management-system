import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  FileProtectOutlined,
  LoginOutlined,
  EnvironmentOutlined,
  ContainerOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/document-process',
      icon: <FileProtectOutlined />,
      label: '证件办理',
    },
    {
      key: '/port-access',
      icon: <LoginOutlined />,
      label: '码头出入管理',
    },
    {
      key: '/ground-activity',
      icon: <EnvironmentOutlined />,
      label: '陆地活动管理',
    },
    {
      key: '/ship-management',
      icon: <ContainerOutlined />,
      label: '船舶管理',
    },
    {
      key: '/maritime-management',
      icon: <SafetyCertificateOutlined />,
      label: '海事管理',
    },
    {
      key: '/operation-management',
      icon: <BarChartOutlined />,
      label: '运营管理',
    },
    {
      key: '/immigration',
      icon: <IdcardOutlined />,
      label: '移民边检检验检疫',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/']}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
            style: { fontSize: '18px', padding: '0 24px', cursor: 'pointer' },
          })}
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 