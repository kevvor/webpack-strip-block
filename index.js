/*jslint node:true */
"use strict";

var projectName = require("./package.json").name;
var loaderUtils = require("loader-utils");

function StripBlockLoader(content) {
    var options = loaderUtils.getOptions(this) || {};
    var startComment = options.start || 'develblock:start';
    var endComment = options.end || 'develblock:end';
    var removeOuterWhitespace = options.removeOuterWhitespace === true;
    var startWhitespaceMatcher = "";
    var endWhitespaceMatcher = "";
    var whitespaceMatcher = "[\\t ]*"
    // if removeOuterWhitespace is true, remove whitespace on
    // the line outside of the comment tags to start and end
    // the dev block
    if (removeOuterWhitespace) {
        startWhitespaceMatcher = "^" + whitespaceMatcher;
        endWhitespaceMatcher = whitespaceMatcher + "\\n?"
    }
    var regexPattern = new RegExp(startWhitespaceMatcher +
            "\\/\\* ?" + startComment + " ?\\*\\/[\\s\\S]*?\\/\\* ?" + 
            endComment + " ?\\*\\/" + endWhitespaceMatcher, "g");

    // format the replacement comment str, but omit the replacement
    // comment entirely if empty string is passed in as the value
    // for the 'replacementText' option
    var replacement = (typeof options.replacementText === 'string')
        ? options.replacementText
        : (projectName + ':removed');
    replacement = (!!replacement)
        ? ('/* ' + replacement + ' */')
        : '';
    content = content.replace(regexPattern, replacement);

    if (this.cacheable) {
        this.cacheable(true);
    }

    return content;
}

module.exports = StripBlockLoader;
