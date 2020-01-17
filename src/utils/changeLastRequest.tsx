import { TLastRequest } from 'dashboards/types';

const changeLastRequest = (idRequest: string, request: string, lastRequests: string) => {
  const lastRequestsArray: TLastRequest[] = lastRequests ? [...JSON.parse(lastRequests)] : [];

  let indexRequest: number | null = null;

  lastRequestsArray.forEach((request: TLastRequest, index) => {
    if (request.idRequest === idRequest) {
      indexRequest = index;
    }
  });

  if (indexRequest === null) {
    lastRequestsArray.push({
      idRequest: idRequest,
      request: request,
    });
  } else {
    lastRequestsArray.splice(indexRequest, 1);
  }

  return JSON.stringify(lastRequestsArray);
};

export default changeLastRequest;
