export class InvalidBytesSizeError extends Error {
  constructor() {
    super('Bytes length must be equal or less than 32')
  }
}
