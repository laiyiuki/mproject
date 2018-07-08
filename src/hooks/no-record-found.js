module.exports = function noRecordFound() {
  return context => {
    const { result } = context;

    if (typeof result === 'object' && result.total === 0) {
      return true;
    }

    if (typeof result === 'array' && result.length === 0) {
      return true;
    }

    return false;
  };
};
