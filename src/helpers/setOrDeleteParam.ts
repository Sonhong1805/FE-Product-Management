const setOrDeleteParam = <T>(
  params: URLSearchParams,
  key: string,
  value: T
) => {
  if (value) {
    params.set(key, value.toString());
  } else {
    params.delete(key);
  }
};

export default setOrDeleteParam;
