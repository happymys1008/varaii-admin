import axios from "axios";

export const lookupPincode = async (pincode) => {
  if (!pincode || String(pincode).length !== 6) return null;

  try {
    const res = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    const data = res.data;

    if (!Array.isArray(data) || data[0]?.Status !== "Success") {
      return null;
    }

    const postOffices = data[0]?.PostOffice;
    if (!Array.isArray(postOffices) || postOffices.length === 0) {
      return null;
    }

    const postOffice = postOffices[0];

    return {
      area: postOffice.Name || "",          // 🔥 AREA (Post Office Name)
      city: postOffice.District || "",
      state: postOffice.State || "",
      block: postOffice.Block || "",
      division: postOffice.Division || "",
    };
  } catch (err) {
    console.error("Pincode lookup failed:", err.message);
    return null;
  }
};