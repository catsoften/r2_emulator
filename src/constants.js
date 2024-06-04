export const COLOR_TABLE =
[
	[0x00, 0x00, 0x00], [0x00, 0x00, 0xAA], [0x00, 0xAA, 0x00], [0x00, 0xAA, 0xAA],
	[0xAA, 0x00, 0x00], [0xAA, 0x00, 0xAA], [0xAA, 0xAA, 0x00], [0xAA, 0xAA, 0xAA],
	[0x55, 0x55, 0x55], [0x55, 0x55, 0xFF], [0x55, 0xFF, 0x55], [0x55, 0xFF, 0xFF],
	[0xFF, 0x55, 0x55], [0xFF, 0x55, 0xFF], [0xFF, 0xFF, 0x55], [0xFF, 0xFF, 0xFF],
];

export let FONT_DATA;

export const INSTRUCTION_CLASS_TABLE =
[
	3, 3, 3, 3, 3, 3, 3, 3,
	2, 3, 3, 3, 3, 3, 3, 3,
	0, 2, 3, 3, 3, 3, 3, 3,
	1, 1, 3, 3, 2, 1, 2, 0,
];

export const INSTRUCTION_NAME_TABLE =
[
	"mov",  "and",  "or",   "xor",  "add",  "adc",  "sub",  "sbb",
	"swm",  "ands", "ors",  "xors", "adds", "adcs", "cmp",  "cmb",
	"hlt",  "jmp",  "rol",  "ror",  "shl",  "shr",  "scl",  "scr",
	"bump", "wait", "send", "recv", "push", "pop",  "call", "ret",
];

export const KEY_MAP =
{
	"`": 0x60, "~": 0x7E, "1": 0x31, "!": 0x21,
	"2": 0x32, "@": 0x40, "3": 0x33, "#": 0x23,
	"4": 0x34, "$": 0x24, "5": 0x35, "%": 0x25,
	"6": 0x36, "^": 0x5E, "7": 0x37, "&": 0x26,
	"8": 0x38, "*": 0x2A, "9": 0x39, "(": 0x28,
	"0": 0x30, ")": 0x29, "-": 0x2D, "_": 0x5F,
	"=": 0x3D, "+": 0x2B, "Backspace": 0x08, "Tab": 0x09,
	"q": 0x71, "Q": 0x51, "w": 0x77, "W": 0x57,
	"e": 0x65, "E": 0x45, "r": 0x72, "R": 0x52,
	"t": 0x74, "T": 0x54, "y": 0x79, "Y": 0x59,
	"u": 0x75, "U": 0x55, "i": 0x69, "I": 0x49,
	"o": 0x6F, "O": 0x4F, "p": 0x70, "P": 0x50,
	"[": 0x5B, "{": 0x7A, "]": 0x5D, "}": 0x7D,
	"\\": 0x6C, "|": 0x7C, "a": 0x61, "A": 0x41,
	"s": 0x73, "S": 0x53, "d": 0x64, "D": 0x44,
	"f": 0x66, "F": 0x46, "g": 0x67, "G": 0x47,
	"h": 0x68, "H": 0x48, "j": 0x6A, "J": 0x4A,
	"k": 0x6B, "K": 0x4B, "l": 0x6C, "L": 0x4C,
	";": 0x3B, ":": 0x3A, "'": 0x27, "\"": 0x22,
	"Enter": 0x0D, "z": 0x7A, "Z": 0x5A, "x": 0x78,
	"X": 0x58, "c": 0x63, "C": 0x43, "v": 0x76,
	"V": 0x56, "b": 0x62, "B": 0x42, "n": 0x6E,
	"N": 0x4E, "m": 0x6D, "M": 0x4D, ",": 0x2C,
	"<": 0x3C, ".": 0x2E, ">": 0x3E, "/": 0x2F,
	"?": 0x3F, " ": 0x20,
};

export const REGISTER_NAME_TABLE =
[
	"r0",  "r1",  "r2",  "r3",
	"r4",  "r5",  "r6",  "r7",
	"r8",  "r9",  "r10", "r11",
	"r12", "r13", "sp",  "ip",
];

let bin = atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEEABIoCAADKp3wKXvFRDxFCCBFHoiUeBAEAAIwgCAwGgiAGCqEAAADhEAAAABACAOAAAAAAAAQQQggBTlZNDgiDIByMhBAeDsRADhBGeRCe4EAOnOBJHB6EIAicxEgOjuRBDgABAAQAARACCCEQCIADOAACgRACDsIABE7XBQ5O9EURT/RED14QBB5PFEUPX/AEH1/wBAFe0EUeUfRFEQ5BEA4YBEUOUXIkEUEQBB/RVkUR0VRlEU4URQ5P9AQBThRVDk/0RBFe8EEPH0EQBFEURQ5RpCgEUVRVCpFCKBFRpBAEX0JIH44gCA6BQCAQDoIgDoQSAQAAAAAfBAIAAAADeRyCI0kOACcIHBAnSRwA4wkMACMYAgDnQQyCI0kSBEAQBBAASQyCYigSBkEQDsBTVRWAI0kSACNJDIAjOQIAJ3EQgGYIAgBnYA6CIwgcgCRJDIAkKQRAVFUKgEQpEoDEQQiAhxAeDCEQDAQBEAQGgRAGVgMAAN/3fR+E8zkEgOM4AADhEAAAQAAA37d9H4SzOQSAozgAAKEQAIriKArAR3wAn6IoCp+iKBPQB30QiqIoH8EXfAHbp3wbwAd8AIqiKArAQRwAiuIAAABHcAAA4CgKyoI8AIomeADAgywKgCdoCsoGfACKJmgKwAdsCsqCLArKBmwKlVIpFZdWLR0fAAAABPABBF/wBR8f9EEfgFIpAAAAAB8AAHwfAPB9H8D3fR9BEAQBwzAMA8dxHAfP8zwPhEIoCgRBOASEQzgEBEAABAEQAAEQAAEQhKJEH4RDAA4OQDgEHFEYBB6BEB4AUAEAAAAAFRUAAAAA8EEAgFM5AMhHfAKE43wf3+c4BJj3eRjD8z0DigJEDooCOBGKAnwAigJUCooCfA6KAjgfigIoFY7jOA7A930AzvM8AI7neQDA8zwOgOd5Ds73fQCO53kOwPd9Ds7zPA7O930OQCIlAICUSACEAhAKCgEoBADwAQAEQRAEAHAAAARBAAAAwAEAAEAQBARxAAAEwQEAAHAQBADAEQQE8QEABMERBADwEQQEcRAEBPERBATxOQSE8xEEBPMxBITxGQSBxHEez3EkEB7HSQFQchwPgEIoAIDzOQDK9zkEhPM5BM62EQ7O9xEOzhZtDoqiAAoKoCgKVgNYDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==");
let bytes = new Uint8Array(bin.length);
for (let i = 0; i < bin.length; i++)
{
	bytes[i] = bin.charCodeAt(i);
}
FONT_DATA = new Uint32Array(bytes.buffer);
