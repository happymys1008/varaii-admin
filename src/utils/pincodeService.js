const KEY = "happy_pincodes";

export const getPincodes = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const savePincodes = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

export const addOrUpdatePincode = (pincodeData) => {
  const list = getPincodes();
  const index = list.findIndex(p => p.pincode === pincodeData.pincode);

  if (index !== -1) {
    list[index] = pincodeData;
  } else {
    list.push(pincodeData);
  }

  savePincodes(list);
};

export const deletePincode = (pincode) => {
  const updated = getPincodes().filter(p => p.pincode !== pincode);
  savePincodes(updated);
};

export const getPincodeInfo = (pincode) => {
  return getPincodes().find(p => p.pincode === pincode);
};
