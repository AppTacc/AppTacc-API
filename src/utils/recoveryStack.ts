import { logger } from "./logging";

type arrayOfPromises = Array<() => Promise<any>>;

export function newRecoveryStack() {
	const recoveryFunctions: arrayOfPromises = [];
	return {
		async runFns() {
			for (const fn of recoveryFunctions) {
				try {
					await fn();
				} catch (err: unknown) {
					logger.error(err);
				}
			}
		},
		async addFn(recoverFn: () => Promise<any>) {
			recoveryFunctions.unshift(recoverFn);
		}
	};
}
