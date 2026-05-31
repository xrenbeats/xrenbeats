// ==UserScript==
// @name         SampleFocus Downloader
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Download unlimited samples from SampleFocus
// @author       Romadillo, xob0t
// @match        https://samplefocus.com/samples/*
// @icon         https://i.imgur.com/WedmtXe.png
// @grant        GM_download
// ==/UserScript==

// fork of https://greasyfork.org/en/scripts/454088-samplefocus-downloader

(function() {
    'use strict';

    // finding and parsing the data
    const element = document.querySelector('[data-react-class="SamplesStoreWrapper"]');
    const data = JSON.parse(element.getAttribute("data-react-props"));

    const sampleUrl = data.samples[0].sample_mp3_url;

    let fileName = data.samples[0].sample_original_filename;

    // Making a new filename out of the original
    // Find the last occurrence of ".wav"
    let lastDotIndex = fileName.lastIndexOf(".wav");

    if (lastDotIndex !== -1) {
        // Replace ".wav" with ".mp3"
        fileName = fileName.slice(0, lastDotIndex) + ".mp3";
    }

    // change download button behavoir
    const link = document.querySelector(".download-link");
    link.onclick = function(e) {
        console.log("Downloading ", sampleUrl, " as ", fileName);
        GM_download({url: sampleUrl, name: fileName, saveAs: true, onerror: function(e) { console.log(e); }});
        e.stopPropagation();
        return false;
    }
})();
