import { FONT_DATA } from "./constants.js";

export class Canvas
{
	canvas;
	ctx;
	x;
	y;

	constructor(canvas)
	{
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.ctx.imageSmoothingEnabled = false;
		this.x = canvas.width;
		this.y = canvas.height;
		this.clear();
	}

	setSize(x, y)
	{
		this.canvas.width = x;
		this.canvas.height = y;
		this.x = x;
		this.y = y;
	}

	setFillStyle(col)
	{
		this.ctx.fillStyle = `rgb(${col[0]}, ${col[1]}, ${col[2]})`;
	}

	drawPixel(x, y, col)
	{
		this.setFillStyle(col);
		this.ctx.fillRect(x * 4, y * 4, 4, 4);
	}

	drawChar(charX, charY, char, fg, bg)
	{
		let baseX = charX * 24;
		let baseY = charY * 24;
		let charData = FONT_DATA[char];
		this.setFillStyle(bg);
		this.ctx.fillRect(baseX, baseY, 24, 24);
		this.setFillStyle(fg);
		for (let offsetY = 0; offsetY < 24; offsetY += 4)
		{
			for (let offsetX = 0; offsetX < 24; offsetX += 4)
			{
				if (charData & 0x1)
				{
					this.ctx.fillRect(baseX + offsetX, baseY + offsetY, 4, 4);
				}
				charData >>= 1;
			}
		}
	}

	clear()
	{
		this.ctx.fillStyle = "#000000";
		this.ctx.fillRect(0, 0, this.x, this.y);
	}
}
