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

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst fs = __importStar(__webpack_require__(/*! fs */ \"fs\"));\nconst path = __importStar(__webpack_require__(/*! path */ \"path\"));\nconst gitly_1 = __webpack_require__(/*! gitly */ \"gitly\");\nconst parser_1 = __webpack_require__(/*! ./internal/parser */ \"./tools/executors/content/internal/parser.ts\");\nconst rimraf_1 = __importDefault(__webpack_require__(/*! rimraf */ \"rimraf\"));\nconst log_1 = __webpack_require__(/*! ./internal/log */ \"./tools/executors/content/internal/log.ts\");\nconst EntitiesIndex_1 = __webpack_require__(/*! ./internal/EntitiesIndex */ \"./tools/executors/content/internal/EntitiesIndex.ts\");\nconst Storage_1 = __webpack_require__(/*! ./internal/Storage */ \"./tools/executors/content/internal/Storage.ts\");\nconst PersonEntity_1 = __webpack_require__(/*! ./internal/PersonEntity */ \"./tools/executors/content/internal/PersonEntity.ts\");\nconst entityFactory_1 = __webpack_require__(/*! ./internal/entityFactory */ \"./tools/executors/content/internal/entityFactory.ts\");\nconst EntitiesTimeline_1 = __webpack_require__(/*! ./internal/EntitiesTimeline */ \"./tools/executors/content/internal/EntitiesTimeline.ts\");\nconst EventEntity_1 = __webpack_require__(/*! ./internal/EventEntity */ \"./tools/executors/content/internal/EventEntity.ts\");\nfunction contentExecutor(options, context) {\n    return __awaiter(this, void 0, void 0, function* () {\n        // Очистим всю мета-информацию\n        rimraf_1.default.sync('./apps/jewishhistory.info/pages/content/*.json');\n        log_1.log.success('Cleaning content directory', 'success');\n        // Клонируем репозиторий с контентом\n        const source = yield (0, gitly_1.download)(options.repository);\n        const contentDir = yield (0, gitly_1.extract)(source, './apps/jewishhistory.info/pages/content');\n        const isSuccessDownload = Boolean(contentDir);\n        if (!isSuccessDownload) {\n            return { success: false };\n        }\n        log_1.log.success('Downloading content', 'success');\n        const index = new EntitiesIndex_1.EntitiesIndex(new Storage_1.Storage(contentDir, 'index.json'));\n        index.init();\n        const files = fs.readdirSync(contentDir)\n            .filter((f) => f.match(/.md$/));\n        for (const file of files) {\n            const content = fs.readFileSync(path.join(contentDir, file), { encoding: 'utf8' });\n            const fields = (0, parser_1.parser)(file, content);\n            fs.writeFileSync(path.join(contentDir, file), (0, parser_1.clean)(content));\n            index.add(fields.type, { code: fields.code, name: fields.name });\n            const entity = (0, entityFactory_1.createEntity)(fields, contentDir);\n            entity.update(fields);\n            if (fields.type === 'event') {\n                for (const code of fields.persons) {\n                    const person = new PersonEntity_1.PersonEntity(new Storage_1.Storage(contentDir, `${code}.json`));\n                    person.addEvent(fields.code);\n                }\n            }\n        }\n        log_1.log.success('Parse meta', 'success');\n        const actualIndex = index.getIndex();\n        const timeline = new EntitiesTimeline_1.EntitiesTimeline(new Storage_1.Storage(contentDir, 'timeline.json'));\n        timeline.initFromIndex(actualIndex);\n        for (const item of actualIndex.person) {\n            const person = new PersonEntity_1.PersonEntity(new Storage_1.Storage(contentDir, `${item.code}.json`));\n            timeline.addPerson(person);\n        }\n        for (const item of actualIndex.event) {\n            const event = new EventEntity_1.EventEntity(new Storage_1.Storage(contentDir, `${item.code}.json`));\n            timeline.addEvent(event);\n        }\n        log_1.log.success('Build timeline', 'success');\n        return { success: true };\n    });\n}\nexports[\"default\"] = contentExecutor;\n\n\n//# sourceURL=webpack://jewishhistory/./tools/executors/content/impl.ts?");

/***/ }),

/***/ "./tools/executors/content/internal/BaseEntity.ts":
/*!********************************************************!*\
  !*** ./tools/executors/content/internal/BaseEntity.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.BaseEntity = void 0;\nconst lodash_1 = __webpack_require__(/*! lodash */ \"lodash\");\nclass BaseEntity {\n    constructor(_storage) {\n        this._storage = _storage;\n    }\n    getData() {\n        return this._storage.getData();\n    }\n    update(entity) {\n        if (this._storage.isExist()) {\n            this.merge(entity);\n            return;\n        }\n        this._storage.setData(entity);\n    }\n    merge(entity) {\n        const current = this._storage.getData();\n        const updated = (0, lodash_1.mergeWith)({}, current, entity, (obj, src) => {\n            if (Array.isArray(obj)) {\n                return obj.concat(src);\n            }\n        });\n        this._storage.setData(updated);\n    }\n}\nexports.BaseEntity = BaseEntity;\n\n\n//# sourceURL=webpack://jewishhistory/./tools/executors/content/internal/BaseEntity.ts?");

/***/ }),

/***/ "./tools/executors/content/internal/EntitiesIndex.ts":
/*!***********************************************************!*\
  !*** ./tools/executors/content/internal/EntitiesIndex.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.EntitiesIndex = void 0;\nclass EntitiesIndex {\n    constructor(_storage) {\n        this._storage = _storage;\n    }\n    init() {\n        this._storage.setData({\n            era: [],\n            person: [],\n            event: [],\n        });\n    }\n    getIndex() {\n        return this._storage.getData();\n    }\n    addEra(era) {\n        this.add('era', era);\n    }\n    addPerson(person) {\n        this.add('person', person);\n    }\n    addEvent(event) {\n        this.add('event', event);\n    }\n    add(type, entity) {\n        const data = this._storage.getData();\n        data[type].push(entity);\n        data[type].sort((src, dest) => src.name.localeCompare(dest.name));\n        this._storage.setData(data);\n    }\n}\nexports.EntitiesIndex = EntitiesIndex;\n\n\n//# sourceURL=webpack://jewishhistory/./tools/executors/content/internal/EntitiesIndex.ts?");

/***/ }),

/***/ "./tools/executors/content/internal/EntitiesTimeline.ts":
/*!**************************************************************!*\
  !*** ./tools/executors/content/internal/EntitiesTimeline.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.EntitiesTimeline = void 0;\nclass EntitiesTimeline {\n    constructor(_storage) {\n        this._storage = _storage;\n    }\n    initFromIndex(index) {\n        const initial = index.era.reduce((acc, current) => [\n            ...acc,\n            Object.assign(Object.assign({}, current), { events: [], persons: [] })\n        ], []);\n        this._storage.setData(initial);\n    }\n    addPerson(person) {\n        const timeline = this._storage.getData();\n        const personFields = person.getData();\n        const era = timeline.find(e => e.code === personFields.era);\n        if (era) {\n            era.persons.push({ code: personFields.code, name: personFields.name });\n            this._storage.setData(timeline);\n        }\n    }\n    addEvent(event) {\n        const timeline = this._storage.getData();\n        const eventFields = event.getData();\n        const era = timeline.find(e => e.code === eventFields.era);\n        if (era) {\n            era.events.push({ code: eventFields.code, name: eventFields.name, dateStart: eventFields.date_start });\n            // Отсортируем события в порядке возрастания\n            era.events.sort((src, dest) => src.dateStart - dest.dateStart);\n            // Отсортируем эпохи в порядке возрастания по первому событию в эпохе\n            timeline.sort((src, dest) => (src.events[0] || { dateStart: 0 }).dateStart - (dest.events[0] || { dateStart: 0 }).dateStart);\n            this._storage.setData(timeline);\n        }\n    }\n}\nexports.EntitiesTimeline = EntitiesTimeline;\n\n\n//# sourceURL=webpack://jewishhistory/./tools/executors/content/internal/EntitiesTimeline.ts?");

/***/ }),

/***/ "./tools/executors/content/internal/EraEntity.ts":
/*!*******************************************************!*\
  !*** ./tools/executors/content/internal/EraEntity.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.EraEntity = void 0;\nconst BaseEntity_1 = __webpack_require__(/*! ./BaseEntity */ \"./tools/executors/content/internal/BaseEntity.ts\");\nclass EraEntity extends BaseEntity_1.BaseEntity {\n    addPerson(code) {\n        this.update({ persons: [code] });\n    }\n    addEvent(code) {\n        this.update({ events: [code] });\n    }\n}\nexports.EraEntity = EraEntity;\n\n\n//# sourceURL=webpack://jewishhistory/./tools/executors/content/internal/EraEntity.ts?");

/***/ }),

/***/ "./tools/executors/content/internal/EventEntity.ts":
/*!*********************************************************!*\
  !*** ./tools/executors/content/internal/EventEntity.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.EventEntity = void 0;\nconst BaseEntity_1 = __webpack_require__(/*! ./BaseEntity */ \"./tools/executors/content/internal/BaseEntity.ts\");\nclass EventEntity extends BaseEntity_1.BaseEntity {\n    constructor(_storage, _era) {\n        super(_storage);\n        this._era = _era;\n    }\n    update(entity) {\n        super.update(entity);\n        if (this._era) {\n            this._era.addEvent(entity.code);\n        }\n    }\n}\nexports.EventEntity = EventEntity;\n\n\n//# sourceURL=webpack://jewishhistory/./tools/executors/content/internal/EventEntity.ts?");

/***/ }),

/***/ "./tools/executors/content/internal/PersonEntity.ts":
/*!**********************************************************!*\
  !*** ./tools/executors/content/internal/PersonEntity.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.PersonEntity = void 0;\nconst BaseEntity_1 = __webpack_require__(/*! ./BaseEntity */ \"./tools/executors/content/internal/BaseEntity.ts\");\nclass PersonEntity extends BaseEntity_1.BaseEntity {\n    constructor(_storage, _era) {\n        super(_storage);\n        this._era = _era;\n    }\n    update(entity) {\n        super.update(entity);\n        if (this._era) {\n            this._era.addPerson(entity.code);\n        }\n    }\n    addEvent(code) {\n        this.update({ events: [code] });\n    }\n}\nexports.PersonEntity = PersonEntity;\n\n\n//# sourceURL=webpack://jewishhistory/./tools/executors/content/internal/PersonEntity.ts?");

/***/ }),

/***/ "./tools/executors/content/internal/Storage.ts":
/*!*****************************************************!*\
  !*** ./tools/executors/content/internal/Storage.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Storage = void 0;\nconst fs = __importStar(__webpack_require__(/*! fs */ \"fs\"));\nconst log_1 = __webpack_require__(/*! ./log */ \"./tools/executors/content/internal/log.ts\");\nconst path = __importStar(__webpack_require__(/*! path */ \"path\"));\nclass Storage {\n    constructor(_folder, _filename) {\n        this._folder = _folder;\n        this._filename = _filename;\n    }\n    getData() {\n        try {\n            return this.load();\n        }\n        catch (e) {\n            log_1.log.error(`Storage::getData() ${this._filename}`, e.toString());\n            throw e;\n        }\n    }\n    setData(data) {\n        try {\n            this.save(data);\n        }\n        catch (e) {\n            log_1.log.error(`Storage::setData() ${this._filename}`, e.toString());\n            throw e;\n        }\n    }\n    isExist() {\n        return fs.existsSync(this.getPath());\n    }\n    load() {\n        const raw = fs.readFileSync(this.getPath(), { encoding: 'utf8' });\n        return JSON.parse(raw);\n    }\n    save(data) {\n        const str = JSON.stringify(data, null, 2);\n        fs.writeFileSync(this.getPath(), str);\n    }\n    getPath() {\n        return path.join(this._folder, this._filename);\n    }\n}\nexports.Storage = Storage;\n\n\n//# sourceURL=webpack://jewishhistory/./tools/executors/content/internal/Storage.ts?");

/***/ }),

/***/ "./tools/executors/content/internal/entityFactory.ts":
/*!***********************************************************!*\
  !*** ./tools/executors/content/internal/entityFactory.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.createEntity = void 0;\nconst EraEntity_1 = __webpack_require__(/*! ./EraEntity */ \"./tools/executors/content/internal/EraEntity.ts\");\nconst Storage_1 = __webpack_require__(/*! ./Storage */ \"./tools/executors/content/internal/Storage.ts\");\nconst PersonEntity_1 = __webpack_require__(/*! ./PersonEntity */ \"./tools/executors/content/internal/PersonEntity.ts\");\nconst EventEntity_1 = __webpack_require__(/*! ./EventEntity */ \"./tools/executors/content/internal/EventEntity.ts\");\nconst log_1 = __webpack_require__(/*! ./log */ \"./tools/executors/content/internal/log.ts\");\nfunction createEntity(fields, contentDir) {\n    switch (fields.type) {\n        case 'era':\n            return new EraEntity_1.EraEntity(new Storage_1.Storage(contentDir, `${fields.code}.json`));\n        case 'person':\n            return new PersonEntity_1.PersonEntity(new Storage_1.Storage(contentDir, `${fields.code}.json`), new EraEntity_1.EraEntity(new Storage_1.Storage(contentDir, `${fields.era}.json`)));\n        case 'event':\n            return new EventEntity_1.EventEntity(new Storage_1.Storage(contentDir, `${fields.code}.json`), new EraEntity_1.EraEntity(new Storage_1.Storage(contentDir, `${fields.era}.json`)));\n        default:\n            log_1.log.error('createEntity()', 'Неизвестный тип сущности');\n            throw new Error('Неизвестный тип сущности');\n    }\n}\nexports.createEntity = createEntity;\n\n\n//# sourceURL=webpack://jewishhistory/./tools/executors/content/internal/entityFactory.ts?");

/***/ }),

/***/ "./tools/executors/content/internal/log.ts":
/*!*************************************************!*\
  !*** ./tools/executors/content/internal/log.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.log = void 0;\nconst colorette_1 = __webpack_require__(/*! colorette */ \"colorette\");\nexports.log = {\n    success: (title, message) => console.log((0, colorette_1.greenBright)(' >'), (0, colorette_1.bold)((0, colorette_1.bgGreenBright)((0, colorette_1.black)(` ${title.toUpperCase()} `))), (0, colorette_1.greenBright)(message)),\n    error: (title, message) => console.log((0, colorette_1.redBright)(' >'), (0, colorette_1.bold)((0, colorette_1.bgRedBright)((0, colorette_1.black)(` ${title.toUpperCase()} `))), (0, colorette_1.redBright)(message)),\n};\n\n\n//# sourceURL=webpack://jewishhistory/./tools/executors/content/internal/log.ts?");

/***/ }),

/***/ "./tools/executors/content/internal/parser.ts":
/*!****************************************************!*\
  !*** ./tools/executors/content/internal/parser.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.clean = exports.parser = void 0;\nconst YAML = __importStar(__webpack_require__(/*! yaml */ \"yaml\"));\nconst core_1 = __webpack_require__(/*! @hebcal/core */ \"@hebcal/core\");\nfunction parser(filename, content) {\n    const [matched] = content.match(/---\\n([.\\S\\s]+)---/g);\n    const frontmatter = matched.replace(/-{3}/g, '');\n    const entity = YAML.parse(frontmatter);\n    entity.code = filename.replace('.md', '');\n    if (entity.type === 'event') {\n        entity.persons = entity.persons || [];\n        // TODO: валидация\n        const [day, month, year] = entity.date_start.split('-');\n        entity.date_start = new core_1.HDate(day, month, year).abs();\n    }\n    return entity;\n}\nexports.parser = parser;\nfunction clean(content) {\n    return content.replace(/(---\\n[.\\S\\s]+---)/g, '');\n}\nexports.clean = clean;\n\n\n//# sourceURL=webpack://jewishhistory/./tools/executors/content/internal/parser.ts?");

/***/ }),

/***/ "@hebcal/core":
/*!*******************************!*\
  !*** external "@hebcal/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@hebcal/core");

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

/***/ "rimraf":
/*!*************************!*\
  !*** external "rimraf" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("rimraf");

/***/ }),

/***/ "yaml":
/*!***********************!*\
  !*** external "yaml" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("yaml");

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