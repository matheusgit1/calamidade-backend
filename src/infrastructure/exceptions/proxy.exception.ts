export class ProxyException extends Error {
  public readonly stack: string;

  constructor(message: string, stack: string) {
    super(message);
    this.stack = stack;
  }
}
