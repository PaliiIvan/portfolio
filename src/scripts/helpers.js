export function iteratePage(index, goOnTop) {

    if (goOnTop) {
        if (index > 0) {
            return --index;
        } else {
            return index;
        }
    } else {
        if (index < 3) {
            return ++index;
        } else {
            return index;
        }
    }
}