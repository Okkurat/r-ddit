export const toJSONConfig = {
  transform: (doc: any, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    for (const key in ret) {
      if (ret[key] instanceof Date) {
        ret[key] = ret[key].toISOString();
      }
    }
    return ret;
  }
};