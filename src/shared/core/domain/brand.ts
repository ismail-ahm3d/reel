declare const brand: unique symbol;

/** A nominal type over a primitive: an id of one kind cannot be passed where another is expected. */
export type Brand<T, Name extends string> = T & { readonly [brand]: Name };
