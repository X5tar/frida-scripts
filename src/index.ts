// For Android apps
import { dump_java_method, hook_java_method } from "./methods/java.js";
dump_java_method('org.example.package.class.method', {
    args: [0],
    ret: true,
    backtrace: true,
    overload: ['java.lang.String'],
});
hook_java_method('org.example.package.class.method', function (method: Java.Method) {
    return function (...args) {
        // Your code here
        let ret = method.call(this, ...args);
        // Your code here
        return ret;
    };
});

// For iOS apps
import { dump_objc_method, hook_objc_method } from "./methods/objc.js";
dump_objc_method('-[class method]', {
    args: [2],  // 0 for receiver (object), 1 for SEL (method)
    ret: true,
    backtrace: true,
});
hook_objc_method('-[class method]', {
    onEnter: function (args) {
        // Your code here
    },
    onLeave: function (ret) {
        // Your code here
    }
})