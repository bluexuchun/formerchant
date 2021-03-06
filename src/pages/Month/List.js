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
class MonthList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
          width: 100,
        },
        {
          title: '月卡名称',
          dataIndex: 'title',
          key: 'title',
          width: 200,
        },
        {
          title: '价钱',
          dataIndex: 'money',
          key: 'money',
          width:180
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
          title: '排序',
          dataIndex: 'displayorder',
          key: 'displayorder',
          width:150
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
                  onClick={() => this.editMonth(record.id)}
                  style={{ color: '#8856FD', marginRight: '40px' }}
                >
                  编辑
                </a>
                <a
                  href="javascript:void(0);"
                  onClick={() => this.deleteMonth(record.id)}
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
    ApiClient.post('/api.php?entry=sys&c=business&a=list&do=month_list', {bid:userInfo.id}).then(res => {
      let result = res.data;
      console.log(result)
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

  addMonth = () => {
    this.props.history.push('month_edit/0');
  };

  editMonth = id => {
    this.props.history.push('month_edit/' + id);
  };

  deleteMonth = id => {
    let _this = this;
    confirm({
      title: '警告',
      content: '你确认删除该月卡？',
      onOk() {
        ApiClient.post('/api.php?entry=sys&c=business&a=month&do=month_del', { id: id }).then(
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

    const { loading, selectedRowKeys } = this.state;

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          {/* 统计 */}
          <IntroCommon />

          {/* 新增按钮 */}
          <div className={styles.btngroup}>
            <Button
              className={styles.addmonth}
              onClick={() => this.addMonth()}
            >
              +新增月卡
            </Button>
          </div>

          {/* 表格 */}
          <Table columns={this.state.columns} dataSource={this.state.data} loading={loading} />
        </Suspense>
      </GridContent>
    );
  }
}

export default MonthList;
