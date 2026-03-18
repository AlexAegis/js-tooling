import { filter, map, mergeScan, switchMap, take, type Observable } from 'rxjs';

/**
 * Use to buffer the output based on a semaphore, while its false the operator
 * will buffer all events from the source, and as soon as the semaphore opens
 * by emitting a true it will emit every buffered event, and all subsequent
 * events until the semaphore closes again.
 *
 * TODO: Lift the restiction on the semaphore that it has to be replayable
 *
 * @param source$
 * @param semaphore$ has to be replayable!
 * @returns
 */
export const bufferWithSemaphore = <T>(
	source$: Observable<T>,
	semaphore$: Observable<boolean>,
): Observable<T> =>
	source$.pipe(
		mergeScan(
			(acc, value) =>
				semaphore$.pipe(
					take(1),
					map((semaphore) =>
						semaphore
							? {
									buffer: [],
									eventsToEmit: [...acc.buffer, value],
								}
							: { eventsToEmit: [], buffer: [...acc.buffer, value] },
					),
				),
			{ buffer: [] as T[], eventsToEmit: [] as T[] },
			1,
		),
		filter((acc) => acc.eventsToEmit.length > 0),
		switchMap((acc) => acc.eventsToEmit),
	);
