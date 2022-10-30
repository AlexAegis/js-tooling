export const cloneJsonSerializable = <T>(jsonSerializable: T): T =>
	JSON.parse(JSON.stringify(jsonSerializable)) as T;
