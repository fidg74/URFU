module.exports = {
	filenameHashing: false,
	publicPath: '/static/',
	indexPath: 'index.html',
	configureWebpack: {
		externals: {
			editlog: "EditLog",
			formdraft: "FormDraft",
			// jquery: "jQuery",
		},
		performance: { 
			hints: false 
		},
		devtool: 'source-map'
	},
	chainWebpack: config => {
		config.module
		  	.rule("vue")
		  	.use("vue-loader")
		  	.loader("vue-loader")
		  	.tap(options => {
				// modify the options...
				options.compilerOptions.whitespace = 'preserve';
				return options;
		  	});
	},
}
