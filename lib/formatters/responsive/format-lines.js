export function formatLines(array, maxLen = 20) {
    const nums = array
        .slice()
        .sort((a, b) => a - b);
    
    const ranges = [];
    const [start] = nums;
    let [prev] = nums;
    
    for (let i = 1; i < nums.length; i++) {
        const n = nums[i];
        
        if (n === prev + 1)
            prev = n;
    }
    
    ranges.push(start === prev ? String(start) : `${start}..${prev}`);
    
    const joined = ranges.join(', ');
    
    if (joined.length <= maxLen)
        return joined;
    
    return ranges[0];
}

