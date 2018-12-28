<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Test1.aspx.cs" Inherits="WebApplication2.Test1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.7.3/css/demo_table.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.7.3/css/demo_table_jui.css" />

    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/jquery.dataTables.js"></script>
    <script type="text/javascript" src="js/json2.js"></script>

    <script type="text/javascript">

        //http://www.sprymedia.co.uk/article/DataTables
        //http://www.datatables.net
        //https://cdn.datatables.net/1.7.3/

        $(document).ready(function () {
            $('#tbl').dataTable({
                "sScrollY": "150px",
                //'sPaginationType': 'full_numbers',
                //'iDisplayLength': 5,
                "bPaginate": true,
                "bProcessing": true,
                "bServerSide": false
            });
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:Repeater ID="repeater" runat="server">
                <HeaderTemplate>
                    <table id="tbl" cellpadding="1" cellspacing="0"
                        border="0" class="display" style="width: 100%">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                </HeaderTemplate>
                <ItemTemplate>
                    <tr>
                        <td><%# Eval("Id") %></td>
                        <td><%# Eval("Name") %></td>
                    </tr>
                </ItemTemplate>
                <FooterTemplate>
                    </tbody>
                </table>
                </FooterTemplate>
            </asp:Repeater>
        </div>
    </form>
</body>
</html>