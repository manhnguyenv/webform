<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Test2.aspx.cs" Inherits="WebApplication2.Test2" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Test2</title>

    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.7.3/css/demo_table.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.7.3/css/demo_table_jui.css" />

    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/jquery.dataTables.js"></script>
    <script type="text/javascript" src="js/json2.js"></script>

    <script type="text/javascript">

        //http://www.sprymedia.co.uk/article/DataTables
        //http://www.datatables.net
        //https://cdn.datatables.net/1.7.3/

        var oTable;
        var tableId = 'tbl';
        var ws_GetData = 'Test2.aspx/GetPersonData';
        var ws_DeleteData = 'Test2.aspx/DeletePerson';
        var ws_UpdateData = 'Test2.aspx/UpdatePerson';
        var ws_AddData = 'Test2.aspx/AddPerson';
        var isDeleteEnbaled = true;
        var isUpdateEnabled = true;
        var isAddEnabled = true;
        var isShowGrid = <%= isShowGrid %>;

        $(document).ready(function () {
            if (isShowGrid == "0") {
                $('#' + tableId).css("display", "none");
                return;
            }
            if (isAddEnabled) {
                $('#' + tableId + '_add').css("display", "block");
                $('#' + tableId + '_add_btnAdd').click(function () { AddMe(); });
            }

            oTable = $('#' + tableId).dataTable({
                'sPaginationType': 'full_numbers',
                'sScrollY': '250px',
                'bPaginate': true,
                'iDisplayLength': 10,
                'bProcessing': true,
                'bFilter': true,
                'bServerSide': true,
                'aoColumns': [null, null, { 'bSortable': false }, { 'bSortable': false }],
                'sAjaxSource': ws_GetData,
                'fnServerData': function (sSource, aoData, fnCallback) { GrabData(sSource, aoData, fnCallback); }
            });

            $('#' + tableId + ' tbody tr').live('click', function () {

                $(oTable.fnSettings().aoData).each(function () { $(this.nTr).removeClass('row_selected'); });

                $(this).addClass('row_selected');

                //var aPos = oTable.fnGetPosition(this);
                //var aData = oTable.fnGetData(this);
                //iId = aData[0];
            });

        });
        //-------------------------------------------------
        function GrabData(sSource, aoData, fnCallback) {
            //aoData.push({ "name": "more_data", "value": "my_value" });

            $.ajax({
                type: "GET",
                url: sSource,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: aoData,
                success: function (result) {
                    //var json = eval('(' + result.d + ')');
                    var myObject = JSON.parse(result.d);

                    if (isUpdateEnabled) {
                        for (var i = 0; i < myObject.aaData.length; i++) {
                            var str2 = "<input id='" + tableId + "_update_" + myObject.aaData[i][0] + "' type='button' value='update' onclick='UpdatePrepare(" + JSON.stringify(myObject.aaData[i]) + ");' />";
                            myObject.aaData[i].push(str2);
                        }
                    }

                    if (isDeleteEnbaled) {
                        for (var i = 0; i < myObject.aaData.length; i++) {
                            var str1 = "<input id='" + tableId + "_delete_" + myObject.aaData[i][0] + "' type='button' value='delete' onclick='DeleteMe(" + myObject.aaData[i][0] + ");' />";
                            myObject.aaData[i].push(str1);
                        }
                    }

                    fnCallback(myObject);
                },
                error: function (errMsg) {
                    alert(errMsg);
                }
            });

        }
        //--------------------------------------------------------------------------
        function DeleteMe(IdToBeDeleted) {
            if (window.confirm('Are you sure to delete this row?') == false) return;
            //*************************************************
            var parameters = "{'id':'" + IdToBeDeleted + "'}";
            //*************************************************
            $.ajax({
                type: "POST",
                url: ws_DeleteData,
                data: parameters,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    alert(msg.d);
                    oTable.fnDraw();
                },
                error: function (e) {
                    alert('Failure Deletion');
                }
            });
        }
        //---------------------------------------------------------------------------
        function UpdatePrepare(data) {

            $('#' + tableId + '_update').css("display", "block");
            //**************************************************
            $('#' + tableId + '_update_txtId').val(data[0]);
            $('#' + tableId + '_update_txtName').val(data[1]);
            //***************************************************
            $('#' + tableId + '_update_btnUpdate').unbind("click");
            $('#' + tableId + '_update_btnUpdate').click(function () { UpdateMe(); });

            $('#' + tableId + '_update_btnCancel').click(function () {
                $('#' + tableId + '_update').css("display", "none");
            });
        }
        function UpdateMe() {

            if (window.confirm('Are you sure to update this?') == false) return;

            //********************************************************
            var person = new Object();
            person.Id = $('#' + tableId + '_update_txtId').val();
            person.name = $('#' + tableId + '_update_txtName').val();

            //var parameters = "{'id':'" + id + "', 'name':'" + name + "'}";
            var DTO = { 'person': person };

            var parameters = JSON.stringify(DTO);
            //******************************************************
            $.ajax({
                type: "POST",
                url: ws_UpdateData,
                data: parameters,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    alert(msg.d);
                    $('#' + tableId + '_update').css("display", "none");
                    oTable.fnDraw();
                },
                error: function (e) {
                    alert('Failure Update');
                }
            });
        }
        //------------------------------------------------------------------------------
        function AddMe() {

            if (window.confirm('Are you sure to add this?') == false) return;

            //************************************************************
            var name = $('#' + tableId + '_add_txtName').val();

            var parameters = "{'id':'0', 'name':'" + name + "'}";
            //***********************************************************

            $.ajax({
                type: "POST",
                url: ws_AddData,
                data: parameters,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    alert(msg.d);
                    oTable.fnDraw();
                },
                error: function (e) {
                    alert('Failure Add');
                }
            });
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div style="width: 500px">

            <table cellpadding="2" cellspacing="0" border="0" class="display" id="tbl_add" style="width: 250px; display: none">
                <tr>
                    <td>Name</td>
                    <td>
                        <input type="text" id="tbl_add_txtName" value="" /></td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                    <td>
                        <input type="button" id="tbl_add_btnAdd" value="Add" /></td>
                </tr>
            </table>
            <br />
            <table cellpadding="2" cellspacing="0" border="0" class="display" id="tbl">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>&nbsp;</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="2" class="dataTables_empty">Loading data from server</td>
                    </tr>
                </tbody>
            </table>
            <br />
            <table cellpadding="2" cellspacing="0" border="0" class="display" id="tbl_update" style="width: 250px; display: none">
                <tr>
                    <td>Id</td>
                    <td>
                        <input type="text" id="tbl_update_txtId" value="0"
                            style="border: solid 1px Black; width: 100px; background-color: #D1D1D1" onfocus="this.blur();" /></td>
                </tr>
                <tr>
                    <td>Name</td>
                    <td>
                        <input type="text" id="tbl_update_txtName" value="" /></td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                    <td>
                        <input type="button" id="tbl_update_btnUpdate" value="Update" />&nbsp;
                    <input type="button" id="tbl_update_btnCancel" value="Cancel" />
                    </td>
                </tr>
            </table>
        </div>
    </form>
</body>
</html>