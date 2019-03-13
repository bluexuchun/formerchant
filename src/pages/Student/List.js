import React, { Component, Suspense } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input, Button, Table, message, Modal,Avatar } from 'antd';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import IntroCommon from '@/components/IntroCommon';
import styles from './List.less';
import ApiClient from '@/utils/api';

const confirm = Modal.confirm;
@connect()
class StudentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      columns: [
        {
          title: 'Uid',
          dataIndex: 'uid',
          key: 'uid',
          width: 180,
        },
        {
          title: '头像',
          dataIndex: 'avatar',
          key: 'avatar',
          render:(text,record) => {
            return (
              <Avatar size={50} src={record.avatar}></Avatar>
            )
          }
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
          key: 'nickname',
          width: 200,
        },
        {
          title: 'openid',
          dataIndex: 'openid',
          key: 'openid',
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
                  onClick={() => this.editStudent(record.uid)}
                  style={{ color: '#8856FD', marginRight: '40px' }}
                >
                  查看详情
                </a>
            </span>
            )
          },
        },
      ],
    };
  }

  componentWillMount = () => {
    this.init();
  };

  init = () => {
    let _this = this
    let userInfo = ApiClient.getUserInfo()
    ApiClient.post('/api.php?entry=sys&c=business&a=student&do=business_member',{merchantid:userInfo.id}).then(res => {
      let result = res.data;
      if (result.status == 1) {
        _this.setState({
          data:result.data,
          loading:false
        });
      }else{
        _this.setState({
          data:[],
          loading:false
        });
      }
    });
  };

  editStudent = id => {
    this.props.history.push('student_edit/' + id);
  };

  deleteTeacher = id => {
    let _this = this;
    confirm({
      title: '警告',
      content: '你确认删除该教师？',
      onOk() {
        ApiClient.post('/api.php?entry=sys&c=teacher&a=teacher&do=teacher_del', { id: id }).then(
          res => {
            let result = res.data;
            if (result.status == 1) {
              message.success(result.message);
              _this.init();
            }
          }
        );
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  render() {
    const { match, children, location } = this.props;

    const { loading } = this.state


    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          {/* 统计 */}
          {/* <IntroCommon /> */}
          
          {/* 表格 */}
          <Table columns={this.state.columns} dataSource={this.state.data} loading={loading} />
        </Suspense>
      </GridContent>
    );
  }
}

export default StudentList;
