# R2 Emulator
Browser based emulator for the [R216](https://powdertoy.co.uk/Browse/View.html?ID=2303519) computer. [Try here](https://catsoften.net/r2_emulator).

## Features
 - Adjustable speed
 - Single or multiple instruction stepping
 - To scale keyboard, screen, and memory
 - Viewing and changing of flags, registers, ~~and memory values (todo)~~

## Advantages over TPT version ("Why would anyone want this?")
 - Up to ~10000 times faster (even with `tpt.setfpscap(2)`)
 - More convenient keyboard input
 - Larger screen
 - Easier debugging

## Loading programs
The demo from the original save is loaded by default. In order to load new programs, [TPTASM](https://github.com/LBPHacker/tptasm) must be modified to save the assembled binary as a file:

Add the following just before `architecture.flash(...)` in `src/main.lua` (line 273).
```lua
local f = io.open("dump.bin", "wb")
for i = 0, #opcodes, 1 do
	local dword = opcodes[i].dwords[1]
	for j = 0, 3, 1 do
		f:write(string.char(bit.band(dword, 0xFF)))
		dword = bit.rshift(dword, 8)
	end
end
f:close()
```
*Note: This will also dump programs from other computers when assembling with TPTASM.*

After adding this, run TPTASM normally. The resulting file (dump.bin) can be loaded with the emulator.
