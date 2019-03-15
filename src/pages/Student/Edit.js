import React, { Component, Suspense } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input, Button, Row, Col, Avatar, Form, Upload, message,Radio,Table } from 'antd';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import IntroCommon from '@/components/IntroCommon';
import styles from './Edit.less';
import uploadImg from '@/utils/upload';
import ApiClient from '@/utils/api';

const FormItem = Form.Item;
const RadioGroup = Radio.Group
const { TextArea } = Input;
@connect()
class StudentEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
          width: 180,
        },
        {
          title: '订单号',
          dataIndex: 'ordersn',
          key: 'ordersn',
          width: 200,
        },
        {
          title: '价格',
          dataIndex: 'price',
          key: 'price',
        },
        {
          title: '类型',
          key: 'type',
          render:(text,record) => {
            return (
              <span>{record.type == 2 ? '次卡' : '月卡'}</span>
            )
          }
        },
        {
          title: '支付时间',
          dataIndex: 'paytime',
          key: 'paytime'
        }
      ],
    };
  }

  componentWillMount = () => {
    let _this = this;
    let id = this.props.match.params.id;
    _this.getDetail(id)
    _this.getRecord(id)
  }

  /**
   * 获取用户的详细信息
   */
  getDetail = (id) => {
    let _this = this
    if (id != 0) {
      ApiClient.post('/api.php?entry=sys&c=business&a=student&do=member_detail', { uid: id }).then(
        res => {
          let result = res.data;
          if (result.status == 1) {
            _this.setState({
              ...result.data
            });
          }
        }
      );
    }
  }

  /**
   * 获取用户的支付记录
   */
  getRecord = (id) => {
    let _this = this
    if (id != 0) {
      ApiClient.post('/api.php?entry=app&c=member&a=record&do=record', { uid: id }).then(
        res => {
          let result = res.data;
          if (result.status == 1) {
            _this.setState({
              record:result.data,
              loading:false
            });
          }
        }
      );
    }
  }

  /**
   * 获取
   */

  render() {
    const { match, children, location } = this.props;
    let { loading,record } = this.state
    const formItemSmallLayout = {
      labelCol: {
        xs: { span: 3 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
    };
    const formDefaultLayout = {
      labelCol: {
        xs: {
          span: 3,
        },
        sm: {
          span: 3,
        },
      },
      wrapperCol: {
        xs: {
          span: 10,
        },
        sm: {
          span: 10,
        },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 3,
          offset: 0,
        },
        sm: {
          span: 3,
          offset: 3,
        },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <Row gutter={12} style={{ padding: '20px 0px' }}>
            <Col span={6} xs={24} sm={6} style={{ textAlign: 'center' }}>
                {this.state.avatar ? 
                  <Avatar size={120} src={this.state.avatar} />
                  : null
                }
                
            </Col>
            <Col span={14} xs={22} sm={14}>
              <div className={styles.tabTitle}>学生信息</div>
              <Form onSubmit={this.submit}>
                <FormItem {...formItemSmallLayout} label="学生昵称：">
                  {getFieldDecorator('nickname', {
                    rules: [{ required: false, message: '请输入教师姓名!' }],
                    initialValue: this.state.nickname,
                  })(
                    <Input disabled />
                  )}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="openid：">
                  {getFieldDecorator('openid', {
                    rules: [{ required: false, message: '请输入教师姓名!' }],
                    initialValue: this.state.openid,
                  })(
                    <Input disabled />
                  )}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="学生uid：">
                  {getFieldDecorator('uid', {
                    rules: [{ required: false, message: '请输入教师姓名!' }],
                    initialValue: this.state.uid,
                  })(
                    <Input disabled />
                  )}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="创建时间：">
                  {getFieldDecorator('createtime', {
                    rules: [{ required: false, message: '请输入教师姓名!' }],
                    initialValue: this.state.createtime,
                  })(
                    <Input disabled />
                  )}
                </FormItem>
              </Form>
            </Col>
          </Row>
          {/* 表格 */}
          <Table columns={this.state.columns} dataSource={record} loading={loading} />
        </Suspense>
      </GridContent>
    );
  }
}

const newStudentEdit = Form.create()(StudentEdit);

export default newStudentEdit;
