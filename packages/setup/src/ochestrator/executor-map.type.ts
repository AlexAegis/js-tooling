import type { SetupElement, SetupElementExecutor } from '@alexaegis/setup-plugin';

export type ExecutorMap = Map<string, SetupElementExecutor<SetupElement<string>>>;
