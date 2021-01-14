export function expose(...types: Array<{ name: string, type: any}>) {
    types.forEach(type => {
        (window as any)[type.name] = type.type;
    });
}