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
      addUrl: '/api.php?entry=sys&c=business&a=second&do=second_add'
    };
  }

  componentWillMount = () => {
    let _this = this;
    let id = this.props.match.params.id;
    if (id != 0) {
      ApiClient.post('/api.php?entry=sys&c=business&a=second&do=second_edit', { id: id }).then(
        res => {
          let result = res.data;
          if (result.status == 1) {
            _this.setState({
              ...result.data,
              addUrl: '/api.php?entry=sys&c=business&a=second&do=second_update',
            });
          }
        }
      );
    }
  };

  // 保存信息
  submit = e => {
    let _this = this;
    let userInfo = ApiClient.getUserInfo()
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data;
        if (this.props.match.params.id != 0) {
          data = { ...values, id: this.state.id };
        } else {
          data = { ...values, bid: userInfo.id };
        }
        ApiClient.post(this.state.addUrl, data).then(res => {
          let result = res.data;
          if (result.status == 1) {
            message.success(result.message);
            setTimeout(() => {
              _this.props.history.push('/once_list');
            }, 1000);
          } else {
            message.error(result.message);
          }
        });
      }
    });
  }

  render() {
    const { match, children, location } = this.props;
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
          span: 8,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 3,
        },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <Row gutter={12} style={{ padding: '20px 0px' }}>
            <Col span={6} xs={0} sm={6}></Col>
            <Col span={14} xs={22} sm={14}>
              <div className={styles.tabTitle}>次卡设置</div>
              <Form onSubmit={this.submit}>
                <FormItem {...formItemSmallLayout} label="次卡名称：">
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入次卡名称!' }],
                    initialValue: this.state.title,
                  })(<Input placeholder="请输入次卡名称" />)}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="次卡次数：">
                  {getFieldDecorator('second', {
                    rules: [{ required: true, message: '请输入次卡次数!' }],
                    initialValue: this.state.second,
                  })(<Input placeholder="请输入次卡次数" />)}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="次卡价格：">
                  {getFieldDecorator('money', {
                    rules: [{ required: true, message: '请输入次卡价格：!' }],
                    initialValue: this.state.money,
                  })(<Input placeholder="请输入次卡价格：" />)}
                </FormItem>
                <FormItem {...formItemSmallLayout} label="排序：">
                  {getFieldDecorator('displayorder', {
                    rules: [{ required: true, message: '请输入排序!' }],
                    initialValue: this.state.displayorder,
                  })(<Input placeholder="请输入排序" />)}
                  <div style={{fontSize:'12px',color:'#999'}}>排序越小，显示越前面</div>
                </FormItem>
                <FormItem {...formItemSmallLayout} label="状态：">
                  {getFieldDecorator('status', {
                    rules: [{ required: false, message: '请选择状态!' }],
                    initialValue: this.state.status || 1,
                  })(
                    <RadioGroup onChange={this.onChangeSex}>
                      <Radio value={1}>开启</Radio>
                      <Radio value={2}>关闭</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                  <Button className={styles.addbtn} htmlType="submit">
                    提交
                  </Button>
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
