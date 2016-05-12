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

wdi.PacketFilter = {
	restoreContext: false,
	start: null,
	dispose: function () {
		wdi.Debug.log("Disposing PacketFilter");
		this.restoreContext = false;
		this.start = null;
	},

	filter: function(spiceMessage, fn, scope, clientGui) {
		if(wdi.logOperations) {
			this.start = Date.now();
		}

		//TODO: design an architecture for loading
		//dynamic filters, instead of filtering here.
		//This should be just the entry point for filters.
		if (wdi.graphicDebug && wdi.graphicDebug.debugMode) {
			wdi.graphicDebug.printDebugMessageOnFilter(spiceMessage, clientGui);
		}
		//end of hardcoded filter

        // MS Word Benchmark startup
        if (wdi.IntegrationBenchmark && wdi.IntegrationBenchmark.benchmarking) {
            var date = new Date();
            wdi.IntegrationBenchmark.setStartTime(date.getTime());
        }

		//check clipping
		if(spiceMessage.args.base) {
			if(spiceMessage.args.base.clip.type === wdi.SpiceClipType.SPICE_CLIP_TYPE_RECTS) {
				var context = clientGui.getContext(spiceMessage.args.base.surface_id);
				context.save();
				context.beginPath();
				var rects = spiceMessage.args.base.clip.rects.rects;
				var len = rects.length;
				while(len--) {
					var box = wdi.graphics.getBoxFromSrcArea(rects[len]);
					context.rect(box.x, box.y, box.width, box.height);
				}
				context.clip();
				this.restoreContext = spiceMessage.args.base.surface_id;
			}
		}
        fn.call(scope, spiceMessage);
	},

    notifyEnd: function(spiceMessage, clientGui) {
		if(this.restoreContext !== false) {
			var context = clientGui.getContext(this.restoreContext);
			context.restore();
			this.restoreContext = false;
		}

        if(wdi.SeamlessIntegration) {
			var filterPosition = null;
			if(spiceMessage.args.base && spiceMessage.args.base.box) {
				filterPosition = spiceMessage.args.base.box;
			}
            clientGui.fillSubCanvas(filterPosition);
        }

		if (wdi.graphicDebug && wdi.graphicDebug.debugMode) {
			wdi.graphicDebug.printDebugMessageOnNotifyEnd(spiceMessage, clientGui);
		}

        // MS Word Benchmark
        if (wdi.IntegrationBenchmark && wdi.IntegrationBenchmark.benchmarking) {
            var date = new Date();
            wdi.IntegrationBenchmark.setEndTime(date.getTime());
        }

        // clear the tmpcanvas
        wdi.GlobalPool.cleanPool('Canvas');
		wdi.GlobalPool.cleanPool('Image');
		if(wdi.logOperations) {
			wdi.DataLogger.log(spiceMessage, this.start);
		}
	}



}

