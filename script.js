// ==UserScript==
// @name         Clip blocker
// @namespace    http://tampermonkey.net/
// @version      2024-08-06
// @description  Declare blacklist of keywords that you wanna block!
// @author       kshshton
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";

  const regex = /[ąćęłńóśżź]/g;
  const polishChars = {
    ą: "a",
    ć: "c",
    ę: "e",
    ł: "l",
    ń: "n",
    ó: "o",
    ś: "s",
    ż: "z",
    ź: "z",
  };

  const blackList = prompt('Write keywords separated with ","')
    .toLowerCase()
    .replaceAll(regex, (match) => polishChars[match])
    .split(",")
    .map((keyword) => keyword.trim());

  const execute = () => {
    return Array.from(
      document.querySelectorAll(
        "#contents ytd-video-renderer, ytd-rich-item-renderer, ytd-grid-video-renderer"
      )
    )
      .map((element) => ({
        DOMElement: element,
        h3: element.querySelector("h3"),
      }))
      .filter((element) => element.h3 != null)
      .map((element) => ({
        ...element,
        h3: element.h3.textContent
          .replaceAll("\n", "")
          .trim()
          .toLowerCase()
          .replaceAll(regex, (match) => polishChars[match]),
      }))
      .filter((element) =>
        blackList.some((keyword) => element.h3.includes(keyword))
      )
      .forEach((element) => element.DOMElement.remove());
  };

  const wait = (seconds) => new Promise((_) => setTimeout(_, seconds * 1000));

  while (true) {
    await wait(1);
    execute();
  }
})();
