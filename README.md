# Frida Scripts

Make it easier (at least I think it easier) to hook mobile apps with frida.

For now, it only provides a few features.

## Features

### parse_xxxx_method

Parse method name to `ObjC.ObjectMethod` or `Java.MethodDispatcher`.

### dump_xxxx_method

Print arguments, return value and backtrace of a method.

### hook_xxxx_method

Change the implementation of a Java method or intercept a ObjC method.

## Usage

1. Write your hook code in `src/index.ts`
1. Compile the code
    ```sh
    # compile once
    npm run build
    yarn build
    # continuously recompile on change
    npm run watch
    yarn watch
    ```
1. Hook the app
    ```sh
    frida -U -f org.example.package --no-pause -l _index.js
    ```

## Tips

### Differences between Android and iOS hook

For Android apps, a hook is to **change the impementation** of a method. You should call `method.call(this, ...args)` to execute the original implementation, get the return value and use it, or you can just generate a return value yourself without calling the original method.

For iOS apps, a hook is to **intercept entering and leaving** of a method. You can use or change the arguments in the `onEnter` callback funtion and the return value in the `onLeave` callback funtion. The original implementation will always be executed.