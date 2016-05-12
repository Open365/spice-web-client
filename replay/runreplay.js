/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

$(document).ready(function() {
	clientGui = new wdi.ClientGui();
	var displayProcessor;

	// manually edit this variable to debug synchronously or asynchronously
	// depending on which part are you debugging
	var asyncReplay = true;

	if (asyncReplay) {
		displayProcessor = new wdi.DisplayPreProcess({
			clientGui: clientGui
		});
		displayProcess = displayProcessor.displayProcess;
	} else {
		displayProcessor = displayProcess = new wdi.DisplayProcess({
			clientGui: clientGui
		});
	}

	var rawSpiceMessage = JSON.parse(replayData.object);
	var queue = new wdi.ViewQueue();

	var tempQ = [];
	var q = rawSpiceMessage.body.q;
	Object.keys(q).forEach(function (key){
		tempQ.push(q[key]);
	});

	queue.setData(tempQ);

	rawSpiceMessage.body = queue;

	var canvasOrigin = $('<canvas/>').attr({
		'width': replayData.width,
		'height': replayData.height
	});
	var ctxOrigin = canvasOrigin[0].getContext('2d');
	var imgOrigin = new Image();
	imgOrigin.onload = function() {
		ctxOrigin.drawImage(imgOrigin, 0, 0);
		clientGui.getCanvas = function() {
			return ctxOrigin.canvas;
		};
		clientGui.getContext = function() {
			return ctxOrigin;
		};
		var spiceMessage = wdi.PacketFactory.extract(rawSpiceMessage);
		var cloneSpiceMessage = $.extend(true, {}, spiceMessage);
		displayProcess.postProcess = function() {
			$(ctxOrigin.canvas).appendTo('body');
			$('<div/>').append(prettyPrint(cloneSpiceMessage)).appendTo('body');
            if('image' in cloneSpiceMessage.args) {
                _printImage(cloneSpiceMessage, $('body'));
            }
		};
		displayProcessor.process(spiceMessage);
	};
	imgOrigin.src = replayData.origin.replace(/\s/g, '+');

	function _printImage(spiceMessage, div) {
		wdi.graphics.getImageFromSpice(spiceMessage.args.image.imageDescriptor, spiceMessage.args.image.data, clientGui, function(srcImg) {
			if(srcImg) {
				div.append(
					$('<div/>').css('font-size', '12px')
						.append('Image inside spiceMessage:')
						.append($('<br/>'))
						.css('border', '1px solid black')
						.append(srcImg)
				);
			}
		}, this);
	}
});

