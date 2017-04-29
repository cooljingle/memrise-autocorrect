// ==UserScript==
// @name           Memrise Autocorrect
// @namespace      https://github.com/cooljingle
// @description    Corrects diacritics, punctuation and case while typing
// @match          https://www.memrise.com/course/*/garden/*
// @match          https://www.memrise.com/garden/review/*
// @version        0.0.1
// @updateURL      https://github.com/cooljingle/memrise-autocorrect/raw/master/Memrise_Autocorrect.user.js
// @downloadURL    https://github.com/cooljingle/memrise-autocorrect/raw/master/Memrise_Autocorrect.user.js
// @grant          none
// ==/UserScript==

$(document).ready(function () {
    var diacritics = [
        { regex: /[\300-\306]/g, replace: 'A' },
        { regex: /[\340-\346]/g, replace: 'a' },
        { regex: /[\310-\313]/g, replace: 'E' },
        { regex: /[\350-\353]/g, replace: 'e' },
        { regex: /[\314-\317]/g, replace: 'I' },
        { regex: /[\354-\357]/g, replace: 'i' },
        { regex: /[\322-\330]/g, replace: 'O' },
        { regex: /[\362-\370]/g, replace: 'o' },
        { regex: /[\331-\334]/g, replace: 'U' },
        { regex: /[\371-\374]/g, replace: 'u' },
        { regex: /[\321]/g, replace: 'N' },
        { regex: /[\361]/g, replace: 'n' },
        { regex: /[\307]/g, replace: 'C' },
        { regex: /[\347]/g, replace: 'c' }
    ],
        punctuation = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;

    var getNonDiacritics = function (str) {
        diacritics.forEach(sub => str = str.replace(sub.regex, sub.replace));
        return str;
    };

    var getNonPunctuation = function (str) {
        return str.replace(punctuation, "")
            .replace(/\s{2,}(?=[^\s]+)/g, " ") //clear multiple spaces (e.g. from "a ... b")
            .replace(/^\s+(?=[^\s]+)/, ""); //clear starting spaces (e.g. from "... abc")
    };

    $('body').on('input', 'input', function (e) {
        var b = MEMRISE.garden.box,
            a = b.thing.columns[b.column_a].val,
            v = b.$input.val(),
            sliceIndex;

        if (a.indexOf(v) !== 0) {
            var aNoDiacritics = getNonDiacritics(a);
            var aSimple = getNonPunctuation(aNoDiacritics).toLowerCase();
            var vSimple = getNonPunctuation(getNonDiacritics(v)).toLowerCase();

            if (aSimple.indexOf(vSimple) === 0) {
                sliceIndex = aNoDiacritics.match(new RegExp(`.*?${vSimple.split("").join(".*?")}((${punctuation.source}|\\s)+$){0,1}`))[0].length;
            }
        } else {
            sliceIndex = a.match(new RegExp(`${v}((${punctuation.source}|\\s)+$){0,1}`))[0].length;
        }

        if (sliceIndex) {
            var replacement = a.slice(0, sliceIndex);
            b.$input.val(replacement);
        }
    });
});
