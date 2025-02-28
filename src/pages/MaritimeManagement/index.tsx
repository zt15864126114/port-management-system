import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Input, Select, DatePicker, Modal, Form, Row, Col, Tabs, Alert, Badge, Statistic, List } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  WarningOutlined, 
  SafetyCertificateOutlined,
  CompassOutlined,
  ThunderboltOutlined,
  AlertOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';

type MaritimeLevel = '紧急' | '严重' | '中度' | '轻微';
type MaritimeStatus = '待处理' | '处理中' | '已完成';

interface MaritimeRecord {
  key: string;
  type: string;
  location: string;
  time: string;
  level: MaritimeLevel;
  status: MaritimeStatus;
  handler: string;
  description: string;
}

interface WeatherInfo {
  time: string;
  windDirection: string;
  windForce: string;
  visibility: string;
  waveHeight: string;
  temperature: string;
  warning?: string;
}

interface ChannelStatus {
  name: string;
  status: string;
  ships: number;
  warning?: string;
  lastUpdate: string;
}

type LevelColorMap = {
  [K in MaritimeLevel]: string;
};

type StatusColorMap = {
  [K in MaritimeStatus]: string;
};

const { Option } = Select;

const MaritimeManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('channel');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const levelColors: LevelColorMap = {
    '紧急': 'red',
    '严重': 'orange',
    '中度': 'yellow',
    '轻微': 'green'
  };

  const statusColors: StatusColorMap = {
    '待处理': 'error',
    '处理中': 'processing',
    '已完成': 'success'
  };

  // 海事记录数据
  const maritimeData: MaritimeRecord[] = [
    {
      key: '1',
      type: '航道拥堵',
      location: '主航道3号段',
      time: '2024-03-15 08:30',
      level: '中度',
      status: '处理中',
      handler: '张队长',
      description: '因船舶密度过大导致航道拥堵'
    },
    {
      key: '2',
      type: '设备故障',
      location: 'B区灯塔',
      time: '2024-03-15 09:15',
      level: '严重',
      status: '待处理',
      handler: '李工程师',
      description: '灯塔信号异常'
    },
    {
      key: '3',
      type: '海上救援',
      location: '锚地A2',
      time: '2024-03-15 10:00',
      level: '紧急',
      status: '已完成',
      handler: '王队长',
      description: '渔船故障救援'
    }
  ];

  // 天气信息
  const weatherInfo: WeatherInfo[] = [
    {
      time: '08:00',
      windDirection: '东北风',
      windForce: '5级',
      visibility: '10海里',
      waveHeight: '1.5米',
      temperature: '22℃'
    },
    {
      time: '12:00',
      windDirection: '东风',
      windForce: '6级',
      visibility: '8海里',
      waveHeight: '2.0米',
      temperature: '24℃',
      warning: '大风预警'
    },
    {
      time: '16:00',
      windDirection: '东南风',
      windForce: '4级',
      visibility: '12海里',
      waveHeight: '1.2米',
      temperature: '23℃'
    }
  ];

  // 航道状态
  const channelStatus: ChannelStatus[] = [
    {
      name: '主航道',
      status: '通畅',
      ships: 5,
      lastUpdate: '5分钟前'
    },
    {
      name: '副航道A',
      status: '拥堵',
      ships: 8,
      warning: '船舶密度过大',
      lastUpdate: '3分钟前'
    },
    {
      name: '副航道B',
      status: '维护中',
      ships: 0,
      warning: '例行维护',
      lastUpdate: '10分钟前'
    }
  ];

  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: MaritimeLevel) => (
        <Tag color={levelColors[level]}>{level}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: MaritimeStatus) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: '处理人',
      dataIndex: 'handler',
      key: 'handler',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: MaritimeRecord) => (
        <Space>
          <Button type="link">详情</Button>
          {record.status !== '已完成' && (
            <Button type="link">处理</Button>
          )}
        </Space>
      ),
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: 'channel',
      label: (
        <span>
          <CompassOutlined />
          航道管理
        </span>
      ),
      children: (
        <Row gutter={16}>
          <Col span={16}>
            <Card title="航道状态监控">
              <List
                dataSource={channelStatus}
                renderItem={item => (
                  <List.Item>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Space>
                        <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                        <Tag color={
                          item.status === '通畅' ? 'green' :
                          item.status === '拥堵' ? 'red' :
                          'orange'
                        }>{item.status}</Tag>
                      </Space>
                      <Space>
                        <span>在航船舶: {item.ships}艘</span>
                        {item.warning && <Tag color="red">{item.warning}</Tag>}
                        <span style={{ color: '#999' }}>更新于 {item.lastUpdate}</span>
                      </Space>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="天气信息">
              <List
                dataSource={weatherInfo}
                renderItem={item => (
                  <List.Item>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                        <span style={{ fontWeight: 'bold' }}>{item.time}</span>
                        {item.warning && <Tag color="red">{item.warning}</Tag>}
                      </Space>
                      <Space wrap>
                        <Tag>{item.windDirection}</Tag>
                        <Tag>{item.windForce}</Tag>
                        <Tag>能见度 {item.visibility}</Tag>
                        <Tag>浪高 {item.waveHeight}</Tag>
                        <Tag>{item.temperature}</Tag>
                      </Space>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'incidents',
      label: (
        <span>
          <AlertOutlined />
          海事记录
        </span>
      ),
      children: (
        <>
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder="搜索类型/位置"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Select defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部类型</Option>
              <Option value="traffic">航道拥堵</Option>
              <Option value="equipment">设备故障</Option>
              <Option value="rescue">海上救援</Option>
            </Select>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部等级</Option>
              <Option value="emergency">紧急</Option>
              <Option value="serious">严重</Option>
              <Option value="moderate">中度</Option>
            </Select>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部状态</Option>
              <Option value="pending">待处理</Option>
              <Option value="processing">处理中</Option>
              <Option value="completed">已完成</Option>
            </Select>
            <DatePicker.RangePicker style={{ width: 300 }} />
            <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
          </Space>
          <Table
            columns={columns}
            dataSource={maritimeData}
            scroll={{ x: 1500 }}
          />
        </>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      {/* 重要提醒 */}
      <Alert
        message="海事预警"
        description="今日14:00-18:00预计有大风天气，风力可达7-8级，请各船只注意安全。"
        type="warning"
        showIcon
      />

      {/* 统计数据 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="在航船舶"
              value={13}
              prefix={<CompassOutlined />}
              suffix="艘"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日海事事件"
              value={5}
              prefix={<AlertOutlined />}
              suffix="起"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理事件"
              value={2}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#cf1322' }}
              suffix="起"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="航道通畅率"
              value={92.5}
              prefix={<SafetyCertificateOutlined />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容区 */}
      <Card
        title="海事管理"
        extra={
          <Space>
            <Badge count={2} offset={[10, 0]}>
              <Button icon={<WarningOutlined />}>紧急事件</Button>
            </Badge>
            <Button type="primary" icon={<PlusOutlined />}>新增记录</Button>
          </Space>
        }
      >
        <Tabs
          defaultActiveKey="channel"
          items={items}
          onChange={(key) => setActiveTab(key)}
        />
      </Card>
    </Space>
  );
};

export default MaritimeManagement; 