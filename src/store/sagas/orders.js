import { put } from "redux-saga/effects";
import * as actions from "../actions/index";
import axios from "../../axios-orders";

export function* purchaseBurgerInitSaga(action) {
  try {
    yield put(actions.purchaseBurgerStart());
    const response = yield axios.post(
      "/orders.json?auth=" + action.token,
      action.orderData
    );
    yield put(
      actions.purchaseBurgerSuccess(response.data.name, action.orderData)
    );
  } catch (error) {
    yield put(actions.purchaseBurgerFail(error));
  }
}

export function* fetchOrdersSaga(action) {
  try {
    yield put(actions.fetchOrdersStart());
    const queryParams =
      "?auth=" +
      action.token +
      '&orderBy="userId"&equalTo="' +
      action.userId +
      '"';
    const response = yield axios.get("/orders.json" + queryParams);
    const fetchedOrders = [];
    for (let key in response.data) {
      fetchedOrders.push({
        ...response.data[key], //Copy all data from firebase to not lose the unique key
        id: key, //Give id to id from firebase
      });
    }
    yield put(actions.fetchOrdersSuccess(fetchedOrders));
  } catch (err) {
    yield put(actions.fetchOrdersFail(err));
  }
}
