import fs from "fs";
const storageFile = "localStorage.json";

export const getStorage = () => {
  if (!fs.existsSync(storageFile)) {
    return {};
  }
  const data = fs.readFileSync(storageFile);
  return JSON.parse(data);
};

export const postStorage = (data) => {
  fs.writeFileSync(storageFile, JSON.stringify(data, null, 2));
};
