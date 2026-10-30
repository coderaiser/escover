const ELLIPSIS = '...';

export const truncateMiddle = (str, maxLength) => {
    if (str.length <= maxLength)
        return str;
    
    const keep = Math.max(0, maxLength - ELLIPSIS.length);
    const head = Math.ceil(keep / 2);
    const tail = keep - head;
    
    return `${str.slice(0, head)}${ELLIPSIS}${str.slice(str.length - tail)}`;
};
