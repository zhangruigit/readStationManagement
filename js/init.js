var username = '';
		var realm = 'qiktone.com';
		var nonce = Math.random().toString(36).substr(2);
		var domain = 'http://192.168.1.88:8098';
		var base64 = ''; //封面
		var selectId = '';
		var bookId = '';
		var picIds = [];//封面插图id
		//var constant;//常量
		//登录
		function login() {
			username = $('.user').val();
			var password = md5($('.pwd').val());
			var ai = { username: username, password: password, realm: realm }
			var response = md5(ai.username + "&" + ai.password + "&" + ai.realm + "&" + nonce + "&login");
			$.ajax({
				url: domain + '/ibook/login',
				type: 'get',
				data: { username: username, nonce: nonce, response: response, realm: realm },
				success: function(res) {
					$('.container').css('display', 'none');
					$('.index_content').css('display', 'block');
					$('.booksManage').css('display', 'none');
					$('.loginName').text(res.name);
					$.ajax({
						url: domain + '/ostrich/queryConstant',
						type: 'get',
						data: { offset: 0, rows: 200, username: username, nonce: nonce, result: '123' },
						success: function(_res) {
							//constant=_res;
							//装在图书类型
							doBookType(_res);
						}
					});
				},
				error: function(err) {
					console.log(err);
				}
			})
		}
		//创建图书类型
		function doBookType(res) {
			var str1 = '<option value="0">请选择</option>';
			for(var i = 0; i < res.book_type1.length; i++) {
				str1 += '<option value="' + res.book_type1[i].code + '">' + res.book_type1[i].descr + '</option>'
			}
			$('.book_type1').append(str1);
			var str2 = '<option value="0">请选择</option>';
			for(var i = 0; i < res.book_type2.length; i++) {
				str2 += '<option value="' + res.book_type2[i].code + '">' + res.book_type2[i].descr + '</option>'
			}
			$('.book_type2').append(str2);
			var str3 = '<option value="0">请选择</option>';
			for(var i = 0; i < res.book_type3.length; i++) {
				str3 += '<option value="' + res.book_type3[i].code + '">' + res.book_type3[i].descr + '</option>'
			}
			$('.book_type3').append(str3);
			var str4 = '<option value="0">请选择</option>';
			for(var i = 0; i < res.book_type4.length; i++) {
				str4 += '<option value="' + res.book_type4[i].code + '">' + res.book_type4[i].descr + '</option>'
			}
			$('.book_type4').append(str4);
		}
		//回到首页
		function intoIndex() {
			$('.container').css('display', 'none');
			$('.index_content').css('display', 'block');
			$('.booksManage').css('display', 'none');
			$('.content_right').css('display', 'block');
			$('.content_addBooks').css('display', 'none');
		}
		//进入图书
		function intoBooks() {
			$('.container').css('display', 'none');
			$('.index_content').css('display', 'none');
			$('.booksManage').css('display', 'block');
			//查询图书
			onQueryBooks();
		}
		//查询图书按钮
		$('.searchBtn').click(function() {
			var search_bookId = $('.search_bookId').val(); //图书编号
			var search_bookName = $('.search_bookName').val(); //图书名称
			var bookState = $('.bookState').val(); //图书状态
			var bookType1 = $('.bookType.book_type1').val(); //图书类别-年龄
			var bookType2 = $('.bookType.bookType2').val(); //图书类别-主题
			var bookType3 = $('.bookType.bookType3').val(); //图书类别-大奖
			var bookType4 = $('.bookType.bookType4').val(); //图书类别-大师
			var data = { username: username, nonce: nonce, result: '123', name: search_bookName, book_state: bookState, bookType1: bookType1, bookType2: bookType2, bookType3: bookType3, bookType4: bookType4, rows: 100, offset: 0 };
			$.ajax({
				url: domain + '/ibook/queryBook',
				type: 'get',
				data: data,
				success: function(res) {
					if(res.statuscode == 200) {
						var str = '';
						for(var i = 0; i < res.items.length; i++) {
							str += '<div class="bodyItem" onclick="select(this,' + res.items[i].id + ')">'
							str += '<div class="book"><img src="' + res.items[i].cover_url + '" alt=""/></div>'
							str += '<div class="bookTitle">' + res.items[i].name + '</div>'
							str += '</div>'
						}
						$('.body').html('');
						$('.body').append(str);
					}
				},
				error: function(err) {
					alert(err)
				}
			});
		});
		//初始化查询图书
		function onQueryBooks() {
			resetParams();
			var data = { username: username, nonce: nonce, result: '123', name: '', book_state: '', id: '', rows: 100, offset: 0 };
			$.ajax({
				url: domain + '/ibook/queryBook',
				type: 'get',
				data: data,
				success: function(res) {
					if(res.statuscode == 200) {
						var str = '';
						for(var i = 0; i < res.items.length; i++) {
							str += '<div class="bodyItem" onclick="select(this,' + res.items[i].id + ')">'
							str += '<div class="book"><img src="' + res.items[i].cover_url + '" alt=""/></div>'
							str += '<div class="bookTitle">' + res.items[i].name + '</div>'
							str += '</div>'
						}
						$('.body').html('');
						$('.body').append(str);
					}
				},
				error: function(err) {
					alert(err)
				}
			});
		}
		//重置参数
		function resetParams() {
			selectId = '';
			base64 = '';
			$('#img')[0].src = '';
			$('textarea').val('');
			var a = $("#addBooks input");
			$.each(a, function(name, object) {
				$(object).val('')
			});
			$('.search_bookId').val(''); //图书编号
			$('.search_bookName').val(''); //图书名称
			$('.bookState').val('0'); //图书状态
			$('.book_type1').val('0'); //图书类别-年龄
			$('.book_type2').val('0'); //图书类别-主题
			$('.book_type3').val('0'); //图书类别-大奖
			$('.book_type4').val('0'); //图书类别-大师
			figure_file_base64 = [];
			for(var i = 1; i < 6; i++) {
				$('#figure_img' + i)[0].src = '';
			}
			temId = '';
		}
		//上架,下架图书
		function upDownBooks(state) {

			if(selectId == '') {
				alert('请选择一本图书！')
			} else {
				var book_state = '';
				if(state == 'up') {
					book_state = 'shelving'
				} else {
					book_state = 'removed'
				}
				var data = { result: "213123", username: username, nonce: nonce, id: selectId, book_state: book_state };
				$.ajax({
					url: domain + '/ibook/saveBook',
					type: 'post',
					data: data,
					success: function(res) {
						if(res.statuscode == 0) {
							alert('操作成功')
							$('.content_right').css('display', 'block');
							$('.content_addBooks').css('display', 'none');
							onQueryBooks();
						}
					}
				});
			}
		}
		//添加图书
		$('.addBooks').click(function() {
			resetParams();
			$('.content_right').css('display', 'none');
			$('.content_addBooks').css('display', 'block');
		});
		//编辑图书
		$('.editBooks').click(function() {
			for(var i = 1; i < 6; i++) {
				$('#figure_img' + i)[0].src = '';
			}
			if(selectId == '') {
				alert('请选择一本图书！')
			} else {
				//跳到编辑图书
				$('.content_right').css('display', 'none');
				$('.content_addBooks').css('display', 'block');
				//获取图书信息
				var data = { username: username, nonce: nonce, result: '123', name: '', book_state: '', id: selectId, rows: 60, offset: 0 };
				$.ajax({
					url: domain + '/ibook/queryBook',
					type: 'get',
					data: data,
					success: function(res) {
						if(res.statuscode == 200) {
							$.ajax({
								type: "get",
								url: domain + '/ibook/queryIllustration',
								data: { username: username, nonce: nonce, result: '123', name: '', book_state: '', book_id: selectId, rows: 60, offset: 0 },
								success: function(_res) {
									debugger;
									var _data = res.items[0];
									$("#addBooks").setFormValue(_data);
									$('#img')[0].src = _data.cover_url; //封面赋值 
									$('#img').attr('data-id',_data.id);
									for(var i = 0; i < _res.items.length; i++) {
										$('#figure_img' + (i + 1))[0].src = _res.items[i].url;
										$('#figure_img' + (i + 1)).attr('data-id',_res.items[i].id);
										$('#figure_img' + (i + 1)).attr('data-book-id',_res.items[i].book_id);
									}
								}
							});

						}
					},
					error: function(err) {
						alert(err)
					}
				});
			}
		});
		//选择一本图书
		function select(obj, id) {
			$(obj).addClass('_active').siblings().removeClass('_active');
			selectId = id;
		}
		//保存添加的图书
		$(".saveBtn").click(function() {
			var data = $("#addBooks").serializeJson('result:"213123";username:' + username + ';nonce:' + nonce + ';id:' + selectId);
			$.ajax({
				url: domain + '/ibook/saveBook',
				type: 'post',
				data: data,
				success: function(res) {
					if(res.statuscode == 0) {
						bookId = res.items.id;
						alert('操作成功')
					}
				}
			});
		});
		//取消保存图书
		$(".cancelBtn").click(function() {
			$('.content_right').css('display', 'block');
			$('.content_addBooks').css('display', 'none');
		});
		//上传封面图片
		document.getElementById('file').onchange = function() {
			var imgFile = this.files[0];
			var fr = new FileReader();
			fr.onload = function() {
				$('#img')[0].src = fr.result;
				base64 = fr.result;
			};
			fr.readAsDataURL(imgFile);
		};
		//上传插图图片
		document.getElementById('figure_file1').onchange = function() {
			var imgFile = this.files[0];
			var fr = new FileReader();
			fr.onload = function() {
				$('#figure_img1')[0].src = fr.result;
				base64 = fr.result;
			};
			fr.readAsDataURL(imgFile);
		};
		document.getElementById('figure_file2').onchange = function() {
			var imgFile = this.files[0];
			var fr = new FileReader();
			fr.onload = function() {
				$('#figure_img2')[0].src = fr.result;
				base64 = fr.result;
			};
			fr.readAsDataURL(imgFile);
		};
		document.getElementById('figure_file3').onchange = function() {
			var imgFile = this.files[0];
			var fr = new FileReader();
			fr.onload = function() {
				$('#figure_img3')[0].src = fr.result;
				base64 = fr.result;
			};
			fr.readAsDataURL(imgFile);
		};
		document.getElementById('figure_file4').onchange = function() {
			var imgFile = this.files[0];
			var fr = new FileReader();
			fr.onload = function() {
				$('#figure_img4')[0].src = fr.result;
				base64 = fr.result;
			};
			fr.readAsDataURL(imgFile);
		};
		document.getElementById('figure_file5').onchange = function() {
			var imgFile = this.files[0];
			var fr = new FileReader();
			fr.onload = function() {
				$('#figure_img5')[0].src = fr.result;
				base64 = fr.result;
			};
			fr.readAsDataURL(imgFile);

		};
		//上传图片
		function uploadImg(type) {
			switch(type) {
				case 'cover':
					doUpload('cover','');
					break;
				case 'figure_file1':
					doUpload('illustration',type);
					break;
				case 'figure_file2':
					doUpload('illustration',type);
					break;
				case 'figure_file3':
					doUpload('illustration',type);
					break;
				case 'figure_file4':
					doUpload('illustration',type);
					break;
				case 'figure_file5':
					doUpload('illustration',type);
					break;
				default:
					break;
			}
		}

		function doUpload(type,index) {
			if(base64 == '') {
				alert('请选择图片');
				return;
			}
			var temId='';
			switch(index) {
				case index:
					bookId=$('#'+index).attr('book_id');
					if(index==''){
						temId=$('#'+index).attr('id');
					}
					break;
				default:
					break;
			}
			var _data = { type: type, book_id: bookId, id: temId, username: username, key: '213', result: '123', file_data: base64 };
			$.ajax({
				url: domain + '/uploadfile',
				type: 'post',
				data: _data,
				success: function(_res) {
					if(_res.statuscode == 200) {
						if(index=='figure_file1'){
							picIds[0]=_res.id;
						}
						if(index=='figure_file2'){
							picIds[1]=_res.id;
						}
						if(index=='figure_file3'){
							picIds[2]=_res.id;
						}
						if(index=='figure_file4'){
							picIds[3]=_res.id;
						}
						if(index=='figure_file5'){
							picIds[4]=_res.id;
						}
						if(index==''){
							picIds[5]=_res.id;
						}
						alert('操作成功')
					} else {
						alert('图片添加失败' + _res.statuscode)
					}
				},
				error: function(err) {
					console.log(err);
				}
			});
		}
		$('.complete').click(function() {
			$('.content_right').css('display', 'block');
			$('.content_addBooks').css('display', 'none');
			onQueryBooks();
		});