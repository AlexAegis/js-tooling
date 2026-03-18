export interface DetailedObjectKeyOrder {
	key: string;
	order: ObjectKeyOrder;
}

export type ObjectKeyOrder = (string | DetailedObjectKeyOrder)[];
