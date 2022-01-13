/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./tools/executors/content/impl.ts":
/*!*****************************************!*\
  !*** ./tools/executors/content/impl.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst fs = __importStar(__webpack_require__(/*! fs */ \"fs\"));\nconst path = __importStar(__webpack_require__(/*! path */ \"path\"));\nconst util = __importStar(__webpack_require__(/*! util */ \"util\"));\nconst child_process = __importStar(__webpack_require__(/*! child_process */ \"child_process\"));\nconst gitly_1 = __webpack_require__(/*! gitly */ \"gitly\");\nconst lodash_1 = __webpack_require__(/*! lodash */ \"lodash\");\nconst colorette_1 = __webpack_require__(/*! colorette */ \"colorette\");\nconst parse_1 = __webpack_require__(/*! ./parser/parse */ \"./tools/executors/content/parser/parse.ts\");\nconst exec = util.promisify(child_process.exec);\nconst log = {\n    success: (title, message) => console.log((0, colorette_1.greenBright)(' >'), (0, colorette_1.bold)((0, colorette_1.bgGreenBright)((0, colorette_1.black)(` ${title.toUpperCase()} `))), (0, colorette_1.greenBright)(message)),\n    error: (title, message) => console.log((0, colorette_1.redBright)(' >'), (0, colorette_1.bold)((0, colorette_1.bgRedBright)((0, colorette_1.black)(` ${title.toUpperCase()} `))), (0, colorette_1.redBright)(message)),\n};\nfunction contentExecutor(options, context) {\n    return __awaiter(this, void 0, void 0, function* () {\n        const { stderr } = yield exec('rm -rf ./content');\n        if (stderr) {\n            return { success: false };\n        }\n        log.success('Cleaning content directory', 'success');\n        const source = yield (0, gitly_1.download)(options.repository);\n        const contentDir = yield (0, gitly_1.extract)(source, './content');\n        const isSuccessDownload = Boolean(contentDir);\n        if (!isSuccessDownload) {\n            return { success: false };\n        }\n        log.success('Downloading content', 'success');\n        const index = {\n            era: [],\n            person: [],\n            event: [],\n        };\n        const indexFile = path.join(contentDir, 'index.json');\n        fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));\n        const files = fs.readdirSync(contentDir)\n            .filter((f) => f.match(/.md$/));\n        for (const file of files) {\n            const content = fs.readFileSync(path.join(contentDir, file), { encoding: 'utf8' });\n            const entity = (0, parse_1.parse)(content);\n            const filename = path.join(contentDir, `${entity.code}.json`);\n            const currentIndex = JSON.parse(fs.readFileSync(indexFile, { encoding: 'utf8' }));\n            currentIndex[entity.type].push(filename);\n            fs.writeFileSync(indexFile, JSON.stringify(currentIndex, null, 2));\n            entity.path = path.join(contentDir, file);\n            if (entity.type === 'era') {\n                if (fs.existsSync(filename)) {\n                    const data = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }));\n                    fs.writeFileSync(filename, JSON.stringify((0, lodash_1.merge)({}, data, entity)));\n                }\n                else {\n                    fs.writeFileSync(filename, JSON.stringify(entity, null, 2));\n                }\n            }\n            if (entity.type === 'person') {\n                if (fs.existsSync(filename)) {\n                    const person = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }));\n                    fs.writeFileSync(filename, JSON.stringify((0, lodash_1.merge)({}, person, entity), null, 2));\n                }\n                else {\n                    fs.writeFileSync(filename, JSON.stringify(entity, null, 2));\n                }\n                const eraFileName = path.join(contentDir, `${entity.era}.json`);\n                if (fs.existsSync(eraFileName)) {\n                    const era = JSON.parse(fs.readFileSync(eraFileName, { encoding: 'utf8' }));\n                    era.persons = era.persons || [];\n                    era.persons.push(entity.code);\n                    fs.writeFileSync(eraFileName, JSON.stringify(era, null, 2));\n                }\n                else {\n                    const era = { type: 'era', code: entity.era, persons: [entity.code] };\n                    fs.writeFileSync(eraFileName, JSON.stringify(era, null, 2));\n                }\n            }\n            if (entity.type === 'event') {\n                fs.writeFileSync(filename, JSON.stringify(entity, null, 2));\n                const eraFileName = path.join(contentDir, `${entity.era}.json`);\n                if (fs.existsSync(eraFileName)) {\n                    const era = JSON.parse(fs.readFileSync(eraFileName, { encoding: 'utf8' }));\n                    era.events = era.events || [];\n                    era.events.push(entity.code);\n                    fs.writeFileSync(eraFileName, JSON.stringify(era, null, 2));\n                }\n                else {\n                    const era = { type: 'era', code: entity.era, events: [entity.code] };\n                    fs.writeFileSync(eraFileName, JSON.stringify(era, null, 2));\n                }\n                for (const person of entity.persons) {\n                    const personFileName = path.join(contentDir, `${person}.json`);\n                    if (fs.existsSync(personFileName)) {\n                        const personObj = JSON.parse(fs.readFileSync(personFileName, { encoding: 'utf8' }));\n                        personObj.events = personObj.events || [];\n                        personObj.events.push(entity.code);\n                        fs.writeFileSync(personFileName, JSON.stringify(personObj, null, 2));\n                    }\n                    else {\n                        const personObj = { type: 'person', code: person, events: [entity.code] };\n                        fs.writeFileSync(personFileName, JSON.stringify(personObj, null, 2));\n                    }\n                }\n            }\n        }\n        log.success('Parse meta', 'success');\n        return { success: true };\n    });\n}\nexports[\"default\"] = contentExecutor;\n\n\n//# sourceURL=webpack://jewishhistory/./tools/executors/content/impl.ts?");

/***/ }),

/***/ "./tools/executors/content/parser/parse.ts":
/*!*************************************************!*\
  !*** ./tools/executors/content/parser/parse.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.parse = void 0;\nconst YAML = __importStar(__webpack_require__(/*! yaml */ \"yaml\"));\nfunction parse(content) {\n    const [matched] = content.match(/---\\n([.\\S\\s]+)---/g);\n    const frontmatter = matched.replace(/-+/g, '');\n    const entity = YAML.parse(frontmatter);\n    if (entity.type === 'event') {\n        entity.persons = entity.persons ? entity.persons.split(' ') : [];\n    }\n    return entity;\n}\nexports.parse = parse;\n\n\n//# sourceURL=webpack://jewishhistory/./tools/executors/content/parser/parse.ts?");

/***/ }),

/***/ "colorette":
/*!****************************!*\
  !*** external "colorette" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("colorette");

/***/ }),

/***/ "gitly":
/*!************************!*\
  !*** external "gitly" ***!
  \************************/
/***/ ((module) => {

module.exports = require("gitly");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "yaml":
/*!***********************!*\
  !*** external "yaml" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("yaml");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./tools/executors/content/impl.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;