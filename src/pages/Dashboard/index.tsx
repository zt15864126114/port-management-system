import React from 'react';
import { Row, Col, Card, Statistic, Table, Space, Progress, List, Tag, Alert } from 'antd';
import {
  UserOutlined,
  CarOutlined,
  ContainerOutlined,
  SafetyCertificateOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const Dashboard: React.FC = () => {
  // 统计数据
  const statistics = {
    todayVisitors: {
      value: 156,
      change: '+12.3%',
      isIncrease: true
    },
    vehiclesInPort: {
      value: 45,
      change: '-5.2%',
      isIncrease: false
    },
    shipsInPort: {
      value: 12,
      change: '+8.5%',
      isIncrease: true
    },
    pendingDocuments: {
      value: 8,
      change: '-15.6%',
      isIncrease: false
    }
  };

  // 泊位使用情况
  const berthUsage = [
    { name: 'A区集装箱码头', total: 10, used: 8, capacity: '50000TEU' },
    { name: 'B区散货码头', total: 8, used: 5, capacity: '30000吨' },
    { name: 'C区油轮码头', total: 6, used: 4, capacity: '20000吨' },
    { name: 'D区客运码头', total: 4, used: 2, capacity: '1000人次' }
  ];

  // 今日船舶动态
  const shipMovements = [
    {
      key: '1',
      name: '远洋之星',
      type: '集装箱船',
      status: '计划进港',
      time: '10:30',
      berth: 'A3',
      cargo: '电子产品'
    },
    {
      key: '2',
      name: '海运号',
      type: '散货船',
      status: '正在装货',
      time: '11:45',
      berth: 'B2',
      cargo: '矿石'
    },
    {
      key: '3',
      name: '长江之光',
      type: '油轮',
      status: '计划出港',
      time: '14:20',
      berth: 'C1',
      cargo: '原油'
    }
  ];

  // 安全预警信息
  const warnings = [
    { type: '高危', content: '3号泊位起重机需要维护检修', time: '10分钟前' },
    { type: '中危', content: 'B区仓库温度超出警戒值', time: '30分钟前' },
    { type: '低危', content: '天气预警：未来12小时可能有大雾', time: '1小时前' }
  ];

  // 今日工作任务
  const tasks = [
    { title: '待审核船舶入港申请', count: 12, priority: '高' },
    { title: '待处理证件办理', count: 8, priority: '中' },
    { title: '待审批设备维修申请', count: 5, priority: '中' },
    { title: '待处理安全隐患', count: 3, priority: '高' }
  ];

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      {/* 重要预警信息 */}
      <Alert
        message="重要通知"
        description="今日14:00-16:00将进行码头安全演练，请各部门做好准备。"
        type="warning"
        showIcon
        banner
      />

      {/* 主要统计数据 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日访客数"
              value={statistics.todayVisitors.value}
              prefix={<UserOutlined />}
              suffix={
                <span style={{ fontSize: '14px', color: statistics.todayVisitors.isIncrease ? '#3f8600' : '#cf1322' }}>
                  {statistics.todayVisitors.isIncrease ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {statistics.todayVisitors.change}
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在港车辆"
              value={statistics.vehiclesInPort.value}
              prefix={<CarOutlined />}
              suffix={
                <span style={{ fontSize: '14px', color: statistics.vehiclesInPort.isIncrease ? '#3f8600' : '#cf1322' }}>
                  {statistics.vehiclesInPort.isIncrease ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {statistics.vehiclesInPort.change}
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在港船舶"
              value={statistics.shipsInPort.value}
              prefix={<ContainerOutlined />}
              suffix={
                <span style={{ fontSize: '14px', color: statistics.shipsInPort.isIncrease ? '#3f8600' : '#cf1322' }}>
                  {statistics.shipsInPort.isIncrease ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {statistics.shipsInPort.change}
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理证件"
              value={statistics.pendingDocuments.value}
              prefix={<SafetyCertificateOutlined />}
              valueStyle={{ color: statistics.pendingDocuments.value > 0 ? '#faad14' : '#52c41a' }}
              suffix={
                <span style={{ fontSize: '14px', color: statistics.pendingDocuments.isIncrease ? '#cf1322' : '#3f8600' }}>
                  {statistics.pendingDocuments.isIncrease ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {statistics.pendingDocuments.change}
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 泊位使用情况 */}
        <Col span={12}>
          <Card title="泊位使用情况" extra={<a href="#">详情</a>}>
            <List
              dataSource={berthUsage}
              renderItem={item => (
                <List.Item>
                  <Space style={{ width: '100%' }} direction="vertical">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{item.name}</span>
                      <Space>
                        <span>使用率: {item.used}/{item.total}</span>
                        <span>容量: {item.capacity}</span>
                      </Space>
                    </div>
                    <Progress 
                      percent={Math.round((item.used / item.total) * 100)} 
                      status={item.used / item.total > 0.8 ? 'exception' : 'normal'}
                      showInfo
                    />
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 安全预警信息 */}
        <Col span={12}>
          <Card title="安全预警信息" extra={<Tag color="red">3条待处理</Tag>}>
            <List
              dataSource={warnings}
              renderItem={item => (
                <List.Item>
                  <Space>
                    <Tag color={
                      item.type === '高危' ? 'red' : 
                      item.type === '中危' ? 'orange' : 
                      'blue'
                    }>{item.type}</Tag>
                    <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                    <span>{item.content}</span>
                    <span style={{ color: '#999' }}>{item.time}</span>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 今日工作任务 */}
        <Col span={8}>
          <Card title="今日工作任务" extra={<a href="#">全部</a>}>
            <List
              dataSource={tasks}
              renderItem={item => (
                <List.Item>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <span>{item.title}</span>
                    <Space>
                      <Tag color={item.priority === '高' ? 'red' : 'orange'}>{item.priority}</Tag>
                      <Tag color="blue">{item.count}</Tag>
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 今日船舶动态 */}
        <Col span={16}>
          <Card title="今日船舶动态" extra={<a href="#">更多</a>}>
            <Table
              dataSource={shipMovements}
              pagination={false}
              columns={[
                { title: '船名', dataIndex: 'name' },
                { title: '类型', dataIndex: 'type' },
                { 
                  title: '状态', 
                  dataIndex: 'status',
                  render: (status) => (
                    <Tag color={
                      status === '计划进港' ? 'blue' :
                      status === '正在装货' ? 'green' :
                      'orange'
                    }>{status}</Tag>
                  )
                },
                { title: '时间', dataIndex: 'time' },
                { title: '泊位', dataIndex: 'berth' },
                { title: '货物', dataIndex: 'cargo' },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default Dashboard; 