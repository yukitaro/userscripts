// ==UserScript==
// @name         GetThePics
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://en.futabakai-inc.com/parentportal-youchien*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=futabakai-inc.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function captureImageChange() {
        let imageTitleElement = document.querySelector(".fullscreen-side-bar-title");
        console.log("*******IMAGE NAME***********");
        console.log(imageTitleElement.textContent);
        let theImageElement = getVisibleImageElement(imageTitleElement.textContent);
        let aElement = createAElement(theImageElement.src);
        //let visibleImageDiv = getDivForVisibleImage();
        //document.body.appendChild(aElement);
        //theImageElement.parentNode.parentNode.appendChild(aElement);
        //visibleImageDiv.appendChild(aElement);
        let fullScreenTitle = document.querySelector(".fullscreen-desktop-navbar-container");
        fullScreenTitle.appendChild(aElement);
        //theImageElement.appendChild(aElement);
        console.log("***************************");
    }

    function detectGalleryClosing() {
        let observer = new MutationObserver(function(mutations_list) {
            mutations_list.forEach(function(mutation) {
                mutation.removedNodes.forEach(function(removed_node) {
                    if(removed_node.className === "fullscreen-comp-wrapper ") {
                        console.log("Detected gallery closing!");
                        waitForImageGallery(".fullscreen-side-bar-title").then((elm) => {
                            console.log("*******IMAGE Gallery Appeared***********");
                            let observer = new MutationObserver(captureImageChange);
                            let imageTitleElement = document.querySelector(".fullscreen-side-bar-title");
                            observer.observe(imageTitleElement, {
                                attributes: false,
                                childList: true,
                                subtree: true,
                                characterData: true
                            });
                        });
                     }
                });
            });
        });
        observer.observe(document.body, { subtree: false, childList: true });
    }

    function createAElement(imageLink) {
        let a = document.createElement("a");
        let linkText = document.createTextNode("Image Link");
        a.setAttribute("style", "font-size:18px;position:absolute;top:40px;left:180px;");
        a.appendChild(linkText);
        a.href = imageLink;
        return a;
    }

    function getVisibleImageElement(imageName) {
        let allPictures = document.querySelectorAll("picture");
        let foundImgElement = "";
        let foundWith = 0;
        for (let i = 0; i < allPictures.length; i++) {
            let imgElement = allPictures[i].getElementsByTagName("img");
            for (let j = 0; j < imgElement.length; j++) {
                if (imgElement[j].alt === imageName) {
                    let pixelWidth = parseInt(imgElement[j].style.width.replace("px", ""));
                    if (pixelWidth > foundWith) {
                        foundImgElement = imgElement[j];
                    }
                }
            }
        }
        return foundImgElement;
        /*let allImgs = document.querySelectorAll("img");
        for (let i = 0; i < allImgs.length; i++) {
            if (allImgs[i].alt === imageName) {
                console.log("image source = " + allImgs[i].src);
                return allImgs[i];
            }
        }
        return "";*/
    }

    function getDivForVisibleImage() {
        let visibleElements = document.getElementsByClassName("gallery-item-visible");
        for (let i = 0; i < visibleElements.length; i++) {
            if (visibleElements[i].nodeType === "div") {
                return visibleElements[i];
            }
        }
    }

    waitForImageGallery(".fullscreen-side-bar-title").then((elm) => {
        console.log("*******IMAGE Gallery Appeared***********");
        let observer = new MutationObserver(captureImageChange);
        let imageTitleElement = document.querySelector(".fullscreen-side-bar-title");
        observer.observe(imageTitleElement, {
            attributes: false,
            childList: true,
            subtree: true,
            characterData: true
        });
        detectGalleryClosing();
    });

    function waitForImageGallery(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, { characterData: true, attributes: false, childList: true, subtree: true });
    });

}
})(document);