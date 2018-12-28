$(document).ready(function() {
	$('#example').dataTable( {
		"fnRowCallback": function( nRow, aData, iDisplayIndex ) {
			/* Append the grade to the default row class name */
			nRow.className = nRow.className + aData[4];
			return nRow;
		},
		"aoData": [ 
			/* Engine */   null,
			/* Browser */  null,
			/* Platform */ { "bVisible": false, "bSearchable": false },
			/* Version */  { "sClass": "center" },
			/* Grade */    { "sClass": "center" }
		]
	} );
} );