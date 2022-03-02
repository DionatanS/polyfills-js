// Polyfill's

//Includes
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, "includes", {
        value: function (searchElement, fromIndex) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                // c. Increase k by 1.
                // NOTE: === provides the correct "SameValueZero" comparison needed here.
                if (o[k] === searchElement) {
                    return true;
                }
                k++;
            }

            // 8. Return false
            return false;
        },
    });
}
//FILTER
if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun /*, thisArg*/ ) {
        "use strict";

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function") {
            throw new TypeError();
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}
//FIND
if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this === null) {
            throw new TypeError("Array.prototype.find called on null or undefined");
        }
        if (typeof predicate !== "function") {
            throw new TypeError("predicate must be a function");
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}
//FlatMap
if (!Array.prototype.flatMap) {
    Object.defineProperty(Array.prototype, 'flatMap', {
        value: function (callback, thisArg) {
            var self = thisArg || this;
            if (self === null) {
                throw new TypeError('Array.prototype.flatMap ' +
                    'called on null or undefined');
            }
            if (typeof callback !== 'function') {
                throw new TypeError(callback +
                    ' is not a function');
            }

            var list = [];

            // 1. Let O be ? ToObject(this value).
            var o = Object(self);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            for (var k = 0; k < len; ++k) {
                if (k in o) {
                    var part_list = callback.call(self, o[k], k, o);
                    list = list.concat(part_list);
                }
            }

            return list;
        }
    });
}
//MAP
if (!Array.prototype.map) {

    Array.prototype.map = function (callback, thisArg) {

        var T, A, k;

        if (this == null) {
            throw new TypeError(' this is null or not defined');
        }

        //  1. Let O be the result of calling ToObject passing the |this|
        //    value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal
        //    method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Let A be a new array created as if by the expression new Array(len)
        //    where Array is the standard built-in constructor with that name and
        //    len is the value of len.
        A = new Array(len);

        // 7. Let k be 0
        k = 0;

        // 8. Repeat, while k < len
        while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal
            //    method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal
                //    method of O with argument Pk.
                kValue = O[k];

                // ii. Let mappedValue be the result of calling the Call internal
                //     method of callback with T as the this value and argument
                //     list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);

                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor
                // { Value: mappedValue,
                //   Writable: true,
                //   Enumerable: true,
                //   Configurable: true },
                // and false.

                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, k, {
                //   value: mappedValue,
                //   writable: true,
                //   enumerable: true,
                //   configurable: true
                // });

                // For best browser support, use the following:
                A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }

        // 9. return A
        return A;
    };
}
//Reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function (callback /*, valorInicial*/ ) {
        'use strict';
        if (this == null) {
            throw new TypeError('Array.prototype.reduce chamado é nulo (null) ou indefinido (undefined)');
        }
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' não é uma função')
        }
        var t = Object(this),
            len = t.length >>> 0,
            k = 0,
            value;
        if (arguments.length == 2) {
            value = arguments[1];
        } else {
            while (k < len && !(k in t)) {
                k++;
            }
            if (k >= len) {
                throw new TypeError('Reduce possui um array vazio sem um valor inicial');
            }
            value = t[k++];
        }
        for (; k < len; k++) {
            if (k in t) {
                value = callback(value, t[k], k, t);
            }
        }
        return value;
    };
}
//Promise
! function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t() : "function" == typeof define && define.amd ? define(t) : t()
}(0, function () {
    "use strict";

    function e(e) {
        var t = this.constructor;
        return this.then(function (n) {
            return t.resolve(e()).then(function () {
                return n
            })
        }, function (n) {
            return t.resolve(e()).then(function () {
                return t.reject(n)
            })
        })
    }

    function t(e) {
        return new this(function (t, n) {
            function o(e, n) {
                if (n && ("object" == typeof n || "function" == typeof n)) {
                    var f = n.then;
                    if ("function" == typeof f) return void f.call(n, function (t) {
                        o(e, t)
                    }, function (n) {
                        r[e] = {
                            status: "rejected",
                            reason: n
                        }, 0 == --i && t(r)
                    })
                }
                r[e] = {
                    status: "fulfilled",
                    value: n
                }, 0 == --i && t(r)
            }
            if (!e || "undefined" == typeof e.length) return n(new TypeError(typeof e + " " + e + " is not iterable(cannot read property Symbol(Symbol.iterator))"));
            var r = Array.prototype.slice.call(e);
            if (0 === r.length) return t([]);
            for (var i = r.length, f = 0; r.length > f; f++) o(f, r[f])
        })
    }

    function n(e) {
        return !(!e || "undefined" == typeof e.length)
    }

    function o() {}

    function r(e) {
        if (!(this instanceof r)) throw new TypeError("Promises must be constructed via new");
        if ("function" != typeof e) throw new TypeError("not a function");
        this._state = 0, this._handled = !1, this._value = undefined, this._deferreds = [], l(e, this)
    }

    function i(e, t) {
        for (; 3 === e._state;) e = e._value;
        0 !== e._state ? (e._handled = !0, r._immediateFn(function () {
            var n = 1 === e._state ? t.onFulfilled : t.onRejected;
            if (null !== n) {
                var o;
                try {
                    o = n(e._value)
                } catch (r) {
                    return void u(t.promise, r)
                }
                f(t.promise, o)
            } else(1 === e._state ? f : u)(t.promise, e._value)
        })) : e._deferreds.push(t)
    }

    function f(e, t) {
        try {
            if (t === e) throw new TypeError("A promise cannot be resolved with itself.");
            if (t && ("object" == typeof t || "function" == typeof t)) {
                var n = t.then;
                if (t instanceof r) return e._state = 3, e._value = t, void c(e);
                if ("function" == typeof n) return void l(function (e, t) {
                    return function () {
                        e.apply(t, arguments)
                    }
                }(n, t), e)
            }
            e._state = 1, e._value = t, c(e)
        } catch (o) {
            u(e, o)
        }
    }

    function u(e, t) {
        e._state = 2, e._value = t, c(e)
    }

    function c(e) {
        2 === e._state && 0 === e._deferreds.length && r._immediateFn(function () {
            e._handled || r._unhandledRejectionFn(e._value)
        });
        for (var t = 0, n = e._deferreds.length; n > t; t++) i(e, e._deferreds[t]);
        e._deferreds = null
    }

    function l(e, t) {
        var n = !1;
        try {
            e(function (e) {
                n || (n = !0, f(t, e))
            }, function (e) {
                n || (n = !0, u(t, e))
            })
        } catch (o) {
            if (n) return;
            n = !0, u(t, o)
        }
    }
    var a = setTimeout,
        s = "undefined" != typeof setImmediate ? setImmediate : null;
    r.prototype["catch"] = function (e) {
        return this.then(null, e)
    }, r.prototype.then = function (e, t) {
        var n = new this.constructor(o);
        return i(this, new function (e, t, n) {
            this.onFulfilled = "function" == typeof e ? e : null, this.onRejected = "function" == typeof t ? t : null, this.promise = n
        }(e, t, n)), n
    }, r.prototype["finally"] = e, r.all = function (e) {
        return new r(function (t, o) {
            function r(e, n) {
                try {
                    if (n && ("object" == typeof n || "function" == typeof n)) {
                        var u = n.then;
                        if ("function" == typeof u) return void u.call(n, function (t) {
                            r(e, t)
                        }, o)
                    }
                    i[e] = n, 0 == --f && t(i)
                } catch (c) {
                    o(c)
                }
            }
            if (!n(e)) return o(new TypeError("Promise.all accepts an array"));
            var i = Array.prototype.slice.call(e);
            if (0 === i.length) return t([]);
            for (var f = i.length, u = 0; i.length > u; u++) r(u, i[u])
        })
    }, r.allSettled = t, r.resolve = function (e) {
        return e && "object" == typeof e && e.constructor === r ? e : new r(function (t) {
            t(e)
        })
    }, r.reject = function (e) {
        return new r(function (t, n) {
            n(e)
        })
    }, r.race = function (e) {
        return new r(function (t, o) {
            if (!n(e)) return o(new TypeError("Promise.race accepts an array"));
            for (var i = 0, f = e.length; f > i; i++) r.resolve(e[i]).then(t, o)
        })
    }, r._immediateFn = "function" == typeof s && function (e) {
        s(e)
    } || function (e) {
        a(e, 0)
    }, r._unhandledRejectionFn = function (e) {
        void 0 !== console && console && console.warn("Possible Unhandled Promise Rejection:", e)
    };
    var d = function () {
        if ("undefined" != typeof self) return self;
        if ("undefined" != typeof window) return window;
        if ("undefined" != typeof global) return global;
        throw Error("unable to locate global object")
    }();
    "function" != typeof d.Promise ? d.Promise = r : (d.Promise.prototype["finally"] || (d.Promise.prototype["finally"] = e), d.Promise.allSettled || (d.Promise.allSettled = t))
});