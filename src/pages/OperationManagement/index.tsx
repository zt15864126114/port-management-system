import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Space, DatePicker, Button, Select, Progress } from 'antd';
import {
  DollarOutlined,
  ShoppingOutlined,
  TeamOutlined,
  FieldTimeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface OperationRecord {
  key: string;
  time: string;
  type: string;
  status: string;
  operator: string;
  location: string;
  efficiency: number;
  cost: number;
  details: string;
}

const { Option } = Select;
const { RangePicker } = DatePicker;

const OperationManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const statisticCards = [
    {
      title: '今日营收',
      value: 234567,
      prefix: <DollarOutlined />,
      valueStyle: { color: '#3f8600' },
      suffix: '元',
      description: '较昨日 +12.5%',
      descriptionStyle: { color: '#3f8600' },
      icon: <ArrowUpOutlined />,
    },
    {
      title: '货物吞吐量',
      value: 1234,
      prefix: <ShoppingOutlined />,
      valueStyle: { color: '#1890ff' },
      suffix: '吨',
      description: '较昨日 +5.8%',
      descriptionStyle: { color: '#3f8600' },
      icon: <ArrowUpOutlined />,
    },
    {
      title: '在港船只',
      value: 45,
      prefix: <TeamOutlined />,
      valueStyle: { color: '#722ed1' },
      suffix: '艘',
      description: '较昨日 -2.2%',
      descriptionStyle: { color: '#cf1322' },
      icon: <ArrowDownOutlined />,
    },
    {
      title: '平均停靠时间',
      value: 12.5,
      prefix: <FieldTimeOutlined />,
      valueStyle: { color: '#eb2f96' },
      suffix: '小时',
      description: '较昨日 -8.3%',
      descriptionStyle: { color: '#3f8600' },
      icon: <ArrowDownOutlined />,
    },
  ];

  const columns: ColumnsType<OperationRecord> = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 120,
    },
    {
      title: '效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      width: 150,
      render: (efficiency: number) => (
        <Progress percent={efficiency} size="small" status={efficiency >= 90 ? 'success' : efficiency >= 70 ? 'normal' : 'exception'} />
      ),
    },
    {
      title: '成本',
      dataIndex: 'cost',
      key: 'cost',
      width: 120,
      render: (cost: number) => `¥${cost.toLocaleString()}`,
    },
    {
      title: '详情',
      dataIndex: 'details',
      key: 'details',
      width: 200,
    },
  ];

  const operationData: OperationRecord[] = [
    {
      key: '1',
      time: '2024-03-15 14:30',
      type: '货物装卸',
      status: '进行中',
      operator: '张三',
      location: 'A区码头',
      efficiency: 95,
      cost: 12500,
      details: '集装箱装卸作业',
    },
    {
      key: '2',
      time: '2024-03-15 13:20',
      type: '船舶维修',
      status: '已完成',
      operator: '李四',
      location: 'B区维修站',
      efficiency: 88,
      cost: 45000,
      details: '常规维护保养',
    },
    {
      key: '3',
      time: '2024-03-15 12:00',
      type: '安全检查',
      status: '已完成',
      operator: '王五',
      location: 'C区仓库',
      efficiency: 92,
      cost: 3000,
      details: '危险品存储检查',
    },
    {
      key: '4',
      time: '2024-03-15 11:30',
      type: '货物清关',
      status: '待处理',
      operator: '赵六',
      location: '海关大厅',
      efficiency: 75,
      cost: 8000,
      details: '进口货物清关手续',
    },
    {
      key: '5',
      time: '2024-03-15 10:15',
      type: '设备维护',
      status: '已完成',
      operator: '孙七',
      location: 'D区机房',
      efficiency: 98,
      cost: 15000,
      details: '起重机例行检修',
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Row gutter={16}>
        {statisticCards.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                precision={2}
                valueStyle={stat.valueStyle}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
              <div style={{ marginTop: 8, fontSize: 14 }}>
                <span style={stat.descriptionStyle}>
                  {stat.icon} {stat.description}
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="运营效率分析" extra={
        <Space>
          <RangePicker />
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">全部类型</Option>
            <Option value="loading">装卸作业</Option>
            <Option value="repair">维修保养</Option>
            <Option value="inspection">安全检查</Option>
            <Option value="customs">清关手续</Option>
          </Select>
          <Button type="primary" icon={<ReloadOutlined />}>刷新</Button>
        </Space>
      }>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="平均作业效率"
                value={89.6}
                suffix="%"
                precision={1}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="平均作业成本"
                value={16700}
                prefix="¥"
                precision={0}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="完成率"
                value={94.3}
                suffix="%"
                precision={1}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>

        <Table<OperationRecord>
          columns={columns}
          dataSource={operationData}
          loading={loading}
          pagination={{
            total: 100,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </Space>
  );
};

export default OperationManagement; 