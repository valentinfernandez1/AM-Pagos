import { myCache } from "../../index";

const cacheUtils = {
  //default timeout is 5 minutes
  storeValue: async (key: string, value: string) => {
    try {
      const data = await myCache.set(key, value);
      return data;
    } catch (error) {
      return false;
    }
  },
  getValue: async (key: string) => {
    try {
      const data = await myCache.get(key);
      return data;
    } catch (error) {
      return false;
    }
  },
};

export default cacheUtils;
