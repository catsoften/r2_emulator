import { INSTRUCTION_CLASS_TABLE, INSTRUCTION_NAME_TABLE } from "./constants.js";
import { Operand } from "./operand.js";

export class Instruction
{
	static Class =
	{
		None: 0,
		Primary: 1,
		Secondary: 2,
		Both: 3,
	};

	opCode;
	instCode;
	instClass;

	primary;
	secondary;

	constructor(opCode)
	{
		this.opCode = opCode;
		this.instCode = (opCode & 0x1F000000) >> 24;
		this.instClass = INSTRUCTION_CLASS_TABLE[this.instCode];

		let primary = new Operand();
		let secondary = new Operand();
		primary.operandClass = Operand.Class.Primary;
		secondary.operandClass = Operand.Class.Secondary;
		this.primary = primary;
		this.secondary = secondary;

		let x = ((opCode & 0xF00000) >> 19) | ((opCode & 0x8000) >> 15);
		if (this.instClass === Instruction.Class.Primary || this.instClass === Instruction.Class.Both) // Primary Exists
		{
			if (!(x & 0b10000) && (x & 0b01000) && (x & 0b00010)) // Primary Value Type
			{
				primary.valueType = Operand.Type.U16;
				primary.value = (opCode >> 4) & 0xFFFF;
			}
			else
			{
				primary.valueType = Operand.Type.REG;
				if ((x & 0b01000) && (x & 0b10000)) // Primary Is Address && Primary Has Offset
				{
					primary.value = (opCode >> 16) & 0xF;
				}
				else
				{
					primary.value = opCode & 0xF;
				}
			}

			if (x & 0b01000) // Primary Is Address
			{
				primary.isAddress = true;
				if (x & 0b10000) // Primary Has Offset
				{
					if (x & 0b00010) // Primary Offset Type
					{
						primary.offsetType = Operand.Type.U11;
						primary.offset = (opCode >> 4) & 0x7FF;
					}
					else
					{
						primary.offsetType = Operand.Type.REG;
						primary.offset = opCode & 0xF;
					}

					if (x & 0b00001) // Primary Offset Negative
					{
						primary.offsetNegative = true;
					}
				}
			}
		}

		if (this.instClass === Instruction.Class.Secondary || this.instClass === Instruction.Class.Both) // Secondary Exists
		{
			if (!(x & 0b00100)) // Secondary Value Type
			{
				secondary.valueType = Operand.Type.REG;
				// Do value later
			}
			else if ((x & 0b01000) && (x & 0b00010))
			{
				secondary.valueType = Operand.Type.U4;
				secondary.value = opCode & 0xF;
			}
			else if (!(x & 0b10000))
			{
				secondary.valueType = Operand.Type.U16;
				secondary.value = (opCode >> 4) & 0xFFFF;
			}
			else if (x & 0b00010)
			{
				secondary.valueType = Operand.Type.REG;
				// Do value later
			}
			else
			{
				secondary.valueType = Operand.Type.U11;
				secondary.value = (opCode >> 4) & 0x7FF;
			}

			if (secondary.valueType === Operand.Type.REG)
			{
				if (!(x & 0b01000) && (x & 0b00010) && (x & 0b10000)) // Secondary Is Address && Secondary Has Offset
				{
					secondary.value = (opCode >> 16) & 0xF;
				}
				else if ((x & 0b01000) && (x & 0b00010))
				{
					secondary.value = opCode & 0xF;
				}
				else
				{
					secondary.value = (opCode >> 4) & 0xF;
				}
			}

			if (!(x & 0b01000) && (x & 0b00010)) // Secondary Is Address
			{
				secondary.isAddress = true;
				if (x & 0b10000) // Secondary Has Offset
				{
					if (x & 0b00100) // Secondary Offset Type
					{
						secondary.offsetType = Operand.Type.U11;
						secondary.offset = (opCode >> 4) & 0x7FF;
					}
					else
					{
						secondary.offsetType = Operand.Type.REG;
						secondary.value = (opCode >> 4) & 0xF;
					}

					if (x & 0b00001) // Secondary Offset Negative
					{
						secondary.offsetNegative = true;
					}
				}
			}
		}
	}

	toString()
	{
		let str = INSTRUCTION_NAME_TABLE[this.instCode];
		if (this.instClass !== Instruction.Class.None)
		{
			if (this.instClass === Instruction.Class.Primary || this.instClass === Instruction.Class.Both)
			{
				str += " ";
				str += this.primary.toString();
			}
			if (this.instClass === Instruction.Class.Both)
			{
				str += ",";
			}
			if (this.instClass === Instruction.Class.Secondary || this.instClass === Instruction.Class.Both)
			{
				str += " ";
				str += this.secondary.toString();
			}
		}
		return str;
	}
}
