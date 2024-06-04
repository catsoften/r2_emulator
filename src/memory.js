import { Canvas } from "./canvas.js";
import { showInputDialog } from "./dialog.js";
import { Value } from "./value.js";

const REG_WM = 17;

export class Memory
{
	canvas = new Canvas(document.getElementById("canvasMemory"));

	reg = new Uint16Array(18);
	ram;

	ramMask;

	getFILTColor(value)
	{
		let wl = value | 0x20000000;
		let x, r = 0, g = 0, b = 0, a = 127;
		for (x = 0; x < 12; x++)
		{
			r += (wl >> (x + 18)) & 1;
			b += (wl >> x) & 1;
		}
		for (x = 0; x < 12; x++)
		{
			g += (wl >> (x + 9)) & 1;
		}
		x = Math.trunc(624 / (r + g + b + 1));
		r = Math.trunc(a * Math.min(r * x, 255) / 0xFF);
		g = Math.trunc(a * Math.min(g * x, 255) / 0xFF);
		b = Math.trunc(a * Math.min(b * x, 255) / 0xFF);
		return [r, g, b];
	}

	redrawCanvas()
	{
		for (let i = 0; i < this.ram.length; i++)
		{
			this.canvas.drawPixel(127 - (i % 128), Math.trunc(i / 128), this.getFILTColor(this.ram[i]));
		}
	}

	constructor(size)
	{
		this.ramSize = size;
		Value.memory = this;
	}

	getReg(reg)
	{
		return this.reg[reg];
	}

	setReg(reg, value)
	{
		this.reg[reg] = value & 0xFFFF;
	}

	getRam(addr, filter = 0xFFFF)
	{
		return this.ram[addr & this.ramMask] & filter;
	}

	setRam(addr, value, filter = 0xFFFF)
	{
		let masked = addr & this.ramMask;
		this.ram[masked] = value & filter;
		if (filter === 0xFFFF)
		{
			this.ram[masked] |= this.reg[REG_WM] << 16;
		}

		this.canvas.drawPixel(127 - (masked % 128), Math.trunc(masked / 128), this.getFILTColor(this.ram[masked]));
	}

	get ramSize()
	{
		return this.ram.length;
	}

	set ramSize(x)
	{
		let newRam = new Uint32Array(x);
		if (this.ram)
		{
			let copySize = Math.min(this.ram.length, newRam.length);
			for (let i = 0; i < copySize; i++)
			{
				newRam[i] = this.ram[i];
			}
		}
		this.ram = newRam;
		this.ramMask = x - 1;

		this.canvas.setSize(512, Math.ceil(x / 128) * 4);
		this.redrawCanvas();
	}

	clear()
	{
		for (let i = 0; i < 18; i++)
		{
			this.reg[i] = 0;
		}

		for (let i = 0; i < this.ram.length; i++)
		{
			this.ram[i] = 0;
		}

		this.redrawCanvas();
	}
}

let registers =
[
	["r0",  0 ], ["r8",   8 ],
	["r1",  1 ], ["r9",   9 ],
	["r2",  2 ], ["r10",  10],
	["r3",  3 ], ["r11",  11],
	["r4",  4 ], ["r12",  12],
	["r5",  5 ], ["r13",  13],
	["r6",  6 ], ["sp",   14],
	["r7",  7 ], ["ip",   15],
	["chn", 16], ["wrm",  17],
];

export function initRegisters(memory, stop)
{
	let d = document.getElementById("divRegisters");
	for (let i of registers)
	{
		let e = document.createElement("span");
		e.classList.add("registerLabel");
		e.innerText = i[0] + ":0x";
		d.appendChild(e);

		e = document.createElement("a");
		e.onclick = function()
		{
			stop();
			showInputDialog("Set " + i[0] + " value:", memory.getReg(i[1]), function(value)
			{
				let parsed = Number.parseInt(value);
				if (!Number.isNaN(parsed))
				{
					memory.setReg(i[1], parsed & (i[1] === REG_WM ? 0x1FFF : 0xFFFF));
					updateRegisters(memory);
				}
			});
		};
		e.classList.add("registerValue");
		e.innerText = "0000";
		d.appendChild(e);

		i.push(e);
	}
}

export function updateRegisters(memory)
{
	for (let i of registers)
	{
		i[2].innerText = memory.getReg(i[1]).toString(16).toUpperCase().padStart(4, "0");
	}
}
