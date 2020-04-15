import { delay } from "redux-saga/effects";
import { put, call, all } from "redux-saga/effects";
import * as actions from "../actions/index";
import axios from "axios";

/*  
    function* isnt a function but like a generators
    generator are next javascript feature that a function
    can be executed incrementally
*/

export function* logoutSaga(action) {
  yield all([
    call([localStorage, "removeItem"], "token"),
    call([localStorage, "removeItem"], "expirationDate"),
    call([localStorage, "removeItem"], "userId"),
    put(actions.logoutSucceed()),
  ]);
}

export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime * 1000);
  yield put(actions.logout());
}

export function* authUserSaga(action) {
  yield put(actions.authStart());

  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true,
  };

  let url =
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC8_0LfLArDP9maNyI-EXB6UFU2K1G2vaE";
  if (!action.isSignup) {
    url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC8_0LfLArDP9maNyI-EXB6UFU2K1G2vaE";
  }

  try {
    const response = yield axios.post(url, authData);
    const expirationDate = new Date(
      new Date().getTime() + response.data.expiresIn * 1000
    );

    yield all([
      call([localStorage, "setItem"], "token", response.data.idToken),
      call([localStorage, "setItem"], "expirationDate", expirationDate),
      call([localStorage, "setItem"], "userId", response.data.localId),
      put(actions.authSuccess(response.data.idToken, response.data.localId)),
      put(actions.checkAuthTimeout(response.data.expiresIn)),
    ]);
  } catch (error) {
    yield put(actions.authFail(error.response.data.error));
  }
}

export function* authCheckStateSaga(action) {
  const token = yield call([localStorage, "getItem"], "token");
  if (!token) {
    yield put(actions.logout());
  } else {
    const expirationDate = yield new Date(
      yield call([localStorage, "getItem"], "expirationDate")
    );

    if (expirationDate <= new Date()) {
      yield put(actions.logout());
    } else {
      const userId = yield call([localStorage, "getItem"], "userId");
      yield put(actions.authSuccess(token, userId));
      yield put(
        actions.checkAuthTimeout(
          (expirationDate.getTime() - new Date().getTime()) / 1000
        )
      );
    }
  }
}
