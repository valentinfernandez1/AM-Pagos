import { E_Sort } from "../utils/enums";

const fieldVerifications = {
  sortEnum: (sort: string) => {
    let sortValidation = (E_Sort as any)[String(sort).toLowerCase()];
    if (!sortValidation) {
      throw new Error(`-- ${sort} -- is not valid for param "sort"`);
    }
  },
};

export default fieldVerifications;
