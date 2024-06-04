import { Canvas } from "./canvas.js";
import { COLOR_TABLE } from "./constants.js";
import { Device } from "./device.js";

export class Screen extends Device
{
	position = 0;
	fg = 0x0;
	bg = 0x0;

	canvas = new Canvas(document.getElementById("canvasScreen"));

	recieveData(inData)
	{
		switch ((inData >> 12) & 0xF)
		{
			case 0x0:
				if (this.position < 16 * 12)
				{
					this.canvas.drawChar(this.position & 0x00F, (this.position & 0x3F0) >> 4, inData & 0xFF, COLOR_TABLE[this.fg], COLOR_TABLE[this.bg]);
				}
				this.position = (this.position + 1) & 0x3FF;
				break;

			case 0x1:
				this.position = inData & 0x3FF;
				break;

			case 0x2:
				this.fg = inData & 0xF;
				this.bg = (inData >> 4) & 0xF;
				break;
		}
	}

	reset()
	{
		super.clear();

		this.position = 0;
		this.fg = 0x0;
		this.bg = 0x0;
		this.canvas.clear();
	}
}
