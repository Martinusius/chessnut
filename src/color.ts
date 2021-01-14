export enum Color {
    WHITE,
    BLACK
};

export namespace Color {
    export function reverse(color: Color) {
        return color === Color.WHITE ? Color.BLACK : Color.WHITE;
    } 
}