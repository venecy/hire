interface Action<T> {
  payload?: T;
  type: string;
}

class EffectModule {
  count = 1;
  message = "hello!";

  delay(input: Promise<number>) {
    return input.then(i => ({
      payload: `hello ${i}!`,
      type: 'delay'
    }));
  }

  setMessage(action: Action<Date>) {
    return {
      payload: action.payload!.getMilliseconds(),
      type: "set-message"
    };
  }
}

type AsyncMethod<T, U> = (input: Promise<T>) => Promise<Action<U>>;
type SyncMethod<T, U> = (input: Action<T>) => Action<U>;
type ActionCreator<T, U> = (input: T) => Action<U>;

type MapHelper<C> =
  C extends AsyncMethod<any, any> ? C extends AsyncMethod<infer T, infer U> ? ActionCreator<T, U> : never :
  C extends SyncMethod<any, any> ? C extends SyncMethod<infer T, infer U> ? ActionCreator<T, U> : never :
  never;

type Allowed = AsyncMethod<any, any> | SyncMethod<any, any>;
type AllowedPropertyNames<T> = { [K in keyof T]: T[K] extends Allowed ? K : never }[keyof T];

// 修改 Connect 的类型，让 connected 的类型变成预期的类型
type Connect = (module: EffectModule) => {
  [k in AllowedPropertyNames<EffectModule>]: MapHelper<EffectModule[k]>
};

const connect: Connect = m => ({
  delay: (input: number) => ({
    type: 'delay',
    payload: `hello 2`
  }),
  setMessage: (input: Date) => ({
    type: "set-message",
    payload: input.getMilliseconds()
  })
});

type Connected = {
  delay(input: number): Action<string>;
  setMessage(action: Date): Action<number>;
};

export const connected: Connected = connect(new EffectModule());
