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
  Progress,
  Timeline
} from 'antd';
import {
  ToolOutlined,
  ScheduleOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';

// 类型定义
type OperationStatus = '未开始' | '进行中' | '已完成' | '已取消';
type EquipmentStatus = '正常' | '维护中' | '故障' | '待检修';
type ShiftType = '早班' | '中班' | '晚班';

interface OperationRecord {
  key: string;
  name: string;
  type: string;
  location: string;
  startTime: string;
  endTime: string;
  status: OperationStatus;
  supervisor: string;
  workers: number;
  progress: number;
}

interface EquipmentRecord {
  key: string;
  name: string;
  code: string;
  type: string;
  status: EquipmentStatus;
  lastMaintenance: string;
  nextMaintenance: string;
  operator: string;
  location: string;
}

interface ShiftRecord {
  key: string;
  date: string;
  shift: ShiftType;
  area: string;
  leader: string;
  workers: string[];
  tasks: string[];
  status: '已安排' | '进行中' | '已完成';
}

// 状态颜色映射
const statusColors: Record<OperationStatus, string> = {
  '未开始': 'default',
  '进行中': 'processing',
  '已完成': 'success',
  '已取消': 'error'
};

const equipmentStatusColors: Record<EquipmentStatus, string> = {
  '正常': 'success',
  '维护中': 'processing',
  '故障': 'error',
  '待检修': 'warning'
};

const OperationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 示例数据
  const operationData: OperationRecord[] = [
    {
      key: '1',
      name: '集装箱装卸',
      type: '装卸作业',
      location: 'A3泊位',
      startTime: '2024-03-15 08:00',
      endTime: '2024-03-15 16:00',
      status: '进行中',
      supervisor: '张工',
      workers: 8,
      progress: 65
    },
    {
      key: '2',
      name: '散货清理',
      type: '清理作业',
      location: 'B2仓库',
      startTime: '2024-03-15 09:00',
      endTime: '2024-03-15 12:00',
      status: '已完成',
      supervisor: '李工',
      workers: 5,
      progress: 100
    }
  ];

  const equipmentData: EquipmentRecord[] = [
    {
      key: '1',
      name: '门式起重机',
      code: 'QZJ-001',
      type: '起重设备',
      status: '正常',
      lastMaintenance: '2024-02-28',
      nextMaintenance: '2024-03-28',
      operator: '王师傅',
      location: 'A区'
    },
    {
      key: '2',
      name: '叉车',
      code: 'CF-002',
      type: '运输设备',
      status: '维护中',
      lastMaintenance: '2024-03-14',
      nextMaintenance: '2024-04-14',
      operator: '李师傅',
      location: 'B区'
    }
  ];

  const shiftData: ShiftRecord[] = [
    {
      key: '1',
      date: '2024-03-15',
      shift: '早班',
      area: 'A区装卸区',
      leader: '张组长',
      workers: ['工人1', '工人2', '工人3', '工人4'],
      tasks: ['集装箱装卸', '设备检查'],
      status: '进行中'
    }
  ];

  // 表格列定义
  const operationColumns = [
    {
      title: '作业名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
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
      render: (status: OperationStatus) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: OperationRecord) => (
        <Space>
          <Button type="link">详情</Button>
          <Button type="link">更新</Button>
        </Space>
      ),
    },
  ];

  const equipmentColumns = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '设备编号',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: EquipmentStatus) => (
        <Tag color={equipmentStatusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: '上次维护',
      dataIndex: 'lastMaintenance',
      key: 'lastMaintenance',
    },
    {
      title: '下次维护',
      dataIndex: 'nextMaintenance',
      key: 'nextMaintenance',
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: EquipmentRecord) => (
        <Space>
          <Button type="link">维护记录</Button>
          <Button type="link">报修</Button>
        </Space>
      ),
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: 'schedule',
      label: (
        <span>
          <ScheduleOutlined />
          作业调度
        </span>
      ),
      children: (
        <>
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder="搜索作业名称/位置"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部类型</Select.Option>
              <Select.Option value="loading">装卸作业</Select.Option>
              <Select.Option value="transport">运输作业</Select.Option>
              <Select.Option value="storage">仓储作业</Select.Option>
            </Select>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部状态</Select.Option>
              <Select.Option value="pending">未开始</Select.Option>
              <Select.Option value="processing">进行中</Select.Option>
              <Select.Option value="completed">已完成</Select.Option>
            </Select>
            <DatePicker.RangePicker style={{ width: 300 }} />
            <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
          </Space>
          <Table columns={operationColumns} dataSource={operationData} />
        </>
      ),
    },
    {
      key: 'equipment',
      label: (
        <span>
          <ToolOutlined />
          设备管理
        </span>
      ),
      children: (
        <>
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder="搜索设备名称/编号"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部类型</Select.Option>
              <Select.Option value="crane">起重设备</Select.Option>
              <Select.Option value="transport">运输设备</Select.Option>
              <Select.Option value="other">其他设备</Select.Option>
            </Select>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部状态</Select.Option>
              <Select.Option value="normal">正常</Select.Option>
              <Select.Option value="maintenance">维护中</Select.Option>
              <Select.Option value="fault">故障</Select.Option>
            </Select>
            <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
          </Space>
          <Table columns={equipmentColumns} dataSource={equipmentData} />
        </>
      ),
    },
    {
      key: 'shifts',
      label: (
        <span>
          <TeamOutlined />
          排班管理
        </span>
      ),
      children: (
        <Row gutter={16}>
          <Col span={16}>
            <Card title="今日排班">
              <Timeline
                items={[
                  {
                    color: 'green',
                    dot: <ClockCircleOutlined />,
                    children: (
                      <div>
                        <p><strong>早班 (06:00-14:00)</strong></p>
                        <p>A区装卸区：张组长 + 4人</p>
                        <p>B区仓储区：李组长 + 3人</p>
                      </div>
                    ),
                  },
                  {
                    color: 'blue',
                    dot: <ClockCircleOutlined />,
                    children: (
                      <div>
                        <p><strong>中班 (14:00-22:00)</strong></p>
                        <p>A区装卸区：王组长 + 4人</p>
                        <p>B区仓储区：赵组长 + 3人</p>
                      </div>
                    ),
                  },
                  {
                    color: 'gray',
                    dot: <ClockCircleOutlined />,
                    children: (
                      <div>
                        <p><strong>晚班 (22:00-06:00)</strong></p>
                        <p>A区装卸区：刘组长 + 3人</p>
                        <p>B区仓储区：陈组长 + 2人</p>
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="人员状态">
              <List
                size="small"
                dataSource={[
                  { title: '在岗人数', value: '25人', status: 'success' },
                  { title: '请假人数', value: '3人', status: 'warning' },
                  { title: '待岗人数', value: '2人', status: 'default' },
                ]}
                renderItem={item => (
                  <List.Item>
                    <Space>
                      {item.status === 'success' && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                      {item.status === 'warning' && <SyncOutlined style={{ color: '#faad14' }} />}
                      {item.status === 'default' && <CloseCircleOutlined style={{ color: '#d9d9d9' }} />}
                      <span>{item.title}:</span>
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
        description="今日有2个重要作业任务需要完成，3台设备待维护。"
        type="warning"
        showIcon
      />

      {/* 统计数据 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日作业任务"
              value={8}
              prefix={<ScheduleOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在用设备"
              value={15}
              prefix={<ToolOutlined />}
              suffix="台"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在岗人员"
              value={25}
              prefix={<TeamOutlined />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="作业完成率"
              value={85.7}
              prefix={<CheckCircleOutlined />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容区 */}
      <Card
        title="操作管理"
        extra={
          <Space>
            <Badge count={3} offset={[10, 0]}>
              <Button icon={<AlertOutlined />}>待处理</Button>
            </Badge>
            <Button type="primary" icon={<PlusOutlined />}>新增作业</Button>
          </Space>
        }
      >
        <Tabs
          defaultActiveKey="schedule"
          items={items}
          onChange={(key) => setActiveTab(key)}
        />
      </Card>
    </Space>
  );
};

export default OperationManagement; 