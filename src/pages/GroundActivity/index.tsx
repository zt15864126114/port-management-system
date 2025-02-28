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
  Progress,
  Descriptions
} from 'antd';
import {
  CarOutlined,
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  ToolOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';

// 类型定义
type ActivityStatus = '进行中' | '已完成' | '已取消' | '待开始' | '异常';
type VehicleType = '叉车' | '牵引车' | '装载机' | '平板车' | '其他';
type AreaType = '集装箱区' | '散货区' | '仓储区' | '堆场' | '维修区';

interface VehicleRecord {
  key: string;
  plateNumber: string;
  type: VehicleType;
  driver: string;
  phone: string;
  company: string;
  area: AreaType;
  task: string;
  startTime: string;
  endTime?: string;
  status: ActivityStatus;
  mileage?: number;
  fuelConsumption?: number;
  maintenanceDate?: string;
  notes?: string;
}

interface PersonnelRecord {
  key: string;
  name: string;
  workerId: string;
  position: string;
  department: string;
  area: AreaType;
  task: string;
  startTime: string;
  endTime?: string;
  status: ActivityStatus;
  supervisor?: string;
  equipment?: string[];
  safetyCheck?: boolean;
  notes?: string;
}

// 状态颜色映射
const statusColors: Record<ActivityStatus, string> = {
  '进行中': 'processing',
  '已完成': 'success',
  '已取消': 'default',
  '待开始': 'warning',
  '异常': 'error'
};

const GroundActivity: React.FC = () => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 示例数据
  const vehicleData: VehicleRecord[] = [
    {
      key: '1',
      plateNumber: '港机001',
      type: '叉车',
      driver: '张师傅',
      phone: '13812345678',
      company: '港口物流公司',
      area: '集装箱区',
      task: '集装箱搬运',
      startTime: '2024-03-15 08:00',
      status: '进行中',
      mileage: 12.5,
      fuelConsumption: 15.8,
      maintenanceDate: '2024-02-28',
      notes: '正常作业中'
    },
    {
      key: '2',
      plateNumber: '港机002',
      type: '牵引车',
      driver: '李师傅',
      phone: '13987654321',
      company: '远洋物流',
      area: '散货区',
      task: '货物运输',
      startTime: '2024-03-15 09:00',
      endTime: '2024-03-15 11:00',
      status: '已完成',
      mileage: 8.3,
      fuelConsumption: 12.5,
      maintenanceDate: '2024-03-10'
    },
    {
      key: '3',
      plateNumber: '港机003',
      type: '装载机',
      driver: '王师傅',
      phone: '13765432100',
      company: '港口物流公司',
      area: '堆场',
      task: '散货装载',
      startTime: '2024-03-15 10:00',
      status: '异常',
      mileage: 5.2,
      fuelConsumption: 18.2,
      maintenanceDate: '2024-03-05',
      notes: '设备故障维修中'
    }
  ];

  const personnelData: PersonnelRecord[] = [
    {
      key: '1',
      name: '张三',
      workerId: 'W2024001',
      position: '装卸工',
      department: '作业一组',
      area: '集装箱区',
      task: '集装箱装卸',
      startTime: '2024-03-15 08:00',
      status: '进行中',
      supervisor: '李组长',
      equipment: ['安全帽', '对讲机', '作业工具'],
      safetyCheck: true
    },
    {
      key: '2',
      name: '李四',
      workerId: 'W2024002',
      position: '叉车工',
      department: '机械组',
      area: '仓储区',
      task: '货物搬运',
      startTime: '2024-03-15 09:00',
      endTime: '2024-03-15 12:00',
      status: '已完成',
      supervisor: '王组长',
      equipment: ['安全帽', '防护手套', '叉车钥匙'],
      safetyCheck: true
    }
  ];

  // 车辆表格列定义
  const vehicleColumns = [
    {
      title: '车牌号',
      dataIndex: 'plateNumber',
      key: 'plateNumber',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '驾驶员',
      dataIndex: 'driver',
      key: 'driver',
      render: (text: string, record: VehicleRecord) => (
        <span>
          {text}
          <div style={{ color: '#999', fontSize: '12px' }}>{record.phone}</div>
        </span>
      ),
    },
    {
      title: '作业区域',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: '任务',
      dataIndex: 'task',
      key: 'task',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: ActivityStatus) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: VehicleRecord) => (
        <Space>
          <Button type="link">详情</Button>
          {record.status === '进行中' && <Button type="link">结束任务</Button>}
          {record.status === '异常' && <Button type="link" danger>处理异常</Button>}
        </Space>
      ),
    },
  ];

  // 人员表格列定义
  const personnelColumns = [
    {
      title: '工号',
      dataIndex: 'workerId',
      key: 'workerId',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      render: (text: string, record: PersonnelRecord) => (
        <span>
          {text}
          <div style={{ color: '#999', fontSize: '12px' }}>{record.department}</div>
        </span>
      ),
    },
    {
      title: '作业区域',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: '任务',
      dataIndex: 'task',
      key: 'task',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: ActivityStatus) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: '安全检查',
      dataIndex: 'safetyCheck',
      key: 'safetyCheck',
      render: (checked: boolean) => (
        <Tag color={checked ? 'success' : 'error'}>
          {checked ? '已检查' : '未检查'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: PersonnelRecord) => (
        <Space>
          <Button type="link">详情</Button>
          {record.status === '进行中' && <Button type="link">结束任务</Button>}
        </Space>
      ),
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: 'vehicles',
      label: (
        <span>
          <CarOutlined />
          车辆作业
        </span>
      ),
      children: (
        <>
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder="搜索车牌号/驾驶员"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部类型</Select.Option>
              <Select.Option value="forklift">叉车</Select.Option>
              <Select.Option value="tractor">牵引车</Select.Option>
              <Select.Option value="loader">装载机</Select.Option>
            </Select>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部区域</Select.Option>
              <Select.Option value="container">集装箱区</Select.Option>
              <Select.Option value="bulk">散货区</Select.Option>
              <Select.Option value="storage">仓储区</Select.Option>
            </Select>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部状态</Select.Option>
              <Select.Option value="working">进行中</Select.Option>
              <Select.Option value="completed">已完成</Select.Option>
              <Select.Option value="abnormal">异常</Select.Option>
            </Select>
            <DatePicker.RangePicker style={{ width: 300 }} />
            <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
          </Space>
          <Table 
            columns={vehicleColumns} 
            dataSource={vehicleData}
            expandable={{
              expandedRowRender: (record) => (
                <Descriptions size="small" column={4}>
                  <Descriptions.Item label="里程">{record.mileage} km</Descriptions.Item>
                  <Descriptions.Item label="油耗">{record.fuelConsumption} L</Descriptions.Item>
                  <Descriptions.Item label="上次保养">{record.maintenanceDate}</Descriptions.Item>
                  {record.notes && <Descriptions.Item label="备注">{record.notes}</Descriptions.Item>}
                </Descriptions>
              ),
            }}
          />
        </>
      ),
    },
    {
      key: 'personnel',
      label: (
        <span>
          <UserOutlined />
          人员作业
        </span>
      ),
      children: (
        <>
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder="搜索工号/姓名"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部部门</Select.Option>
              <Select.Option value="team1">作业一组</Select.Option>
              <Select.Option value="team2">作业二组</Select.Option>
              <Select.Option value="mechanical">机械组</Select.Option>
            </Select>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部区域</Select.Option>
              <Select.Option value="container">集装箱区</Select.Option>
              <Select.Option value="bulk">散货区</Select.Option>
              <Select.Option value="storage">仓储区</Select.Option>
            </Select>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部状态</Select.Option>
              <Select.Option value="working">进行中</Select.Option>
              <Select.Option value="completed">已完成</Select.Option>
            </Select>
            <DatePicker.RangePicker style={{ width: 300 }} />
            <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
          </Space>
          <Table 
            columns={personnelColumns} 
            dataSource={personnelData}
            expandable={{
              expandedRowRender: (record) => (
                <Descriptions size="small" column={3}>
                  <Descriptions.Item label="主管">{record.supervisor}</Descriptions.Item>
                  <Descriptions.Item label="配备设备">
                    {record.equipment?.map((item, index) => (
                      <Tag key={index}>{item}</Tag>
                    ))}
                  </Descriptions.Item>
                  {record.notes && <Descriptions.Item label="备注">{record.notes}</Descriptions.Item>}
                </Descriptions>
              ),
            }}
          />
        </>
      ),
    },
    {
      key: 'statistics',
      label: (
        <span>
          <EnvironmentOutlined />
          区域统计
        </span>
      ),
      children: (
        <Row gutter={16}>
          <Col span={16}>
            <Card title="区域作业情况">
              <Table
                size="small"
                dataSource={[
                  { area: '集装箱区', vehicles: 8, personnel: 12, tasks: 5 },
                  { area: '散货区', vehicles: 5, personnel: 8, tasks: 3 },
                  { area: '仓储区', vehicles: 4, personnel: 6, tasks: 2 },
                  { area: '堆场', vehicles: 3, personnel: 4, tasks: 2 },
                  { area: '维修区', vehicles: 2, personnel: 3, tasks: 1 },
                ]}
                columns={[
                  { title: '区域', dataIndex: 'area' },
                  { title: '在用车辆', dataIndex: 'vehicles' },
                  { title: '作业人员', dataIndex: 'personnel' },
                  { title: '进行中任务', dataIndex: 'tasks' },
                ]}
                pagination={false}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="设备状态">
              <List
                size="small"
                dataSource={[
                  { title: '在用车辆', value: '22台', status: 'normal' },
                  { title: '维修中', value: '3台', status: 'warning' },
                  { title: '待检查', value: '2台', status: 'processing' },
                  { title: '报废待处理', value: '1台', status: 'error' },
                ]}
                renderItem={item => (
                  <List.Item>
                    <Space>
                      <Tag color={
                        item.status === 'normal' ? 'success' :
                        item.status === 'warning' ? 'warning' :
                        item.status === 'processing' ? 'processing' :
                        'error'
                      }>{item.title}</Tag>
                      <span style={{ fontWeight: 'bold' }}>{item.value}</span>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      {/* 重要提醒 */}
      <Alert
        message="作业提醒"
        description="3台车辆需要进行例行保养，2名作业人员安全证书即将到期。"
        type="warning"
        showIcon
      />

      {/* 统计数据 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="在用车辆"
              value={22}
              prefix={<CarOutlined />}
              suffix="台"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="作业人员"
              value={33}
              prefix={<UserOutlined />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="进行中任务"
              value={13}
              prefix={<ClockCircleOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备完好率"
              value={92.3}
              prefix={<ToolOutlined />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容区 */}
      <Card
        title="陆地活动管理"
        extra={
          <Space>
            <Badge count={3} offset={[10, 0]}>
              <Button icon={<AlertOutlined />}>异常记录</Button>
            </Badge>
            <Button type="primary" icon={<PlusOutlined />}>新增作业</Button>
          </Space>
        }
      >
        <Tabs
          defaultActiveKey="vehicles"
          items={items}
          onChange={(key) => setActiveTab(key)}
        />
      </Card>
    </Space>
  );
};

export default GroundActivity; 