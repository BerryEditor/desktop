const titlebar_html = ` <header id="titlebar">
<div id="drag-region">
  <div id="window-title">
    <span id="window-title-val">Window</span>
  </div>

  <div id="window-controls">
    <div class="button" id="min-button">
      <img
        class="icon"
        srcset="
          icons/min-w-10.png 1x,
          icons/min-w-12.png 1.25x,
          icons/min-w-15.png 1.5x,
          icons/min-w-15.png 1.75x,
          icons/min-w-20.png 2x,
          icons/min-w-20.png 2.25x,
          icons/min-w-24.png 2.5x,
          icons/min-w-30.png 3x,
          icons/min-w-30.png 3.5x
        "
        draggable="false"
      />
    </div>
    <div class="button" id="max-button">
      <img
        class="icon"
        srcset="
          icons/max-w-10.png 1x,
          icons/max-w-12.png 1.25x,
          icons/max-w-15.png 1.5x,
          icons/max-w-15.png 1.75x,
          icons/max-w-20.png 2x,
          icons/max-w-20.png 2.25x,
          icons/max-w-24.png 2.5x,
          icons/max-w-30.png 3x,
          icons/max-w-30.png 3.5x
        "
        draggable="false"
      />
    </div>
    <div class="button" id="restore-button">
      <img
        class="icon"
        srcset="
          icons/restore-w-10.png 1x,
          icons/restore-w-12.png 1.25x,
          icons/restore-w-15.png 1.5x,
          icons/restore-w-15.png 1.75x,
          icons/restore-w-20.png 2x,
          icons/restore-w-20.png 2.25x,
          icons/restore-w-24.png 2.5x,
          icons/restore-w-30.png 3x,
          icons/restore-w-30.png 3.5x
        "
        draggable="false"
      />
    </div>
    <div class="button" id="close-button">
      <img
        class="icon"
        srcset="
          icons/close-w-10.png 1x,
          icons/close-w-12.png 1.25x,
          icons/close-w-15.png 1.5x,
          icons/close-w-15.png 1.75x,
          icons/close-w-20.png 2x,
          icons/close-w-20.png 2.25x,
          icons/close-w-24.png 2.5x,
          icons/close-w-30.png 3x,
          icons/close-w-30.png 3.5x
        "
        draggable="false"
      />
    </div>
  </div>
</div>
</header>`;
const titlebar_css = ` #titlebar {
    display: block;
    position: fixed;
    height: 32px;
    width: calc(100% - 2px);
    width: 100%;
    padding: 0;
    color: #fff;
    background-color: #f97b7b;
  }

  #app {
    height: calc(100% - 32px) !important;
    overflow-y: auto !important;
    top: 32px !important;
  }

  .ReactModalPortal > div {
    height: calc(100% - 32px) !important;
    overflow-y: auto !important;
    top: 32px !important;
  }

  .fullscreened #app {
    height: 100% !important;
    top: 0px !important;
  }

  .fullscreened .ReactModalPortal > div {
    height: 100% !important;
    top: 0px !important;
  }

  .fullscreened #titlebar {
    display: none !important;
  }

  #titlebar #drag-region {
    width: 100%;
    height: 100%;
    -webkit-app-region: drag;
  }

  #titlebar #drag-region {
    display: grid;
    grid-template-columns: auto 138px;
  }

  #window-title {
    grid-column: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    font-family: "Segoe UI", sans-serif;
    font-size: 12px;
    margin-left: 12px;
  }

  #window-title span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.5;
  }

  #window-controls {
    display: grid;
    grid-template-columns: repeat(3, 46px);
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    -webkit-app-region: no-drag;
  }
  #window-controls .button {
    grid-row: 1 / span 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  @media (-webkit-device-pixel-ratio: 1.5),
    (device-pixel-ratio: 1.5),
    (-webkit-device-pixel-ratio: 2),
    (device-pixel-ratio: 2),
    (-webkit-device-pixel-ratio: 3),
    (device-pixel-ratio: 3) {
    #window-controls .icon {
      width: 10px;
      height: 10px;
    }
  }

  #window-controls .button {
    user-select: none;
  }

  #window-controls .button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  #window-controls .button:active {
    background: rgba(255, 255, 255, 0.2);
  }

  #close-button:hover {
    background: #e81123 !important;
  }

  #close-button:active {
    background: #f1707a !important;
  }
  #close-button:active .icon {
    filter: invert(1);
  }

  #min-button {
    grid-column: 1;
  }
  #max-button,
  #restore-button {
    grid-column: 2;
  }
  #close-button {
    grid-column: 3;
  }

  #restore-button {
    display: none !important;
  }

  .maximized #restore-button {
    display: flex !important;
  }

  .maximized #max-button {
    display: none;
  }`;


document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        document.body.innerHTML = titlebar_html + document.body.innerHTML;
        const s = document.createElement("style");
        s.innerHTML = titlebar_css;
        handleWindowControls();
        electron.ipcRenderer.send("tb:hook");
        getTitle();
    }
};

// TODO: Needs Check
/* window.onbeforeunload = (event) => {
  electron.ipcRenderer.removeAllListeners();
}; */

function handleWindowControls() {
    // Make minimise/maximise/restore/close buttons work when they are clicked
    document
        .getElementById("min-button")
        .addEventListener("click", (event) => {
            electron.ipcRenderer.send("tb:minimize");
        });

    document
        .getElementById("max-button")
        .addEventListener("click", (event) => {
            electron.ipcRenderer.send("tb:maximize");
        });

    document
        .getElementById("restore-button")
        .addEventListener("click", (event) => {
            electron.ipcRenderer.send("tb:unmaximize");
        });

    document
        .getElementById("close-button")
        .addEventListener("click", (event) => {
            electron.ipcRenderer.send("tb:close");
        });

    // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
    toggleMaxRestoreButtons();
    electron.ipcRenderer.on("tb:maximized", toggleMaxRestoreButtons);
    electron.ipcRenderer.on("tb:unmaximized", toggleMaxRestoreButtons);
    electron.ipcRenderer.on("tb:fullscreened", toggleMaxRestoreButtons);
    electron.ipcRenderer.on("tb:unfullscreened", toggleMaxRestoreButtons);
    electron.ipcRenderer.on("tb:titleupdated", getTitle);
    window.titlebar = {
        maximize: () => {
            electron.ipcRenderer.send("tb:maximize");
            toggleMaxRestoreButtons();
            return true;
        },
        minimize: () => {
            electron.ipcRenderer.send("tb:maximize");
            toggleMaxRestoreButtons();
            return true;
        },
        fullscreen: () => {
            electron.ipcRenderer.send("tb:fullscreen");
            toggleMaxRestoreButtons();
            return true;
        },
        unfullscreen: () => {
            electron.ipcRenderer.send("tb:unfullscreen");
            toggleMaxRestoreButtons();
            return true;
        },
    };
}

async function getTitle() {
    document.querySelector("#window-title-val").innerHTML =
        (await electron.ipcRenderer.invoke("tb:gettitle"));
}

new MutationObserver(function (mutations) {
    document.querySelector("#window-title-val").innerHTML = mutations[0].target.nodeValue;
}).observe(document.querySelector("title"), {
    subtree: true,
    characterData: true,
    childList: true,
});

async function toggleMaxRestoreButtons() {
    if (await electron.ipcRenderer.invoke("tb:ismaximized")) {
        document.body.classList.add("maximized");
    } else {
        document.body.classList.remove("maximized");
    }
    if (await electron.ipcRenderer.invoke("tb:isfullscreened")) {
        document.body.classList.add("fullscreened");
    } else {
        document.body.classList.remove("fullscreened");
    }
}