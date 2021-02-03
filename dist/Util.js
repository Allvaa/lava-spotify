"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const v8_1 = require("v8");
class Util {
    static try(fn) {
        try {
            return fn();
        }
        catch (_a) {
            return undefined;
        }
    }
    static tryPromise(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield fn();
            }
            catch (_a) {
                return undefined;
            }
        });
    }
    static structuredClone(obj) {
        return v8_1.deserialize(v8_1.serialize(obj));
    }
}
exports.default = Util;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9VdGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsMkJBQTRDO0FBQzVDLE1BQXFCLElBQUk7SUFDZCxNQUFNLENBQUMsR0FBRyxDQUFJLEVBQVc7UUFDNUIsSUFBSTtZQUNBLE9BQU8sRUFBRSxFQUFFLENBQUM7U0FDZjtRQUFDLFdBQU07WUFDSixPQUFPLFNBQVMsQ0FBQztTQUNwQjtJQUNMLENBQUM7SUFFTSxNQUFNLENBQU8sVUFBVSxDQUFJLEVBQW9COztZQUNsRCxJQUFJO2dCQUNBLE9BQU8sTUFBTSxFQUFFLEVBQUUsQ0FBQzthQUNyQjtZQUFDLFdBQU07Z0JBQ0osT0FBTyxTQUFTLENBQUM7YUFDcEI7UUFDTCxDQUFDO0tBQUE7SUFFTSxNQUFNLENBQUMsZUFBZSxDQUFJLEdBQU07UUFDbkMsT0FBTyxnQkFBVyxDQUFDLGNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBTSxDQUFDO0lBQzVDLENBQUM7Q0FDSjtBQXBCRCx1QkFvQkMifQ==