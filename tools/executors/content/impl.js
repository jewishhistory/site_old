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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var gitly_1 = require("gitly");
var lodash_1 = require("lodash");
var colorette_1 = require("colorette");
var parse_1 = require("./parser/parse");
var log = {
    success: function (title, message) {
        return console.log((0, colorette_1.greenBright)(' >'), (0, colorette_1.bold)((0, colorette_1.bgGreenBright)((0, colorette_1.black)(" " + title.toUpperCase() + " "))), (0, colorette_1.greenBright)(message));
    },
    error: function (title, message) {
        return console.log((0, colorette_1.redBright)(' >'), (0, colorette_1.bold)((0, colorette_1.bgRedBright)((0, colorette_1.black)(" " + title.toUpperCase() + " "))), (0, colorette_1.redBright)(message));
    }
};
function contentExecutor(options, context) {
    return __awaiter(this, void 0, void 0, function () {
        var source, contentDir, isSuccessDownload, files, _i, files_1, file, content, entity, filename, data, person, eraFileName, era, era, eraFileName, era, era, _a, _b, person, personFileName, personObj, personObj;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, gitly_1.download)(options.repository)];
                case 1:
                    source = _c.sent();
                    return [4 /*yield*/, (0, gitly_1.extract)(source, './content')];
                case 2:
                    contentDir = _c.sent();
                    isSuccessDownload = Boolean(contentDir);
                    if (!isSuccessDownload) {
                        return [2 /*return*/, { success: false }];
                    }
                    log.success('Downloading content', 'success');
                    files = fs.readdirSync(contentDir)
                        .filter(function (f) { return f.match(/.md$/); });
                    for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                        file = files_1[_i];
                        content = fs.readFileSync(path.join(contentDir, file), { encoding: 'utf8' });
                        entity = (0, parse_1.parse)(content);
                        filename = path.join(contentDir, entity.code + ".json");
                        if (entity.type === 'era') {
                            if (fs.existsSync(filename)) {
                                fs.writeFileSync(filename, JSON.stringify(entity, null, 2));
                            }
                            else {
                                data = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }));
                                fs.writeFileSync(filename, JSON.stringify((0, lodash_1.merge)({}, data, entity)));
                            }
                        }
                        if (entity.type === 'person') {
                            if (fs.existsSync(filename)) {
                                person = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }));
                                fs.writeFileSync(filename, JSON.stringify((0, lodash_1.merge)({}, person, entity), null, 2));
                            }
                            else {
                                fs.writeFileSync(filename, JSON.stringify(entity, null, 2));
                            }
                            eraFileName = path.join(contentDir, entity.era + ".json");
                            if (fs.existsSync(eraFileName)) {
                                era = JSON.parse(fs.readFileSync(eraFileName, { encoding: 'utf8' }));
                                era.persons = era.persons || [];
                                era.persons.push(entity.code);
                                fs.writeFileSync(eraFileName, JSON.stringify(era, null, 2));
                            }
                            else {
                                era = { type: 'era', code: entity.era, persons: [entity.code] };
                                fs.writeFileSync(eraFileName, JSON.stringify(era, null, 2));
                            }
                        }
                        if (entity.type === 'event') {
                            fs.writeFileSync(filename, JSON.stringify(entity, null, 2));
                            eraFileName = path.join(contentDir, entity.era + ".json");
                            if (fs.existsSync(eraFileName)) {
                                era = JSON.parse(fs.readFileSync(eraFileName, { encoding: 'utf8' }));
                                era.events = era.events || [];
                                era.events.push(entity.code);
                                fs.writeFileSync(eraFileName, JSON.stringify(era, null, 2));
                            }
                            else {
                                era = { type: 'era', code: entity.era, events: [entity.code] };
                                fs.writeFileSync(eraFileName, JSON.stringify(era, null, 2));
                            }
                            for (_a = 0, _b = entity.persons; _a < _b.length; _a++) {
                                person = _b[_a];
                                personFileName = path.join(contentDir, person + ".json");
                                if (fs.existsSync(personFileName)) {
                                    personObj = JSON.parse(fs.readFileSync(personFileName, { encoding: 'utf8' }));
                                    personObj.events = personObj.events || [];
                                    personObj.events.push(entity.code);
                                    fs.writeFileSync(personFileName, JSON.stringify(personObj, null, 2));
                                }
                                else {
                                    personObj = { type: 'person', code: person, events: [entity.code] };
                                    fs.writeFileSync(personFileName, JSON.stringify(personObj, null, 2));
                                }
                            }
                        }
                    }
                    log.success('Parse meta', 'success');
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
exports["default"] = contentExecutor;
