// Import Dependencies

import { ENABLE_LOGIN_ONSTART, ENABLE_MAINTENANCE_ONSTART } from "@/config";

// Store site toggle switch states here
// and initialize them to config values
let MAINTENANCE_ENABLED = ENABLE_MAINTENANCE_ONSTART;
let LOGIN_ENABLED = ENABLE_LOGIN_ONSTART;
let DEPOSITS_ENABLED = true;
let WITHDRAWS_ENABLED = true;
let COINFLIP_ENABLED = true;
let MINES_ENABLED = true;
let CRASH_ENABLED = true;

// Create getters
const getMaintenanceState = () => MAINTENANCE_ENABLED;
const getLoginState = () => LOGIN_ENABLED;
const getDepositState = () => DEPOSITS_ENABLED;
const getWithdrawState = () => WITHDRAWS_ENABLED;
const getCoinflipState = () => COINFLIP_ENABLED;
const getMinesState = () => MINES_ENABLED;
const getSiteCrashState = () => CRASH_ENABLED;

// Create reducers
const toggleMaintenance = () => {
  MAINTENANCE_ENABLED = !MAINTENANCE_ENABLED;
  return true;
};

const toggleLogin = () => {
  LOGIN_ENABLED = !LOGIN_ENABLED;
  return true;
};

const toggleDeposits = () => {
  DEPOSITS_ENABLED = !DEPOSITS_ENABLED;
  return true;
};

const toggleWithdraws = () => {
  WITHDRAWS_ENABLED = !WITHDRAWS_ENABLED;
  return true;
};

const toggleCoinflip = () => {
  COINFLIP_ENABLED = !COINFLIP_ENABLED;
  return true;
};

const toggleCrash = () => {
  CRASH_ENABLED = !CRASH_ENABLED;
  return true;
};

const toggleMines = () => {
  MINES_ENABLED = !MINES_ENABLED;
  return true;
};

// Export functions
export {
  getCoinflipState,
  getDepositState,
  getLoginState,
  getMaintenanceState,
  getMinesState,
  getSiteCrashState,
  getWithdrawState,
  toggleCoinflip,
  toggleCrash,
  toggleDeposits,
  toggleLogin,
  toggleMaintenance,
  toggleMines,
  toggleWithdraws,
};
