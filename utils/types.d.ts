export type Day = `day${number}`;

type Answer = string | number;
type Answers = [Answer, Answer];
export type Run = (disableLogging?: boolean) => Promise<Answers>;
