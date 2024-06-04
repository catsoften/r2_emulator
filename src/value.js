import { Operand } from "./operand.js";

export class Value
{
	static Source =
	{
		IMM: 0,
		REG: 1,
		RAM: 2,
	};

	static memory;

	source = Value.Source.IMM;
	position = 0;

	constructor(op)
	{
		if (op.valueType !== Operand.Type.None)
		{
			this.position = op.value;
			if (op.isAddress)
			{
				this.source = Value.Source.RAM;
				if (op.valueType === Operand.Type.REG)
				{
					this.position = Value.memory.getReg(op.value);
				}
				if (op.offsetType !== Operand.Type.None)
				{
					let offset = op.offset;
					if (op.offsetType === Operand.Type.REG)
					{
						offset = Value.memory.getReg(offset);
					}
					this.position += (op.offsetNegative ? -1 : 1) * offset;
				}
			}
			else if (op.valueType === Operand.Type.REG)
			{
				this.source = Value.Source.REG;
			}
			else
			{
				this.source = Value.Source.IMM;
			}
		}
	}

	get value()
	{
		if (this.source === Value.Source.REG)
		{
			return Value.memory.getReg(this.position);
		}
		else if (this.source === Value.Source.RAM)
		{
			return Value.memory.getRam(this.position);
		}
		return this.position;
	}

	set value(x)
	{
		if (this.source === Value.Source.REG)
		{
			Value.memory.setReg(this.position, x);
		}
		else if (this.source === Value.Source.RAM)
		{
			Value.memory.setRam(this.position, x);
		}
	}
}
