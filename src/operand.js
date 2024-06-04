import { REGISTER_NAME_TABLE } from "./constants.js";

export class Operand
{
	static Class =
	{
		Primary: 0,
		Secondary: 1,
	};

	static Type =
	{
		None: 0,
		REG: 1,
		U4: 2,
		U11: 3,
		U16: 4,
	};

	operandClass = Operand.Class.Primary;

	isAddress = false;

	valueType = Operand.Type.None;
	value = 0;

	offsetType = Operand.Type.None;
	offsetNegative = false;
	offset = 0;

	toString()
	{
		let str = "";
		if (this.isAddress)
		{
			str += "[";
			if (this.valueType === Operand.Type.REG)
			{
				str += REGISTER_NAME_TABLE[this.value];
				if (this.offsetType !== Operand.Type.None)
				{
					str += this.offsetNegative ? "-" : "+";
					if (this.offsetType === Operand.Type.REG)
					{
						str += REGISTER_NAME_TABLE[this.offset];
					}
					else
					{
						str += this.offset;
					}
				}
			}
			else
			{
				str += this.value;
			}
			str += "]";
		}
		else if (this.valueType === Operand.Type.REG)
		{
			str += REGISTER_NAME_TABLE[this.value];
		}
		else
		{
			str += this.value;
		}
		return str;
	}
}
