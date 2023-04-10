let photosData = null;

export const savePhotosData = (data) => {
  photosData = data;
};

const getPhotosData = () => photosData;
getPhotosData();
