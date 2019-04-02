export function monogram(names: string) {
    return names
        .split(' ')
        .map(name => {
            return name.charAt(0);
        })
        .join('');
}
