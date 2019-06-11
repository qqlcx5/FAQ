import {
  api_post
} from '../api';
import qs from 'querystring';

const baseParmUrl = (window.location.host === '192.168.102.123:8090' || window.location.host === '47.99.237.39:8090') ? 'baseQueryParm_PROD' : 'baseQueryParm';

const {
  baseParm
} = require(`../assets/js/${baseParmUrl}`);

const handleQueryParm = (queryType, queryFilter) => {
  return new Promise((resolve, reject) => {
    let baseQueryParm = JSON.parse(JSON.stringify(baseParm[queryType]));
    if (queryFilter) {
      if (queryFilter.dateFilter) {
        //有时间过滤

        if (baseQueryParm.mergeDims) {
          //多立方体
          baseQueryParm.criteriaCubes = baseQueryParm.criteriaCubes.map(
            cube => {
              let dataIdx = cube.rollUps.findIndex(dim => {
                return dim.outputType === 'date';
              });

              cube.rollUps[dataIdx] = {
                ...cube.rollUps[dataIdx],
                dateFilter: queryFilter.dateFilter
              };

              return cube;
            }
          );
        } else {
          let dataIdx = baseQueryParm.rollUps.findIndex(item => {
            return item.outputType === 'date';
          });

          baseQueryParm.rollUps[dataIdx] = {
            ...baseQueryParm.rollUps[dataIdx],
            dateFilter: queryFilter.dateFilter
          };
        }
      }
    }

    let sendParm = qs.stringify({
      criteria: JSON.stringify(baseQueryParm)
    });

    const queryApi = window.location.host === '47.99.237.39:8090' ? '47.99.237.39:8083' : '192.168.102.126:8083';

    api_post(`http://${queryApi}/dw/cube/query`, sendParm).then(
      resp => {
        if (resp.data) {
          resolve(resp.data);
        } else {
          resolve(resp);
        }
      }
    );
  });
};

export default handleQueryParm;