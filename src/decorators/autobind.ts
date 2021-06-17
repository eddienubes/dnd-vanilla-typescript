//autobind decorator
export function FunctionBinder(_: any, _2: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalFn = descriptor.value;

  return {
    enumerable: true,
    configurable: true,
    get() {
      return originalFn.bind(this);
    }
  }
}

