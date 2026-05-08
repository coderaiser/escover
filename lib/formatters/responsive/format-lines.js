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
    
    return ranges[0];
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
