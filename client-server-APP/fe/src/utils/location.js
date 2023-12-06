export const getLocation = async () => {
  if (window.navigator.geolocation) {
    let position;

    try {
      position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    } catch (error) {
      return;
    }

    const { latitude, longitude } = position.coords;

    return {
      lat: latitude,
      lng: longitude,
    };
  } else {
    return;
  }
};
