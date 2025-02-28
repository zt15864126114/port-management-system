import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  DatePicker,
  Modal,
  Form,
  Row,
  Col,
  Tabs,
  Alert,
  Badge,
  Statistic,
  List,
  Timeline,
  Descriptions,
  Progress
} from 'antd';
import {
  ContainerOutlined,
  SearchOutlined,
  PlusOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  AimOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';

// 类型定义
type ShipStatus = '在港' | '预计到达' | '已离港' | '延误' | '取消';
type ShipType = '集装箱船' | '散货船' | '油轮' | '客轮' | '其他';
type BerthStatus = '空闲' | '占用' | '维护' | '预留';
type CargoType = '集装箱' | '散货' | '液体货物' | '件杂货' | '其他';

interface ShipRecord {
  key: string;
  shipName: string;
  shipId: string;
  type: ShipType;
  nationality: string;
  length: number;
  tonnage: number;
  company: string;
  captain: string;
  contactPhone: string;
  arrivalTime?: string;
  departureTime?: string;
  berth?: string;
  status: ShipStatus;
  cargoType: CargoType;
  cargoVolume?: number;
  loadingProgress?: number;
  notes?: string;
}

interface BerthRecord {
  key: string;
  berthId: string;
  name: string;
  length: number;
  depth: number;
  status: BerthStatus;
  currentShip?: string;
  nextShip?: string;
  maintenanceTime?: string;
  lastMaintenance?: string;
}

// 状态颜色映射
const statusColors: Record<ShipStatus, string> = {
  '在港': 'processing',
  '预计到达': 'warning',
  '已离港': 'default',
  '延误': 'error',
  '取消': 'error'
};

const berthStatusColors: Record<BerthStatus, string> = {
  '空闲': 'success',
  '占用': 'processing',
  '维护': 'warning',
  '预留': 'default'
};

const ShipManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ships');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 示例数据
  const shipData: ShipRecord[] = [
    {
      key: '1',
      shipName: 'COSCO SHIPPING PISCES',
      shipId: 'IMO9784271',
      type: '集装箱船',
      nationality: '中国香港',
      length: 400,
      tonnage: 198000,
      company: '中远海运集装箱运输有限公司',
      captain: 'Captain Li',
      contactPhone: '+86 13812345678',
      arrivalTime: '2024-03-15 10:00',
      departureTime: '2024-03-16 18:00',
      berth: 'A3',
      status: '在港',
      cargoType: '集装箱',
      cargoVolume: 20000,
      loadingProgress: 45,
      notes: '正常装卸作业中'
    },
    {
      key: '2',
      shipName: 'MAERSK SEMARANG',
      shipId: 'IMO9632179',
      type: '集装箱船',
      nationality: '丹麦',
      length: 366,
      tonnage: 152000,
      company: 'Maersk Line',
      captain: 'Captain Jensen',
      contactPhone: '+45 12345678',
      arrivalTime: '2024-03-16 08:00',
      status: '预计到达',
      cargoType: '集装箱',
      cargoVolume: 15000
    },
    {
      key: '3',
      shipName: 'BULK FORTUNE',
      shipId: 'IMO9534066',
      type: '散货船',
      nationality: '巴拿马',
      length: 225,
      tonnage: 82000,
      company: 'Pacific Basin Shipping',
      captain: 'Captain Smith',
      contactPhone: '+1 987654321',
      arrivalTime: '2024-03-14 15:00',
      departureTime: '2024-03-15 09:00',
      berth: 'B2',
      status: '已离港',
      cargoType: '散货',
      cargoVolume: 75000,
      loadingProgress: 100
    }
  ];

  const berthData: BerthRecord[] = [
    {
      key: '1',
      berthId: 'A1',
      name: '集装箱专用泊位1号',
      length: 400,
      depth: 16,
      status: '空闲',
      nextShip: 'MAERSK SEMARANG',
      lastMaintenance: '2024-02-15'
    },
    {
      key: '2',
      berthId: 'A2',
      name: '集装箱专用泊位2号',
      length: 400,
      depth: 16,
      status: '维护',
      maintenanceTime: '2024-03-15至2024-03-17',
      lastMaintenance: '2023-09-15'
    },
    {
      key: '3',
      berthId: 'A3',
      name: '集装箱专用泊位3号',
      length: 400,
      depth: 16,
      status: '占用',
      currentShip: 'COSCO SHIPPING PISCES',
      lastMaintenance: '2024-01-20'
    }
  ];

  // 船舶表格列定义
  const shipColumns = [
    {
      title: '船名',
      dataIndex: 'shipName',
      key: 'shipName',
      render: (text: string, record: ShipRecord) => (
        <span>
          {text}
          <div style={{ color: '#999', fontSize: '12px' }}>IMO: {record.shipId}</div>
        </span>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '船籍',
      dataIndex: 'nationality',
      key: 'nationality',
    },
    {
      title: '泊位',
      dataIndex: 'berth',
      key: 'berth',
    },
    {
      title: '到港时间',
      dataIndex: 'arrivalTime',
      key: 'arrivalTime',
    },
    {
      title: '离港时间',
      dataIndex: 'departureTime',
      key: 'departureTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: ShipStatus) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: '作业进度',
      dataIndex: 'loadingProgress',
      key: 'loadingProgress',
      render: (progress: number) => (
        progress ? <Progress percent={progress} size="small" /> : '-'
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: ShipRecord) => (
        <Space>
          <Button type="link">详情</Button>
          {record.status === '在港' && <Button type="link">作业管理</Button>}
          {record.status === '预计到达' && <Button type="link">安排泊位</Button>}
        </Space>
      ),
    },
  ];

  // 泊位表格列定义
  const berthColumns = [
    {
      title: '泊位编号',
      dataIndex: 'berthId',
      key: 'berthId',
    },
    {
      title: '泊位名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '长度(m)',
      dataIndex: 'length',
      key: 'length',
    },
    {
      title: '水深(m)',
      dataIndex: 'depth',
      key: 'depth',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: BerthStatus) => (
        <Tag color={berthStatusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: '当前船舶',
      dataIndex: 'currentShip',
      key: 'currentShip',
    },
    {
      title: '下一艘船',
      dataIndex: 'nextShip',
      key: 'nextShip',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: BerthRecord) => (
        <Space>
          <Button type="link">详情</Button>
          {record.status === '空闲' && <Button type="link">安排船舶</Button>}
          {record.status !== '维护' && <Button type="link">维护管理</Button>}
        </Space>
      ),
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: 'ships',
      label: (
        <span>
          <ContainerOutlined />
          船舶管理
        </span>
      ),
      children: (
        <>
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder="搜索船名/IMO号"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部类型</Select.Option>
              <Select.Option value="container">集装箱船</Select.Option>
              <Select.Option value="bulk">散货船</Select.Option>
              <Select.Option value="tanker">油轮</Select.Option>
            </Select>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部状态</Select.Option>
              <Select.Option value="inPort">在港</Select.Option>
              <Select.Option value="expected">预计到达</Select.Option>
              <Select.Option value="departed">已离港</Select.Option>
            </Select>
            <DatePicker.RangePicker style={{ width: 300 }} />
            <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
          </Space>
          <Table 
            columns={shipColumns} 
            dataSource={shipData}
            expandable={{
              expandedRowRender: (record) => (
                <Descriptions size="small" column={4}>
                  <Descriptions.Item label="总吨位">{record.tonnage} GT</Descriptions.Item>
                  <Descriptions.Item label="船长">{record.length} m</Descriptions.Item>
                  <Descriptions.Item label="船长">{record.captain}</Descriptions.Item>
                  <Descriptions.Item label="联系电话">{record.contactPhone}</Descriptions.Item>
                  <Descriptions.Item label="货物类型">{record.cargoType}</Descriptions.Item>
                  {record.cargoVolume && <Descriptions.Item label="货物量">{record.cargoVolume} TEU</Descriptions.Item>}
                  <Descriptions.Item label="船公司">{record.company}</Descriptions.Item>
                  {record.notes && <Descriptions.Item label="备注">{record.notes}</Descriptions.Item>}
                </Descriptions>
              ),
            }}
          />
        </>
      ),
    },
    {
      key: 'berths',
      label: (
        <span>
          <AimOutlined />
          泊位管理
        </span>
      ),
      children: (
        <>
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder="搜索泊位编号/名称"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部状态</Select.Option>
              <Select.Option value="free">空闲</Select.Option>
              <Select.Option value="occupied">占用</Select.Option>
              <Select.Option value="maintenance">维护</Select.Option>
            </Select>
            <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
          </Space>
          <Table columns={berthColumns} dataSource={berthData} />
        </>
      ),
    },
    {
      key: 'schedule',
      label: (
        <span>
          <ClockCircleOutlined />
          靠泊计划
        </span>
      ),
      children: (
        <Timeline
          mode="left"
          items={[
            {
              label: '2024-03-15 10:00',
              children: (
                <Card size="small" title="COSCO SHIPPING PISCES">
                  <p>泊位：A3</p>
                  <p>预计作业时间：32小时</p>
                  <p>货物：集装箱 20000 TEU</p>
                </Card>
              ),
            },
            {
              label: '2024-03-16 08:00',
              children: (
                <Card size="small" title="MAERSK SEMARANG">
                  <p>泊位：A1</p>
                  <p>预计作业时间：24小时</p>
                  <p>货物：集装箱 15000 TEU</p>
                </Card>
              ),
            },
            {
              label: '2024-03-17 14:00',
              children: (
                <Card size="small" title="EVERGREEN EVER GIVEN">
                  <p>泊位：A3</p>
                  <p>预计作业时间：36小时</p>
                  <p>货物：集装箱 18000 TEU</p>
                </Card>
              ),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      {/* 重要提醒 */}
      <Alert
        message="船舶动态"
        description="今日预计到港3艘，离港2艘。A2泊位正在进行维护。"
        type="warning"
        showIcon
      />

      {/* 统计数据 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="在港船舶"
              value={5}
              prefix={<ContainerOutlined />}
              suffix="艘"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日计划"
              value={8}
              prefix={<ClockCircleOutlined />}
              suffix="艘"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="泊位利用率"
              value={85.7}
              prefix={<SafetyCertificateOutlined />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="作业效率"
              value={95.2}
              prefix={<ThunderboltOutlined />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容区 */}
      <Card
        title="船舶管理"
        extra={
          <Space>
            <Badge count={2} offset={[10, 0]}>
              <Button icon={<AlertOutlined />}>异常情况</Button>
            </Badge>
            <Button type="primary" icon={<PlusOutlined />}>新增船舶</Button>
          </Space>
        }
      >
        <Tabs
          defaultActiveKey="ships"
          items={items}
          onChange={(key) => setActiveTab(key)}
        />
      </Card>
    </Space>
  );
};

export default ShipManagement; 