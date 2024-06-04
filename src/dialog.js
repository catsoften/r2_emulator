let dialog = document.getElementById("dialogDialog");
let span = document.getElementById("spanDialog");
let input = document.getElementById("inputDialog");
let cancel = document.getElementById("buttonDialogCancel");
let ok = document.getElementById("buttonDialogOk");

input.onkeydown = function(event)
{
	if (event.key === "Enter")
	{
		event.preventDefault();
		ok.click();
	}
};

cancel.onclick = function()
{
	dialog.close();
};

export function showMessageDialog(message)
{
	span.innerText = message;
	input.hidden = true;
	cancel.hidden = true;

	ok.onclick = function()
	{
		dialog.close();
	};

	dialog.showModal();
}

export function showConfirmDialog(message, callback)
{
	span.innerText = message;
	input.hidden = true;
	cancel.hidden = false;

	ok.onclick = function()
	{
		dialog.close();
		callback();
	};

	dialog.showModal();
}

export function showInputDialog(message, value, callback)
{
	span.innerText = message;
	input.hidden = false;
	input.type = "text";
	input.placeholder = value;
	if (value === 0)
	{
		input.value = "";
	}
	else
	{
		input.value = value;
	}
	cancel.hidden = false;

	ok.onclick = function()
	{
		dialog.close();
		callback(input.value);
	};

	dialog.showModal();
}

export function showFileDialog(message, callback)
{
	span.innerText = message;
	input.hidden = false;
	input.type = "file";
	cancel.hidden = false;

	ok.onclick = function()
	{
		dialog.close();
		if (input.files.length)
		{
			callback(input.files[0]);
		}
		else
		{
			callback(null);
		}
	};

	dialog.showModal();
}
