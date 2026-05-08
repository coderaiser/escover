export function formatLines(nums, maxLen = 20) {
    const ranges = [];
    const range = maybeRange(nums);
    
    ranges.push(range);
    
    const joined = ranges.join(', ');
    
    if (joined.length <= maxLen)
        return joined;
    
    return ranges[0];
}

function maybeRange(nums) {
    const [start] = nums;
    let [prev] = nums;
    
    for (let i = 1; i < nums.length; i++) {
        const n = nums[i];
        
        if (n === prev + 1)
            prev = n;
    }
    
    if (start === prev)
        return start;
    
    return `${start}..${prev}`;
}
