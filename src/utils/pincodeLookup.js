import axios from "axios";

export const lookupPincode = async (pincode) => {
  if (!pincode || String(pincode).length !== 6) return null;

  try {
    const res = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    const data = res.data;

    if (!data?.[0] || data[0].Status !== "Success") return null;

    const postOffice = data[0].PostOffice?.[0];
    if (!postOffice) return null;

    return {
      city: postOffice.District || "",
      state: postOffice.State || "",
    };
  } catch (err) {
    return null;
  }
};
