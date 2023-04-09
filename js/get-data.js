let receivedData = null;

export const savePhotosData = (data) => {
  receivedData = data;
};

const getReceivedData = () => receivedData;
getReceivedData();
