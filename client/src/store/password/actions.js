import { createAsyncThunk } from '@reduxjs/toolkit';
import { ActionType } from './common.js';

const resetPassword = createAsyncThunk(
  ActionType.RESET_PASSWORD,
  async (request, { extra: { services } }) => {
    return services.password.resetPassword(request);
  }
);

const setPassword = createAsyncThunk(
  ActionType.SET_PASSWORD,
  async (request, { extra: { services } }) => {
    return services.password.setPassword(request);
  }
);

export { setPassword, resetPassword };
