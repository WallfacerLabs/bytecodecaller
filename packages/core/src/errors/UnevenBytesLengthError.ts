export class UnevenBytesLengthError extends Error {
  constructor() {
    super('Bytes length must be even')
  }
}
