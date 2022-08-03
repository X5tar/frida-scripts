export function parse_objc_method(name: string): ObjC.ObjectMethod {
    const type = name.charAt(0);
    const class_method = name.substring(2, name.length - 1).split(" ");
    const classname = class_method[0];
    const methodname = type + " " + class_method[1];
    return ObjC.classes[classname][methodname];
}

interface DumpConfig {
    args?: Array<number>;
    ret?: boolean;
    backtrace?: boolean;
}

export function dump_objc_method(name: string, config: DumpConfig = {}) {
    hook_objc_method(name, {
        onEnter: function (args) {
            console.log(`call method ${name}`);
            if (config.backtrace) {
                console.log('Backtrace: \n\t' +  + Thread.backtrace(this.context,
                    Backtracer.ACCURATE).map(DebugSymbol.fromAddress)
                    .join('\n\t'));
            }
            if (config.args) {
                for (const idx of config.args) {
                    console.log(`args[${idx}] = ${new ObjC.Object(args[idx])}`);
                }
            }
        },
        onLeave: function (ret) {
            if (config.ret) {
                console.log(`ret = ${new ObjC.Object(ret)}`);
            }
        }
    });
}

export function hook_objc_method(name: string, callbacks: InvocationListenerCallbacks | InstructionProbeCallback) {
    let method = parse_objc_method(name);
    Interceptor.attach(method.implementation, callbacks);
}
