interface JavaMethod {
    clazz: Java.Wrapper,
    method: Java.MethodDispatcher,
}

export function parse_java_method(class_method: string): JavaMethod {
    const parts = class_method.split('.');
    const len = parts.length;
    const class_name = parts.slice(0, len - 1).join('.');
    const method_name = parts[len - 1];
    const clazz = Java.use(class_name);
    return {
        clazz: clazz,
        method: clazz[method_name],
    }
}

interface DumpConfig {
    args?: Array<number>;
    ret?: boolean;
    backtrace?: boolean;
    overload?: string[];
}

export function dump_java_method(class_method: string, config: DumpConfig) {
    hook_java_method(class_method, function (method: Java.Method) {
        function backtrace() {
            const Exception = Java.use('java.lang.Exception');
            const Log = Java.use('android.util.Log');
            console.log(Log.getStackTraceString(Exception.$new()));
        }

        return function (...args) {
            if (config.backtrace) {
                backtrace();
            }
            if (config.args) {
                for (const idx of config.args) {
                    console.log(`args[${idx}] = ${args[idx]}`);
                }
            }
            const ret = method.call(this, ...args);
            if (config.ret) {
                console.log(`ret = ${ret}`);
            }
            return ret;
        }
    }, config.overload);  
}

export function hook_java_method(class_method: string, implementation: (method: Java.Method) => Java.MethodImplementation, overload?: string[]) {
    Java.perform(function () {
        let method_dispatcher = parse_java_method(class_method).method;
        let method: Java.Method;
        if (overload) {
            method = method_dispatcher.overload(...overload);
        } else {
            if (method_dispatcher.overloads.length > 1) {
                console.log('\x1B[31mMultiple overloads: \x1B[0m');
                for (const overload of method_dispatcher.overloads) {
                    console.log('\t\x1B[31m[\'' + overload.argumentTypes.map(t => t.className).join('\', \'') + '\']\x1B[0m');
                }
            }
            method = method_dispatcher.overloads[0];
        }
        method.implementation = implementation(method);
    });
}
