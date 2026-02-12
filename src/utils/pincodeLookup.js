export const lookupPincode = async (pincode) => {
  if (pincode.length !== 6) return null;

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await res.json();

    if (data[0].Status !== "Success") return null;

    const postOffice = data[0].PostOffice[0];

    return {
      city: postOffice.District,
      state: postOffice.State
    };
  } catch (err) {
    return null;
  }
};
