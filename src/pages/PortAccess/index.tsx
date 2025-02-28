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
  Image
} from 'antd';
import {
  CarOutlined,
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  CameraOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';

const { Option } = Select;

// 类型定义
type AccessType = '人员' | '车辆';
type AccessStatus = '已进入' | '已离开' | '已预约' | '已取消' | '异常';
type AccessArea = 'A区' | 'B区' | 'C区' | 'D区';
type VehicleType = '集装箱车' | '重型货车' | '小型车辆' | '特种车辆';

interface AccessRecord {
  key: string;
  accessId: string;
  type: AccessType;
  name: string;
  idNumber: string;
  company?: string;
  vehicleNumber?: string;
  vehicleType?: VehicleType;
  area: AccessArea;
  purpose: string;
  enterTime?: string;
  leaveTime?: string;
  status: AccessStatus;
  appointmentTime?: string;
  contactPerson?: string;
  contactPhone: string;
  notes?: string;
  temperature?: string;
  healthCode?: 'green' | 'yellow' | 'red';
  securityCheck?: '已通过' | '未通过' | '待检查';
  photo?: string;
}

interface GateStatus {
  id: string;
  name: string;
  status: '正常' | '维护中' | '关闭';
  currentFlow: number;
  maxFlow: number;
  lastUpdate: string;
}

// 状态颜色映射
const statusColors: Record<AccessStatus, string> = {
  '已进入': 'processing',
  '已离开': 'default',
  '已预约': 'warning',
  '已取消': 'error',
  '异常': 'error'
};

const PortAccess: React.FC = () => {
  const [activeTab, setActiveTab] = useState('realtime');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 示例数据
  const accessData: AccessRecord[] = [
    {
      key: '1',
      accessId: 'AC202403150001',
      type: '车辆',
      name: '张师傅',
      idNumber: '310123198001011234',
      company: '远洋物流有限公司',
      vehicleNumber: '沪A12345',
      vehicleType: '集装箱车',
      area: 'A区',
      purpose: '货物装卸',
      enterTime: '2024-03-15 08:30',
      status: '已进入',
      contactPhone: '13812345678',
      temperature: '36.5',
      healthCode: 'green',
      securityCheck: '已通过',
      photo: 'vehicle1.jpg'
    },
    {
      key: '2',
      accessId: 'AC202403150002',
      type: '人员',
      name: '李工',
      idNumber: '310123199001011234',
      company: '设备维修公司',
      area: 'B区',
      purpose: '设备维护',
      appointmentTime: '2024-03-15 14:00',
      status: '已预约',
      contactPerson: '王经理',
      contactPhone: '13987654321',
      notes: '带工具箱',
      healthCode: 'green'
    },
    {
      key: '3',
      accessId: 'AC202403150003',
      type: '车辆',
      name: '王师傅',
      idNumber: '310123197001011234',
      company: '集运物流有限公司',
      vehicleNumber: '沪B54321',
      vehicleType: '重型货车',
      area: 'C区',
      purpose: '货物运输',
      enterTime: '2024-03-15 09:15',
      leaveTime: '2024-03-15 11:30',
      status: '已离开',
      contactPhone: '13765432100',
      temperature: '36.3',
      healthCode: 'green',
      securityCheck: '已通过',
      photo: 'vehicle2.jpg'
    }
  ];

  // 闸口状态数据
  const gateStatus: GateStatus[] = [
    {
      id: 'G1',
      name: '1号门（主入口）',
      status: '正常',
      currentFlow: 15,
      maxFlow: 30,
      lastUpdate: '1分钟前'
    },
    {
      id: 'G2',
      name: '2号门（货运专用）',
      status: '正常',
      currentFlow: 8,
      maxFlow: 20,
      lastUpdate: '2分钟前'
    },
    {
      id: 'G3',
      name: '3号门（人员通道）',
      status: '维护中',
      currentFlow: 0,
      maxFlow: 15,
      lastUpdate: '5分钟前'
    }
  ];

  // 表格列定义
  const columns = [
    {
      title: '进出编号',
      dataIndex: 'accessId',
      key: 'accessId',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: AccessType) => (
        <Tag icon={type === '人员' ? <UserOutlined /> : <CarOutlined />}>
          {type}
        </Tag>
      ),
    },
    {
      title: '姓名/车牌',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text: string, record: AccessRecord) => (
        <span>
          {text}
          {record.vehicleNumber && (
            <div style={{ color: '#999', fontSize: '12px' }}>{record.vehicleNumber}</div>
          )}
        </span>
      ),
    },
    {
      title: '单位',
      dataIndex: 'company',
      key: 'company',
      width: 200,
    },
    {
      title: '区域',
      dataIndex: 'area',
      key: 'area',
      width: 100,
    },
    {
      title: '进入时间',
      dataIndex: 'enterTime',
      key: 'enterTime',
      width: 150,
    },
    {
      title: '离开时间',
      dataIndex: 'leaveTime',
      key: 'leaveTime',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: AccessStatus) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: '安检状态',
      dataIndex: 'securityCheck',
      key: 'securityCheck',
      width: 100,
      render: (status: string) => (
        <Tag color={
          status === '已通过' ? 'success' :
          status === '未通过' ? 'error' :
          'warning'
        }>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: AccessRecord) => (
        <Space>
          <Button type="link">详情</Button>
          {record.status === '已进入' && <Button type="link">登记离开</Button>}
          {record.status === '已预约' && <Button type="link">登记进入</Button>}
        </Space>
      ),
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: 'realtime',
      label: (
        <span>
          <ClockCircleOutlined />
          实时监控
        </span>
      ),
      children: (
        <>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            {gateStatus.map(gate => (
              <Col span={8} key={gate.id}>
                <Card size="small">
                  <Statistic
                    title={
                      <Space>
                        {gate.name}
                        <Tag color={
                          gate.status === '正常' ? 'success' :
                          gate.status === '维护中' ? 'warning' :
                          'error'
                        }>{gate.status}</Tag>
                      </Space>
                    }
                    value={gate.currentFlow}
                    suffix={`/ ${gate.maxFlow} (人/车)`}
                    valueStyle={{ color: gate.currentFlow > gate.maxFlow * 0.8 ? '#cf1322' : '#3f8600' }}
                  />
                  <div style={{ color: '#999', fontSize: '12px', marginTop: 8 }}>
                    更新于：{gate.lastUpdate}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder="搜索编号/姓名/车牌"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Select defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部类型</Option>
              <Option value="person">人员</Option>
              <Option value="vehicle">车辆</Option>
            </Select>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部区域</Option>
              <Option value="A">A区</Option>
              <Option value="B">B区</Option>
              <Option value="C">C区</Option>
              <Option value="D">D区</Option>
            </Select>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部状态</Option>
              <Option value="in">已进入</Option>
              <Option value="out">已离开</Option>
              <Option value="appointment">已预约</Option>
            </Select>
            <DatePicker.RangePicker style={{ width: 300 }} />
            <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
          </Space>
          <Table 
            columns={columns} 
            dataSource={accessData}
            scroll={{ x: 1500 }}
            loading={loading}
            expandable={{
              expandedRowRender: (record) => (
                <Descriptions size="small" column={4}>
                  <Descriptions.Item label="证件号码">{record.idNumber}</Descriptions.Item>
                  <Descriptions.Item label="联系电话">{record.contactPhone}</Descriptions.Item>
                  {record.temperature && <Descriptions.Item label="体温">{record.temperature}℃</Descriptions.Item>}
                  {record.healthCode && (
                    <Descriptions.Item label="健康码">
                      <Tag color={
                        record.healthCode === 'green' ? 'success' :
                        record.healthCode === 'yellow' ? 'warning' :
                        'error'
                      }>{record.healthCode}</Tag>
                    </Descriptions.Item>
                  )}
                  {record.notes && <Descriptions.Item label="备注">{record.notes}</Descriptions.Item>}
                  {record.photo && (
                    <Descriptions.Item label="现场照片">
                      <Image
                        width={200}
                        src={record.photo}
                      />
                    </Descriptions.Item>
                  )}
                </Descriptions>
              ),
            }}
          />
        </>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Card title="码头出入管理" extra={<Button type="primary" icon={<PlusOutlined />}>新增记录</Button>}>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索姓名/证件号"
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
          />
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">全部类型</Option>
            <Option value="in">入港</Option>
            <Option value="out">出港</Option>
          </Select>
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">全部状态</Option>
            <Option value="approved">已通过</Option>
            <Option value="pending">待审核</Option>
            <Option value="rejected">已拒绝</Option>
          </Select>
          <DatePicker.RangePicker style={{ width: 300 }} />
          <Button type="primary" icon={<SearchOutlined />}>
            搜索
          </Button>
        </Space>
        <Table<AccessRecord>
          columns={columns}
          dataSource={accessData}
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

export default PortAccess as React.ComponentType;