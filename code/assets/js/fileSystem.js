class myFile{
	constructor(fileName, type, content, parent){
		let _id = -1;
		let _fileName = fileName;
		let _type = type;
		let _content = content;
		let _parent = parent;
		let _path = ((parent == null)?"":parent.getPath()) + "/" + fileName;
		let _nextID = -1;
		if(type == "dir")_nextID = 0;

		this.getID = function(){
			return _id;
		}

		this.setID = function(id){
			_id = id;
		}

		this.getName = function(){
			return _fileName;
		}

		this.setName = function(fileName){
			_fileName = fileName;
		}

		this.updatePath = function(){
			_path = _parent.getPath() + "/" + _fileName;
		}

		this.getPath = function(){
			return _path;
		}

		this.getType = function(){
			return _type;
		}

		this.getSize = function(){
			if(_type == "dir"){
				var sz = 0;
				var v = _content.values();
				while(true){
					var t = v.next();
					if(t.value == null)break;
					sz += t.value.getSize();
				}
				return sz;
			}else{
				// this only works for txt files
				return _content.length;
			}
		}

		this.setContent = function(content){
			_content = content;
		}

		this.getContent = function(){
			if(_type == "dir"){
				var res = [];
				var v = _content.values();
				while(true){
					var t = v.next();
					if(t.value == null)break;
					res.push({
						"fileID" : t.value.getID(),
						"fileName" : t.value.getName(),
						"type"     : t.value.getType()
					});
				}
				return res;
			}else{
				return _content;
			}
		}

		this.getParent = function(){
			return _parent;
		}

		this.setParent = function(parent){
			_parent = parent;
		}

		this.getCopy = function(){
			var f = new myFile(_fileName, _type, (_type == "dir")? new Map(): "", null);
			if(_type == "dir"){
				var v = _content.values();
				while(true){
					var t = v.next();
					if(t.value == null)break;
					f.addFile(t.value.getCopy());
				}
			}else f.setContent(_content);
			return f;
		}

		// directory -> files operations
		this.addFile = function(f){
			_content.set(_nextID, f);
			f.setID(_nextID);
			_nextID += 1;
		}

		this.deleteFile = function(fileID){
			_content.delete(fileID);
		}

		this.doesFileExists = function(fileName){
			var v = _content.values();
			while(true){
				var s = v.next().value;
				if(s == null)break;
				if(s.getName() == fileName)return true;
			}
			return false;
		}

		//gets file with given id
		this.selectFile = function(fileID){
			var f = _content.get(fileID);
			if(f != null) return f;
			console.log("No such file or directory");
		}
	}
}



class session{
	constructor(id, CWD, s){
		let _id = id;
		let _currentWorkingDir = CWD;
		let _selected = s;

		this.getId = function(){return _id;}
		this.getCWD = function(){return _currentWorkingDir;}
		this.getSelected = function(){return _selected;}
		this.setCWD = function(cwd){return _currentWorkingDir = cwd;}
		this.setSelected = function(s){return _selected = s;}
	}
}

class fileSystem{
	constructor(){
		let _root = new myFile("root", "dir", new Map() , null);;
		let _sessions = new Map();
		let _nextID = 0;
		let _opCode = 0;
		let _tmp = null;
		let isCommiting = 1;
		var _commands = [];
		/**
		 * this function should be modified to make it read back the updates in the stored file
		 *

		 this.storeFileSystemTree = function(){
		 	var JSONObject = JSON.stringify(_root);
		 	localStorage.setItem("OurTree", _root);
		 }

		 /*this.retrieveFileSystemTree = function(){
		 	var tree = localStorage.getItem("OurTree");
		 	// var tree = JSON.parse(JSONObject);
		 	if(tree == null) return new myFile("root", "dir", new Map() , null);
		 	return tree;
		 }*/

		this.saveUpdates = function(opCode, oprands){
			_commands.push({
				"opCode" : opCode,
				"operands" : oprands
				});
				console.log("Woooo");
				var JSONObject = JSON.stringify(_commands);
				console.log(JSONObject);
				localStorage.setItem("savedCommands", JSONObject);
		}
		this.clear = function(){
			var JSONObject = JSON.stringify([]);
			console.log(JSONObject);
			localStorage.setItem("savedCommands", JSONObject);
		}
		this.commit = function(){
			isCommiting = 1;
			console.log("i 'm commiting");
			var JSONObject = localStorage.getItem("savedCommands");
			var res = JSON.parse(JSONObject);
			console.log(res);
			if(res == null){
				isCommiting = 0;
				return;
			}
			_commands = res;
			var Sid = this.createSession();
			var sz = _commands.length;
			for(var i = 0; i < sz ; ++i){
				var order = _commands[i];
				switch(order.opCode){
					case 3: // select
						this.select(Sid, order.operands.fileID);
						break;
					case 4: // unselect
						this.unselect(Sid);
						break;
					case 5: // cut
						this.cut(Sid);
						break;
					case 6: // copy
						this.copy(Sid);
						break;
					case 7: // deleteFile
						this.deleteFile(Sid);
						break;
					case 8: // paste
						this.paste(Sid);
						break;
					case 9: // newFile
						this.newFile(Sid, order.operands.fileName, order.operands.type, order.operands.content);
						break;
					case 10: // newFolder
						this.newFolder(Sid, order.operands.fileName);
						break;
					case 11: // rename
						this.rename(Sid, order.operands.newName);
						break;
					case 12: // open
						this.open(Sid);
						break;
					case 13: // save
						this.save(Sid, order.operands.content);
						break;
					case 14: // goBack
						this.goBack(Sid);
						break;
					case 15: // goToRoot
						this.goToRoot(Sid);
						break;
				}
			}
			isCommiting = 0;
			this.terminateSession(Sid);
		}

		this._getSession = function(id){
			let thisSession = _sessions.get(id);
			if(thisSession != null) return thisSession;
			location.replace('Login.html');
			return null;
		}

		this.createSession = function(){
			// 1
			let thisSession = new session(_nextID, _root, null);
			_sessions.set(_nextID, thisSession);
			_nextID += 1;
			return _nextID - 1;
		}

		this.terminateSession = function(id){
			// 2
			_sessions.delete(id);


		}

		this.getCWDpath = function(id){
			let thisSession = this._getSession(id);
			if(thisSession == null)return;
			return thisSession.getCWD().getPath();
		}

		this.select = function(id, fileID){
			// 3
			let thisSession = this._getSession(id);
			if(thisSession == null)return;
			thisSession.setSelected(thisSession.getCWD().selectFile(fileID));
			if(!isCommiting)	this.saveUpdates(3, {
				"fileID" : fileID
				});
		}

		this.unselect = function(id){
			// 4
			let thisSession = this._getSession(id);
			if(thisSession == null)return;
			thisSession.setSelected(null);
			if(!isCommiting)	this.saveUpdates(4, null);
		}

		this.cut = function(id){
			// 5
			console.log(isCommiting);
			let thisSession = this._getSession(id);
			if(thisSession == null) return;
			if(thisSession.getSelected() == null){
				alert("nothing to cut");
				return;
			}
			_opCode = 1;
			_tmp = [thisSession.getCWD(), thisSession.getSelected()];
			if(!isCommiting)	this.saveUpdates(5, null);
		}

		this.copy = function(id){
			// 6
			let thisSession = this._getSession(id);
			if(thisSession == null)return;
			if(thisSession.getSelected() == null){
				alert("nothing to copy");
				return;
			}
			_opCode = 0;
			_tmp = [thisSession.getCWD(), thisSession.getSelected()];
			if(!isCommiting)	this.saveUpdates(6, null);
		}

		this.deleteFile = function(id){
			// 7
			let thisSession = this._getSession(id);
			if(thisSession == null)return;
			if(thisSession.getSelected() == null){
				alert("nothing to delete");
				return;
			}
			thisSession.getCWD().deleteFile(thisSession.getSelected().getID());
			thisSession.setSelected(null);
			if(!isCommiting)	this.saveUpdates(7, null);
		}

		this.paste = function(id, newName = null){
			// 8
			var thisSession = this._getSession(id)
			if(thisSession == null)return null;

			if(_tmp == null) {
				alert("there is nothing to paste");
				return null;
			}

			var destDir = thisSession.getCWD();
			var srcDir  = _tmp[0];
			var s = thisSession.getSelected();
			if(s != null && s.getType() == "dir")
				destDir = s;

			if(destDir == srcDir){
				alert("same directory!");
				return null;
			}

			var f = _tmp[1];
			if((destDir.getPath() + "/").startsWith(f.getPath() + "/")){
				alert("can't copy/cut - paste a folder inside itself");
				return null;
			}

			if(destDir.doesFileExists(f.getName()) && (newName == null || newName == f.getName())){
				alert("file of same name already exists");
				return null;
			}

			if(_opCode){
				// the operation is cut
				var prvID = f.getID();
				destDir.addFile(f);
				srcDir.deleteFile(prvID);
			}else{
				// the operation is copy
				//destDir.addFile(f.getCopy());
				 f = f.getCopy();
				 destDir.addFile(f);
			}
			f.setParent(destDir);
			f.updatePath();
			_tmp = null;
			if(!isCommiting)	this.saveUpdates(8, null);
			return {
				"fileID" : f.getID(),
				"fileName" : f.getName(),
				"type" : f.getType()
			};
		}

		this.newFile = function(id, fileName, type, content){
			// 9
			let thisSession = this._getSession(id);
			if(thisSession == null)return;
			let cwd = thisSession.getCWD()
			if(cwd.doesFileExists(fileName)){
				alert("file of same name already exists!");
				return;
			}
			var f = new myFile(fileName, type, content, thisSession.getCWD());
			cwd.addFile(f);
			if(!isCommiting)	this.saveUpdates(9, {
				"fileName" : fileName,
				"type" : type,
				"content" : content
			});
			return {
				"fileID": f.getID(),
				"fileName": fileName,
				"type": type
				};
		}

		this.newFolder = function(id, folderName){
			// 10
			let thisSession = this._getSession(id);
			if(thisSession == null)return;
			let cwd = thisSession.getCWD();
			if(cwd.doesFileExists(folderName)){
				alert("file of same name already exists!");
				return;
			}
			var f = new myFile(folderName, "dir", new Map(), cwd);
			cwd.addFile(f);

			if(!isCommiting)	this.saveUpdates(10, {
				"fileName" : folderName,
			});
			return {
				"fileID": f.getID(),
				"fileName": folderName,
				"type": "dir"
				};
		}

		this.rename = function(id, newName){
			// 11
			let thisSession = this._getSession(id);
			if(thisSession == null)return;
			let cwd = thisSession.getCWD();
			if(cwd.doesFileExists(newName)){
				alert("file of same name already exists!");
				return;
			}
			thisSession.getSelected().setName(newName);
			thisSession.getSelected().updatePath();
			if(!isCommiting)	this.saveUpdates(11, {
				"newName" : newName
			})
		}

		this.open = function(id){
			// 12
			var thisSession = this._getSession(id);
			if(thisSession == null)return;
			var s = thisSession.getSelected();
			if(!isCommiting)	this.saveUpdates(12, null);
			if(s.getType() == "dir"){
				thisSession.setCWD(s);
				thisSession.setSelected(null);
				return thisSession.getCWD().getContent();
			}
			return thisSession.getSelected().getContent();
		}

		this.save = function(id, content){
			// 13
			let thisSession = this._getSession(id);
			if(thisSession == null)return;
			thisSession.getSelected().setContent(content);
			if(!isCommiting)	this.saveUpdates(13, {
				"content" : content
			});
		}

		this.goBack = function(id){
			// 14
			let thisSession = this._getSession(id);
			if(thisSession == null)return;
			let cwd = thisSession.getCWD().getParent();
			if(cwd == null) return;
			thisSession.setCWD(cwd);
			thisSession.setSelected(null);
			if(!isCommiting)	this.saveUpdates(14, null);
			return thisSession.getCWD().getContent();
		}

		this.getProperities = function(id){
			let thisSession = this._getSession(id);
			if(thisSession == null)return;
			let s = thisSession.getSelected()
			return {
				"fileName" : s.getName(),
				"type"     : s.getType(),
				"size"     : s.getSize()
			}
		}

		this.goToRoot = function(id){
			// 15
			let thisSession = this._getSession(id);
			if(thisSession == null)return;
			thisSession.setSelected(null);
			thisSession.setCWD(_root);
			if(!isCommiting)	this.saveUpdates(15, null);
			return _root.getContent();
		}

		// debugging methods
		this.getSessions = function(){
			//console.log(_sessions);
			for(var i = 0; i < _sessions.size; i++){
				console.log(i);
				console.log(_sessions.get(i));
			}
		}
	}
}
