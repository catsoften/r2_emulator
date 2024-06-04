import { Instruction } from "./instruction.js";
import { IOBus } from "./ioBus.js";
import { Memory } from "./memory.js";
import { Value } from "./value.js";

const REG_SP = 14;
const REG_IP = 15;
const REG_CH = 16;
const REG_WM = 17;

function toSigned(v)
{
	return v > 0x7FFF ? v - 0x10000 : v;
}

export class Computer
{
	zeroFlag = false;
	signFlag = false;
	carryFlag = false;
	oflowFlag = false;

	memory;
	ioBus = new IOBus();

	clearFlags()
	{
		this.zeroFlag = false;
		this.signFlag = false;
		this.carryFlag = false;
		this.oflowFlag = false;
	}

	updateFlags(value, clear = true)
	{
		if (clear)
		{
			this.clearFlags();
		}
		this.zeroFlag = (value & 0xFFFF) === 0;
		this.signFlag = (value & 0x8000) !== 0;
	}

	constructor(ramSize)
	{
		this.memory = new Memory(ramSize);
	}

	step()
	{
		let hlt = false;

		let instPtr = this.memory.getReg(REG_IP);
		this.memory.setReg(REG_IP, instPtr + 1);

		let inst = new Instruction(this.memory.getRam(instPtr, 0x1FFFFFFF));

		let primary = new Value(inst.primary);
		let secondary = new Value(inst.secondary);

		let chain = this.memory.getReg(REG_CH);
		if (inst.instClass === Instruction.Class.Primary || inst.instClass === Instruction.Class.Both)
		{
			this.memory.setReg(REG_CH, primary.value);
		}

		switch (inst.instCode)
		{
			case 0x00: // mov
				this.updateFlags(primary.value = secondary.value);
				break;

			case 0x01: // and
				this.updateFlags(primary.value &= secondary.value);
				break;

			case 0x02: // or
				this.updateFlags(primary.value |= secondary.value);
				break;

			case 0x03: // xor
				this.updateFlags(primary.value ^= secondary.value);
				break;

			case 0x04: // add
			case 0x05: // adc
			case 0x06: // sub
			case 0x07: // sbb
			case 0x0C: // adds
			case 0x0D: // adcs
			case 0x0E: // cmp, subs
			case 0x0F: // cmb, sbbs
				{
					let carry = this.carryFlag && (inst.instCode & 0b0001) ? 1 : 0;
					let sub = (inst.instCode & 0b0010) ? -1 : 1;
					let pri = primary.value, sec = secondary.value;
					let sPri = toSigned(pri), sSec = toSigned(sec);
					let res = pri + (sec + carry) * sub;
					let sRes = sPri + (sSec + carry) * sub;
					this.carryFlag = res < 0x0000 || res > 0xFFFF;
					this.oflowFlag = sRes < -0x8000 || sRes > 0x7FFF;
					this.updateFlags(res, false);
					if (!(inst.instCode & 0b1000))
					{
						primary.value = res;
					}
				}
				break;

			case 0x08: // swm
				this.memory.setReg(REG_WM, secondary.value & 0x1FFF);
				this.updateFlags(secondary.value);
				break;

			case 0x09: // ands, test
				this.updateFlags(primary.value & secondary.value);
				break;

			case 0x0A: // ors
				this.updateFlags(primary.value | secondary.value);
				break;

			case 0x0B: // xors
				this.updateFlags(primary.value ^ secondary.value);
				break;

			case 0x10: // hlt
				hlt = true;
				break;

			case 0x11: // jmp
				{
					let jump = false;
					switch (inst.opCode & 0xF)
					{
						case 0x0: // jmp
							jump = true;
							break;

						case 0x1: // jn
							jump = false;
							break;

						case 0x2: // jb jc jnae
							jump = this.carryFlag;
							break;

						case 0x3: // jae jnb jnc
							jump = !this.carryFlag;
							break;

						case 0x4: // jo
							jump = this.oflowFlag;
							break;

						case 0x5: // jno
							jump = !this.oflowFlag;
							break;

						case 0x6: // js
							jump = this.signFlag;
							break;

						case 0x7: // jns
							jump = !this.signFlag;
							break;

						case 0x8: // je jz
							jump = this.zeroFlag;
							break;

						case 0x9: // jne jnz
							jump = !this.zeroFlag;
							break;

						case 0xA: // jle jng
							jump = this.zeroFlag || (this.signFlag !== this.oflowFlag);
							break;

						case 0xB: // jg jnle
							jump = !this.zeroFlag && (this.signFlag === this.oflowFlag);
							break;

						case 0xC: // jl jnge
							jump = this.signFlag !== this.oflowFlag;
							break;

						case 0xD: // jge jnl
							jump = this.signFlag === this.oflowFlag;
							break;

						case 0xE: // jbe jna
							jump = this.carryFlag || this.zeroFlag;
							break;

						case 0xF: // ja jnbe
							jump = !this.carryFlag && !this.zeroFlag;
							break;
					}
					if (jump)
					{
						this.memory.setReg(REG_IP, secondary.value);
					}
				}
				break;

			case 0x12: // rol
				{
					let result = primary.value << (secondary.value & 0xF);
					result |= (primary.value >> (16 - (secondary.value & 0xF)));
					this.updateFlags(primary.value = result);
				}
				break;

			case 0x13: // ror
				{
					let result = primary.value >> (secondary.value & 0xF);
					result |= (primary.value << (16 - (secondary.value & 0xF)));
					this.updateFlags(primary.value = result);
				}
				break;

			case 0x14: // shl
				this.updateFlags(primary.value <<= (secondary.value & 0xF));
				break;

			case 0x15: // shr
				this.updateFlags(primary.value >>= (secondary.value & 0xF));
				break;

			case 0x16: // scl
				{
					let result = primary.value << (secondary.value & 0xF);
					result |= (chain >> (16 - (secondary.value & 0xF)));
					this.updateFlags(primary.value = result);
				}
				break;

			case 0x17: // scr
				{
					let result = primary.value >> (secondary.value & 0xF);
					result |= (chain << (16 - (secondary.value & 0xF)));
					this.updateFlags(primary.value = result);
				}
				break;

			case 0x18: // bump
				this.ioBus.sendAttn(primary.value & 0xFF);
				break;

			case 0x19: // wait
				{
					let state = this.ioBus.getState();
					this.updateFlags(state.hasAttn ? state.port : 0xFFFF);
				}
				break;

			case 0x1A: // send
				this.ioBus.sendData(primary.value & 0xFF, secondary.value);
				break;

			case 0x1B: // recv
				{
					let state = this.ioBus.getState();
					if (state.hasData)
					{
						this.carryFlag = true;
						primary.value = state.data;
					}
					else
					{
						this.carryFlag = false;
					}
				}
				break;

			case 0x1C: // push
				this.memory.setReg(REG_SP, this.memory.getReg(REG_SP) - 1);
				this.memory.setRam(this.memory.getReg(REG_SP), secondary.value);
				this.updateFlags(secondary.value);
				break;

			case 0x1D: // pop
				primary.value = this.memory.getRam(this.memory.getReg(REG_SP));
				this.memory.setReg(REG_SP, this.memory.getReg(REG_SP) + 1);
				this.updateFlags(primary.value);
				break;

			case 0x1E: // call
				this.memory.setReg(REG_SP, this.memory.getReg(REG_SP) - 1);
				this.memory.setRam(this.memory.getReg(REG_SP), instPtr + 1);
				this.memory.setReg(REG_IP, secondary.value);
				break;

			case 0x1F: // ret
				this.memory.setReg(REG_IP, this.memory.getRam(this.memory.getReg(REG_SP)));
				this.memory.setReg(REG_SP, this.memory.getReg(REG_SP) + 1);
				break;
		}
		this.ioBus.step();
		return hlt;
	}

	reset()
	{
		this.clearFlags();
		this.memory.clear();
	}
}

let flags =
[
	["zeroFlag",  "Zf"],
	["signFlag",  "Sf"],
	["carryFlag", "Cf"],
	["oflowFlag", "Of"],
];

export function initFlags(computer)
{
	let d = document.getElementById("divFlags");
	for (let i of flags)
	{
		let e = document.createElement("span");
		e.classList.add("flagLabel");
		e.innerText = i[1] + ":";
		d.appendChild(e);

		e = document.createElement("a");
		e.onclick = function()
		{
			computer[i[0]] = !computer[i[0]];
			updateFlags(computer);
		};
		e.classList.add("flagValue");
		e.innerText = "false";
		d.appendChild(e);

		i.push(e);
	}
}

export function updateFlags(computer)
{
	for (let i of flags)
	{
		i[2].innerText = computer[i[0]].toString();
	}
}
