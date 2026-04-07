export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? T[P] extends (...args: any[]) => any 
      ? T[P] 
      : DeepReadonly<T[P]> 
    : T[P];
};

export type PickedByType<T, U> = Pick<T, {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]>;

export type EventHandlers<T> = {
  [K in keyof T & string as `on${Capitalize<K>}`]: T[K];
};