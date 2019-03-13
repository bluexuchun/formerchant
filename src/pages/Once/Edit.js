import React, { Component, Suspense } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input, Button, Row, Col, Avatar, Form, Upload, message, Radio } from 'antd';
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
class OnceEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      addUrl: '/api.php?entry=sys&c=teacher&a=teacher&do=teacher_add',
      sex: 1,
    };
  }

  componentWillMount = () => {
    let _this = this;
    let id = this.props.match.params.id;
    if (id != 0) {
      ApiClient.post('/api.php?entry=sys&c=teacher&a=teacher&do=teacher_edit', { id: id }).then(
        res => {
          let result = res.data;
          if (result.status == 1) {
            _this.setState({
              ...result.data,
              imageUrl: result.data.Filedata,
              addUrl: '/api.php?entry=sys&c=teacher&a=teacher&do=teacher_update',
            });
          }
        }
      );
    }
  };

  // 保存信息
  submit = e => {
    let _this = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!this.state.imageUrl) {
          message.error('请上传教师头像');
        } else {
          let data;
          if (this.props.match.params.id != 0) {
            data = { Filedata: this.state.imageUrl, ...values, id: this.state.id };
          } else {
            data = { Filedata: this.state.imageUrl, ...values };
          }
          ApiClient.post(this.state.addUrl, data).then(res => {
            let result = res.data;
            if (result.status == 1) {
              message.success(result.message);
              setTimeout(() => {
                _this.props.history.push('/teacher_list');
              }, 1000);
            } else {
              message.error(result.message);
            }
          });
        }
      }
    });
  };

  handleChange = info => {
    let _this = this;
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      let result = info.file.response;
      if (result.status == 1) {
        message.success(result.message);
        let url = result.data.url;
        _this.setState({
          imageUrl: url,
        });
      } else {
        message.error(result.message);
      }
    }
  };

  onChangeSex = e => {
    this.setState({
      sex: e.target.value,
    });
  };

  render() {
    const { match, children, location } = this.props;
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
            <Col span={14}>
              <div className={styles.tabTitle}>次卡设置</div>
              <Form onSubmit={this.submit}>
                <FormItem {...formItemSmallLayout} label="次卡名称：">
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入次卡名称!' }],
                    initialValue: this.state.teacherName,
                  })(<Input placeholder="请输入次卡名称" />)}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="次数：">
                  {getFieldDecorator('nickname', {
                    rules: [{ required: true, message: '请输入次数!' }],
                    initialValue: this.state.nickname,
                  })(<Input placeholder="请输入次数" />)}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="价格：">
                  {getFieldDecorator('nickname', {
                    rules: [{ required: true, message: '请输入价格!' }],
                    initialValue: this.state.nickname,
                  })(<Input placeholder="请输入价格" />)}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="状态：">
                  {getFieldDecorator('sex', {
                    rules: [{ required: false, message: '请选择状态!' }],
                    initialValue: this.state.sex,
                  })(
                    <RadioGroup onChange={this.onChangeSex}>
                      <Radio value={1}>开启</Radio>
                      <Radio value={2}>关闭</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Form>
            </Col>
          </Row>
        </Suspense>
      </GridContent>
    );
  }
}

const newOnceEdit = Form.create()(OnceEdit);

export default newOnceEdit;
