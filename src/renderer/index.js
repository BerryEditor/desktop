const React = require('react');
const ReactDOM = require('react-dom');
const ScratchGUI = require('scratch-gui');
const {compose} = require('redux');

const AppStateHOC = ScratchGUI.AppStateHOC;
const GUI = ScratchGUI.default;

const target = document.createElement('div');
target.style.position = 'absolute';
target.style.top = '0';
target.style.left = '0';
target.style.width = '100%';
target.style.height = '100%';
document.body.appendChild(target);

const WrappedGUI = compose(
  AppStateHOC
)(GUI);

ReactDOM.render(React.createElement(WrappedGUI, {
  projectId: '0',
  isPlayerOnly: false,
  canEditTitle: true
}, null), target);

require('../addons/index');