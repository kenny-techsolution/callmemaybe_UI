xAxis: {
	lineWidth:3,
	lineColor:'#666',
	plotLines:[{
		color:"#ddd",
		width:1,
		value:0.9,
		zIndex:1;
	}]
},
labels: {
	items: [
		{
			html: 'Age:',
			style: {
				font-family: "Omnes_ATT Medium";
				font-size: "9pt";
				font-weight: "normal";
				color: "#666666";
				top: '175px',
				left: '60px'
			}
		},
		{
			html:"Unknown: 5%",
			style:{
				font-family: "Omnes_ATT Medium";
				font-size: "9pt";
				color: "#666666";
				top: '193px',
				left: '255px'
			}
		}
	]
},
plotOptions:{
	series:{
		enableMouseTracking:false
	},
	column:{
		grouping:false,
		colorByPoint: true,
		cursor: 'pointer',
		states:{
			hover:{
				enabled:false
			}
		},
		pointWidth:38,
		colors:[
			'#B30A3C',
			{ },
			{
				linearGradient:{x1:0,y1:1,x2:0, y2:0},
				stops:[
					[0, '#81017E' ],
					[1, '#C080BE' ]
				]
			},
			{
				linearGradient:{x1:0,y1:1,x2:0, y2:0},
				stops:[
					[0, '#81017E' ],
					[1, '#C080BE' ]
				]
			},
			{
				linearGradient:{x1:0,y1:1,x2:0, y2:0},
				stops:[
					[0, '#81017E' ],
					[1, '#C080BE' ]
				]
			},
			{
				linearGradient:{x1:0,y1:1,x2:0, y2:0},
				stops:[
					[0, '#81017E' ],
					[1, '#C080BE' ]
				]
			},
			{
				linearGradient:{x1:0,y1:1,x2:0, y2:0},
				stops:[
					[0, '#81017E' ],
					[1, '#C080BE' ]
				]
			}
		]
	}
},

