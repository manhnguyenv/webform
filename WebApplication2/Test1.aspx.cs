using Dapper;
using Entity;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;

namespace WebApplication2
{
    public partial class Test1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            List<Person> list = new List<Person>();


            /*
             * CREATE TABLE public.persons( id serial NOT NULL, name character varying(45) NOT NULL, PRIMARY KEY (id) ) WITH (OIDS = FALSE) TABLESPACE pg_default;
             */
            using (var connection = new NpgsqlConnection("Host=localhost;Username=postgres;Password=Abcde@12345-;Database=hrm"))
            {
                connection.Open();

                //connection.Execute("Insert into public.persons (id, name) values (1, 'NGUYEN VIET MANH');");
                //connection.Execute("Insert into public.persons (id, name) values (2, 'NGUYEN THI VAN');");
                //connection.Execute("Insert into public.persons (id, name) values (3, 'NGUYEN THU THAO');");
                //connection.Execute("Insert into public.persons (id, name) values (4, 'NGUYEN THUY TRAM');");

                //string name = string.Empty;
                //for (var i = 5; i < 169; i++)
                //{
                //    if (i % 2 == 0)
                //        name = RandomNameGenerator.NameGenerator.Generate(RandomNameGenerator.Gender.Male);
                //    else
                //        name = RandomNameGenerator.NameGenerator.Generate(RandomNameGenerator.Gender.Female);
                //    string sql = $"Insert into public.persons (id, name) values ({i}, '{name}');";
                //    connection.Execute(sql);
                //}

                list = connection.Query<Person>("Select id, name from public.persons;").ToList();
            }

            repeater.DataSource = list;
            repeater.DataBind();
        }
    }
}