const highlightString = (inString: string, searchQuery: string, isBold?: boolean) => {
  let beginString = inString;

  searchQuery.split(' ').forEach((searchString) => {
    const isString = beginString!.toLowerCase().indexOf(searchString!.toLowerCase());
    const tagStart = isBold ? '<b>' : '<span>';
    const tagEnd = isBold ? '</b>' : '</span>';

    if (isString !== -1 && searchString) {
      const findString = beginString.slice(isString, isString + searchString.length);

      beginString = beginString!
        .split(findString)
        .map((part, index, arr) => {
          if (index === 0) {
            return part + tagStart + findString;
          }

          if (index !== arr.length - 1 && index !== 0) {
            return tagEnd + part + tagStart + findString;
          }

          if (index === arr.length - 1) {
            return tagEnd + part;
          }

          return part;
        })
        .join('');
    }
  });

  return beginString;
};

export default highlightString;
