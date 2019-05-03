export function monogram(names: string) {
    return names
        .split(' ')
        .map(name => {
            return name.charAt(0);
        })
        .join('');
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func: Function, wait: number, immediate?: boolean) {
    var timeout: TimeoutID | null;
    return function() {
        var context = this,
            args = arguments;
        timeout && clearTimeout(timeout);
        timeout = setTimeout(function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
}
