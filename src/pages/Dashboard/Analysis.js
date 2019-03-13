import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Icon, Menu, Dropdown } from 'antd';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';

import styles from './Analysis.less';
import PageLoading from '@/components/PageLoading';
import IntroCommon from '@/components/IntroCommon';

@connect()
class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // this.reqRef = requestAnimationFrame(() => {
    //   dispatch({
    //     type: 'chart/fetch',
    //   });
    // });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'chart/clear',
    // });
    // cancelAnimationFrame(this.reqRef);
    // clearTimeout(this.timeoutId);
  }

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <IntroCommon />
        </Suspense>
      </GridContent>
    );
  }
}

export default Analysis;
