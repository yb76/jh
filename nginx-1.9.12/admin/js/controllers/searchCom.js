/**
 * Created by zham on 15-8-7.
 */
angular.module('demoApp').controller('searchComCtrl', ['$q','$window','$scope', '$state','dataService','md5', '$rootScope', '$http','ngDialog',
    function($q,$window,$scope, $state, dataService, md5,$rootScope, $http, ngDialog) {
		
		$scope.userList = [];
		$scope.productList = [];
		$scope.newProduct = {};
		$scope.searchContext = '';
		$scope.isEdit = false;

        $scope.searchCom = function() {
            if($scope.searchContext == undefined){
                return;
            }
            var param = {'id':$scope.searchContext};
            var url = "/api/json/getcominfo";
            console.log("param",JSON.stringify(param));
            myGet($q,$http,url, param).then(function(result){
				console.log(JSON.stringify(result));
                if(result.success){
					$scope.userList.length = 0;
                    $scope.userList.push(result.data);
					
					$scope.newProduct.com_id = result.data.com_id;
					$scope.newProduct.prod_name = '';
					$scope.newProduct.prod_price = '';
					
					var url2 = "/api/json/getproductsinfo";
					var param2 = {'id':result.data.com_id};
					myGet($q,$http,url2, param2).then(function(result){
						console.log(JSON.stringify(result));
						if(result.success){
							$scope.productList.length = 0;
							var data = result.data;
							for(var i=0; i<data.length; i++) {
								var myData = {};
								myData.prod_id = data[i].prod_id;
								myData.com_id = data[i].com_id;
								myData.prod_name = data[i].prod_name;
								myData.prod_image_url = data[i].prod_image_url;
								myData.prod_price = data[i].prod_price;
								myData.isEdit = false;
								$scope.productList.push(myData);
							}
						}
					});
                }
            });
        }
		
		$scope.editCom = function() {
			$scope.isEdit = true;
		}
		
		$scope.cancelModify = function() {
			$scope.isEdit = false;
		}

		$scope.modifyCom = function() {
			var user = $scope.userList[0];
			if (user == undefined) {
				return;
			}
			var param = {'id':$scope.searchContext,
						'company_site':user.com_site,
						'company':user.com_name,
						'company_en':user.com_name_en,
						'company_address':user.com_address,
						'company_address_en':user.com_address_en,
						'description':user.com_desp,
						'description_en':user.com_desp_en
						};
            var url = "/api/json/updatecominfo";
			console.log("param",JSON.stringify(param));
			
			myGet($q,$http,url, param).then(function(result){
				console.log(JSON.stringify(result));
                if(result.success){
					$scope.isEdit = false;
                }
            });
		}
		
		$scope.modifyWeixinQrCodeImage = function() {
			var user = $scope.userList[0];
			if (user == undefined) return;
			
			var file = $('#weixinImage')[0].files[0];
			if (file == undefined) return;
			
			var d = new FormData();
			d.append('field', user.com_id);
			d.append('file', file);
			$.ajax({
				type:'post',
				url:"/api/json/uploadComPubQrImage",
				data:d,
				cache:false,
				dataType:'json',
				contentType:false,
				processData:false,
				success:function(data) {
					console.log("post success, result="+data.data.com_pub_qrImg_url);
					user.com_pub_qrImg_url = data.data.com_pub_qrImg_url;
					$scope.isEdit = false;
					alert("upload success");
	        	},
	        	error:function() {
		        	alert("error");
		        }
		    });
		}
		
		
		$scope.editProduct = function(index) {
			var prod = $scope.productList[index];
			prod.isEdit = true;
		}
		$scope.editProductSubmit = function(index) {
			var prod = $scope.productList[index];
			console.log(prod);
			myGet($q,$http,"/api/json/modifyProductInfo", prod).then(function(result){
				console.log(JSON.stringify(result));
                if(result.success){
					prod.isEdit = false;
                }
            });
		}
		$scope.editProductDelete = function(index) {
			var prod = $scope.productList[index];
			console.log(prod);
			myGet($q,$http,"/api/json/deleteProductInfo", prod).then(function(result){
				console.log(JSON.stringify(result));
                if(result.success){
					$scope.productList.splice(index, 1);
                }
            });
		}
		$scope.editProductCancel = function(index) {
			var prod = $scope.productList[index];
			prod.isEdit = false;
		}
		$scope.uploadProductImage = function(index) {
			var prod = $scope.productList[index];
			if (prod == undefined) return;
			
			var user = $scope.userList[0];
			if (user == undefined) return;
			
			var fileInput = $('.product_li').eq(index).find('.productImage');
			var file = fileInput[0].files[0];
			if (file == undefined) return;
			
			var d = new FormData();
			var para = {};
			para.com_id = user.com_id;
			para.prod_id = prod.prod_id;
			d.append('field', JSON.stringify(para));
			d.append('file', file);
			$.ajax({
				type:'post',
				url:"/api/json/uploadProductImage",
				data:d,
				cache:false,
				dataType:'json',
				contentType:false,
				processData:false,
				success:function(data) {
					console.log("post success, result="+data.data.prod_image_url);
					prod.prod_image_url = data.data.prod_image_url;
					alert("upload success");
	        	},
	        	error:function() {
		        	alert("error");
		        }
		    });
		}
		$scope.addProduct = function(index) {
			var prod = $scope.newProduct;
			console.log(prod);
			myGet($q,$http,"/api/json/addProductInfo", prod).then(function(result){
				console.log(JSON.stringify(result));
                if(result.success){
					$scope.newProduct.prod_name = '';
					$scope.newProduct.prod_price = '';
					
					var data = result.data;
					var myData = {};
					myData.prod_id = data.prod_id;
					myData.com_id = data.com_id;
					myData.prod_name = data.prod_name;
					myData.prod_image_url = data.prod_image_url;
					myData.prod_price = data.prod_price;
					myData.isEdit = false;
					$scope.productList.push(myData);
					
					alert("add new product success");
                }
				else {
					alert("add new product failed");
				}
            });
		}
    }]);