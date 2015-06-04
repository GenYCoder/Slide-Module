angular.module("images",[])
	.factory("imageStorage", function(){
		//storing images across controllers

		var photoAlbum = null,
			slideIndex = null,
			options = {},
			folderLocation = null;

		return {
			add: function(images){
				if( angular.isObject(images) ){
					photoAlbum = this.sortImage(images);
				}
			},
			get: function(){
				return photoAlbum;
			},
			getOptions: function(){
				return options;
			},
			setOptions: function(setofoptions){
				if( angular.isObject(setofoptions) ){
					options = setofoptions;
				}
			},
			setFolderLocation:function(path){
				if( angular.isString(path) ){
					folderLocation = path;
				}
			},
			getFolderLocation:function(){
				return folderLocation;
			},
			setIndex: function(index){
				slideIndex = index;
			},
			getIndex: function(){
				return slideIndex;
			},
			sortImage: function(arr){
				if( angular.isArray(arr) ){
					return arr.sort(function(a,b){
						//only get the numbers
						a = parseInt( (a.Name).replace(/[^0-9]/g,"") );
						b = parseInt( (b.Name).replace(/[^0-9]/g,"") );

						if(a > b){
							return 1;
						}
						if(a < b){
							return -1;
						}
						//if match
						return 0;
					})

				}
			}
		}
	})