import type { Run } from "~/utils/types";
import { readWholeFile } from "~/utils";

class Computer {
  public a: number;
  public b: number;
  public c: number;
  public program: number[];

  private pointer: number = 0;
  private _output: number[] = [];

  private loggingDisabled: boolean;

  constructor(
    a: number,
    b: number,
    c: number,
    program: number[],
    loggingDisabled?: boolean,
  ) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.program = program;
    this.loggingDisabled = loggingDisabled ?? false;
  }

  get output(): string {
    return this._output.join();
  }

  public run(): void {
    this.print();
    while (this.pointer < this.program.length) {
      this.exec(this.program[this.pointer], this.program[this.pointer + 1]);
      this.print();
    }
  }

  public print(): void {
    if (this.loggingDisabled) return;
    console.log("A", this.a);
    console.log("B", this.b);
    console.log("C", this.c);
    console.log(this.program.join());
    console.log(`${"  ".repeat(this.pointer)}^`);
    console.log("output", this.output);
  }

  private exec(operator: number, operand: number): void {
    switch (operator) {
      case 0:
        this.adv(operand);
        break;
      case 1:
        this.bxl(operand);
        break;
      case 2:
        this.bst(operand);
        break;
      case 3:
        this.jnz(operand);
        break;
      case 4:
        this.bxc(operand);
        break;
      case 5:
        this.out(operand);
        break;
      case 6:
        this.bdv(operand);
        break;
      case 7:
        this.cdv(operand);
        break;
    }
  }

  private literal(operand: number): number {
    if (operand < 0 || operand > 7) throw new Error();
    return operand;
  }

  private combo(operand: number): number {
    switch (operand) {
      case 0:
      case 1:
      case 2:
      case 3:
        return this.literal(operand);
      case 4:
        return this.a;
      case 5:
        return this.b;
      case 6:
        return this.c;
    }
    throw new Error();
  }

  private adv(operand: number): void {
    if (!this.loggingDisabled) console.log("adv", operand);
    this.a = Math.trunc(this.a / Math.pow(2, this.combo(operand)));
    this.pointer += 2;
  }

  private bxl(operand: number) {
    if (!this.loggingDisabled) console.log("bxl", operand);
    this.b ^= this.literal(operand);
    this.pointer += 2;
  }

  private bst(operand: number) {
    if (!this.loggingDisabled) console.log("bst", operand);
    this.b = this.combo(operand) % 8;
    this.pointer += 2;
  }

  private jnz(operand: number) {
    if (!this.loggingDisabled) console.log("jnz", operand);
    if (this.a === 0) {
      this.pointer += 2;
      return;
    }
    this.pointer = this.literal(operand);
  }

  private bxc(operand: number) {
    if (!this.loggingDisabled) console.log("bxc", operand);
    this.b ^= this.c;
    this.pointer += 2;
  }

  private out(operand: number) {
    if (!this.loggingDisabled) console.log("out", operand);
    this._output.push(this.combo(operand) % 8);
    this.pointer += 2;
  }

  private bdv(operand: number) {
    if (!this.loggingDisabled) console.log("bdv", operand);
    this.b = Math.trunc(this.a / Math.pow(2, this.combo(operand)));
    this.pointer += 2;
  }

  private cdv(operand: number) {
    if (!this.loggingDisabled) console.log("cdv", operand);
    this.c = Math.trunc(this.a / Math.pow(2, this.combo(operand)));
    this.pointer += 2;
  }
}

const run: Run = async (loggingDisabled) => {
  //const filePath = "day17/test-input.txt";
  const filePath = "day17/input.txt";
  const input = (await readWholeFile(filePath)).split("\n\n");

  const [a, b, c] = input[0]
    .split("\n")
    .map((line) => line.split(": ")[1])
    .map(Number);
  //console.log(a, b, c);
  const program = input[1].split(": ")[1].split(",").map(Number);
  //console.log(program);

  const computer = new Computer(a, b, c, program, loggingDisabled);
  computer.run();
  //console.log(computer.output);

  return [computer.output, 0];
};

export default run;
