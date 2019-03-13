import React, { Component, Suspense } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input, Button, Row, Col, Avatar, Form, Upload, message, Radio,Modal } from 'antd';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import IntroCommon from '@/components/IntroCommon';
import styles from './Edit.less';
import uploadImg from '@/utils/upload';
import ApiClient from '@/utils/api';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
@connect()
class TeacherEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:false
    };
  }

  componentWillMount = () => {
    let _this = this;
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    _this.setState({
      userInfo,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  render() {
    const { match, children, location } = this.props;
    let { userInfo } = this.state;
    let url = 'http://teacher.centralsofts.cn/h5/auth.html?merchantid=' + userInfo.id
    url = encodeURI(url)
    const formItemSmallLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 6 },
      },
    };
    const formDefaultLayout = {
      labelCol: {
        xs: {
          span: 8,
        },
        sm: {
          span: 3,
        },
      },
      wrapperCol: {
        xs: {
          span: 16,
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
              <Avatar size={120} src={userInfo.cover} />
            </Col>
            <Col span={14} xs={22} sm={14}>
              <div className={styles.tabTitle}>机构信息</div>
              <Form onSubmit={this.submit}>
                <FormItem {...formItemSmallLayout} label="机构名称：">
                  <Input defaultValue={userInfo.title} disabled />
                </FormItem>
                <FormItem {...formItemSmallLayout} label="联系人：">
                  <Input defaultValue={userInfo.user} disabled />
                </FormItem>
                <FormItem {...formItemSmallLayout} label="手机号：">
                  <Input defaultValue={userInfo.mobile} disabled />
                </FormItem>
              </Form>
              <div>
                <Button 
                  type="primary" onClick={this.showModal}
                >点击生成公众号链接</Button>
                <Modal
                  title="公众号链接"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                >
                  <p>{url}</p>
                </Modal>
              </div>
            </Col>
          </Row>
        </Suspense>
      </GridContent>
    );
  }
}

const newTeacherEdit = Form.create()(TeacherEdit);

export default newTeacherEdit;
