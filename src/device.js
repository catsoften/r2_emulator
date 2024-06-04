export class Device
{
	port;

	sendAttn = false;
	sendData = false;
	data = 0;

	constructor(port)
	{
		this.port = port;
	}

	step()
	{

	}

	clear()
	{
		this.sendAttn = false;
		this.sendData = false;
	}

	recieveAttn()
	{

	}

	recieveData()
	{

	}
}
