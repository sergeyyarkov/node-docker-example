class WaitMiddleware {
  static async handle() {
    const wait = (ms = 1000) => {
      return new Promise((res) => {
        setTimeout(() => res(ms), ms);
      });
    };

    await wait(10);
  }
}

export default WaitMiddleware;
