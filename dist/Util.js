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
}
exports.default = Util;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9VdGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsTUFBcUIsSUFBSTtJQUNkLE1BQU0sQ0FBQyxHQUFHLENBQUksRUFBVztRQUM1QixJQUFJO1lBQ0EsT0FBTyxFQUFFLEVBQUUsQ0FBQztTQUNmO1FBQUMsV0FBTTtZQUNKLE9BQU8sU0FBUyxDQUFDO1NBQ3BCO0lBQ0wsQ0FBQztJQUVNLE1BQU0sQ0FBTyxVQUFVLENBQUksRUFBb0I7O1lBQ2xELElBQUk7Z0JBQ0EsT0FBTyxNQUFNLEVBQUUsRUFBRSxDQUFDO2FBQ3JCO1lBQUMsV0FBTTtnQkFDSixPQUFPLFNBQVMsQ0FBQzthQUNwQjtRQUNMLENBQUM7S0FBQTtDQUNKO0FBaEJELHVCQWdCQyJ9