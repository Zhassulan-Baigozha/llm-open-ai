export const joinClasses = (...args: unknown[]) =>
  args.filter((item) => !!item).join(" ");
