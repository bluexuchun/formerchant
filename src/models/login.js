import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      let status = localStorage.getItem('status');
      if (status) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: status,
            currentAuthority: 'admin',
            userInfo: localStorage.getItem('userInfo'),
          },
        });
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: response.data.status == 1 ? true : false,
            currentAuthority: 'admin',
            userInfo: response.data.data,
          },
        });
      }

      // Login successfully
      if (response.status === 200) {
        reloadAuthorized();
        localStorage.setItem('userInfo', JSON.stringify(response.data.data));
        localStorage.setItem('status', true);
        window.location.href = '/';
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
          userInfo: {},
        },
      });
      localStorage.setItem('userInfo', {});
      localStorage.setItem('status', false);
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        userInfo: payload.userInfo,
      };
    },
  },
};
