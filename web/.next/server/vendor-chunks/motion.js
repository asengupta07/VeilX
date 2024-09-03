"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/motion";
exports.ids = ["vendor-chunks/motion"];
exports.modules = {

/***/ "(ssr)/./node_modules/motion/dist/animate.es.js":
/*!************************************************!*\
  !*** ./node_modules/motion/dist/animate.es.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   animate: () => (/* binding */ animate),\n/* harmony export */   animateProgress: () => (/* binding */ animateProgress)\n/* harmony export */ });\n/* harmony import */ var _motionone_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @motionone/dom */ \"(ssr)/./node_modules/@motionone/dom/dist/animate/utils/controls.es.js\");\n/* harmony import */ var _motionone_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @motionone/dom */ \"(ssr)/./node_modules/@motionone/dom/dist/animate/index.es.js\");\n/* harmony import */ var _motionone_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @motionone/utils */ \"(ssr)/./node_modules/@motionone/utils/dist/is-function.es.js\");\n/* harmony import */ var _motionone_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @motionone/animation */ \"(ssr)/./node_modules/@motionone/animation/dist/Animation.es.js\");\n\n\n\n\nfunction animateProgress(target, options = {}) {\n    return (0,_motionone_dom__WEBPACK_IMPORTED_MODULE_0__.withControls)([\n        () => {\n            const animation = new _motionone_animation__WEBPACK_IMPORTED_MODULE_1__.Animation(target, [0, 1], options);\n            animation.finished.catch(() => { });\n            return animation;\n        },\n    ], options, options.duration);\n}\nfunction animate(target, keyframesOrOptions, options) {\n    const factory = (0,_motionone_utils__WEBPACK_IMPORTED_MODULE_2__.isFunction)(target) ? animateProgress : _motionone_dom__WEBPACK_IMPORTED_MODULE_3__.animate;\n    return factory(target, keyframesOrOptions, options);\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbW90aW9uL2Rpc3QvYW5pbWF0ZS5lcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBb0U7QUFDdEI7QUFDRzs7QUFFakQsNkNBQTZDO0FBQzdDLFdBQVcsNERBQVk7QUFDdkI7QUFDQSxrQ0FBa0MsMkRBQVM7QUFDM0MsOENBQThDO0FBQzlDO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiw0REFBVSw2QkFBNkIsbURBQVM7QUFDcEU7QUFDQTs7QUFFb0MiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92ZWlseC8uL25vZGVfbW9kdWxlcy9tb3Rpb24vZGlzdC9hbmltYXRlLmVzLmpzPzllOTEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYW5pbWF0ZSBhcyBhbmltYXRlJDEsIHdpdGhDb250cm9scyB9IGZyb20gJ0Btb3Rpb25vbmUvZG9tJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICdAbW90aW9ub25lL3V0aWxzJztcbmltcG9ydCB7IEFuaW1hdGlvbiB9IGZyb20gJ0Btb3Rpb25vbmUvYW5pbWF0aW9uJztcblxuZnVuY3Rpb24gYW5pbWF0ZVByb2dyZXNzKHRhcmdldCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHdpdGhDb250cm9scyhbXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24odGFyZ2V0LCBbMCwgMV0sIG9wdGlvbnMpO1xuICAgICAgICAgICAgYW5pbWF0aW9uLmZpbmlzaGVkLmNhdGNoKCgpID0+IHsgfSk7XG4gICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uO1xuICAgICAgICB9LFxuICAgIF0sIG9wdGlvbnMsIG9wdGlvbnMuZHVyYXRpb24pO1xufVxuZnVuY3Rpb24gYW5pbWF0ZSh0YXJnZXQsIGtleWZyYW1lc09yT3B0aW9ucywgb3B0aW9ucykge1xuICAgIGNvbnN0IGZhY3RvcnkgPSBpc0Z1bmN0aW9uKHRhcmdldCkgPyBhbmltYXRlUHJvZ3Jlc3MgOiBhbmltYXRlJDE7XG4gICAgcmV0dXJuIGZhY3RvcnkodGFyZ2V0LCBrZXlmcmFtZXNPck9wdGlvbnMsIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgeyBhbmltYXRlLCBhbmltYXRlUHJvZ3Jlc3MgfTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/motion/dist/animate.es.js\n");

/***/ })

};
;