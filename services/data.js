import "dotenv/config";

export const getData = async () => {
  try {
    const url = `${process.env.API_URL}/api/data`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch OTP: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching OTP:", error.message);
    return null;
  }
};
