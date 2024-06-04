export class IOBus
{
	devices = [];

	step()
	{
		for (let i of this.devices)
		{
			i.clear();
			i.step();
		}
	}

	getState()
	{
		let state =
		{
			hasAttn: false,
			hasData: false,
			port: 0,
			data: 0,
		};
		for (let i of this.devices)
		{
			if (i.sendAttn)
			{
				state.hasAttn = true;
				state.hasData = false;
				state.port = i.port;
				state.data = 0;
			}
			else if (i.sendData)
			{
				state.hasAttn = false;
				state.hasData = true;
				state.port = i.port;
				state.data = i.data;
			}
		}
		return state;
	}

	sendAttn(port)
	{
		for (let i of this.devices)
		{
			if (i.port === port)
			{
				i.recieveAttn();
			}
		}
	}

	sendData(port, data)
	{
		for (let i of this.devices)
		{
			if (i.port === port)
			{
				i.recieveData(data);
			}
		}
	}
}
