import { Device } from "./device.js";
import { KEY_MAP } from "./constants.js";

export class Keyboard extends Device
{
	key = 0;
	waiting = false;
	sendCount = 0;

	step()
	{
		if (this.waiting)
		{
			this.sendAttn = true;
		}
		if (this.sendCount)
		{
			this.sendCount--;
			this.sendData = true;
			this.data = this.key;
		}
	}

	recieveAttn()
	{
		this.sendCount = 2;
		this.waiting = false;
	}

	setKey(newKey)
	{
		if (!this.waiting)
		{
			this.waiting = true;
			this.key = newKey;
		}
	}

	reset()
	{
		super.clear();

		this.key = 0;
		this.waiting = false;
		this.sendCount = 0;
	}
}

let shiftSet, capsLockSet;

export function initKeys(keyboard, isRunning)
{
	window.onkeydown = function(event)
	{
		if (isRunning() && Object.hasOwn(KEY_MAP, event.key))
		{
			event.preventDefault();
			keyboard.setKey(KEY_MAP[event.key]);
		}
	};

	shiftSet = false;
	capsLockSet = false;

	let keyShiftLeft = document.createElement("button");
	let keyShiftRight = document.createElement("button");

	let shiftFunc = function()
	{
		shiftSet = !shiftSet;
		keyShiftLeft.classList.toggle("keyShiftSet", shiftSet);
		keyShiftRight.classList.toggle("keyShiftSet", shiftSet);
	};

	keyShiftLeft.onclick = shiftFunc;
	keyShiftLeft.classList.add("key", "key24");
	keyShiftLeft.innerText = "Shift";

	keyShiftRight.onclick = shiftFunc;
	keyShiftRight.classList.add("key", "key24");
	keyShiftRight.innerText = "Shift";

	let keyCapsLock = document.createElement("button");
	keyCapsLock.classList.add("key", "key19");
	keyCapsLock.onclick = function()
	{
		capsLockSet = !capsLockSet;
		this.classList.toggle("keyCapsLockSet", capsLockSet);
	};
	keyCapsLock.innerText = "Caps";

	let keys =
	[
		["`", 0x7E60], ["1", 0x2131], ["2", 0x4032], ["3", 0x2333],
		["4", 0x2434], ["5", 0x2535], ["6", 0x5E36], ["7", 0x2637],
		["8", 0x2A38], ["9", 0x2839], ["0", 0x2930], ["-", 0x5F2D],
		["=", 0x2B3D], ["Backsp", 0x1D08, "key19"],
		document.createElement("br"),
		["Tab", 0x1C09, "key14"], ["Q", 0x5171], ["W", 0x5777], ["E", 0x4565],
		["R", 0x5272], ["T", 0x5474], ["Y", 0x5979], ["U", 0x5575],
		["I", 0x4969], ["O", 0x4F6F], ["P", 0x5070], ["[", 0x7A5B],
		["]", 0x7D5D], ["\\", 0x7C6C, "key14"],
		document.createElement("br"),
		keyCapsLock,
		["A", 0x4161], ["S", 0x5373], ["D", 0x4464], ["F", 0x4666],
		["G", 0x4767], ["H", 0x4868], ["J", 0x4A6A], ["K", 0x4B6B],
		["L", 0x4C6C], [";", 0x3A3B], ["'", 0x2227], ["Enter", 0x1E0D, "key19"],
		document.createElement("br"),
		keyShiftLeft,
		["Z", 0x5A7A], ["X", 0x5878], ["C", 0x4363], ["V", 0x5676],
		["B", 0x4262], ["N", 0x4E6E], ["M", 0x4D6D], [",", 0x3C2C],
		[".", 0x3E2E], ["/", 0x3F2F],
		keyShiftRight,
		document.createElement("br"),
		["Space", 0x1F20, "key69"],
	];

	let d = document.getElementById("divKeyboard");
	for (let i of keys)
	{
		if (Array.isArray(i))
		{
			let e = document.createElement("button");
			e.classList.add("key");
			if (i.length === 3)
			{
				e.classList.add(i[2]);
			}
			e.onclick = function()
			{
				keyboard.setKey(shiftSet || capsLockSet ? i[1] >> 8 : i[1] & 0xFF);
				shiftSet = false;
				keyShiftLeft.classList.remove("keyShiftSet");
				keyShiftRight.classList.remove("keyShiftSet");
			};
			e.innerText = i[0];
			d.appendChild(e);
		}
		else
		{
			d.appendChild(i);
		}
	}
}
