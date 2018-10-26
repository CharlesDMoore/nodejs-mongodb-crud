/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , bond = require('./routes/bond')
  , http = require('http')
  , path = require('path')
  , BondProvider = require('./bondprovider').BondProvider;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.enable('trust proxy');
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var bondProvider= new BondProvider();

//Routes

//index
app.get('/', function(req, res){
  bondProvider.findAll(function(error, bonds){
      res.json(JSON.stringify(bonds))
  });
});

//new bond
app.get('/bond/new', function(req, res) {
    res.render('bond_new', {
        title: 'New bond'
    });
});

//save new bond
app.post('/bond/new', function(req, res){
    bondProvider.save({
        taxable: req.param('taxable'),
        symbol: req.param('symbol'),
        coupon_rate: req.param('coupon_rate'),
        pmt_day: req.param('pmt_day'),
        pmt_month: req.param('pmt_month'),
        call_date: req.param('call_date'),
        call_amount: req.param('call_amount'),
        maturity: req.param('maturity'),
        maturity_amount: req.param('maturity_amount'),
        purchase_date: req.param('purchase_date')

    }, function( error, docs) {
        res.statusMessage('WHATS GOOOOOOOD AMERICA?')
        res.redirect('/')
    });
});

//update an bond
app.get('/bond/:id/edit', function(req, res) {
	bondProvider.findById(req.params.id, function(error, bond) {
		res.render('bond_edit',
		{
			_id: bond._id.toHexString(),
			taxable: req.param('taxable'),
        symbol: req.param('symbol'),
        coupon_rate: req.para('coupon_rate'),
        pmt_day: req.para('pmt_day'),
        pmt_month: req.para('pmt_month'),
        call_date: req.para('call_date'),
        call_amount: req.para('call_amount'),
        maturity: req.para('maturity'),
        maturity_amount: req.para('maturity_amount'),
        purchase_date: req.para('purchase_date')
		});
	});
});

//save updated bond
app.post('/bond/:id/edit', function(req, res) {
	bondProvider.update(req.params.id,{
		taxable: req.param('taxable'),
        symbol: req.param('symbol'),
        coupon_rate: req.para('coupon_rate'),
        pmt_day: req.para('pmt_day'),
        pmt_month: req.para('pmt_month'),
        call_date: req.para('call_date'),
        call_amount: req.para('call_amount'),
        maturity: req.para('maturity'),
        maturity_amount: req.para('maturity_amount'),
        purchase_date: req.para('purchase_date')
	}, function(error, docs) {
		res.redirect('/')
	});
});

//delete an bond
app.get('/bond/:id/delete', function(req, res) {
	bondProvider.delete(req.params.id, function(error, docs) {
		res.redirect('/')
	});
});

app.listen(process.env.PORT || 3000);
