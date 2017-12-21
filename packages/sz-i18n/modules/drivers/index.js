import Json from './Json';
import Po from './Po';

const DRIVER_JSON = 'json';
const DRIVER_PO = 'po';

export default {
  DEFAULT_DRIVER: DRIVER_JSON,
  driversMap: {
    [DRIVER_JSON]: Json,
    [DRIVER_PO]: Po,
  },
};
