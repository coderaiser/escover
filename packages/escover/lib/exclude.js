export const exclude = (url, names) => {
    for (const name of names) {
        if (url.includes(name))
            return true;
    }
    
    return false;
};
