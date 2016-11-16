function readJsonFile(filename) {
	return new Promise(function(resolve, reject) {
		var $request = $.ajax({ 
			url: "../data/" + filename + ".json",
			dataType: 'json',
			type: 'GET'
		});

		$request.done(function(data, textStatus) {
			resolve(data);
		});

		$request.fail(function(jqXHR, textStatus, errorThrown) {
			reject(errorThrown);
		});
	});
}

function onRejected(error) {
	console.error(error);
}