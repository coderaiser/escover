const a = () => {
    a = 5;
    __c4.mark(3, 4), console.log(5);
};


function x() {
    
    if (a > 2) {
        __c4.mark(9, 14), a();
    } else {
        __c4.mark(10, 9), b();
    }
}

for (const x of y) {
    __c4.mark(13, 19);
}

const ax = ((__c4.mark(16, 12), a()), (__c4.mark(16, 17), b()));
const bx = (c, (__c4.mark(17, 15), d()));

if ((__c4.mark(19, 4), a) || (__c4.mark(19, 9), b)) {
    __c4.mark(19, 12);
}


function x1(a, b = (__c4.mark(23, 15), b)) {
    __c4.mark(23, 22);
}
