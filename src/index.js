import { Computer, initFlags, updateFlags } from "./computer.js";
import { initKeys, Keyboard } from "./keyboard.js";
import { initRegisters, updateRegisters } from "./memory.js";
import { Screen } from "./screen.js";
import { showConfirmDialog, showFileDialog, showMessageDialog } from "./dialog.js";

function el(id)
{
	return document.getElementById(id);
}

let computer = new Computer(2048);
let keyboard = new Keyboard(0);
let screen = new Screen(0);
computer.ioBus.devices.push(keyboard, screen);

let running = false;
let steps;

let frameTime = 0, lastLoop = window.performance.now();

function tick()
{
	if (running)
	{
		step();
		window.requestAnimationFrame(tick);
	}
}

function start()
{
	if (!running)
	{
		running = true;
		tick();
	}
}

function step()
{
	let completed = 0;
	for (let i = 0; i < steps; i++)
	{
		completed++;
		if (computer.step())
		{
			running = false;
			break;
		}
	}

	updateFlags(computer);
	updateRegisters(computer.memory);

	let thisLoop = window.performance.now();
	let thisFrameTime = (thisLoop - lastLoop) / completed;
	frameTime += (thisFrameTime - frameTime) / 5;
	lastLoop = thisLoop;
	el("spanFPS").innerText = (1000 / frameTime).toFixed(1);
}

function stop()
{
	running = false;
}

function recalcSteps()
{
	steps = 2 ** el("inputSteps").value / 2;
	el("spanSteps").innerText = steps;
}

function recalcRamSize()
{
	let newSize = Number.parseInt(el("selectRamSize").value);
	if (newSize !== computer.memory.ramSize)
	{
		computer.memory.ramSize = newSize;
	}
}

function askReset()
{
	stop();
	showConfirmDialog("Reset computer?\nAll data will be lost!", reset);
}

function reset()
{
	computer.reset();
	keyboard.reset();
	screen.reset();

	updateFlags(computer);
	updateRegisters(computer.memory);
}

function askLoad()
{
	stop();
	showFileDialog("Select a file to load\nAll data will be lost!", load);
}

function load(file)
{
	if (file)
	{
		file.arrayBuffer().then(function(result)
		{
			let dv = new DataView(result);
			if (!dv.byteLength)
			{
				showMessageDialog("Error: Empty file");
			}
			else if (dv.byteLength > 8192 * 4)
			{
				showMessageDialog("Error: File too large");
			}
			else if (dv.byteLength % 4)
			{
				showMessageDialog("Error: File not 32-bit aligned");
			}
			else
			{
				reset();

				let wordLength = dv.byteLength / 4;
				if (wordLength > 4096)
				{
					el("selectRamSize").value = "8192";
					recalcRamSize();
				}
				else if (wordLength > 2048)
				{
					el("selectRamSize").value = "4096";
					recalcRamSize();
				}

				for (let i = 0; i < wordLength; i++)
				{
					computer.memory.setRam(i, dv.getUint32(i * 4, true), 0x1FFFFFFF);
				}
			}
		}).catch(function(error)
		{
			showMessageDialog("Error reading file\n\"" + error + "\"");
		});
	}
	else
	{
		askLoad();
	}
}

initFlags(computer);
initRegisters(computer.memory, stop);
initKeys(keyboard, function() { return running; });

el("buttonStart").onclick = start;
el("buttonStep").onclick = step;
el("buttonStop").onclick = stop;

el("inputSteps").oninput = recalcSteps;
el("selectRamSize").onchange = recalcRamSize;

el("buttonReset").onclick = askReset;
el("buttonLoad").onclick = askLoad;

el("inputSteps").value = "1";
el("selectRamSize").value = "2048";

recalcSteps();
recalcRamSize();

// Not a "File", but stil has .arrayBuffer()
fetch("quadratic.bin").then(load).catch(function(error)
{
	showMessageDialog("Error fetching default program\n\"" + error + "\"");
});
