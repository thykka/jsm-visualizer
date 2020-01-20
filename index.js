// Usage

// Install graphviz with:
// $ brew install graphviz

// Install dependencies with
// $ npm i

// Copy your FSM config into a JSON file, then run
// $ npm start myFSM.json

const StateMachine = require('javascript-state-machine');
const visualize = require('javascript-state-machine/lib/visualize');
const fs = require('fs');
const { spawnSync } = require('child_process');

if(process.argv.length < 3) {
  console.log('expected path to json as argument, see:');
  console.log(
    'https://github.com/jakesgordon/javascript-state-machine/blob/master/docs/initialization.md'
  );
  process.exit();
}
const lastArg = process.argv[process.argv.length - 1];

try {
  const jsonData = fs.readFileSync(lastArg);
  const data = JSON.parse(jsonData.toString());
  const fsm = new StateMachine(data);

  // Visualize the FSM and save to file
  fs.writeFileSync('./visualized.dot', visualize(fsm));
  // Create a PNG from .dot with `dot` (brew install graphviz)
  const result = spawnSync('dot', ['-Tpng', 'visualized.dot']);
  fs.writeFileSync('./visualized.png', result.stdout);
  // Remove .dot
  fs.unlinkSync('./visualized.dot');
  spawnSync('qlmanage', ['-p', './visualized.png']);
  // fs.unlinkSync('./visualized.png');

} catch(e) {
  console.warn(e.message);
  process.exit();
}
