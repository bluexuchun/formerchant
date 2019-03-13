import React, { Component, Suspense } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input, Button, Table, message, Modal,Tag } from 'antd';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import IntroCommon from '@/components/IntroCommon';
import styles from './List.less';
import ApiClient from '@/utils/api';

const confirm = Modal.confirm;
@connect()
class OnceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      loading: true,
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
          width: 100,
        },
        {
          title: '次卡名称',
          dataIndex: 'title',
          key: 'title',
          width: 200,
        },
        {
          title: '价钱',
          dataIndex: 'money',
          key: 'money',
          width: 180,
        },
        {
          title: '次数',
          dataIndex: 'second',
          key: 'second',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width:150,
          render:(text,record) => {
            let word,color
            if(record.status == 1){
              word = '开启'
              color = '#2db7f5'
            }else{
              word = '关闭'
              color = '#f50'
            }
            return (
              <Tag color={color}>{word}</Tag>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
          align: 'center',
          render: (text, record) => {
            return (
              <span>
                <a
                  href="javascript:void(0);"
                  onClick={() => this.editOnce(record.id)}
                  style={{ color: '#8856FD', marginRight: '40px' }}
                >
                  编辑
                </a>
                <a
                  href="javascript:void(0);"
                  onClick={() => this.deleteOnce(record.id)}
                  style={{ color: '#F67066' }}
                >
                  删除
                </a>
              </span>
            );
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
    ApiClient.post('/api.php?entry=sys&c=business&a=list&do=second_list', {bid:userInfo.id}).then(res => {
      let result = res.data;
      if (result.status == 1) {
        _this.setState({
          data:result.data,
          loading: false,
        });
      }else{
        _this.setState({
          data:[],
          loading: false,
        });
      }
    });
  };

  addOnce = () => {
    console.log('234');
    this.props.history.push('once_edit/0');
  };

  editOnce = id => {
    this.props.history.push('once_edit/' + id);
  };

  deleteOnce = id => {
    let _this = this;
    confirm({
      title: '警告',
      content: '你确认删除该次卡？',
      onOk() {
        ApiClient.post('/api.php?entry=sys&c=business&a=second&do=second_del', { id: id }).then(
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

    const { loading } = this.state;

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          {/* 统计 */}
          <IntroCommon />

          {/* 新增按钮 */}
          <div className={styles.btngroup}>
            <Button
              className={styles.addbtn}
              onClick={() => this.addOnce()}
              style={{ marginRight: '15px' }}
            >
              +新增次卡
            </Button>
          </div>

          {/* 表格 */}
          <Table
            columns={this.state.columns}
            dataSource={this.state.data}
            loading={loading}
          />
        </Suspense>
      </GridContent>
    );
  }
}

export default OnceList;
