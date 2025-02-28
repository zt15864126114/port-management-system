import React, { useState } from 'react';
import { Card, Table, Input, Button, Space, Tag, DatePicker, Modal, Form, Select, Row, Col, Statistic } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface ImmigrationRecord {
  key: string;
  name: string;
  passportNo: string;
  nationality: string;
  checkTime: string;
  status: '已通过' | '待检查' | '未通过';
  type: '入境' | '出境';
  reason?: string;
  visaType?: string;
  stayDuration?: string;
  destination?: string;
  healthStatus?: string;
}

type StatusColorMap = {
  [K in ImmigrationRecord['status']]: string;
};

const { Option } = Select;
const { confirm } = Modal;

const Immigration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ImmigrationRecord | null>(null);
  const [form] = Form.useForm();

  const showModal = (record?: ImmigrationRecord) => {
    setSelectedRecord(record || null);
    setIsModalVisible(true);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('提交数据:', values);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const showRejectConfirm = (record: ImmigrationRecord) => {
    confirm({
      title: '确认拒绝入境/出境？',
      icon: <ExclamationCircleOutlined />,
      content: '请确认是否要拒绝该申请，此操作不可撤销',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        console.log('拒绝记录:', record);
      },
    });
  };

  const columns: ColumnsType<ImmigrationRecord> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      fixed: 'left',
    },
    {
      title: '护照号',
      dataIndex: 'passportNo',
      key: 'passportNo',
      width: 120,
    },
    {
      title: '国籍',
      dataIndex: 'nationality',
      key: 'nationality',
      width: 100,
    },
    {
      title: '签证类型',
      dataIndex: 'visaType',
      key: 'visaType',
      width: 100,
    },
    {
      title: '停留时长',
      dataIndex: 'stayDuration',
      key: 'stayDuration',
      width: 100,
    },
    {
      title: '目的地',
      dataIndex: 'destination',
      key: 'destination',
      width: 120,
    },
    {
      title: '健康状况',
      dataIndex: 'healthStatus',
      key: 'healthStatus',
      width: 100,
      render: (status) => (
        <Tag color={status === '正常' ? 'success' : 'error'}>{status}</Tag>
      ),
    },
    {
      title: '检查时间',
      dataIndex: 'checkTime',
      key: 'checkTime',
      width: 180,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag color={type === '入境' ? 'blue' : 'green'}>{type}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: ImmigrationRecord['status']) => {
        const colors: StatusColorMap = {
          '已通过': 'success',
          '待检查': 'warning',
          '未通过': 'error',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)}>查看</Button>
          {record.status === '待检查' && (
            <>
              <Button type="link" onClick={() => handleOk()}>通过</Button>
              <Button type="link" danger onClick={() => showRejectConfirm(record)}>拒绝</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const data: ImmigrationRecord[] = [
    {
      key: '1',
      name: 'John Brown',
      passportNo: 'E12345678',
      nationality: '美国',
      checkTime: '2024-03-15 14:30:00',
      status: '已通过',
      type: '入境',
      visaType: '商务签证',
      stayDuration: '30天',
      destination: '上海',
      healthStatus: '正常',
      reason: '商务访问',
    },
    {
      key: '2',
      name: '张三',
      passportNo: 'G98765432',
      nationality: '中国',
      checkTime: '2024-03-15 15:20:00',
      status: '待检查',
      type: '出境',
      visaType: '工作签证',
      stayDuration: '180天',
      destination: '新加坡',
      healthStatus: '正常',
      reason: '工作',
    },
    {
      key: '3',
      name: 'Maria Garcia',
      passportNo: 'P87654321',
      nationality: '西班牙',
      checkTime: '2024-03-15 16:45:00',
      status: '未通过',
      type: '入境',
      visaType: '旅游签证',
      stayDuration: '15天',
      destination: '北京',
      healthStatus: '异常',
      reason: '健康检查未通过',
    },
    {
      key: '4',
      name: '李四',
      passportNo: 'E98765432',
      nationality: '中国',
      checkTime: '2024-03-15 17:30:00',
      status: '待检查',
      type: '入境',
      visaType: '探亲签证',
      stayDuration: '90天',
      destination: '广州',
      healthStatus: '正常',
      reason: '探亲访友',
    },
    {
      key: '5',
      name: 'James Wilson',
      passportNo: 'B12345678',
      nationality: '英国',
      checkTime: '2024-03-15 18:15:00',
      status: '已通过',
      type: '入境',
      visaType: '商务签证',
      stayDuration: '60天',
      destination: '深圳',
      healthStatus: '正常',
      reason: '商务考察',
    },
  ];

  return (
    <div>
      <Card title="移民边检管理" bordered={false}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="今日入境人数"
                value={156}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="今日出境人数"
                value={98}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="待检查数量"
                value={23}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="检查通过率"
                value={95.8}
                precision={1}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>

        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            新增记录
          </Button>
          <Input
            placeholder="搜索姓名/护照号"
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
          />
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">全部类型</Option>
            <Option value="entry">入境</Option>
            <Option value="exit">出境</Option>
          </Select>
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">全部状态</Option>
            <Option value="passed">已通过</Option>
            <Option value="pending">待检查</Option>
            <Option value="rejected">未通过</Option>
          </Select>
          <DatePicker.RangePicker style={{ width: 300 }} />
          <Button type="primary" icon={<SearchOutlined />}>
            搜索
          </Button>
          <Button icon={<ReloadOutlined />}>重置</Button>
        </Space>

        <Table<ImmigrationRecord>
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ x: 1500 }}
          pagination={{
            total: 100,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />

        <Modal
          title={selectedRecord ? '查看记录' : '新增记录'}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="passportNo"
                  label="护照号"
                  rules={[{ required: true, message: '请输入护照号' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="nationality"
                  label="国籍"
                  rules={[{ required: true, message: '请选择国籍' }]}
                >
                  <Select>
                    <Option value="中国">中国</Option>
                    <Option value="美国">美国</Option>
                    <Option value="英国">英国</Option>
                    <Option value="日本">日本</Option>
                    <Option value="韩国">韩国</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="visaType"
                  label="签证类型"
                  rules={[{ required: true, message: '请选择签证类型' }]}
                >
                  <Select>
                    <Option value="商务签证">商务签证</Option>
                    <Option value="旅游签证">旅游签证</Option>
                    <Option value="工作签证">工作签证</Option>
                    <Option value="探亲签证">探亲签证</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="出入境类型"
                  rules={[{ required: true, message: '请选择出入境类型' }]}
                >
                  <Select>
                    <Option value="入境">入境</Option>
                    <Option value="出境">出境</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="healthStatus"
                  label="健康状况"
                  rules={[{ required: true, message: '请选择健康状况' }]}
                >
                  <Select>
                    <Option value="正常">正常</Option>
                    <Option value="异常">异常</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="reason"
              label="原因说明"
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default Immigration; 