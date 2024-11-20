"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/rlp@2.2.7";
exports.ids = ["vendor-chunks/rlp@2.2.7"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/rlp@2.2.7/node_modules/rlp/dist/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/.pnpm/rlp@2.2.7/node_modules/rlp/dist/index.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.getLength = exports.decode = exports.encode = void 0;\nconst bn_js_1 = __importDefault(__webpack_require__(/*! bn.js */ \"(ssr)/./node_modules/.pnpm/bn.js@5.2.1/node_modules/bn.js/lib/bn.js\"));\n/**\n * RLP Encoding based on: https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP\n * This function takes in a data, convert it to buffer if not, and a length for recursion\n * @param input - will be converted to buffer\n * @returns returns buffer of encoded data\n **/\nfunction encode(input) {\n    if (Array.isArray(input)) {\n        const output = [];\n        for (let i = 0; i < input.length; i++) {\n            output.push(encode(input[i]));\n        }\n        const buf = Buffer.concat(output);\n        return Buffer.concat([encodeLength(buf.length, 192), buf]);\n    }\n    else {\n        const inputBuf = toBuffer(input);\n        return inputBuf.length === 1 && inputBuf[0] < 128\n            ? inputBuf\n            : Buffer.concat([encodeLength(inputBuf.length, 128), inputBuf]);\n    }\n}\nexports.encode = encode;\n/**\n * Parse integers. Check if there is no leading zeros\n * @param v The value to parse\n * @param base The base to parse the integer into\n */\nfunction safeParseInt(v, base) {\n    if (v[0] === '0' && v[1] === '0') {\n        throw new Error('invalid RLP: extra zeros');\n    }\n    return parseInt(v, base);\n}\nfunction encodeLength(len, offset) {\n    if (len < 56) {\n        return Buffer.from([len + offset]);\n    }\n    else {\n        const hexLength = intToHex(len);\n        const lLength = hexLength.length / 2;\n        const firstByte = intToHex(offset + 55 + lLength);\n        return Buffer.from(firstByte + hexLength, 'hex');\n    }\n}\nfunction decode(input, stream = false) {\n    if (!input || input.length === 0) {\n        return Buffer.from([]);\n    }\n    const inputBuffer = toBuffer(input);\n    const decoded = _decode(inputBuffer);\n    if (stream) {\n        return decoded;\n    }\n    if (decoded.remainder.length !== 0) {\n        throw new Error('invalid remainder');\n    }\n    return decoded.data;\n}\nexports.decode = decode;\n/**\n * Get the length of the RLP input\n * @param input\n * @returns The length of the input or an empty Buffer if no input\n */\nfunction getLength(input) {\n    if (!input || input.length === 0) {\n        return Buffer.from([]);\n    }\n    const inputBuffer = toBuffer(input);\n    const firstByte = inputBuffer[0];\n    if (firstByte <= 0x7f) {\n        return inputBuffer.length;\n    }\n    else if (firstByte <= 0xb7) {\n        return firstByte - 0x7f;\n    }\n    else if (firstByte <= 0xbf) {\n        return firstByte - 0xb6;\n    }\n    else if (firstByte <= 0xf7) {\n        // a list between  0-55 bytes long\n        return firstByte - 0xbf;\n    }\n    else {\n        // a list  over 55 bytes long\n        const llength = firstByte - 0xf6;\n        const length = safeParseInt(inputBuffer.slice(1, llength).toString('hex'), 16);\n        return llength + length;\n    }\n}\nexports.getLength = getLength;\n/** Decode an input with RLP */\nfunction _decode(input) {\n    let length, llength, data, innerRemainder, d;\n    const decoded = [];\n    const firstByte = input[0];\n    if (firstByte <= 0x7f) {\n        // a single byte whose value is in the [0x00, 0x7f] range, that byte is its own RLP encoding.\n        return {\n            data: input.slice(0, 1),\n            remainder: input.slice(1),\n        };\n    }\n    else if (firstByte <= 0xb7) {\n        // string is 0-55 bytes long. A single byte with value 0x80 plus the length of the string followed by the string\n        // The range of the first byte is [0x80, 0xb7]\n        length = firstByte - 0x7f;\n        // set 0x80 null to 0\n        if (firstByte === 0x80) {\n            data = Buffer.from([]);\n        }\n        else {\n            data = input.slice(1, length);\n        }\n        if (length === 2 && data[0] < 0x80) {\n            throw new Error('invalid rlp encoding: byte must be less 0x80');\n        }\n        return {\n            data: data,\n            remainder: input.slice(length),\n        };\n    }\n    else if (firstByte <= 0xbf) {\n        // string is greater than 55 bytes long. A single byte with the value (0xb7 plus the length of the length),\n        // followed by the length, followed by the string\n        llength = firstByte - 0xb6;\n        if (input.length - 1 < llength) {\n            throw new Error('invalid RLP: not enough bytes for string length');\n        }\n        length = safeParseInt(input.slice(1, llength).toString('hex'), 16);\n        if (length <= 55) {\n            throw new Error('invalid RLP: expected string length to be greater than 55');\n        }\n        data = input.slice(llength, length + llength);\n        if (data.length < length) {\n            throw new Error('invalid RLP: not enough bytes for string');\n        }\n        return {\n            data: data,\n            remainder: input.slice(length + llength),\n        };\n    }\n    else if (firstByte <= 0xf7) {\n        // a list between  0-55 bytes long\n        length = firstByte - 0xbf;\n        innerRemainder = input.slice(1, length);\n        while (innerRemainder.length) {\n            d = _decode(innerRemainder);\n            decoded.push(d.data);\n            innerRemainder = d.remainder;\n        }\n        return {\n            data: decoded,\n            remainder: input.slice(length),\n        };\n    }\n    else {\n        // a list  over 55 bytes long\n        llength = firstByte - 0xf6;\n        length = safeParseInt(input.slice(1, llength).toString('hex'), 16);\n        const totalLength = llength + length;\n        if (totalLength > input.length) {\n            throw new Error('invalid rlp: total length is larger than the data');\n        }\n        innerRemainder = input.slice(llength, totalLength);\n        if (innerRemainder.length === 0) {\n            throw new Error('invalid rlp, List has a invalid length');\n        }\n        while (innerRemainder.length) {\n            d = _decode(innerRemainder);\n            decoded.push(d.data);\n            innerRemainder = d.remainder;\n        }\n        return {\n            data: decoded,\n            remainder: input.slice(totalLength),\n        };\n    }\n}\n/** Check if a string is prefixed by 0x */\nfunction isHexPrefixed(str) {\n    return str.slice(0, 2) === '0x';\n}\n/** Removes 0x from a given String */\nfunction stripHexPrefix(str) {\n    if (typeof str !== 'string') {\n        return str;\n    }\n    return isHexPrefixed(str) ? str.slice(2) : str;\n}\n/** Transform an integer into its hexadecimal value */\nfunction intToHex(integer) {\n    if (integer < 0) {\n        throw new Error('Invalid integer as argument, must be unsigned!');\n    }\n    const hex = integer.toString(16);\n    return hex.length % 2 ? `0${hex}` : hex;\n}\n/** Pad a string to be even */\nfunction padToEven(a) {\n    return a.length % 2 ? `0${a}` : a;\n}\n/** Transform an integer into a Buffer */\nfunction intToBuffer(integer) {\n    const hex = intToHex(integer);\n    return Buffer.from(hex, 'hex');\n}\n/** Transform anything into a Buffer */\nfunction toBuffer(v) {\n    if (!Buffer.isBuffer(v)) {\n        if (typeof v === 'string') {\n            if (isHexPrefixed(v)) {\n                return Buffer.from(padToEven(stripHexPrefix(v)), 'hex');\n            }\n            else {\n                return Buffer.from(v);\n            }\n        }\n        else if (typeof v === 'number' || typeof v === 'bigint') {\n            if (!v) {\n                return Buffer.from([]);\n            }\n            else {\n                return intToBuffer(v);\n            }\n        }\n        else if (v === null || v === undefined) {\n            return Buffer.from([]);\n        }\n        else if (v instanceof Uint8Array) {\n            return Buffer.from(v);\n        }\n        else if (bn_js_1.default.isBN(v)) {\n            // converts a BN to a Buffer\n            return Buffer.from(v.toArray());\n        }\n        else {\n            throw new Error('invalid type');\n        }\n    }\n    return v;\n}\n//# sourceMappingURL=index.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vcmxwQDIuMi43L25vZGVfbW9kdWxlcy9ybHAvZGlzdC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBYTtBQUNiO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGlCQUFpQixHQUFHLGNBQWMsR0FBRyxjQUFjO0FBQ25ELGdDQUFnQyxtQkFBTyxDQUFDLGtGQUFPO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixrQkFBa0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsSUFBSTtBQUNwQztBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsRUFBRTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYWZlLXBhc3NrZXlzLXR1dG9yaWFsLy4vbm9kZV9tb2R1bGVzLy5wbnBtL3JscEAyLjIuNy9ub2RlX21vZHVsZXMvcmxwL2Rpc3QvaW5kZXguanM/Y2IwNSJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2V0TGVuZ3RoID0gZXhwb3J0cy5kZWNvZGUgPSBleHBvcnRzLmVuY29kZSA9IHZvaWQgMDtcbmNvbnN0IGJuX2pzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImJuLmpzXCIpKTtcbi8qKlxuICogUkxQIEVuY29kaW5nIGJhc2VkIG9uOiBodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW0vd2lraS93aWtpLyU1QkVuZ2xpc2glNUQtUkxQXG4gKiBUaGlzIGZ1bmN0aW9uIHRha2VzIGluIGEgZGF0YSwgY29udmVydCBpdCB0byBidWZmZXIgaWYgbm90LCBhbmQgYSBsZW5ndGggZm9yIHJlY3Vyc2lvblxuICogQHBhcmFtIGlucHV0IC0gd2lsbCBiZSBjb252ZXJ0ZWQgdG8gYnVmZmVyXG4gKiBAcmV0dXJucyByZXR1cm5zIGJ1ZmZlciBvZiBlbmNvZGVkIGRhdGFcbiAqKi9cbmZ1bmN0aW9uIGVuY29kZShpbnB1dCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGlucHV0KSkge1xuICAgICAgICBjb25zdCBvdXRwdXQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgb3V0cHV0LnB1c2goZW5jb2RlKGlucHV0W2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYnVmID0gQnVmZmVyLmNvbmNhdChvdXRwdXQpO1xuICAgICAgICByZXR1cm4gQnVmZmVyLmNvbmNhdChbZW5jb2RlTGVuZ3RoKGJ1Zi5sZW5ndGgsIDE5MiksIGJ1Zl0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgaW5wdXRCdWYgPSB0b0J1ZmZlcihpbnB1dCk7XG4gICAgICAgIHJldHVybiBpbnB1dEJ1Zi5sZW5ndGggPT09IDEgJiYgaW5wdXRCdWZbMF0gPCAxMjhcbiAgICAgICAgICAgID8gaW5wdXRCdWZcbiAgICAgICAgICAgIDogQnVmZmVyLmNvbmNhdChbZW5jb2RlTGVuZ3RoKGlucHV0QnVmLmxlbmd0aCwgMTI4KSwgaW5wdXRCdWZdKTtcbiAgICB9XG59XG5leHBvcnRzLmVuY29kZSA9IGVuY29kZTtcbi8qKlxuICogUGFyc2UgaW50ZWdlcnMuIENoZWNrIGlmIHRoZXJlIGlzIG5vIGxlYWRpbmcgemVyb3NcbiAqIEBwYXJhbSB2IFRoZSB2YWx1ZSB0byBwYXJzZVxuICogQHBhcmFtIGJhc2UgVGhlIGJhc2UgdG8gcGFyc2UgdGhlIGludGVnZXIgaW50b1xuICovXG5mdW5jdGlvbiBzYWZlUGFyc2VJbnQodiwgYmFzZSkge1xuICAgIGlmICh2WzBdID09PSAnMCcgJiYgdlsxXSA9PT0gJzAnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBSTFA6IGV4dHJhIHplcm9zJyk7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZUludCh2LCBiYXNlKTtcbn1cbmZ1bmN0aW9uIGVuY29kZUxlbmd0aChsZW4sIG9mZnNldCkge1xuICAgIGlmIChsZW4gPCA1Nikge1xuICAgICAgICByZXR1cm4gQnVmZmVyLmZyb20oW2xlbiArIG9mZnNldF0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgaGV4TGVuZ3RoID0gaW50VG9IZXgobGVuKTtcbiAgICAgICAgY29uc3QgbExlbmd0aCA9IGhleExlbmd0aC5sZW5ndGggLyAyO1xuICAgICAgICBjb25zdCBmaXJzdEJ5dGUgPSBpbnRUb0hleChvZmZzZXQgKyA1NSArIGxMZW5ndGgpO1xuICAgICAgICByZXR1cm4gQnVmZmVyLmZyb20oZmlyc3RCeXRlICsgaGV4TGVuZ3RoLCAnaGV4Jyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGVjb2RlKGlucHV0LCBzdHJlYW0gPSBmYWxzZSkge1xuICAgIGlmICghaW5wdXQgfHwgaW5wdXQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBCdWZmZXIuZnJvbShbXSk7XG4gICAgfVxuICAgIGNvbnN0IGlucHV0QnVmZmVyID0gdG9CdWZmZXIoaW5wdXQpO1xuICAgIGNvbnN0IGRlY29kZWQgPSBfZGVjb2RlKGlucHV0QnVmZmVyKTtcbiAgICBpZiAoc3RyZWFtKSB7XG4gICAgICAgIHJldHVybiBkZWNvZGVkO1xuICAgIH1cbiAgICBpZiAoZGVjb2RlZC5yZW1haW5kZXIubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCByZW1haW5kZXInKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlY29kZWQuZGF0YTtcbn1cbmV4cG9ydHMuZGVjb2RlID0gZGVjb2RlO1xuLyoqXG4gKiBHZXQgdGhlIGxlbmd0aCBvZiB0aGUgUkxQIGlucHV0XG4gKiBAcGFyYW0gaW5wdXRcbiAqIEByZXR1cm5zIFRoZSBsZW5ndGggb2YgdGhlIGlucHV0IG9yIGFuIGVtcHR5IEJ1ZmZlciBpZiBubyBpbnB1dFxuICovXG5mdW5jdGlvbiBnZXRMZW5ndGgoaW5wdXQpIHtcbiAgICBpZiAoIWlucHV0IHx8IGlucHV0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gQnVmZmVyLmZyb20oW10pO1xuICAgIH1cbiAgICBjb25zdCBpbnB1dEJ1ZmZlciA9IHRvQnVmZmVyKGlucHV0KTtcbiAgICBjb25zdCBmaXJzdEJ5dGUgPSBpbnB1dEJ1ZmZlclswXTtcbiAgICBpZiAoZmlyc3RCeXRlIDw9IDB4N2YpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0QnVmZmVyLmxlbmd0aDtcbiAgICB9XG4gICAgZWxzZSBpZiAoZmlyc3RCeXRlIDw9IDB4YjcpIHtcbiAgICAgICAgcmV0dXJuIGZpcnN0Qnl0ZSAtIDB4N2Y7XG4gICAgfVxuICAgIGVsc2UgaWYgKGZpcnN0Qnl0ZSA8PSAweGJmKSB7XG4gICAgICAgIHJldHVybiBmaXJzdEJ5dGUgLSAweGI2O1xuICAgIH1cbiAgICBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhmNykge1xuICAgICAgICAvLyBhIGxpc3QgYmV0d2VlbiAgMC01NSBieXRlcyBsb25nXG4gICAgICAgIHJldHVybiBmaXJzdEJ5dGUgLSAweGJmO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gYSBsaXN0ICBvdmVyIDU1IGJ5dGVzIGxvbmdcbiAgICAgICAgY29uc3QgbGxlbmd0aCA9IGZpcnN0Qnl0ZSAtIDB4ZjY7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHNhZmVQYXJzZUludChpbnB1dEJ1ZmZlci5zbGljZSgxLCBsbGVuZ3RoKS50b1N0cmluZygnaGV4JyksIDE2KTtcbiAgICAgICAgcmV0dXJuIGxsZW5ndGggKyBsZW5ndGg7XG4gICAgfVxufVxuZXhwb3J0cy5nZXRMZW5ndGggPSBnZXRMZW5ndGg7XG4vKiogRGVjb2RlIGFuIGlucHV0IHdpdGggUkxQICovXG5mdW5jdGlvbiBfZGVjb2RlKGlucHV0KSB7XG4gICAgbGV0IGxlbmd0aCwgbGxlbmd0aCwgZGF0YSwgaW5uZXJSZW1haW5kZXIsIGQ7XG4gICAgY29uc3QgZGVjb2RlZCA9IFtdO1xuICAgIGNvbnN0IGZpcnN0Qnl0ZSA9IGlucHV0WzBdO1xuICAgIGlmIChmaXJzdEJ5dGUgPD0gMHg3Zikge1xuICAgICAgICAvLyBhIHNpbmdsZSBieXRlIHdob3NlIHZhbHVlIGlzIGluIHRoZSBbMHgwMCwgMHg3Zl0gcmFuZ2UsIHRoYXQgYnl0ZSBpcyBpdHMgb3duIFJMUCBlbmNvZGluZy5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRhdGE6IGlucHV0LnNsaWNlKDAsIDEpLFxuICAgICAgICAgICAgcmVtYWluZGVyOiBpbnB1dC5zbGljZSgxKSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZmlyc3RCeXRlIDw9IDB4YjcpIHtcbiAgICAgICAgLy8gc3RyaW5nIGlzIDAtNTUgYnl0ZXMgbG9uZy4gQSBzaW5nbGUgYnl0ZSB3aXRoIHZhbHVlIDB4ODAgcGx1cyB0aGUgbGVuZ3RoIG9mIHRoZSBzdHJpbmcgZm9sbG93ZWQgYnkgdGhlIHN0cmluZ1xuICAgICAgICAvLyBUaGUgcmFuZ2Ugb2YgdGhlIGZpcnN0IGJ5dGUgaXMgWzB4ODAsIDB4YjddXG4gICAgICAgIGxlbmd0aCA9IGZpcnN0Qnl0ZSAtIDB4N2Y7XG4gICAgICAgIC8vIHNldCAweDgwIG51bGwgdG8gMFxuICAgICAgICBpZiAoZmlyc3RCeXRlID09PSAweDgwKSB7XG4gICAgICAgICAgICBkYXRhID0gQnVmZmVyLmZyb20oW10pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGF0YSA9IGlucHV0LnNsaWNlKDEsIGxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMiAmJiBkYXRhWzBdIDwgMHg4MCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHJscCBlbmNvZGluZzogYnl0ZSBtdXN0IGJlIGxlc3MgMHg4MCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgcmVtYWluZGVyOiBpbnB1dC5zbGljZShsZW5ndGgpLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIGlmIChmaXJzdEJ5dGUgPD0gMHhiZikge1xuICAgICAgICAvLyBzdHJpbmcgaXMgZ3JlYXRlciB0aGFuIDU1IGJ5dGVzIGxvbmcuIEEgc2luZ2xlIGJ5dGUgd2l0aCB0aGUgdmFsdWUgKDB4YjcgcGx1cyB0aGUgbGVuZ3RoIG9mIHRoZSBsZW5ndGgpLFxuICAgICAgICAvLyBmb2xsb3dlZCBieSB0aGUgbGVuZ3RoLCBmb2xsb3dlZCBieSB0aGUgc3RyaW5nXG4gICAgICAgIGxsZW5ndGggPSBmaXJzdEJ5dGUgLSAweGI2O1xuICAgICAgICBpZiAoaW5wdXQubGVuZ3RoIC0gMSA8IGxsZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBSTFA6IG5vdCBlbm91Z2ggYnl0ZXMgZm9yIHN0cmluZyBsZW5ndGgnKTtcbiAgICAgICAgfVxuICAgICAgICBsZW5ndGggPSBzYWZlUGFyc2VJbnQoaW5wdXQuc2xpY2UoMSwgbGxlbmd0aCkudG9TdHJpbmcoJ2hleCcpLCAxNik7XG4gICAgICAgIGlmIChsZW5ndGggPD0gNTUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBSTFA6IGV4cGVjdGVkIHN0cmluZyBsZW5ndGggdG8gYmUgZ3JlYXRlciB0aGFuIDU1Jyk7XG4gICAgICAgIH1cbiAgICAgICAgZGF0YSA9IGlucHV0LnNsaWNlKGxsZW5ndGgsIGxlbmd0aCArIGxsZW5ndGgpO1xuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBSTFA6IG5vdCBlbm91Z2ggYnl0ZXMgZm9yIHN0cmluZycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgcmVtYWluZGVyOiBpbnB1dC5zbGljZShsZW5ndGggKyBsbGVuZ3RoKSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZmlyc3RCeXRlIDw9IDB4ZjcpIHtcbiAgICAgICAgLy8gYSBsaXN0IGJldHdlZW4gIDAtNTUgYnl0ZXMgbG9uZ1xuICAgICAgICBsZW5ndGggPSBmaXJzdEJ5dGUgLSAweGJmO1xuICAgICAgICBpbm5lclJlbWFpbmRlciA9IGlucHV0LnNsaWNlKDEsIGxlbmd0aCk7XG4gICAgICAgIHdoaWxlIChpbm5lclJlbWFpbmRlci5sZW5ndGgpIHtcbiAgICAgICAgICAgIGQgPSBfZGVjb2RlKGlubmVyUmVtYWluZGVyKTtcbiAgICAgICAgICAgIGRlY29kZWQucHVzaChkLmRhdGEpO1xuICAgICAgICAgICAgaW5uZXJSZW1haW5kZXIgPSBkLnJlbWFpbmRlcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF0YTogZGVjb2RlZCxcbiAgICAgICAgICAgIHJlbWFpbmRlcjogaW5wdXQuc2xpY2UobGVuZ3RoKSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGEgbGlzdCAgb3ZlciA1NSBieXRlcyBsb25nXG4gICAgICAgIGxsZW5ndGggPSBmaXJzdEJ5dGUgLSAweGY2O1xuICAgICAgICBsZW5ndGggPSBzYWZlUGFyc2VJbnQoaW5wdXQuc2xpY2UoMSwgbGxlbmd0aCkudG9TdHJpbmcoJ2hleCcpLCAxNik7XG4gICAgICAgIGNvbnN0IHRvdGFsTGVuZ3RoID0gbGxlbmd0aCArIGxlbmd0aDtcbiAgICAgICAgaWYgKHRvdGFsTGVuZ3RoID4gaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcmxwOiB0b3RhbCBsZW5ndGggaXMgbGFyZ2VyIHRoYW4gdGhlIGRhdGEnKTtcbiAgICAgICAgfVxuICAgICAgICBpbm5lclJlbWFpbmRlciA9IGlucHV0LnNsaWNlKGxsZW5ndGgsIHRvdGFsTGVuZ3RoKTtcbiAgICAgICAgaWYgKGlubmVyUmVtYWluZGVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHJscCwgTGlzdCBoYXMgYSBpbnZhbGlkIGxlbmd0aCcpO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChpbm5lclJlbWFpbmRlci5sZW5ndGgpIHtcbiAgICAgICAgICAgIGQgPSBfZGVjb2RlKGlubmVyUmVtYWluZGVyKTtcbiAgICAgICAgICAgIGRlY29kZWQucHVzaChkLmRhdGEpO1xuICAgICAgICAgICAgaW5uZXJSZW1haW5kZXIgPSBkLnJlbWFpbmRlcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF0YTogZGVjb2RlZCxcbiAgICAgICAgICAgIHJlbWFpbmRlcjogaW5wdXQuc2xpY2UodG90YWxMZW5ndGgpLFxuICAgICAgICB9O1xuICAgIH1cbn1cbi8qKiBDaGVjayBpZiBhIHN0cmluZyBpcyBwcmVmaXhlZCBieSAweCAqL1xuZnVuY3Rpb24gaXNIZXhQcmVmaXhlZChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnNsaWNlKDAsIDIpID09PSAnMHgnO1xufVxuLyoqIFJlbW92ZXMgMHggZnJvbSBhIGdpdmVuIFN0cmluZyAqL1xuZnVuY3Rpb24gc3RyaXBIZXhQcmVmaXgoc3RyKSB7XG4gICAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIHJldHVybiBpc0hleFByZWZpeGVkKHN0cikgPyBzdHIuc2xpY2UoMikgOiBzdHI7XG59XG4vKiogVHJhbnNmb3JtIGFuIGludGVnZXIgaW50byBpdHMgaGV4YWRlY2ltYWwgdmFsdWUgKi9cbmZ1bmN0aW9uIGludFRvSGV4KGludGVnZXIpIHtcbiAgICBpZiAoaW50ZWdlciA8IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGludGVnZXIgYXMgYXJndW1lbnQsIG11c3QgYmUgdW5zaWduZWQhJyk7XG4gICAgfVxuICAgIGNvbnN0IGhleCA9IGludGVnZXIudG9TdHJpbmcoMTYpO1xuICAgIHJldHVybiBoZXgubGVuZ3RoICUgMiA/IGAwJHtoZXh9YCA6IGhleDtcbn1cbi8qKiBQYWQgYSBzdHJpbmcgdG8gYmUgZXZlbiAqL1xuZnVuY3Rpb24gcGFkVG9FdmVuKGEpIHtcbiAgICByZXR1cm4gYS5sZW5ndGggJSAyID8gYDAke2F9YCA6IGE7XG59XG4vKiogVHJhbnNmb3JtIGFuIGludGVnZXIgaW50byBhIEJ1ZmZlciAqL1xuZnVuY3Rpb24gaW50VG9CdWZmZXIoaW50ZWdlcikge1xuICAgIGNvbnN0IGhleCA9IGludFRvSGV4KGludGVnZXIpO1xuICAgIHJldHVybiBCdWZmZXIuZnJvbShoZXgsICdoZXgnKTtcbn1cbi8qKiBUcmFuc2Zvcm0gYW55dGhpbmcgaW50byBhIEJ1ZmZlciAqL1xuZnVuY3Rpb24gdG9CdWZmZXIodikge1xuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKHYpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChpc0hleFByZWZpeGVkKHYpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHBhZFRvRXZlbihzdHJpcEhleFByZWZpeCh2KSksICdoZXgnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBCdWZmZXIuZnJvbSh2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHYgPT09ICdiaWdpbnQnKSB7XG4gICAgICAgICAgICBpZiAoIXYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQnVmZmVyLmZyb20oW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGludFRvQnVmZmVyKHYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gQnVmZmVyLmZyb20oW10pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHYgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgICAgICByZXR1cm4gQnVmZmVyLmZyb20odik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYm5fanNfMS5kZWZhdWx0LmlzQk4odikpIHtcbiAgICAgICAgICAgIC8vIGNvbnZlcnRzIGEgQk4gdG8gYSBCdWZmZXJcbiAgICAgICAgICAgIHJldHVybiBCdWZmZXIuZnJvbSh2LnRvQXJyYXkoKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgdHlwZScpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/rlp@2.2.7/node_modules/rlp/dist/index.js\n");

/***/ })

};
;