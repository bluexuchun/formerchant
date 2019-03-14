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
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          width: 200,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title:'开放时间',
          width: 250,
          align: 'center',
          render:(text,record) => {
            let id = [record.id]
            return (
              <Button type="primary" onClick={() => this.arrange(id)}>添加开放时间</Button>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
          align: 'center',
          render: (text, record) => {
            return(
              <span>
                <a
                  href="javascript:void(0);"
                  onClick={() => this.editTeacher(record.id)}
                  style={{ color: '#8856FD', marginRight: '40px' }}
                >
                  编辑
                </a>
                <a
                  href="javascript:void(0);"
                  onClick={() => this.deleteTeacher(record.id)}
                  style={{ color: '#F67066' }}
                >
                  删除
                </a>
            </span>
            )
          },
        },
      ],
    };
  }

  componentWillMount = () => {
    let _this = this;
    let id = this.props.match.params.id;
    _this.getDetail(id)
  }

  /**
   * getdetail
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

  render() {
    const { match, children, location } = this.props;
    let { loading } = this.state
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
          <Table columns={this.state.columns} dataSource={this.state.data} loading={loading} />
        </Suspense>
      </GridContent>
    );
  }
}

const newStudentEdit = Form.create()(StudentEdit);

export default newStudentEdit;
