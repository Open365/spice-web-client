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

Application = $.spcExtend(wdi.DomainObject, {
    spiceConnection: null,
    clientGui: null,
    agent: null,
    externalCallback: null,
    keyboardEnabled: true,
    packetProcess: null,
    inputProcess: null,
    multimediaTime: null,
    lastMultimediaTime: null,
    busConnection: null,
    busProcess: null,
	timeLapseDetector: null,
    connectionInfo: null,
    reconnecting: null,
    checkActivity: null,
    configs: null,

    init: function (c) {
        this.disposed = false;
        if (!c) {
            c = this.configs || {};
        } else {
            this.configs = c;
        }

        wdi.spiceClientPath = c.spiceClientPath || "";

        wdi.Debug.log('application init');
        wdi.GlobalPool.init();
        this.spiceConnection = c.spiceConnection || new wdi.SpiceConnection();
        this.clientGui = c.clientGui || new wdi.ClientGui({app: this});
        this.agent = c.agent || new wdi.Agent({
			app: this
		});

        this.inputProcess = c.inputProcess || new wdi.InputProcess({
			clientGui: this.clientGui,
			spiceConnection: this.spiceConnection
		});
        this.packetProcess = c.packetProcess;
        this.busConnection = c.busConnection || new wdi.BusConnection();
        this.busProcess = c.busProcess || new wdi.BusProcess({
			clientGui: this.clientGui,
			busConnection: this.busConnection
		});
		this.timeLapseDetector = c.timeLapseDetector || new wdi.TimeLapseDetector();
        this.checkActivity = c.checkActivity;
        this.setup();

        if (c['supportHighDPI']) {
            this.clientGui.pixelRatio = window.devicePixelRatio;
            this.pixelRatio = window.devicePixelRatio;

        } else {
            this.clientGui.pixelRatio = 1;
            this.pixelRatio = 1;
        }
    },

    run: function (c) {
        this.runParams = c;
	    if(c.hasOwnProperty('seamlessDesktopIntegration')) {
		    wdi.SeamlessIntegration = c['seamlessDesktopIntegration'];
	    }

		if (!this.packetProcess) {
			var displayProcess = false;

			if (c.useWorkers === false) {
				displayProcess = new wdi.DisplayProcess({
					clientGui: this.clientGui
				});
			}

			this.packetProcess = new wdi.PacketProcess({
				app: this,
				clientGui: this.clientGui,
				agent: this.agent,
				spiceConnection: this.spiceConnection,
	            inputsProcess: this.inputProcess,
	            displayProcess: displayProcess
	        })
		}

        if(!this.checkActivity) {
		    this.checkActivity = new wdi.CheckActivity(c.checkActivityInterval);
            this.checkActivity.addListener('activityLost', this.onActivityLost, this);
		}

        if (window.vdiLoadTest) {
            this.spiceConnection.addListener('message', this.onMessage, this);
        } else {
            this.spiceConnection.addListener('message', this.packetProcess.process, this.packetProcess);
        }


        this.busConnection.connect(c);
		this.timeLapseDetector.startTimer();

        if (c['canvasMargin']) {
            this.clientGui.setCanvasMargin(c['canvasMargin']);
        }

        if (c['disableClipboard']) {
            this.agent.disableClipboard();
            this.clientGui.disableClipboard();
            this.enableCtrlV();
        }

        if(c['layer']) {
            this.clientGui.setLayer(c['layer']);
        }

        if (this.clientGui.checkFeatures()) {
            if (wdi.SeamlessIntegration) {
                this.disableKeyboard();//keyboard should start disabled is integrated
            }
            wdi.Keymap.loadKeyMap(c['layout']);
            this.setExternalCallback(c['callback'], c['context']);

            try {
                this.connect({
					host: c['host'],
					port: c['port'],
					protocol: c['protocol'],
					vmHost: c['vmHost'],
					vmPort: c['vmPort'],
                    vmInfoToken: c['vmInfoToken'],
					busHost: c['busHost'],
					token: c['token'],
					connectionControl: c['connectionControl'],
                    heartbeatToken: c['heartbeatToken'],
					heartbeatTimeout: c['heartbeatTimeout']
				});
            } catch (e) {
                this.executeExternalCallback('error', 1);
            }

            this.clientGui.setClientOffset(c['clientOffset']['x'], c['clientOffset']['y']);
        }
		if (c.hasOwnProperty('externalClipboardHandling')) {
			this.externalClipoardHandling = c['externalClipboardHandling'];
		}
    },

    end: function () {
        //TODO: end?
    },

    setup: function () {
        this.spiceConnection.addListener('mouseMode', this.onMouseMode, this);
        this.spiceConnection.addListener('initAgent', this.onInitAgent, this);
        this.spiceConnection.addListener('error', this.onDisconnect, this);
		this.spiceConnection.addListener('channelConnected', this.onChannelConnected, this);
        this.clientGui.addListener('input', this.onClientInput, this);
        this.clientGui.addListener('resolution', this.onResolution, this);
        this.clientGui.addListener('paste', this.onPaste, this);
        this.clientGui.addListener('startAudio', this.onStartAudio, this);
        this.clientGui.addListener('eventLayerCreated', this.onEventLayerCreated, this);
        this.busProcess.addListener('windowCreated', this.onWindowCreated, this);
        this.busProcess.addListener('windowClosed', this.onWindowClosed, this);
        this.busProcess.addListener('windowMoved', this.onWindowMoved, this);
        this.busProcess.addListener('windowResized', this.onWindowResized, this);
        this.busProcess.addListener('windowFocused', this.onWindowFocused, this);
        this.busProcess.addListener('windowMinimized', this.onWindowMinimized, this);
        this.busProcess.addListener('windowRestored', this.onWindowRestored, this);
        this.busProcess.addListener('windowMaximized', this.onWindowMaximized, this);
        this.busProcess.addListener('busConnected', this.onBusConnected, this);
	    this.busProcess.addListener('menuResponse', this.onMenuResponse, this);
		this.busProcess.addListener('networkDriveResponse', this.onNetworkDriveResponse, this);
		this.busProcess.addListener('wrongPathError', this.onWrongPathError, this);
		this.busProcess.addListener('applicationLaunchedSuccessfully', this.onApplicationLaunchedSuccessfully, this);
		this.busProcess.addListener('selectedText', this.onRemoteSelectedText, this);
		this.busProcess.addListener('copiedText', this.onRemoteCopiedText, this);
		this.agent.addListener('clipBoardData', this.onClipBoardData, this);
        this.busConnection.addListener('busMessage', this.onBusMessage, this);
        this.busConnection.addListener('error', this.onDisconnect, this);
		this.timeLapseDetector.addListener('timeLapseDetected', this.onTimeLapseDetected, this);
        this.busProcess.addListener('defaultTypeEvent', this.onDefaultTypeEvent, this);
    },

	onChannelConnected: function(params) {
		var channel = params;
		if (channel === wdi.SpiceVars.SPICE_CHANNEL_INPUTS) {
			this.clientGui.releaseAllKeys();
		}
	},

	onDefaultTypeEvent: function (data) {
		this.executeExternalCallback(data['event'], data);
	},

	onNetworkDriveResponse: function(params) {
		this.executeExternalCallback('networkDriveResponse', params);
	},

    onDisconnect: function (params) {
		var error = params;
        this.executeExternalCallback('error', error);
    },

    onResolution: function (params) {
        this.executeExternalCallback('resolution', params);
    },

    onClipBoardData: function (params) {
		if (this.externalClipoardHandling) {
			this.executeExternalCallback('clipboardEvent', params);
		} else {
			this.clientGui.setClipBoardData(params);
		}
    },

	onRemoteCopiedText: function (data) {
		this.clientGui.setToLocalClipboard(data);
	},

	onRemoteSelectedText: function (data) {
		this.clientGui.setToLocalClipboard(data);
	},

	onWindowMinimized: function (params) {
        var window = params;
        var params = this.clientGui.resizeSubCanvas(window);
        this.executeExternalCallback('windowMinimized', params);
    },

    onWindowFocused: function (params) {
        this.executeExternalCallback('windowFocused', params);
    },

    onWindowRestored: function (params) {
        var window = params;
        var params = this.clientGui.resizeSubCanvas(window);
        this.executeExternalCallback('windowRestored', params);
    },

    onWindowMaximized: function (params) {
        var window = params;
        var params = this.clientGui.resizeSubCanvas(window);
        this.executeExternalCallback('windowMaximized', params);
    },

    onWindowResized: function (params) {
        var window = params;
        var params = this.clientGui.resizeSubCanvas(window);
        this.executeExternalCallback('windowResized', params);
    },

    onWindowMoved: function (params) {
        var window = params;
        var params = this.clientGui.moveSubCanvas(window);
        this.executeExternalCallback('windowMoved', params);
    },

    onWindowClosed: function (params) {
        var window = params;
        var params = this.clientGui.deleteSubCanvas(window);
        this.executeExternalCallback('windowClosed', params);
    },

    onWindowCreated: function (params) {
        var window = params;
        var params = this.clientGui.createNewSubCanvas(window);
        this.executeExternalCallback('windowCreated', params);
    },

	onMenuResponse: function(params) {
		var menuData = params;
		this.executeExternalCallback('menuResponse', menuData);
	},

    //Events
    onClientInput: function (params) {
        var data = params;
		var type = data[0];
		var event = data[1][0];
		if (this.inputProcess.isKeyboardShortcut(type, event)) {
			this._sendCtrlKey(event['keyCode']);
			return;
		}
		this.inputProcess.send(data, type);
	},

    onMessage: function (params) {
        var message = params;
        this.packetProcess.process(message);

        var self = this;

        window.checkResultsTimer && clearTimeout(window.checkResultsTimer);
        window.checkResultsTimer = window.setTimeout(function () {
            self.executeExternalCallback('checkResults');
            window.vdiLoadTest = false;
        }, 5000);

    },

    onBusConnected: function(params) {
        if (wdi.SeamlessIntegration) {
            this.busProcess.requestWindowList(); //request windows list
        }
    },

    onBusMessage: function (params) {
        var message = params;
        this.busProcess.process(message);
    },

    onInitAgent: function (params) {
        this.agent.setClientTokens(params);
        this.agent.sendInitMessage(this);
        this.reconnecting = false;
        this.executeExternalCallback('ready', params);
	},

    onMouseMode: function (params) {
        this.clientGui.setMouseMode(params);
    },

    onPaste: function (params) {
        this.agent.setClipboard(params);
    },

    onStartAudio: function () {
        this.packetProcess.processors[wdi.SpiceVars.SPICE_CHANNEL_PLAYBACK].startAudio();
    },

	onEventLayerCreated: function (params) {
		this.executeExternalCallback('eventLayerCreated', params);
	},

	onTimeLapseDetected: function (params) {
		var elapsedMillis = params;
		this.executeExternalCallback('timeLapseDetected', elapsedMillis);
	},

    connect: function (connectionInfo) {
        wdi.Debug.log('application connect');
        this.connectionInfo = connectionInfo;
        try {
            this.spiceConnection.connect(connectionInfo);
        } catch (e) {
            this.clientGui.showError(e.message);
        }
    },

    reconnect: function(reconnectionInfo) {
        this.reconnecting = true;
        if (reconnectionInfo.freeze) {
            this.freeze();
        }
        this.dispose();
        this.init();
        this.run(this.runParams);
    },

    freeze: function() {
        this.clientGui.freeze();
    },

    cancelFreeze: function() {
        this.clientGui.cancelFreeze();
    },

    setReconnecting: function(reconnecting) {
        this.reconnecting = reconnecting;
    },

    getReconnecting: function() {
        return this.reconnecting;
    },

    setExternalCallback: function (fn, context) {
        this.externalCallback = [fn, context];
    },

    executeExternalCallback: function (action, params) {
        this.externalCallback[0].call(this.externalCallback[1], action, params);
    },

    sendCommand: function (action, params) {
        switch (action) {
            case "close":
                this.busProcess.closeWindow(params['hwnd']);
                break;
            case "move":
                this.busProcess.moveWindow(params['hwnd'], params['x'], params['y']);
                break;
            case "minimize":
                this.busProcess.minimizeWindow(params['hwnd']);
                break;
            case "maximize":
                this.busProcess.maximizeWindow(params['hwnd']);
                break;
            case "restore":
                this.busProcess.restoreWindow(params['hwnd']);
                break;
            case "focus":
                this.busProcess.focusWindow(params['hwnd']);
                break;
            case "resize":
                this.busProcess.resizeWindow(params['hwnd'], params['width'], params['height']);
                break;
            case "run":
                this.busProcess.executeCommand(params['cmd']);
                break;
            case "setResolution":
                this.agent.setResolution(params['width'], params['height']);
                break;
			case 'getMenu':
				this.busProcess.getMenu();
				break;
			case 'reMountNetworkDrive':
				this.busProcess.reMountNetworkDrive(params['host'], params['username'], params['password']);
				break;
            case 'refreshFileSystem':
                this.busProcess.refreshFileSystem();
                break;
            default:
                this.busProcess.sendGenericMessage(action, params);
                break;
		}
    },

    enableKeyboard: function () {
    	this.clientGui.enableKeyboard();
    },

    disableKeyboard: function () {
		this.clientGui.disableKeyboard();
    },

    enableCtrlV: function () {
        wdi.KeymapES.setCtrlKey(86, 0x2F);
        wdi.KeymapUS.setCtrlKey(86, 0x2F);
    },

	disconnect: function() {
		this.busConnection.disconnect();
		this.spiceConnection.disconnect();
	},

    setMultimediaTime: function (time) {
        this.multimediaTime = time;
        this.lastMultimediaTime = Date.now();
    },

    sendShortcut: function(shortcut) {
        if(shortcut == wdi.keyShortcutsHandled.CTRLV) {
            this._sendCtrlKey(86);
        } else if(shortcut == wdi.keyShortcutsHandled.CTRLC) {
            this._sendCtrlKey(67);
        }
    },

    _sendCtrlKey: function (keycode){
        this.inputProcess.send([
            "keydown",
            [
                {
                    'generated': true,
                    'type': "keydown",
                    'keyCode': 17,
                    'charCode': 0
                }
            ]

        ], "keydown"); //ctrl down

        this.inputProcess.send([
            "keydown",
            [
                {
                    'generated': true,
                    'type': "keydown",
                    'keyCode': keycode,
                    'charCode': 0
                }
            ]

        ], "keydown");

        this.inputProcess.send([
            "keyup",
            [
                {
                    'generated': true,
                    'type': "keyup",
                    'keyCode': keycode,
                    'charCode': 0
                }
            ]

        ], "keyup");

        this.inputProcess.send([
            "keyup",
            [
                {
                    'generated': true,
                    'type': "keyup",
                    'keyCode': 17,
                    'charCode': 0
                }
            ]

        ], "keyup"); //ctrl up
    },

	dispose: function () {
        this.disposed = true;
        wdi.Debug.log('application dispose');
        wdi.ExecutionControl.runQ.clear();
        wdi.ExecutionControl.currentProxy = null;
        wdi.ExecutionControl.sync = true;
		this.disableKeyboard();
		this.disconnect();
		this.packetProcess.dispose();
        this.clientGui.dispose();
        this.busProcess.clearEvents();
        this.busProcess.dispose();
        this.busConnection.clearEvents();
        this.agent.clearEvents();
        this.agent.dispose();
        this.timeLapseDetector.clearEvents();
        this.timeLapseDetector.dispose();
        this.checkActivity.dispose();
	},

    onWrongPathError: function (params) {
        this.executeExternalCallback('wrongPathError', params);
    },

    onApplicationLaunchedSuccessfully: function (params) {
        this.executeExternalCallback('applicationLaunchedSuccessfully', params);
    },

    getKeyboardHandler: function() {
        return this.clientGui.handleKey;
    },

    getClientGui: function() {
        return this.clientGui;
    },

    setCurrentWindow: function(wnd) {
        this.clientGui.inputManager.setCurrentWindow(wnd);
    },

    onActivityLost: function(params) {
        this.executeExternalCallback('activityLost', params);
    },

    resetActivity: function() {
        this.checkActivity.resetActivity();
    },

    toSpiceResolution: function (resolution) {
        return {
            width: resolution.width * this.pixelRatio,
            height: resolution.height * this.pixelRatio,
            scaleFactor: this.pixelRatio
        }
    }
});

window['Application'] = Application;
Application.prototype['run'] = Application.prototype.run;
Application.prototype['sendCommand'] = Application.prototype.sendCommand;
Application.prototype['enableKeyboard'] = Application.prototype.enableKeyboard;
Application.prototype['disableKeyboard'] = Application.prototype.disableKeyboard;
Application.prototype['dispose'] = Application.prototype.dispose;
Application.prototype['getKeyboardHandler'] = Application.prototype.getKeyboardHandler;
Application.prototype['getClientGui'] = Application.prototype.getClientGui;
Application.prototype['setCurrentWindow'] = Application.prototype.setCurrentWindow;
Application.prototype['reconnect'] = Application.prototype.reconnect;
Application.prototype['freeze'] = Application.prototype.freeze;
Application.prototype['cancelFreeze'] = Application.prototype.cancelFreeze;
Application.prototype['setReconnecting'] = Application.prototype.setReconnecting;
Application.prototype['getReconnecting'] = Application.prototype.getReconnecting;
