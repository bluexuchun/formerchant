import React, { Component, Suspense } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Input, Button, Table, message, Modal } from 'antd';
import PageLoading from '@/components/PageLoading';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import IntroCommon from '@/components/IntroCommon';
import styles from './List.less';
import ApiClient from '@/utils/api';

const confirm = Modal.confirm;
@connect()
class BalenceList extends Component {
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
          width: 180,
        },
        {
          title: '订单号',
          dataIndex: 'ordersn',
          key: 'ordersn',
          width: 200,
        },
        {
          title: '用户昵称',
          dataIndex: 'nickname',
          key: 'nickname',
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
    this.init();
  };

  init = () => {
    let userInfo = ApiClient.getUserInfo()
    let data = [];
    ApiClient.post('/api.php?entry=sys&c=business&a=record&do=record', {bid:userInfo.id}).then(res => {
      let result = res.data;
      if (result.status == 1) {
        if (result.data.length > 0) {
          result.data.map((v, i) => {
            let dataItem = {
              id: v.id,
              nickname: v.uid.nickname,
              price: v.price,
              ordersn:v.ordersn,
              paytime:v.paytime,
              type:v.type
            };
            data.push(dataItem);
          });
        }
        this.setState({
          data,
          loading:false
        });
      }
    });
  };

  render() {
    const { match, children, location } = this.props;

    const { loading } = this.state

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          {/* 表格 */}
          <Table columns={this.state.columns} dataSource={this.state.data} loading={loading} />
        </Suspense>
      </GridContent>
    );
  }
}

export default BalenceList;
