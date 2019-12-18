import { alertConstants } from '../constants/alert';

export const alertActions = {
  success,
  info,
  error,
  clear
};

// Success alert
function success (message) {
  return { type: alertConstants.SUCCESS, message };
}

// Info alert
function info (message) {
  return { type: alertConstants.INFO, message };
}

// Error alert
function error (message) {
  return { type: alertConstants.ERROR, message };
}

// Clear all alerts
function clear () {
  return { type: alertConstants.CLEAR };
}
