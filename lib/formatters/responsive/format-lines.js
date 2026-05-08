export function formatLines(nums, maxLen = 20) {
    const ranges = [];
    
    for (let i = 0; i < nums.length; i++) {
        const [j, range] = maybeRange(nums, i);
        ranges.push(range);
        i = j - 1;
    }
    
    const joined = ranges.join(', ');
    
    if (joined.length <= maxLen)
        return joined;
    
    return getShortenedRange(ranges, maxLen);
}

export function getShortenedRange(ranges, maxLen) {
    const last = ranges
        .at(-1)
        .toString();
    
    for (let i = 1; i < ranges.length - 1; i++) {
        const joined = `${ranges
            .slice(0, -i)
            .join(', ')} ... ${last}`;
        
        if (joined.length <= maxLen)
            return joined;
    }
    
    const first = ranges.at(0);
    const firstLast = `${first} ... ${last}`;
    
    if (firstLast.length <= maxLen)
        return firstLast;
    
    return `${ranges.at(0)} ...`;
}

function maybeRange(nums, i) {
    const start = nums.at(i);
    let prev = nums.at(i);
    
    for (++i; i < nums.length; i++) {
        const n = nums[i];
        
        if (n === prev + 1) {
            prev = n;
            continue;
        }
        
        break;
    }
    
    if (start === prev)
        return [i, start];
    
    return [i, `${start}..${prev}`];
}
