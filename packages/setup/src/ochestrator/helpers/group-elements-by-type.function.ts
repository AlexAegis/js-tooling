import type {
	GroupedSetupElementsWithMetadata,
	SetupElementTypes,
	SetupElementWithMetadata,
} from '@alexaegis/setup-plugin';

export const groupElementsByType = (
	elements: SetupElementWithMetadata[]
): GroupedSetupElementsWithMetadata => {
	return elements.reduce<Record<SetupElementTypes, SetupElementWithMetadata[]>>(
		(groups, next) => {
			groups[next.type].push(next);
			return groups;
		},
		{
			'file-copy': [],
			'file-remove': [],
			'file-symlink': [],
			'file-transform': [],
			json: [],
			unique: [],
		}
	) as GroupedSetupElementsWithMetadata;
};
