<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="">
		<meta name="author" content="">
		<link rel="shortcut icon" href="">
		
		<title>Sin captcha</title>
		
		<!-- Bootstrap core CSS -->
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<link href="css/bootstrap-app-custom.css" rel="stylesheet">
		<link href="css/docs.css" rel="stylesheet">
		<link href="css/animate.min.css" rel="stylesheet">
		
		<!-- Custom styles for this template -->
		<link href="css/sticky-footer.css" rel="stylesheet">
		
	
		<!-- Just for debugging purposes. Don't actually copy this line! -->
		<!--[if lt IE 9]><script src="../../docs-assets/js/ie8-responsive-file-warning.js"></script><![endif]-->
		
		<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
		<!--[if lt IE 9]>
		      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
		      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
		    <![endif]-->

		<script type="text/javascript" src="js/jquery.min.js"></script>
		<script type="text/javascript" src="js/modernizr.min.js"></script>
		<script type="text/javascript" src="js/bootstrap.min.js"></script>
		<script type="text/javascript" src="js/wonDecade.js"></script>
	</head>
	
	<body>
	
		<!-- Wrap all page content here -->
		<div id="wrap">
			<!-- Affix para numeros usados -->
			<div class="col-md-3">
				<div id="usedTrackingList"  class="bs-sidebar hidden-print affix" role="complementary" style="">
		            <ul class="nav bs-sidenav"></ul>
	          </div>		
			</div>
			
			
			<!-- Begin page content -->
			<div class="container">
				<div class="page-header">
					<h1>La d&eacute;cada ganada</h1>
				</div>
				<p class="lead">S&oacute;lo ingres&aacute; el n&uacute;mero de env&iacute;o y listo!</p>
	
				<p>
					Us&aacute; <a href="#">Correo Argentino</a> (por ahora).
				</p>
	
				<form id="wonDecadeForm" onsubmit="return doTheDecade($('#decadeQueryValue').val());">
					<fieldset>
						<div class="row">
							<div class="col-lg-12">
								<div class="input-group">
									<span class="input-group-btn">
										<button class="btn btn-default" type="button">DG!</button>
									</span> 
									<input type="text" class="form-control"	id="decadeQueryValue">
								</div>
								<!-- /input-group -->
							</div>
							<!-- /.col-lg-6 -->
							<button type="submit" class="ganar-decada btn btn-primary btn-lg btn-block top-block">
								A ganar la d&eacute;cada...
							</button>
						</div>
						<!-- /.row -->
					</fieldset>
				</form>
				<hr />
	
	
				<h1 class="decade animated bounceInDown" id="decadeSwing">
					Intentando ganar la d&eacute;cada
					<span class="particle particle--c"></span>
					<span class="particle particle--a"></span>
					<span class="particle particle--b"></span>
				</h1>
	
	
				<div id="decadeResults"></div>
			</div>
		</div>
	
	
		<div id="footer">
			<div class="container">
				<p class="text-muted credit">
					The <a href="http://martinbean.co.uk" target="_blank">Katrina's boys</a> - Demostrando la calidad de los profesionales que contrata el Gobierno Nacional
				</p>
			</div>
		</div>
	
		
		<script type="text/javascript">
		        
			 $(function(){
				swingOffDecade();
				$("#decadeQueryValue").focus();
				$('#usedTrackingList').affix({
				    offset: {
				      top: 100
				    , bottom: function () {
				        return (this.bottom = $('.bs-footer').outerHeight(true))
				      }
				    }
			    });

				buildTrackingAffixList();

				$('.ganar-decada-affix').on("click",function(){
					$("#decadeQueryValue").val($(this).html());

					$("#wonDecadeForm").submit();
				});

				$('.ganar-decada-affix-a-remove').on("click",function(){
					removeSavedTracking($(this).find('li').last().html());
					$(this).find('li').remove();
				});

				var idParam;
				<?php if (($_GET['id']) && (strlen($_GET['id']) >= 10) ){ ?>
					idParam = "<?php echo $_GET['id']; ?>";
				<?php }?>

				if ($.trim(idParam) != ""){
					$("#decadeQueryValue").val(idParam);
					$("#wonDecadeForm").submit();
				}
				
			 });
	
	    </script>
	
		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		
		  ga('create', 'UA-45954254-1', 'sincaptcha.com.ar');
		  ga('send', 'pageview');
		
		</script>
	</body>
</html>
