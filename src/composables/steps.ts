/* Provider-neutral WVerticalSteps behavior shared by every renderer (SPEC R03, M3). */

export const verticalStepsDefaults = { steps: () => [], label: "Steps" } as const;

/** The default marker text for a step: `01`–`09`, then `10`, `11` and so on. */
export const stepNumber = (index: number) => (index >= 9 ? String(index + 1) : `0${index + 1}`);
